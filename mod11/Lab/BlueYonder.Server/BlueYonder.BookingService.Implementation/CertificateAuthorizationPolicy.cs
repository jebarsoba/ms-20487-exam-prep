using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.BookingService.Implementation
{
    public class CertificateAuthorizationPolicy : System.IdentityModel.Policy.IAuthorizationPolicy
    {
        private Guid _id;
        private static Dictionary<string, string[]> AuthorizationForUser = new Dictionary<string, string[]>
            {
                { "CN=Client", new string[] {"ReservationsManager" }}
        };

        public bool Evaluate(System.IdentityModel.Policy.EvaluationContext evaluationContext, ref object state)
        {
            bool retValue = false;

            var identitiesList = evaluationContext.Properties["Identities"] as List<System.Security.Principal.IIdentity>;
            if (identitiesList != null && identitiesList.Count > 0)
            {
                System.Security.Principal.IIdentity identity = identitiesList.First();
                string name = identity.Name.Split(';').First();
                string[] roles = null;

                if (AuthorizationForUser.ContainsKey(name))
                {
                    roles = AuthorizationForUser[name];
                }

                evaluationContext.Properties["Principal"] =
                    new System.Security.Principal.GenericPrincipal(
                        identity,
                        roles);

                retValue = true;
            }

            return retValue;
        }

        public CertificateAuthorizationPolicy()
        {
            _id = Guid.NewGuid();
        }

        public string Id
        {
            get
            {
                return _id.ToString();
            }
        }

        public System.IdentityModel.Claims.ClaimSet Issuer
        {
            get
            {
                return System.IdentityModel.Claims.ClaimSet.System;
            }
        }


    }
}
