using ImagesWithMediaTypeFormatter.Host.Controllers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Web;

namespace ImagesWithMediaTypeFormatter.Host.Fromatters
{
    public class ImageFormatter : BufferedMediaTypeFormatter
    {
        public ImageFormatter()
        {
            this.SupportedMediaTypes.Add(new MediaTypeHeaderValue("image/png"));
        }

        public override bool CanReadType(Type type)
        {
            return false;
        }

        public override bool CanWriteType(Type type)
        {
            return typeof(Value) == type;
        }

        public override void WriteToStream(Type type, object value, Stream stream, HttpContent content)
        {
            content.Headers.ContentType = new MediaTypeHeaderValue("image/png");            
            if (value is Value)
            {
                string thumbnail = (value as Value).Thumbnail;
                string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, thumbnail);

                using (var fileStream = new FileStream(path, FileMode.Open, FileAccess.Read))
                {
                    fileStream.CopyTo(stream);
                }
            }
        }
    }
}