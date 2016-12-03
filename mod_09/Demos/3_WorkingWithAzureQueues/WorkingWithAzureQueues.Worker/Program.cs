using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WorkingWithAzureQueues.Receiver
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Title = "Receiver";
            string connectionString = ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString;
            CloudStorageAccount account = CloudStorageAccount.Parse(connectionString);
            CloudQueueClient client = account.CreateCloudQueueClient();
            CloudQueue queue = client.GetQueueReference("messagesqueue");
            queue.CreateIfNotExists();            

            Console.WriteLine("Waiting for messages... Close the console window to stop.\n\n");
            while (true)
            {
                CloudQueueMessage message = queue.GetMessage();
                if (message != null)
                {
                    Console.WriteLine("Processing message {0} with string '{1}'", message.Id, message.AsString);

                    // process message
                    // ...

                    queue.DeleteMessage(message);

                }
                else
                {
                    Thread.Sleep(100);
                }
            }
        }
    }
}
