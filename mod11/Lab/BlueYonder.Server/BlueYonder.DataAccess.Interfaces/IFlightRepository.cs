using System;
using BlueYonder.Entities;
using System.Linq;

namespace BlueYonder.DataAccess.Interfaces
{
    public interface IFlightRepository : IRepository<Flight>
    {
        Flight GetFlight(string flightNumber);
        Flight GetFlight(int flightID);
        FlightSchedule GetSchedule(int flightScheduleId);
        IQueryable<FlightSchedule> GetFlightSchedules(Location fromLocation, Location toLocation, DateTime fromDate, DateTime toDate);
        
        void AddSchedule(Flight route, FlightSchedule newSchedule);
        void UpdateSchedule(FlightSchedule flightSchedule);
        void UpdateActualDeparture(FlightSchedule flightSchedule, DateTime newDeparture);
    }
}
