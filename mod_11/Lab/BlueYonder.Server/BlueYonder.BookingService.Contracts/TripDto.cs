using System.Runtime.Serialization;
using BlueYonder.Entities;

namespace BlueYonder.BookingService.Contracts
{
    [DataContract]
    public class TripDto
    {
        [DataMember]
        public int FlightScheduleID { get; set; }

        [DataMember]
        public FlightStatus Status { get; set; }

        [DataMember]
        public SeatClass Class { get; set; }
    }
}


