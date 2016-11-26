using System.Threading.Tasks;
using BlueYonder.Companion.Shared;
using Newtonsoft.Json;
using NotificationsExtensions.TileContent;
using System;
using System.Diagnostics;
using System.Net.Http;
using System.Threading;
using Windows.ApplicationModel.Background;
using Windows.Foundation;
using Windows.Storage;
using Windows.System.Threading;
using Windows.UI.Notifications;

namespace BlueYonder.Companion.Tasks
{
    //Module 10 - Background Tasks
    //The student will be able to create and consume background tasks.
    public sealed class WeatherUpdateTask : IBackgroundTask
    {
        private static readonly ApplicationDataContainer _settings = ApplicationData.Current.LocalSettings;

        public async void Run(IBackgroundTaskInstance taskInstance)
        {
            var deferral = taskInstance.GetDeferral();

            var weather = await GetWeatherAsync();
            if (weather != null)
            {
                var condition = weather.Condition.ToString();
                var celcius = weather.TemperatureCelcius.ToString();
                var fahrenheit = weather.TemperatureFahrenheit.ToString();

                _settings.Values["weather.condition"] = condition;
                _settings.Values["weather.celcius"] = celcius;
                _settings.Values["weather.fahrenheit"] = fahrenheit;

                UpdateTile(condition, celcius, fahrenheit);
            }

            deferral.Complete();
        }

        private async Task<WeatherForecast> GetWeatherAsync()
        {
            int locationId;
            int.TryParse(_settings.Values["locationId"].ToString(), out locationId);
            DateTime departure;
            DateTime.TryParse(_settings.Values["departure"].ToString(), out departure);

            var uri = new Uri(string.Format(Addresses.GetWeatherUri, locationId, departure));
            var responseContent = string.Empty;
            try
            {
                HttpClient client = new HttpClient();
                HttpResponseMessage response = await client.GetAsync(uri);
                responseContent = await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                throw new ArgumentException("GetWeatherAsync", ex);
            }

            var weather = Deserialize(responseContent);
            return weather;
        }

        private static void UpdateTile(string condition, string celcius, string fahrenheit)
        {
            var tile = TileUpdateManager.CreateTileUpdaterForApplication();
            if (tile.Setting != NotificationSetting.Enabled)
                return;

            var locationName = _settings.Values["locationName"].ToString();

            ITileWideText01 tileContent = TileContentFactory.CreateTileWideText01();
            tileContent.TextHeading.Text = locationName;
            tileContent.TextBody1.Text = condition;
            tileContent.TextBody2.Text = "Celcius: " + celcius;
            tileContent.TextBody3.Text = "Fahrenheit: " + fahrenheit;

            ITileSquareBlock squareTileContent = TileContentFactory.CreateTileSquareBlock();
            squareTileContent.TextBlock.Text = celcius;
            squareTileContent.TextSubBlock.Text = locationName;
            tileContent.SquareContent = squareTileContent;

            tileContent.Branding = TileBranding.Logo;

            TileNotification tileNotification = new TileNotification(tileContent.GetXml());
            TileUpdateManager.CreateTileUpdaterForApplication().Update(tileNotification);
        }

        public static WeatherForecast Deserialize(string json)
        {
            if (string.IsNullOrEmpty(json))
                return null;

            try
            {
                return JsonConvert.DeserializeObject<WeatherForecast>(json);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Deserialize->{0}", ex.Message);
                return null;
            }
        }
    }
}
