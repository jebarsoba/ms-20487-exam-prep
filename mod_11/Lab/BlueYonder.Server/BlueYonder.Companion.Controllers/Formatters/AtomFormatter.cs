using BlueYonder.Companion.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.ServiceModel.Syndication;
using System.Threading.Tasks;
using System.Xml;

namespace BlueYonder.Companion.Controllers.Formatters
{
    public class AtomFormatter : MediaTypeFormatter
    {
        private HttpRequestMessage _request;
        
        public AtomFormatter()
        {
            SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/atom+xml"));
        }

        public AtomFormatter(HttpRequestMessage request)
        {
            _request = request;
        }

        public override bool CanReadType(Type type)
        {
            return false;
        }

        public override bool CanWriteType(Type type)
        {
            return type == typeof(List<FlightWithSchedulesDTO>);
        }

        public override Task WriteToStreamAsync(Type type, object value, System.IO.Stream writeStream, HttpContent content, System.Net.TransportContext transportContext)
        {
            // creating a System.ServiceModel.Syndication.SyndicationFeed
            var feed = CreateFeed(type, value);

            return Task.Run(() =>
                {
                    using (var writer = XmlWriter.Create(writeStream))
                    {
                        Atom10FeedFormatter atomformatter = new Atom10FeedFormatter(feed);
                        atomformatter.WriteTo(writer);
                    }
                });
        }

        // this method is overridden in order to pass the HttpRequestMessage into the formatter
        // when overridden the GetPerRequestFormatterInstance is called in order to create 
        // new instances of the formatter (if the method is not overridden the same instance is
        // being reused for every call) allowing to pass the request to the Formatter constructor.
        public override MediaTypeFormatter GetPerRequestFormatterInstance(Type type, 
                                                                          HttpRequestMessage request, 
                                                                          MediaTypeHeaderValue mediaType)
        {
            return new AtomFormatter(request);
        }

        private SyndicationFeed CreateFeed(Type type, object value)
        {
            // this object represent a syndication feed. Based on the formatter, the actual syndication
            // format will be created
            var feed = new SyndicationFeed
            {
                Title = new TextSyndicationContent("Blue Yonder flights")
            };

            var items = from f in (IEnumerable<FlightWithSchedulesDTO>)value
                        from s in f.Schedules
                        select new SyndicationItem
                                    {
                                        Title = new TextSyndicationContent(String.Format("Flight {0} {1}", f.FlightNumber, s.Departure.ToString("MMMM dd, yyyy"))),
                                        Id = f.FlightNumber,
                                        BaseUri = new Uri(_request.RequestUri, string.Format("{0}/{1}",_request.RequestUri.AbsolutePath, f.FlightNumber)),

                                    };

            feed.Items = items;
            return feed;
        }


    }
}
