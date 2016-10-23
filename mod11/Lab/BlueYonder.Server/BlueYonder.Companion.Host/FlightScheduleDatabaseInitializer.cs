using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BlueYonder.Entities;
using BlueYonder.DataAccess;
using System.Data.Entity;

namespace BlueYonder.Companion.Host
{
    class FlightScheduleDatabaseInitializer : DropCreateDatabaseIfModelChanges<TravelCompanionContext>
    {
        protected override void Seed(TravelCompanionContext context)
        {
            Location seattle = GenerateLocation("Seattle", "United States", "US", "Washington", "Pacific Standard Time", "Seattle.jpg");

            Location paris = GenerateLocation("Paris", "France", "FR", null, "W. Europe Standard Time", "Paris.jpg");

            Location rome = GenerateLocation("Rome", "Italy", "IT", null, "W. Europe Standard Time", "Rome.jpg");

            Location nyc = GenerateLocation("New York", "United States", "US", "New York", "Eastern Standard Time", "NewYork.jpg");

            Dictionary<Tuple<Location, Location>, DayOfWeek[]> flightInfo = new Dictionary<Tuple<Location, Location>, DayOfWeek[]>();

            CreateFlightInfos(flightInfo, seattle, paris, rome, nyc);

            var index = 0;
            foreach (var flightInfoItem in flightInfo)
            {
                var flight = GenerateFlight(flightInfoItem.Key.Item1, flightInfoItem.Key.Item2, flightInfoItem.Value, ++index);
                context.Flights.Add(flight);
            }

            context.SaveChanges();
        }

        private static void CreateFlightInfos(Dictionary<Tuple<Location, Location>, DayOfWeek[]> flightInfo, Location seattle, Location paris, Location rome,
                                              Location nyc)
        {
            flightInfo.Add(new Tuple<Location, Location>(seattle, paris),
                           new[] { DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday });
            flightInfo.Add(new Tuple<Location, Location>(seattle, rome),
                           new[] { DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Thursday });
            flightInfo.Add(new Tuple<Location, Location>(seattle, nyc),
                           new[]
                               {
                                   DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday,
                                   DayOfWeek.Friday, DayOfWeek.Saturday,
                               });

            flightInfo.Add(new Tuple<Location, Location>(paris, seattle),
                           new[] { DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Friday });
            flightInfo.Add(new Tuple<Location, Location>(paris, rome),
                           new[] { DayOfWeek.Wednesday, DayOfWeek.Sunday, DayOfWeek.Friday });
            flightInfo.Add(new Tuple<Location, Location>(paris, nyc),
                           new[] { DayOfWeek.Monday, DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Sunday, });

            flightInfo.Add(new Tuple<Location, Location>(rome, seattle),
                           new[] { DayOfWeek.Sunday, DayOfWeek.Saturday, DayOfWeek.Friday });
            flightInfo.Add(new Tuple<Location, Location>(rome, paris),
                           new[] { DayOfWeek.Monday, DayOfWeek.Friday });
            flightInfo.Add(new Tuple<Location, Location>(rome, nyc),
                           new[] { DayOfWeek.Monday, DayOfWeek.Tuesday, });

            flightInfo.Add(new Tuple<Location, Location>(nyc, seattle),
                           new[]
                               {
                                   DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday,
                                   DayOfWeek.Friday, DayOfWeek.Saturday
                               });
            flightInfo.Add(new Tuple<Location, Location>(nyc, paris),
                           new[] { DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday });
            flightInfo.Add(new Tuple<Location, Location>(nyc, rome),
                           new[] { DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday });
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

        private static Flight GenerateFlight(Location source, Location destination, DayOfWeek[] weeklyDays, int flightNumber)
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