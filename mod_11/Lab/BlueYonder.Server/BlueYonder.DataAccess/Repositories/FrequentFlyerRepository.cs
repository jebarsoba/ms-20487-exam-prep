using BlueYonder.DataAccess.Interfaces;
using BlueYonder.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.DataAccess.Repositories
{
    public class FrequentFlyerRepository : IFrequentFlyerRepository
    {
        FrequentFlyersContext context;

        public FrequentFlyerRepository(string connectionName)
        {
            context = new FrequentFlyersContext(connectionName);
        }

        public FrequentFlyerRepository()
        {
            context = new FrequentFlyersContext();
        }

        public FrequentFlyerRepository(FrequentFlyersContext dbContext)
        {
            context = dbContext;
        }

        public FrequentFlyer GetSingle(int entityKey)
        {
            var query = from t in context.FrequentFlyers
                        where t.TravelerId == entityKey
                        select t;

            return query.SingleOrDefault();
        }

        public IQueryable<FrequentFlyer> GetAll()
        {
            return context.FrequentFlyers.AsQueryable<FrequentFlyer>();
        }

        public IQueryable<FrequentFlyer> FindBy(System.Linq.Expressions.Expression<Func<FrequentFlyer, bool>> predicate)
        {
            return GetAll().Where(predicate);
        }

        public void Add(FrequentFlyer entity)
        {
            context.FrequentFlyers.Add(entity);
        }

        public void Delete(FrequentFlyer entity)
        {
            context.FrequentFlyers.Find(entity.TravelerId);
            context.FrequentFlyers.Remove(entity);
        }

        public void Edit(FrequentFlyer entity)
        {
            var originalEntity = context.FrequentFlyers.Find(entity.TravelerId);
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
