using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BlueYonder.DataAccess.Interfaces;
using BlueYonder.Entities;
using CompanionDTOMappers = BlueYonder.Companion.Entities.Mappers;
using CompanionDTO = BlueYonder.Companion.Entities;
using System.ServiceModel;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using BlueYonder.Companion.Entities;
using BlueYonder.Companion.Entities.Mappers;
using BlueYonder.BookingService.Contracts;

namespace BlueYonder.Companion.Controllers
{
    public class ReservationsController : ApiController
    {
        // will be used to create channels when required
        private ChannelFactory<IBookingService> factory =
            new ChannelFactory<IBookingService>("BookingTcp");

        public IReservationRepository Reservations { get; set; }

        public ReservationsController(IReservationRepository reservations)
        {
            Reservations = reservations;
        }

        public HttpResponseMessage GetReservation(int id)
        {
            var reservation = Reservations.GetSingle(id);

            // Handling the HTTP status codes
            if (reservation != null)
                return Request.CreateResponse<ReservationDTO>
                    (HttpStatusCode.OK, reservation.ToReservationDTO());
            else
                return Request.CreateResponse(HttpStatusCode.NotFound);
        }

        public HttpResponseMessage GetReservations(int travelerId)
        {
            var reservations = Reservations.FindBy(r => r.TravelerId == travelerId);

            var reservationsDto =
                from r in reservations.ToList() select CompanionDTOMappers.ReservationExtensions.ToReservationDTO(r);

            return Request.CreateResponse(HttpStatusCode.OK, reservationsDto);
        }

        public HttpResponseMessage Post([FromBody]CompanionDTO.ReservationDTO reservation)
        {
            // saving the new order to the database
            Reservation newReservation = CompanionDTOMappers.ReservationExtensions.FromReservationDTO(reservation);

            // send a reservation creation request to the backend booking service.
            string confirmationCode = CreateReservationOnBackendSystem(newReservation);

            newReservation.ConfirmationCode = confirmationCode;
            Reservations.Add(newReservation);
            Reservations.Save();


            // creating the response, with three key features:
            // 1. the newly saved entity
            // 2. 201 Created status code
            // 3. Location header with the location of the new resource
            var response = Request.CreateResponse(HttpStatusCode.Created, newReservation);
            response.Headers.Location = new Uri(Request.RequestUri, newReservation.ReservationId.ToString());
            return response;
        }

        public HttpResponseMessage Delete(int id)
        {
            var reservation = Reservations.GetSingle(id);

            // returning 404 if the entity doesn't exist 
            if (reservation == null)
                return Request.CreateResponse(HttpStatusCode.NotFound);

            Reservations.Delete(reservation);
            Reservations.Save();
            return Request.CreateResponse(HttpStatusCode.OK);
        }


        private string CreateReservationOnBackendSystem(Reservation reservation)
        {
            IBookingService proxy = factory.CreateChannel();

            try
            {
                (proxy as ICommunicationObject).Open();

                TripDto departureFlight = new TripDto
                {
                    FlightScheduleID = reservation.DepartureFlight.FlightScheduleID,
                    Class = reservation.DepartureFlight.Class,
                    Status = reservation.DepartureFlight.Status
                };

                TripDto returnFlight = null;
                if (reservation.ReturnFlight != null)
                {
                    returnFlight = new TripDto
                    {
                        FlightScheduleID = reservation.ReturnFlight.FlightScheduleID,
                        Class = reservation.ReturnFlight.Class,
                        Status = reservation.ReturnFlight.Status
                    };
                }

                ReservationDto request = new ReservationDto()
                {
                    DepartureFlight = departureFlight,
                    ReturnFlight = null,
                    ReservationDate = reservation.ReservationDate,
                    TravelerId = reservation.TravelerId
                };

                string confirmationCode = proxy.CreateReservation(request);

                (proxy as ICommunicationObject).Close();

                return confirmationCode;
            }
            catch (Exception)
            {
                (proxy as ICommunicationObject).Abort();
                throw;
            }
        }
    }
}