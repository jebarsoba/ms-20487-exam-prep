using BlueYonder.Entities;
using BlueYonder.Companion.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.Entities.Mappers
{
    public static class TripExtensions
    {
        public static TripDTO ToTripDTO(this Trip trip)
        {
            TripDTO dto = new TripDTO()
            {                                
                TripId = trip.TripId,                
                Status = (FlightStatus)trip.Status,
                Class = (SeatClass)trip.Class,
                ThumbnailImage = trip.ThumbnailImage
            };

            if (trip.FlightInfo != null)
            {
                dto.FlightInfo = trip.FlightInfo.ToFlightScheduleDTO();
            }

            return dto;
        }

        public static Trip FromTripDTO(this TripDTO dto)
        {
            Trip trip = new Trip()
            {
                TripId = dto.TripId,
                Status = (BlueYonder.Entities.FlightStatus)dto.Status,
                Class = (BlueYonder.Entities.SeatClass)dto.Class
            };

            if (dto.FlightInfo != null)
            {
                trip.FlightScheduleID = dto.FlightInfo.FlightScheduleId;
            }

            return trip;
        }
    }
}
