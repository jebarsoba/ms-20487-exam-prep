using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.BookingService.Contracts
{
    [DataContract]
    public class TripUpdateDto
    {
        [DataMember]
        public string ReservationConfirmationCode { get; set; }

        [DataMember]
        public FlightDirections FlightDirection { get; set; }
        
        [DataMember]
        public TripDto TripToUpdate { get; set; }
    }
}
