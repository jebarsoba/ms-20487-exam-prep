using BlueYonder.DataAccess.Interfaces;
using BlueYonder.Entities;
using System;
using System.Collections.Generic;
using System.Data.Objects;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.DataAccess.Repositories
{
    public class FlightRepository : IFlightRepository
    {
        TravelCompanionContext context;

        public FlightRepository(string connectionName)
        {
            context = new TravelCompanionContext(connectionName);
        }

        public FlightRepository()
        {
            context = new TravelCompanionContext();
        }

        public FlightRepository(TravelCompanionContext dbContext)
        {
            context = dbContext;
        }

        public Flight GetFlight(string flightNumber)
        {
            var query = from f in context.Flights
                        where f.FlightNumber == flightNumber 
                        select f;

            query = query.AsQueryable().Include(f => f.Schedules);

            return query.SingleOrDefault();            
        }

        public FlightSchedule GetSchedule(int flightScheduleId)
        {
            var query = from f in context.FlightSchedules
                        where f.FlightScheduleId == flightScheduleId
                        select f;

            return query.Include(f => f.Flight).SingleOrDefault();          
        }

        public IQueryable<Flight> GetAll()
        {
            return context.Flights.AsQueryable<Flight>();
        }

        public IQueryable<Flight> FindBy(System.Linq.Expressions.Expression<Func<Flight, bool>> predicate)
        {
            return GetAll().Where(predicate);
        }

        public IQueryable<FlightSchedule> GetFlightSchedules(Location fromLocation, Location toLocation, DateTime fromDate, DateTime toDate)
        {
            var query = from fs in context.FlightSchedules                       
                        where fs.Departure >= fromDate && fs.Departure <= toDate
                        && fs.Flight.Source.LocationId == fromLocation.LocationId
                        && fs.Flight.Destination.LocationId == toLocation.LocationId
                        select fs;

            query = query.AsQueryable().Include(fs => fs.Flight);

            return query;            
        }

        public void Add(Flight entity)
        {
            context.Flights.Add(entity);
            
        }

        public void Delete(Flight entity)
        {
            context.Flights.Find(entity.FlightId);
            context.Flights.Remove(entity);
        }

        public void Edit(Flight entity)
        {
            var originalEntity = context.Flights.Find(entity.FlightId);
            context.Entry(originalEntity).CurrentValues.SetValues(entity);
        }

        public void Save()
        {
            context.SaveChanges();
        }

        public void Dispose()
        {
            if (context != null)
            {
                context.Dispose();
                context = null;
            }
            GC.SuppressFinalize(this);
        }
        
        public void AddSchedule(Flight route, FlightSchedule newSchedule)
        {
            context.Flights.Find(route.FlightId).Schedules.Add(newSchedule);
        }

        public void UpdateSchedule(FlightSchedule flightSchedule)
        {
            var originalEntity = context.FlightSchedules.Find(flightSchedule.FlightScheduleId);
            context.Entry(originalEntity).CurrentValues.SetValues(flightSchedule);            
        }

        public void UpdateActualDeparture(FlightSchedule flightSchedule, DateTime newDeparture)
        {
            var query = from r in context.Flights
                        from s in r.Schedules
                        where s.FlightScheduleId == flightSchedule.FlightScheduleId
                        select s;
            query.Single().ActualDeparture = newDeparture;
        }


        public Flight GetFlight(int flightID)
        {
            var query = from f in context.Flights
                        where f.FlightId == flightID
                        select f;

            query = query.AsQueryable().Include(f => f.Schedules);

            return query.SingleOrDefault(); 
        }
    }
}
