using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using BlueYonder.DataAccess.Interfaces;
using BlueYonder.Entities;
using BlueYonder.Companion.Entities.Mappers;
using BlueYonder.Companion.Entities;

namespace BlueYonder.Companion.Controllers
{    
    public class LocationsController : ApiController
    {
        public ILocationRepository Locations { get; set; }

        public LocationsController(ILocationRepository locations)
        {
            Locations = locations;
        }

        [Queryable]
        public IEnumerable<LocationDTO> Get()
        {
            var locations = Locations.GetAll().ToList();

            var locationsDTOs = from l in locations select l.ToLocationDTO();

            return locationsDTOs.ToList();
        }

        public LocationDTO Get(int id)
        {
            var location = Locations.GetSingle(id);

            return location.ToLocationDTO();
        }


        public DataTransferObjects.WeatherForecast GetWeather(int locationId, DateTime date)
        {            
            var service = new WeatherService();
            Location location = Locations.GetSingle(locationId);

            return service.GetWeather(location, date);
        }


    }
}