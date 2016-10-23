using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.Shared
{
    public sealed class Addresses
    {
        public static string BaseUri
        {
            get { return "https://{CloudService}.cloudapp.net/"; }
        }

        public static string GetLocationsUri
        {
            get { return BaseUri + "Locations"; }
        }

        public static string GetLocationsWithQueryUri
        {
            get { return GetLocationsUri + "?$filter=substringof(tolower('{0}'),tolower(City))"; }
        }

        public static string GetFlightsUri
        {
            get { return BaseUri + "Flights?source={0}&destination={1}&date={2}"; }
        }

        public static string GetFlightByIdUri
        {
            get { return BaseUri + "Flights?id={0}"; }
        }

        public static string AddReservationUri
        {
            get { return BaseUri + "Reservations"; }
        }

        public static string UpdateReservationUri
        {
            get { return BaseUri + "Reservations/{0}"; }
        }

        public static string GetReservationsByTravelerUri
        {
            get { return BaseUri + "travelers/{0}/reservations"; }
        }

        public static string GetReservationByIdUri
        {
            get { return BaseUri + "Reservations/{0}"; }
        }

        public static string GetTravelerByIdentityUri
        {
            get { return BaseUri + "Travelers/{0}"; }
        }

        public static string CreateTravelerUri
        {
            get { return BaseUri + "Travelers"; }
        }

        public static string UpdateTravelerUri
        {
            get { return BaseUri + "Travelers/{0}"; }
        }
   
        public static string GetWeatherUri
        {
            get { return BaseUri + "locations/{0}/weather?date={1:yyyy-MM-dd}"; }
        }

        public static string RegisterNotificationsUri
        {
            get { return BaseUri + "Notifications/Register"; }
        }

        public static string GetFilesMetadataUri
        {
            get { return BaseUri + "Files/Metadata?tripId={0}"; }
        }
    }
}
