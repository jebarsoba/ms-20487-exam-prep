using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.Entities
{
    public class TripDTO
    {
        public int TripId { get; set; }

        public FlightScheduleDTO FlightInfo { get; set; }

        public FlightStatus Status { get; set; }

        public SeatClass Class { get; set; }

        public string ThumbnailImage { get; set; }
    }
}