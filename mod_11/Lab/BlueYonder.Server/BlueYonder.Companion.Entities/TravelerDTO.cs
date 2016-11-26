using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace BlueYonder.Companion.Entities
{
    public class TravelerDTO
    {
        public int TravelerId { get; set; }

        public string TravelerUserIdentity { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string MobilePhone { get; set; }

        public string HomeAddress { get; set; }

        public string Passport { get; set; }    
    }
}