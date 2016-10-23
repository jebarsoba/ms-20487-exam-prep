using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BlueYonder.Companion.Controllers.DataTransferObjects
{
    public class WeatherForecast
    {
        public double TemperatureCelcius { get; set; }
        public double TemperatureFahrenheit { get; set; }
        public WeatherCondition Condition { get; set; }
    }
}
