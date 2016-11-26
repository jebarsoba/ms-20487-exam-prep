using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlueYonder.Companion.Controllers.DataTransferObjects;
using BlueYonder.Entities;

namespace BlueYonder.Companion.Controllers
{
    class WeatherService
    {
        public WeatherForecast GetWeather(Location location, DateTime date)
        {
            // Currently we won't be connecting to a real weather service 
            // so we'll create random weather forecasts
            return GetRandomWeather(date);
        }

        private WeatherForecast GetRandomWeather(DateTime date)
        {
            int maxTemperature;
            int minTemperature;

            // Set temperature bounds to create more logical results
            if (date.Month >= 10 && date.Month <= 3)
            {
                maxTemperature = 73;
                minTemperature = 28;
            }
            else
            {
                maxTemperature = 96;
                minTemperature = 71;
            }

            // Get a random temperature
            Random rand = new Random();
            double temperature = rand.NextDouble() +
                (double)rand.Next(minTemperature, maxTemperature);

            // Set possible weather conditions according to temperature
            WeatherCondition[] conditions;
            if (temperature >= 28 && temperature <= 75)
            {
                conditions = new WeatherCondition[] {
                    WeatherCondition.Snowy,WeatherCondition.Rainy, WeatherCondition.ThunderStorms, WeatherCondition.Cloudy};
            }
            else
            {
                conditions = new WeatherCondition[] {
                    WeatherCondition.Rainy,WeatherCondition.Cloudy, WeatherCondition.Sunny};
            }

            // Return a random weather forecast
            return new WeatherForecast
            {
                TemperatureFahrenheit = Math.Round(temperature, 1),
                TemperatureCelcius = Math.Round((temperature - 32) * 5 / 9, 1),
                Condition = conditions[rand.Next(conditions.Length)]
            };
        }
    }
}
