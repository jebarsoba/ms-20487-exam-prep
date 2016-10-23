using BlueYonder.Companion.Client.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Devices.Geolocation;

namespace BlueYonder.Companion.Client.Helpers
{
    public class GeopositionDataFetcher : DataFetcher
    {
        private readonly Geolocator _geolocator;
        private Geoposition _userPosition;

        private GeopositionDataFetcher()
        {
            _geolocator = new Geolocator();
        }

        public async Task<Geoposition> GetLocationAsync()
        {
            if (RequireRefresh)
            {
                _userPosition= await _geolocator.GetGeopositionAsync();
                LastRefreshDateTime = DateTime.Now;
                return _userPosition;
            }
            else
            {
                return _userPosition;
            }
        }

        private static GeopositionDataFetcher instance;
        public static GeopositionDataFetcher Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new GeopositionDataFetcher();
                }
                return instance;
            }
        }
    }
}
