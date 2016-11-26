using BlueYonder.Entities;
using BlueYonder.Companion.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.Entities.Mappers
{
    public static class ReservationExtensions
    {
        public static ReservationDTO ToReservationDTO(this Reservation reservation)
        {
            ReservationDTO dto = new ReservationDTO()
            {
                ConfirmationCode = reservation.ConfirmationCode,
                ReservationDate = reservation.ReservationDate,
                ReservationId = reservation.ReservationId,
                TravelerId = reservation.TravelerId
            };

            if (reservation.DepartureFlight != null)
            {
                dto.DepartureFlight = reservation.DepartureFlight.ToTripDTO();
            }

            if (reservation.ReturnFlight != null)
            {
                dto.ReturnFlight = reservation.ReturnFlight.ToTripDTO();
            }

            return dto;
        }

        public static Reservation FromReservationDTO(this ReservationDTO res)
        {
            Reservation reservation = new Reservation()
            {
                ConfirmationCode = res.ConfirmationCode,
                ReservationDate = res.ReservationDate,
                ReservationId = res.ReservationId,
                TravelerId = res.TravelerId,
                DepartureFlight = res.DepartureFlight.FromTripDTO(),                
            };

            if (res.ReturnFlight != null)
            {
                reservation.ReturnFlight = res.ReturnFlight.FromTripDTO();
            }

            return reservation;
        }

        public static int GetEarnedMiles(this Reservation reservation)
        {
            //departure flight is manatory
            int earnedMiles = reservation.DepartureFlight.FlightInfo.Flight.FrequentFlyerMiles;

            //return flight is optional
            if (reservation.ReturnFlight != null)
            {
                earnedMiles += reservation.DepartureFlight.FlightInfo.Flight.FrequentFlyerMiles;
            }

            return earnedMiles;
        }
    }
}
