using ServiceBusRelay.Contract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceBusRelay.Server
{
    class ConsoleService : IConsoleService
    {
        public void Write(string text)
        {
            Console.WriteLine(text); ;
        }
    }
}
