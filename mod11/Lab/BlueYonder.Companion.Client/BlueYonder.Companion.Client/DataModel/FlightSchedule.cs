using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.Client.DataModel
{
    public class FlightSchedule
    {
        public int TripID { get; set; }

        public string Status { get; set; }
        public string Class { get; set; }

        public FlightInfo FlightInfo { get; set; }
    }
}
