using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.Client.Helpers
{
    public class IdentityProviderFeed
    {
        public string Name { get; set; }
        public string LoginUrl { get; set; }
        public string LogoutUrl { get; set; }
        public string ImageUrl { get; set; }
        public string[] EmailAddressSuffixes { get; set; }

        public override string ToString()
        {
            return Name;
        }
    }
}
