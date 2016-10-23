using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.Client.DataModel
{
    public class Location
    {
        public string City { get; set; }
        public string Country { get; set; }
        public string CountryCode { get; set; }
        public int LocationId { get; set; }
        public string State { get; set; }
        public string TimeZoneId { get; set; }
    }
}
