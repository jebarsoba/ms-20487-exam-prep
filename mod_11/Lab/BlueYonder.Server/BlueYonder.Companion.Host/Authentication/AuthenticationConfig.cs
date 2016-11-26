using Microsoft.WindowsAzure;
using Thinktecture.IdentityModel.Tokens.Http;

namespace BlueYonder.Companion.Host.Authentication
{
    public class AuthenticationConfig
    {
        public static AuthenticationConfiguration CreateConfiguration()
        {
            AuthenticationConfiguration config = new AuthenticationConfiguration();

            string issuerName = CloudConfigurationManager.GetSetting("ACS.IssuerName").Trim();
            string realm = CloudConfigurationManager.GetSetting("ACS.Realm").Trim();
            string signingKey = CloudConfigurationManager.GetSetting("ACS.SigningKey").Trim();

            config.AddSimpleWebToken(issuerName, realm, signingKey, AuthenticationOptions.ForAuthorizationHeader("OAuth"));

            config.DefaultAuthenticationScheme = "OAuth";
            config.EnableSessionToken = true;

            return config;
        }
    }
}