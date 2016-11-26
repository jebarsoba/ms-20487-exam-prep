using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Entities
{
    public class Trip
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TripId { get; set; }

        public int FlightScheduleID { get; set; }

        [ForeignKey("FlightScheduleID")]
        public virtual FlightSchedule FlightInfo { get; set; }

        public FlightStatus Status { get; set; }
        public SeatClass Class { get; set; }
        
        public string ThumbnailImage
        {
            get;
            set;
        }
    }
}
