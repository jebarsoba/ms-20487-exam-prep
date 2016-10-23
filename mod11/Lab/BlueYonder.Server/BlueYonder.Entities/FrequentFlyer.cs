using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Entities
{
    public class FrequentFlyer
    {
        [Key]
        public int TravelerId { get; set; }

        public int Miles { get; set; }
    }
}
