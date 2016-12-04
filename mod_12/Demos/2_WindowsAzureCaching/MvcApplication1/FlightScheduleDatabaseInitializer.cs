using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MvcApplication1
{
    class FlightScheduleDatabaseInitializer : DropCreateDatabaseIfModelChanges<TravelCompanionContext>
    {
        protected override void Seed(TravelCompanionContext context)
        {
            context.Locations.Add(GenerateLocation("Seattle", "United States", "US", "Washington"));

            context.Locations.Add(GenerateLocation("Paris", "France", "FR", null));

            context.Locations.Add(GenerateLocation("Rome", "Italy", "IT", null ));

            context.Locations.Add(GenerateLocation("New York", "United States", "US", "New York"));
         
            context.SaveChanges();            
        }

        private static Location GenerateLocation(string city, string country, string countryCode, string state)
        {
            return new Location
                       {
                           City = city,
                           Country = country,
                           CountryCode = countryCode,
                           State = state                           
                       };
        }

       
    }
}
