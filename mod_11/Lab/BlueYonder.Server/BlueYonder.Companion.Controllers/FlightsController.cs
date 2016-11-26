using BlueYonder.DataAccess;
using BlueYonder.DataAccess.Interfaces;
using BlueYonder.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BlueYonder.Companion.Entities;
using BlueYonder.Companion.Entities.Mappers;

namespace BlueYonder.Companion.Controllers
{
    public class FlightsController : ApiController
    {
        private IFlightRepository Flights;
        private ILocationRepository Locations;


        public FlightsController(IFlightRepository flights, ILocationRepository locations)
        {
            Flights = flights;
            Locations = locations;
        }

        public HttpResponseMessage Get(int id)
        {
            var flight = Flights.GetFlight(id);

            var flightDTO = new FlightWithSchedulesDTO
                {
                    FlightNumber = flight.FlightNumber,
                    FlightId = flight.FlightId,
                    Source = flight.Source.ToLocationDTO(),
                    Destination = flight.Destination.ToLocationDTO(),
                    Schedules =
                        from s in flight.Schedules
                        select new FlightScheduleDTO
                        {
                            // Departure is saved as the local time, but we need to 
                            // calculate the local arrival time according to 
                            // the origin and destination of the flight, and its duration
                            FlightScheduleId = s.FlightScheduleId,
                            Departure = s.Departure,
                            Duration = s.Duration,
                            Arrival = GetArrivalDate(s.Departure, s.Duration, flight.Source, flight.Destination),
                        }
                };

            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, flightDTO);
            return response;
        }

        public HttpResponseMessage GetSpecificSchedule(int id, int scheduleId)
        {
            FlightScheduleDTO schedule = Flights.GetSchedule(scheduleId).ToFlightScheduleDTO();
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, schedule);
            return response;
        }

        public HttpResponseMessage Put(int id, int scheduleId, [FromBody]FlightSchedule updatedSchedule)
        {
            Flights.UpdateActualDeparture(updatedSchedule, updatedSchedule.ActualDeparture.Value);
            Flights.Save();
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
            return response;
        }

        public HttpResponseMessage Get(int source,
                                       int destination,
                                       DateTime? date = null)
        {
            var flights = Flights.GetAll();

            Location fromLocation = Locations.GetSingle(source);
            Location toLocation = Locations.GetSingle(destination);

            if (date == null)
            {
                date = DateTime.Today;
            }

            // Get an IQueryable of possible schedules
            var schedules = Flights.GetFlightSchedules(fromLocation, toLocation, date.Value, date.Value.AddDays(30));

            // Each schedule has a route property, but most schedules
            // will probably belong to the same route, so instead of 
            // having the same route appear several times in the 
            // serialized graph, we will group the schedules according 
            // to the route
            var groupedSchedules = from s in schedules
                                   group s by s.Flight into routes
                                   select routes;

            // Construct the flight object and the flight's schedules
            // We create a new FlightDto object instead of returning  
            // the original Flight because the EF object 
            // was created using transparent proxies
            // and therefore cannot be serialized
            var routesWithSchedules = 
                from r in groupedSchedules.ToList()
                select new FlightWithSchedulesDTO
                {
                    FlightNumber = r.Key.FlightNumber,
                    FlightId = r.Key.FlightId,
                    Source = fromLocation.ToLocationDTO(),
                    Destination = toLocation.ToLocationDTO(),                    
                    Schedules = 
                        from s in r
                        select new FlightScheduleDTO
                        {
                            // Departure is saved as the local time, but we need to 
                            // calculate the local arrival time according to 
                            // the origin and destination of the flight, and its duration
                            FlightScheduleId = s.FlightScheduleId,
                            Departure = s.Departure,
                            Duration = s.Duration,
                            Arrival = GetArrivalDate(s.Departure, s.Duration, fromLocation , toLocation),
                            ActualDeparture = s.ActualDeparture
                        }
                };
            
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, routesWithSchedules.ToList());
            return response;
        }

        private static DateTime GetArrivalDate(DateTime date, TimeSpan duration, Location sourceLocation, Location targetLocation)
        {
            return TimeZoneInfo.ConvertTime(date.Add(duration), sourceLocation.LocationTimeZone, targetLocation.LocationTimeZone);
        }

        protected override void Dispose(bool disposing)
        {
            Flights.Dispose();
            Locations.Dispose();
            base.Dispose(disposing);
        }
    }
}        