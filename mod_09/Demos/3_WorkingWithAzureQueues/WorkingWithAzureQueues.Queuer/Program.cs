using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WorkingWithAzureQueues.Sender
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Title = "Sender";
            string connectionString = ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString;
            CloudStorageAccount account = CloudStorageAccount.Parse(connectionString);
            CloudQueueClient client = account.CreateCloudQueueClient();
            CloudQueue queue = client.GetQueueReference("messagesqueue");
            queue.CreateIfNotExists();

            Console.WriteLine("Sending messages... Close the console window to stop.\n\n");            
            for (int i=1; ;i++)
            {
                string msg = string.Format("message number {0} on {1}", i, DateTime.Now.ToString());
                CloudQueueMessage message = new CloudQueueMessage(msg);
                queue.AddMessage(message);
                Console.WriteLine(string.Concat("Created ", msg));
                Thread.Sleep(50);
            }            
        }
    }
}
