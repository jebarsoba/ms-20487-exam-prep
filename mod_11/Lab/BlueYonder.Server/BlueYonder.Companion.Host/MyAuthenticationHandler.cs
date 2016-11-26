//using Microsoft.IdentityModel.Claims;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Dispatcher;
using Thinktecture.IdentityModel;
using Thinktecture.IdentityModel.Constants;
using Thinktecture.IdentityModel.Tokens.Http;

namespace BlueYonder.Companion.Host
{
    public class MyAuthenticationHandler : DelegatingHandler
    {
        HttpAuthentication _authN;

        public MyAuthenticationHandler(AuthenticationConfiguration configuration, HttpConfiguration httpConfiguration = null)
        {
            _authN = new HttpAuthentication(configuration);

            if (httpConfiguration != null)
            {
                InnerHandler = new HttpControllerDispatcher(httpConfiguration);
            }
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            if (_authN.Configuration.InheritHostClientIdentity == false)
            {
                SetPrincipal(Principal.Anonymous);
            }

            try
            {
                // try to authenticate
                // returns an anonymous principal if no credential was found
                var principal = _authN.Authenticate(request);

                if (principal == null)
                {
                    throw new InvalidOperationException("No principal set");
                }

                if (principal.Identity.IsAuthenticated)
                {
                    // check for token request - if yes send token back and return
                    if (_authN.IsSessionTokenRequest(request))
                    {
                        return SendSessionTokenResponse(principal);
                    }

                    // else set the principal
                    SetPrincipal(principal);
                }
            }
            catch (SecurityTokenValidationException)
            {
                return SendUnauthorizedResponse(request);
            }
            catch (SecurityTokenException)
            {
                return SendUnauthorizedResponse(request);
            }

            return base.SendAsync(request, cancellationToken).ContinueWith(
                (task) =>
                {
                    var response = task.Result;

                    if (response.StatusCode == HttpStatusCode.Unauthorized)
                    {
                        SetAuthenticateHeader(response);
                        SetNoRedirectMarker(request);
                    }

                    return response;
                });
        }

        private Task<HttpResponseMessage> SendUnauthorizedResponse(HttpRequestMessage request)
        {
            return Task<HttpResponseMessage>.Factory.StartNew(() =>
            {
                var response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                SetAuthenticateHeader(response);
                SetNoRedirectMarker(request);

                return response;
            });
        }

        private Task<HttpResponseMessage> SendSessionTokenResponse(ClaimsPrincipal principal)
        {
            var token = _authN.CreateSessionToken(principal);
            var tokenResponse = _authN.CreateSessionTokenResponse(token);

            return Task<HttpResponseMessage>.Factory.StartNew(() =>
            {
                var response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = new StringContent(tokenResponse, Encoding.UTF8, "application/json");

                return response;
            });
        }

        protected virtual void SetAuthenticateHeader(HttpResponseMessage response)
        {
            //if (_authN.Configuration.SendAuthenticateResponseHeader)
            //{
            //    response.Headers.WwwAuthenticate.Add(new AuthenticationHeaderValue(_authN.Configuration.DefaultAuthenticationScheme));
            //}
        }

        protected virtual void SetNoRedirectMarker(HttpRequestMessage request)
        {
            //if (_authN.Configuration.SetNoRedirectMarker)
            //{
            //    if (HttpContext.Current != null)
            //    {
            //        HttpContext.Current.Items[Internal.NoRedirectLabel] = true;
            //    }
            //    else if (request.Properties["MS_HttpContext"] != null)
            //    {
            //        var context = request.Properties["MS_HttpContext"] as HttpContextWrapper;
            //        context.Items[Internal.NoRedirectLabel] = true;
            //    }
            //}
        }

        protected virtual void SetPrincipal(ClaimsPrincipal principal)
        {
            Thread.CurrentPrincipal = principal;

            if (HttpContext.Current != null)
            {
                HttpContext.Current.User = principal;
            }
        }
    }

}