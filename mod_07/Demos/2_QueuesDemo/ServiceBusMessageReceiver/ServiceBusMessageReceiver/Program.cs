using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using Microsoft.WindowsAzure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceBusMessageReceiver
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Title = "Receiver";

            // Creating the topic if it does not exist already using the service bus connection string stored in the app.config file
            string connectionString =
                CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

            var namespaceManager =
                NamespaceManager.CreateFromConnectionString(connectionString);

            if (!namespaceManager.QueueExists("servicebusqueue"))
            {
                namespaceManager.CreateQueue("servicebusqueue");
            }

            QueueClient client = QueueClient.Create("servicebusqueue");

            while (true)
            {
                var message = client.Receive();
                if (message != null)
                {

                    try
                    {
                        Console.WriteLine(message.GetBody<string>());
                    }
                    finally
                    {
                        message.Complete();
                    }
                }
            }

        }
    }
}
