using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace BlueYonder.Entities
{
    [DataContract]
    public class FlightSchedule
    {
        [DataMember]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FlightScheduleId { get; set; }

        // Departure time is in time zone of departure location
        [DataMember]
        public DateTime Departure { get; set; }

        [DataMember]
        public DateTime? ActualDeparture { get; set; }
        
        [DataMember]
        public TimeSpan Duration { get; set; }

        [DataMember]
        public int FlightId { get; set; }

        [JsonIgnore]
        [XmlIgnore]
        [ForeignKey("FlightId")]
        public virtual Flight Flight { get; set; }
    }
}
