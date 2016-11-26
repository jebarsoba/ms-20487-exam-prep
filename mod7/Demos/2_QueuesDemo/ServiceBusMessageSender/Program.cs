using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using Microsoft.WindowsAzure;
using System;

namespace ServiceBusMessageSender
{
    class Program
    {
        static void Main(string[] args)
        {
            string connectionString = CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

            NamespaceManager namespaceManager = NamespaceManager.CreateFromConnectionString(connectionString);

            string queueName = "servicebusqueue";

            if (!namespaceManager.QueueExists(queueName))
                namespaceManager.CreateQueue(queueName);

            QueueClient queueClient = QueueClient.CreateFromConnectionString(connectionString, queueName);

            while (true)
            {
                Console.WriteLine("Type and press Enter to send through ASB...");

                BrokeredMessage message = new BrokeredMessage(Console.ReadLine());
                queueClient.Send(message);
            }
        }
    }
}