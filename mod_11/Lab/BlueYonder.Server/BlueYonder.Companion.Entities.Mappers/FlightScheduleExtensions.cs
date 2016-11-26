using BlueYonder.Entities;
using BlueYonder.Companion.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.Entities.Mappers
{
    public static class FlightScheduleExtensions
    {
        public static FlightScheduleDTO ToFlightScheduleDTO(this FlightSchedule flightSchedule)
        {
            FlightScheduleDTO dto = new FlightScheduleDTO
                {
                    Departure = flightSchedule.Departure,
                    Duration = flightSchedule.Duration,
                    ActualDeparture = flightSchedule.ActualDeparture,
                    Flight = new FlightDTO
                    {
                        Source = flightSchedule.Flight.Source.ToLocationDTO(),
                        Destination = flightSchedule.Flight.Destination.ToLocationDTO(),
                        FlightNumber = flightSchedule.Flight.FlightNumber,
                        FrequentFlyerMiles = flightSchedule.Flight.FrequentFlyerMiles,
                        FlightId = flightSchedule.Flight.FlightId
                    },
                    FlightScheduleId = flightSchedule.FlightScheduleId,                    
                };

            return dto;
        }
    }
}
