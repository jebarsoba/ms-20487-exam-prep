using BlueYonder.DataAccess;
using BlueYonder.DataAccess.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Dependencies;

namespace BlueYonder.Companion.Controllers
{
    public class BlueYonderResolver : IDependencyResolver
    {
        public IDependencyScope BeginScope()
        {
            return this;
        }

        public object GetService(Type serviceType)
        {
            if (serviceType == typeof(FlightsController))
                return new FlightsController(new FlightRepository(), new LocationRepository());
            if (serviceType == typeof(LocationsController))
                return new LocationsController(new LocationRepository());
            if (serviceType == typeof(ReservationsController))
                return new ReservationsController(new ReservationRepository());
            if (serviceType == typeof(TravelersController))
                return new TravelersController(new TravelerRepository());
            if (serviceType == typeof(TripsController))
                return new TripsController(new ReservationRepository());
            return null;
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return new List<object>();
        }

        public void Dispose()
        {
        }
    }
}
