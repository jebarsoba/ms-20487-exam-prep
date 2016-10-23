using BlueYonder.DataAccess.Interfaces;
using BlueYonder.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.DataAccess.Repositories
{
    public class LocationRepository : ILocationRepository
    {
        TravelCompanionContext context;

        public LocationRepository()
        {
            context = new TravelCompanionContext();
        }

        public LocationRepository(TravelCompanionContext dbContext)
        {
            context = dbContext;
        }

        public Location GetSingle(int entityKey)
        {
            var query = from l in context.Locations
                        where l.LocationId == entityKey
                        select l;

            return query.SingleOrDefault();         
        }

        public IQueryable<Location> GetAll()
        {
            return context.Locations.AsQueryable<Location>();
        }

        public IQueryable<Location> FindBy(System.Linq.Expressions.Expression<Func<Location, bool>> predicate)
        {
            return GetAll().Where(predicate);
        }

        public void Add(Location entity)
        {
            context.Locations.Add(entity);
        }

        public void Delete(Location entity)
        {
            context.Locations.Find(entity.LocationId);
            context.Locations.Remove(entity);
        }

        public void Edit(Location entity)
        {
            var originalEntity = context.Locations.Find(entity.LocationId);
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
    }
}
