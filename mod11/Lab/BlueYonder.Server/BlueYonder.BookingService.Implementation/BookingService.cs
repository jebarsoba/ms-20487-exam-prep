using System;
using System.ServiceModel;
using BlueYonder.BookingService.Contracts;
using BlueYonder.BookingService.Contracts.Faults;
using BlueYonder.DataAccess.Interfaces;
using BlueYonder.DataAccess.Repositories;
using BlueYonder.Entities;
using System.Transactions;
using System.Linq;
using BlueYonder.FrequentFlyerService.Contracts;

namespace BlueYonder.BookingService.Implementation
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall)]
    public class BookingService : IBookingService
    {
        public static readonly string ConnectionName = "BlueYonderServer";

        private ChannelFactory<IFrequentFlyerService> _frequentFlyerChannnelFactory =
            new ChannelFactory<IFrequentFlyerService>("FrequentFlyerEP");

        public string CreateReservation(ReservationDto request)
        {
            // Verify the flight is valid
            if (request.DepartureFlight == null)
            {
                throw new FaultException<ReservationCreationFault>(
                    new ReservationCreationFault
                    {
                        Description = "Reservation must include a departure flight",
                        ReservationDate = request.ReservationDate
                    },
                    "Invalid flight info");
            }


            // Create reservation object with trips
            var reservation = new Reservation
            {
                TravelerId = request.TravelerId,
                ReservationDate = request.ReservationDate,
                DepartureFlight = new Trip
                {
                    Class = request.DepartureFlight.Class,
                    Status = request.DepartureFlight.Status,
                    FlightScheduleID = request.DepartureFlight.FlightScheduleID
                }
            };

            if (request.ReturnFlight != null)
            {
                reservation.ReturnFlight = new Trip
                {
                    Class = request.ReturnFlight.Class,
                    Status = request.ReturnFlight.Status,
                    FlightScheduleID = request.ReturnFlight.FlightScheduleID
                };
            }

            using (IReservationRepository reservationRepository = new ReservationRepository(ConnectionName))
            {
                reservation.ConfirmationCode = ReservationUtils.GenerateConfirmationCode(reservationRepository);
                reservationRepository.Add(reservation);
                reservationRepository.Save();
                return reservation.ConfirmationCode;
            }
        }

        public void UpdateTrip(TripUpdateDto trip)
        {
            using (IReservationRepository reservationRepository = new ReservationRepository(ConnectionName))
            {
                Reservation reservation = reservationRepository.FindBy(r => r.ConfirmationCode == trip.ReservationConfirmationCode).FirstOrDefault();
                Trip originalTrip = null;

                if (reservation == null)
                {
                    throw new FaultException("The confirmation code of the reservation is invalid");
                }

                switch (trip.FlightDirection)
                {
                    case FlightDirections.Departing:
                        originalTrip = reservation.DepartureFlight;
                        break;
                    case FlightDirections.Returning:
                        originalTrip = reservation.ReturnFlight;
                        break;
                }

                if (originalTrip == null)
                {
                    throw new FaultException("The requested trip was not found");
                }

                FlightStatus originalStatus = originalTrip.Status;
                FlightStatus newStatus = trip.TripToUpdate.Status;
                reservationRepository.UpdateTrip(
                    originalTrip,
                     new Trip()
                    {
                        TripId = originalTrip.TripId,
                        ThumbnailImage = originalTrip.ThumbnailImage,
                        FlightInfo = originalTrip.FlightInfo,
                        FlightScheduleID = originalTrip.FlightScheduleID,
                        Status = trip.TripToUpdate.Status,
                        Class = trip.TripToUpdate.Class
                    });

                using (TransactionScope scope = new TransactionScope())
                {
                    if (originalStatus != newStatus && newStatus == FlightStatus.CheckedIn)
                    {
                        IFrequentFlyerService proxy = _frequentFlyerChannnelFactory.CreateChannel();
                        int earnedMiles = originalTrip.FlightInfo.Flight.FrequentFlyerMiles;
                        proxy.AddFrequentFlyerMiles(reservation.TravelerId, earnedMiles);
                    }

                    reservationRepository.Save();

                    scope.Complete();
                }
            }
        }

        public void CancelReservation(string confirmationCode)
        {
            using (IReservationRepository reservationRepository = new ReservationRepository(ConnectionName))
            {
                var existingReservation = reservationRepository.FindBy(r => r.ConfirmationCode == confirmationCode).SingleOrDefault();

                if (existingReservation == null)
                {
                    throw new FaultException("Reservation not found");
                }

                // Canceling a reservation is logical, not physical
                // meaning the trips are marked as canceled, instead of
                // being deleted from the database
                existingReservation.DepartureFlight.Status = FlightStatus.Canceled;
                if (existingReservation.ReturnFlight != null)
                {
                    existingReservation.ReturnFlight.Status = FlightStatus.Canceled;
                }
                reservationRepository.Save();
            }
        }
    }
}
