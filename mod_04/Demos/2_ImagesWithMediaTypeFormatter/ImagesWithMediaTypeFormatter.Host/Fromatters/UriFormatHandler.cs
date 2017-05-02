using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace ImagesWithMediaTypeFormatter.Host.Fromatters
{
    public class UriFormatHandler : DelegatingHandler
    {
        static IDictionary<string, string> extensionMappings = new Dictionary<string, string>()
            {
                {"png", "image/png"}
            };

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var path = request.RequestUri.AbsolutePath;
            // Get the extension of the requested file
            var ext = path.Substring(path.LastIndexOf('.') + 1);
            string mediaType = null;
            // Check if the extension exists in the mappings dictionary
            var found = extensionMappings.TryGetValue(ext, out mediaType);

            if (found)
            {
                // Replace the url xxx.ext with url xxx and content type = ext
                var newUri = request.RequestUri.OriginalString.Replace('.' + ext, String.Empty);
                request.RequestUri = new Uri(newUri, UriKind.Absolute);
                // Remove the "ext" from the route data to match the controller's action
                if (request.GetRouteData() != null)
                    request.GetRouteData().Values.Remove("ext");
                // Set the correct accept mime type
                request.Headers.Accept.Clear();
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue(mediaType));
            }

            return base.SendAsync(request, cancellationToken);
        }
    }
}