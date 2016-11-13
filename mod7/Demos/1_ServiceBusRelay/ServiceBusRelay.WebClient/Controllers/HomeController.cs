using ServiceBusRelay.Contract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Web;
using System.Web.Mvc;

namespace ServiceBusRelay.WebClient.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";

            return View();
        }

        public ActionResult Write(string text)
        {
            var factory = new ChannelFactory<IConsoleService>(new NetTcpBinding(),
                                                              new EndpointAddress("net.tcp://127.0.0.1:747/console"));
            var proxy = factory.CreateChannel();
            try
            {
                proxy.Write(text);
            }
            catch (Exception)
            {

                throw;
            }


            (proxy as IClientChannel).Close();
            return Redirect(Request.ApplicationPath);
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
