using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlueYonder.DataAccess;
using BlueYonder.Entities;

namespace BlueYonder.BookingService.Host
{
    class FlightScheduleDatabaseInitializer : DropCreateDatabaseIfModelChanges<TravelCompanionContext>
    {
        protected override void Seed(TravelCompanionContext context)
        {
            Location seattle = GenerateLocation("Seattle", "United States", "US", "Washington", "Pacific Standard Time", "Seattle.jpg");

            Location paris = GenerateLocation("Paris", "France", "FR", null, "W. Europe Standard Time", "Paris.jpg");

            Location rome = GenerateLocation("Rome", "Italy", "IT", null, "W. Europe Standard Time", "Rome.jpg");

            Location nyc = GenerateLocation("New York", "United States", "US", "New York", "Eastern Standard Time", "NewYork.jpg");

            Dictionary<Tuple<Location, Location>, Tuple<DayOfWeek[], int>> flightInfo = new Dictionary<Tuple<Location, Location>, Tuple<DayOfWeek[], int>>();

            CreateFlightInfos(flightInfo, seattle, paris, rome, nyc);

            var index = 0;
            foreach (var flightInfoItem in flightInfo)
            {
                var flight = GenerateFlight(flightInfoItem.Key.Item1, flightInfoItem.Key.Item2, flightInfoItem.Value.Item1, ++index, flightInfoItem.Value.Item2);
                context.Flights.Add(flight);
            }

            context.SaveChanges();

            AddLabRelatedEntities(context);

            context.SaveChanges();
        }

        private void AddLabRelatedEntities(TravelCompanionContext context)
        {
            string confirmationCode = "Aa123";

            int flightScheduleId = context.FlightSchedules.Local.First().FlightScheduleId;

            Reservation reservation1 = new Reservation
            {
                TravelerId = 1,
                ReservationDate = DateTime.Now,
                DepartureFlight = new Trip
                {
                    Class = SeatClass.Economy,
                    Status = FlightStatus.Confirmed,
                    FlightScheduleID = flightScheduleId
                },
                ConfirmationCode = confirmationCode
            };
            context.Reservations.Add(reservation1);
        }

        private static void CreateFlightInfos(Dictionary<Tuple<Location, Location>, Tuple<DayOfWeek[], int>> flightInfo, Location seattle, Location paris, Location rome,
                                              Location nyc)
        {
            flightInfo.Add(new Tuple<Location, Location>(seattle, paris),
                           new Tuple<DayOfWeek[], int>(new[] { DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday }, 5026));
            flightInfo.Add(new Tuple<Location, Location>(seattle, rome),
                           new Tuple<DayOfWeek[], int>(new[] { DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Thursday }, 5694));
            flightInfo.Add(new Tuple<Location, Location>(seattle, nyc),
                           new Tuple<DayOfWeek[], int>(new[]
                               {
                                   DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday,
                                   DayOfWeek.Friday, DayOfWeek.Saturday,
                               }, 2435));

            flightInfo.Add(new Tuple<Location, Location>(paris, seattle),
                           new Tuple<DayOfWeek[], int>(new[] { DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Friday }, 5026));
            flightInfo.Add(new Tuple<Location, Location>(paris, rome),
                           new Tuple<DayOfWeek[], int>(new[] { DayOfWeek.Wednesday, DayOfWeek.Sunday, DayOfWeek.Friday }, 686));
            flightInfo.Add(new Tuple<Location, Location>(paris, nyc),
                           new Tuple<DayOfWeek[], int>(new[] { DayOfWeek.Monday, DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Sunday, }, 3625));

            flightInfo.Add(new Tuple<Location, Location>(rome, seattle),
                           new Tuple<DayOfWeek[], int>(new[] { DayOfWeek.Sunday, DayOfWeek.Saturday, DayOfWeek.Friday }, 5694));
            flightInfo.Add(new Tuple<Location, Location>(rome, paris),
                           new Tuple<DayOfWeek[], int>(new[] { DayOfWeek.Monday, DayOfWeek.Friday }, 686));
            flightInfo.Add(new Tuple<Location, Location>(rome, nyc),
                           new Tuple<DayOfWeek[], int>(new[] { DayOfWeek.Monday, DayOfWeek.Tuesday, }, 4278));

            flightInfo.Add(new Tuple<Location, Location>(nyc, seattle),
                           new Tuple<DayOfWeek[], int>(new[]
                               {
                                   DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday,
                                   DayOfWeek.Friday, DayOfWeek.Saturday
                               }, 2435));
            flightInfo.Add(new Tuple<Location, Location>(nyc, paris),
                           new Tuple<DayOfWeek[], int>(new[] { DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday }, 3625));
            flightInfo.Add(new Tuple<Location, Location>(nyc, rome),
                           new Tuple<DayOfWeek[], int>(new[] { DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday }, 4278));
        }

        private static Location GenerateLocation(string city, string country, string countryCode, string state, string timeZone, string thumbnailImageFile)
        {
            return new Location
                       {
                           City = city,
                           Country = country,
                           CountryCode = countryCode,
                           State = state,
                           LocationTimeZone = TimeZoneInfo.FindSystemTimeZoneById(timeZone),
                           ThumbnailImageFile = thumbnailImageFile
                       };
        }

        private static Flight GenerateFlight(Location source, Location destination, DayOfWeek[] weeklyDays, int flightNumber, int miles)
        {            
            DateTime start = FindPreviousSunday();
            var flightSchedules = new List<FlightSchedule>();
            for (var i = 0; i < 26; i++)
            {
                foreach (var weeklyDay in weeklyDays)
                {
                    DateTime today = start.AddDays(7 * i + (int)weeklyDay).AddHours(8);
                    var flightSchedule = new FlightSchedule
                                             {
                                                 Departure = today,
                                                 Duration = new TimeSpan(2, 30, 0)
                                             };
                    flightSchedules.Add(flightSchedule);
                }
            }

            var flight = new Flight()
                             {
                                 Source = source,
                                 Destination = destination,
                                 FlightNumber = string.Format("BY{0:3}", flightNumber),
                                 Schedules = flightSchedules,
                                 FrequentFlyerMiles = miles
                             };
            return flight;
        }

        private static DateTime FindPreviousSunday()
        {
            var today = DateTime.Today;
            var dayNumber = (int)today.DayOfWeek;
            var target = today.AddDays(dayNumber == 0 ? -7 : -dayNumber);
            return target;
        }
    }
}
