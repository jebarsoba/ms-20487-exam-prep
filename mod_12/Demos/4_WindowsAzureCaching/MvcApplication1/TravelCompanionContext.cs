using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MvcApplication1
{    
    public class TravelCompanionContext : DbContext
    {
        public TravelCompanionContext(string connectionName) : base(connectionName)
        {
        }

        public TravelCompanionContext() : this("TravelCompanion")
        {
        }

        public DbSet<Location> Locations { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }
}
