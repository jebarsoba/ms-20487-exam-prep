using Microsoft.IdentityModel;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace BlueYonder.Companion.Host
{
    public class FederationCallbackController : ApiController
    {
        public HttpResponseMessage Post()
        {
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Redirect);
            response.Headers.Add("Location", string.Format("FederationCallback/end?acsToken={0}", ClaimsPrincipalExtensions.BootstrapToken(HttpContext.Current.User)));

            return response;
        }
    }
}