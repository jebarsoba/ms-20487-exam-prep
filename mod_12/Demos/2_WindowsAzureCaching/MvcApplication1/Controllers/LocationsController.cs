using Microsoft.ApplicationServer.Caching;
using System.Linq;
using System.Web.Http;

namespace MvcApplication1.Controllers
{
    public class LocationsController : ApiController
    {
        public Location Get(int id)
        {
            Location location = null;

            DataCache dataCache = new DataCacheFactory().GetDefaultCache();

            location = (Location)dataCache.Get(string.Format("location_{0}", id));

            if (location == null)
            {
                using (TravelCompanionContext context = new TravelCompanionContext())
                {
                    var locations = from l in context.Locations
                                    where l.LocationId == id
                                    select l;

                    location = locations.FirstOrDefault();

                    dataCache.Put(string.Format("location_{0}", id), location);
                }
            }

            return location;
        }
    }
}