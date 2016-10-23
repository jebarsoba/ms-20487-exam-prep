using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.Entities
{
    public class ReservationDTO
    {       
        public int ReservationId { get; set; }

        public string ConfirmationCode { get; set; }

        public int TravelerId { get; set; }

        public DateTime ReservationDate { get; set; }

        public TripDTO DepartureFlight { get; set; }

        public TripDTO ReturnFlight { get; set; }
    }
}
