using BlueYonder.DataAccess.Interfaces;
using BlueYonder.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.DataAccess.Repositories
{
    public class ReservationRepository : IReservationRepository
    {
        TravelCompanionContext context;

        public ReservationRepository(string connectionName)
        {
            context = new TravelCompanionContext(connectionName);
        }

        public ReservationRepository()
        {
            context = new TravelCompanionContext();
        }

        public ReservationRepository(TravelCompanionContext dbContext)
        {
            context = dbContext;
        }

        public Reservation GetSingle(int entityKey)
        {
            var query = from r in context.Reservations
                        where r.ReservationId == entityKey
                        select r;

            return query.SingleOrDefault();
        }

        public Reservation GetSingleNoTracking(int reservationID)
        {
            var query = from r in context.Reservations.AsNoTracking()
                        where r.ReservationId == reservationID
                        select r ;

            return query.SingleOrDefault();
        }

        public IQueryable<Reservation> GetAll()
        {
            return context.Reservations.AsQueryable<Reservation>();
        }

        public IQueryable<Reservation> FindBy(Expression<Func<Reservation, bool>> predicate)
        {
            return GetAll().Where(predicate);
        }

        public void Add(Reservation entity)
        {
            context.Reservations.Add(entity);
        }

        public void Delete(Reservation entity)
        {
            context.Reservations.Find(entity.ReservationId);
            if (entity.DepartFlightScheduleID != 0)
                context.Entry(entity.DepartureFlight).State = System.Data.EntityState.Deleted;
            if (entity.ReturnFlightScheduleID != 0)
                context.Entry(entity.ReturnFlight).State = System.Data.EntityState.Deleted;            
            context.Reservations.Remove(entity);
        }

        public void Edit(Reservation entity)
        {
            var originalEntity = context.Reservations.Find(entity.ReservationId);
            context.Entry(originalEntity).CurrentValues.SetValues(entity);
        }

        public void UpdateTrip(Trip originalEntity, Trip updatedEntity)
        {
            context.Entry(originalEntity).CurrentValues.SetValues(updatedEntity);
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
    }
}
