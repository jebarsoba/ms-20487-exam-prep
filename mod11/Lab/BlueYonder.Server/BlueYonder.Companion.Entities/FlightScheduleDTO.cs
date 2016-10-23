using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.Entities
{
    public class FlightScheduleDTO
    {
        public int FlightScheduleId { get; set; }

        public DateTime Departure { get; set; }

        public TimeSpan Duration { get; set; }

        public DateTime? ActualDeparture { get; set; }

        public DateTime Arrival { get; set; }

        public FlightDTO Flight { get; set; }        
    }
}
