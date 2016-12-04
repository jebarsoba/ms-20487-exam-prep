using ImagesWithMediaTypeFormatter.Host.Fromatters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web.Http;

namespace ImagesWithMediaTypeFormatter.Host
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {          
            config.Routes.MapHttpRoute(
                name: "IdWithExt",
                routeTemplate: "api/{controller}/{id}.{ext}");
            
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional });
           
            config.Formatters.Add(new ImageFormatter());
            config.MessageHandlers.Add(new UriFormatHandler());
        }
    }
}
