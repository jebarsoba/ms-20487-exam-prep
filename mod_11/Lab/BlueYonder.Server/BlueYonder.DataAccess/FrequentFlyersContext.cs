using BlueYonder.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.DataAccess
{    
    public class FrequentFlyersContext : DbContext
    {
        public FrequentFlyersContext(string connectionName) : base(connectionName)
        {
        }

        public FrequentFlyersContext() : base("BlueYonderFrequentFlyer")
        {
        }

        public DbSet<FrequentFlyer> FrequentFlyers { get; set; }
    }
}
