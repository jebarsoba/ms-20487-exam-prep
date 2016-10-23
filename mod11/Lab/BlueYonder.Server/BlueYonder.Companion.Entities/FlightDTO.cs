using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BlueYonder.Companion.Entities
{
    public class FlightDTO
    {
        public int FlightId { get; set; }

        public string FlightNumber { get; set; }

        public int FrequentFlyerMiles { get; set; }

        public LocationDTO Source { get; set; }

        public LocationDTO Destination { get; set; }

    }
}
