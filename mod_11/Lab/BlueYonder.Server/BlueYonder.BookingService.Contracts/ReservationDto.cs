using System;
using System.Runtime.Serialization;

namespace BlueYonder.BookingService.Contracts
{
    [DataContract]
    public class ReservationDto
    {
        [DataMember]
        public int TravelerId { get; set; }

        [DataMember]
        public DateTime ReservationDate { get; set; }

        [DataMember]
        public TripDto DepartureFlight { get; set; }

        [DataMember]
        public TripDto ReturnFlight { get; set; }
    }
}

