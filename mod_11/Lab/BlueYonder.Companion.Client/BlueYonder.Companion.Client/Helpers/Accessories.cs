using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.ApplicationModel.Resources;

namespace BlueYonder.Companion.Client.Helpers
{
    public static class Accessories
    {
        /// <summary>
        /// The resource identifier of the ResourceMap that the new resource loader uses for unqualified resource references.
        /// It can then retrieve resources relative to those references.
        /// </summary>
        public static ResourceLoader resourceLoader = new ResourceLoader();
    }
}
