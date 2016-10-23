using BlueYonder.Companion.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.Entities
{
    public class FlightWithSchedulesDTO : FlightDTO
    {
        public IEnumerable<FlightScheduleDTO> Schedules { get; set; }
    }
}
