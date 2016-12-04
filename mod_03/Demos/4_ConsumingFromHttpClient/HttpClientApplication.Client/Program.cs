using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;

namespace HttpClientApplication.Client
{
    class Program
    {
        static void Main(string[] args)
        {
            CallServer().Wait();
            Console.ReadKey();
        }

        static async Task CallServer()
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("http://localhost:12534/");
            HttpResponseMessage message = await client.GetAsync("api/Destinations");
            Console.WriteLine(await message.Content.ReadAsStringAsync());
        }
    }
}