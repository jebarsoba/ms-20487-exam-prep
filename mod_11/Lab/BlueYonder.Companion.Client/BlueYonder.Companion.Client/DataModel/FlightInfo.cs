using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.Client.DataModel
{
    public class FlightInfo
    {
        public string ActualDeparture { get; set; }
        public Flight Flight { get; set; }
        public int FlightScheduleId { get; set; }
        public string Duration { get; set; }
        public DateTime? Departure { get; set; }
        public DateTime? Arrival { get; set; }
    }
}
