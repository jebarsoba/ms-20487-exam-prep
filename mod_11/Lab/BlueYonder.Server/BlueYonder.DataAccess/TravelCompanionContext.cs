using BlueYonder.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.DataAccess
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
        public DbSet<Flight> Flights { get; set; }
        public DbSet<FlightSchedule> FlightSchedules { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Traveler> Travelers { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Reservation>()
                .HasRequired(r => r.DepartureFlight)
                .WithMany()
                .HasForeignKey(r => r.DepartFlightScheduleID)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Reservation>()
                .HasOptional(r => r.ReturnFlight)
                .WithMany()
                .HasForeignKey(r => r.ReturnFlightScheduleID)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<FlightSchedule>()
                .HasRequired(fs => fs.Flight)
                .WithMany(f => f.Schedules)
                .Map(m => m.MapKey("FlightID"));
        }
    }
}
