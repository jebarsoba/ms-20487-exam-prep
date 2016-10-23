using BlueYonder.DataAccess.Interfaces;
using BlueYonder.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.DataAccess.Repositories
{
    public class TravelerRepository : ITravelerRepository
    {
        TravelCompanionContext context;

        public TravelerRepository(string connectionName)
        {
            context = new TravelCompanionContext(connectionName);
        }

        public TravelerRepository()
        {
            context = new TravelCompanionContext();
        }

        public TravelerRepository(TravelCompanionContext dbContext)
        {
            context = dbContext;
        }

        public Traveler GetSingle(int entityKey)
        {
            var query = from t in context.Travelers
                        where t.TravelerId == entityKey
                        select t;

            return query.SingleOrDefault();
        }

        public IQueryable<Traveler> GetAll()
        {
            return context.Travelers.AsQueryable<Traveler>();
        }

        public IQueryable<Traveler> FindBy(System.Linq.Expressions.Expression<Func<Traveler, bool>> predicate)
        {
            return GetAll().Where(predicate);
        }

        public void Add(Traveler entity)
        {
            context.Travelers.Add(entity);
        }

        public void Delete(Traveler entity)
        {
            context.Travelers.Find(entity.TravelerId);
            context.Travelers.Remove(entity);
        }

        public void Edit(Traveler entity)
        {
            var originalEntity = context.Travelers.Find(entity.TravelerId);
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
