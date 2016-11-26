using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace BlueYonder.Entities
{
    public class Traveler
    {      
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TravelerId { get; set; }

        public string TravelerUserIdentity { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string MobilePhone { get; set; }

        public string HomeAddress { get; set; }

        public string Passport { get; set; }    
    }
}