using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;

namespace ServiceBusQueue
{
    class Program
    {
        private static string QueueName = "BlueYonderQueue";

        private static string ServiceBusNamespace = "BlueYonderServerDemo11JEB";

        private static string ServiceIdentityName1 = "owner";
        private static string ServiceIdentityKey1 = "KrE3C6u7YBwhRsglhXGxZ4PGJpoG2ol0MWIN903GlPA=";

        private static string ServiceIdentity2 = "QueueClient";
        private static string ServiceIdentityKey2 = "M7NzzezwZGXGSViwP4LvArnZwtQy0xJE+LadTup3+k4=";

        static void Main(string[] args)
        {
            try
            {
                TokenProvider credentials = TokenProvider.CreateSharedSecretTokenProvider(ServiceIdentity2, ServiceIdentityKey2);
                Uri serviceUri = ServiceBusEnvironment.CreateServiceUri("sb", ServiceBusNamespace, string.Empty);

                // Send messages to the queue with the QueueClient user
                Send(serviceUri, credentials);

                // Listen to the queue with the owner user
                credentials = TokenProvider.CreateSharedSecretTokenProvider(ServiceIdentityName1, ServiceIdentityKey1);
                Receive(serviceUri, credentials);

                // Listen to the queue with the QueueClient user - should throw an unauthorized exception
                credentials = TokenProvider.CreateSharedSecretTokenProvider(ServiceIdentity2, ServiceIdentityKey2);
                Receive(serviceUri, credentials);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            Console.WriteLine("Press Enter to Exit");
            Console.ReadLine();

        }

        private static BrokeredMessage CreateIssueMessage(string msgId, string msgBody)
        {
            BrokeredMessage message = new BrokeredMessage(msgBody);
            message.MessageId = msgId;
            return message;
        }

        private static void Send(Uri serviceUri, TokenProvider credentials)
        {
            MessagingFactory factory = null;
            factory = MessagingFactory.Create(serviceUri, credentials);

            QueueClient myQueueClient = factory.CreateQueueClient(QueueName);

            var messageList = new List<BrokeredMessage>();
            messageList.Add(CreateIssueMessage("1", "First message"));
            messageList.Add(CreateIssueMessage("2", "Second message"));
            messageList.Add(CreateIssueMessage("3", "Third message"));

            foreach (BrokeredMessage message in messageList)
            {
                myQueueClient.Send(message);
                Console.WriteLine(string.Format("Message sent: Id = {0}, Body = {1}", message.MessageId, message.GetBody<string>()));
            }
        }

        private static void Receive(Uri serviceUri, TokenProvider credentials)
        {
            NamespaceManager namespaceClient = new NamespaceManager(serviceUri, credentials);
            QueueDescription queueDescription = namespaceClient.GetQueue(QueueName);
            MessagingFactory factory = MessagingFactory.Create(serviceUri, credentials);
            QueueClient myQueueClient = factory.CreateQueueClient(QueueName, ReceiveMode.PeekLock);

            BrokeredMessage message;

            long messageCount = queueDescription.MessageCount;
            for (long count = 0; count < messageCount; count++)
            {
                message = myQueueClient.Receive(TimeSpan.FromSeconds(5));

                if (message != null)
                {
                    Console.WriteLine(string.Format("Message received: Id = {0}, Body = {1}", message.MessageId, message.GetBody<string>()));
                    message.Complete();
                }
            }
        }
    }
}
