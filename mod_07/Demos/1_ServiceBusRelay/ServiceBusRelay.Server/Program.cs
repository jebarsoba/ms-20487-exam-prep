using ServiceBusRelay.Contract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace ServiceBusRelay.Server
{
    class Program
    {
        static void Main(string[] args)
        {
            var host = new ServiceHost(typeof(ConsoleService), new Uri("net.tcp://127.0.0.1:747/"));
            var endpoint = host.AddServiceEndpoint(typeof(IConsoleService), new NetTcpBinding(), "console");
            host.Open();

            Console.WriteLine("The server is running");
            Console.ReadKey();
            host.Close();
        }
    }
}
