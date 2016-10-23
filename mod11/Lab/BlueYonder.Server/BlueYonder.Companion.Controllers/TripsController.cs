using BlueYonder.Companion.Entities.Mappers;
using BlueYonder.Companion.Entities;
using BlueYonder.DataAccess.Interfaces;
using BlueYonder.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Hosting;
using System.Web.Http.Routing;
using System.Web;
using BlueYonder.BookingService.Contracts;

namespace BlueYonder.Companion.Controllers
{
    public class TripsController : ApiController
    {
        private ChannelFactory<IBookingService> factory =
            new ChannelFactory<IBookingService>("BookingTcp");

        private const string IMAGE_URL_TEMPLATE = "{0}/Images/Thumbnails/{1}";

        public IReservationRepository Reservations { get; set; }

        public TripsController(IReservationRepository reservations)
        {
            Reservations = reservations;
        }

        public HttpResponseMessage Get(int id)
        {
            var departTrip = Reservations.GetAll().Where(r => r.DepartFlightScheduleID == id).Select(r => r.DepartureFlight);
            var returnTrip = Reservations.GetAll().Where(r => r.ReturnFlightScheduleID == id).Select(r => r.ReturnFlight);

            Trip trip = departTrip.Union(returnTrip).SingleOrDefault();

            if (!string.IsNullOrEmpty(trip.FlightInfo.Flight.Destination.ThumbnailImageFile))
            {
                trip.ThumbnailImage = ResolveImageUrl(trip.FlightInfo.Flight.Destination.ThumbnailImageFile);
            }

            if (trip == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, trip.ToTripDTO());
            }
        }

        private string ResolveImageUrl(string relativeImagePath)
        {
            return string.Format(IMAGE_URL_TEMPLATE, Request.RequestUri.Authority, relativeImagePath);
        }

        public HttpResponseMessage Put(int id, [FromBody]TripDTO trip)
        {
            Reservation reservation = Reservations.FindBy(r =>
                r.DepartFlightScheduleID == id ||
                r.ReturnFlightScheduleID == id).FirstOrDefault();

            if (reservation == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            Trip orignalEntity;
            FlightDirections flightDirection;
            if (reservation.DepartFlightScheduleID == id)
            {
                orignalEntity = reservation.DepartureFlight;
                flightDirection = FlightDirections.Departing;
            }
            else
            {
                orignalEntity = reservation.ReturnFlight;
                flightDirection = FlightDirections.Returning;
            }

            Reservations.UpdateTrip(orignalEntity, trip.FromTripDTO());
            Reservations.Save();

            // send a reservation update request to the backend booking service
            UpdateReservationOnBackendSystem(reservation, orignalEntity, flightDirection);

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        private void UpdateReservationOnBackendSystem(Reservation reservation, Trip trip, FlightDirections flightDirection)
        {
            IBookingService proxy = factory.CreateChannel();

            try
            {
                (proxy as ICommunicationObject).Open();


                TripUpdateDto tripUpdateRequest = new TripUpdateDto
                {
                    FlightDirection = flightDirection,
                    ReservationConfirmationCode = reservation.ConfirmationCode,
                    TripToUpdate = new TripDto
                    {
                        FlightScheduleID = reservation.DepartureFlight.FlightScheduleID,
                        Class = reservation.DepartureFlight.Class,
                        Status = reservation.DepartureFlight.Status
                    }
                };

                proxy.UpdateTrip(tripUpdateRequest);

                (proxy as ICommunicationObject).Close();
            }
            catch (Exception)
            {
                (proxy as ICommunicationObject).Abort();
            }
        }
    }
}
