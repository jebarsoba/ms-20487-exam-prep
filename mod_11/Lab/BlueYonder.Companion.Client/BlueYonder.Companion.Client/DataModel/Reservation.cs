using BlueYonder.Companion.Client.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.Client.DataModel
{
    public class Reservation
    {
        public int ReservationId { get; set; }
        public int TravelerId { get; set; }
        public DateTime? ReservationDate { get; set; }
        public string ConfirmationCode { get; set; }
        
        public CategoryType Type { get; set; }

        private bool _checkIn;
        public bool IsCheckIn
        {
            get { return this._checkIn; }
            set
            {
                this._checkIn = value;
                if (this.Type == CategoryType.CurrentTrip && !this.IsCheckIn)
                    this.CanCheckIn = true;
                else
                    this.CanCheckIn = true;
            }
        }

        private bool _canCheckIn;
        public bool CanCheckIn
        {
            get { return this.Type == CategoryType.CurrentTrip && !this.IsCheckIn; }
            set { this._canCheckIn = value; }
        }

        public FlightSchedule DepartureFlight { get; set; }
        public FlightSchedule ReturnFlight { get; set; }
    }
}
