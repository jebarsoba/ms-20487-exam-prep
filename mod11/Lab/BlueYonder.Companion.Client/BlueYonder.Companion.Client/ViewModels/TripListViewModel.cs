using BlueYonder.Companion.Client.Common;
using BlueYonder.Companion.Client.DataModel;
using BlueYonder.Companion.Client.Helpers;
using BlueYonder.Companion.Client.Views.Settings;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.ApplicationModel.Background;
using Windows.ApplicationModel.Core;
using Windows.ApplicationModel.Search;
using Windows.Storage;
using Windows.UI.ApplicationSettings;
using Windows.UI.Core;
using Windows.UI.Popups;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace BlueYonder.Companion.Client.ViewModels
{
    public class TripListViewModel : ViewModel
    {
        private readonly DataManager _data;

        public DelegateCommand LoginCommand { get; set; }
        public DelegateCommand SearchCommand { get; set; }
        public DelegateCommand LogoutCommand { get; set; }

        private ObservableCollection<TripCategory> _tripCategories;
        public ObservableCollection<TripCategory> TripCategories
        {
            get { return this._tripCategories; }
            set { this.SetProperty(ref this._tripCategories, value); }
        }

        private Reservation _currentTrip;
        public Reservation CurrentTrip
        {
            get { return this._currentTrip; }
            set { this.SetProperty(ref this._currentTrip, value); }
        }

        private bool _working;
        public bool Working
        {
            get { return this._working; }
            set { this.SetProperty(ref this._working, value); }
        }

        private WeatherForecast _weather;
        public WeatherForecast Weather
        {
            get { return this._weather; }
            set { this.SetProperty(ref this._weather, value); }
        }

        private bool _isLoginCommandVisible;
        public bool IsLoginCommandVisible
        {
            get { return this._isLoginCommandVisible; }
            set { this.SetProperty(ref this._isLoginCommandVisible, value); }
        }

        private bool _isLogoutCommandVisible;
        public bool IsLogoutCommandVisible
        {
            get { return this._isLogoutCommandVisible; }
            set { this.SetProperty(ref this._isLogoutCommandVisible, value); }
        }

        private bool _isTripDataVisible;
        public bool IsTripDataVisible
        {
            get { return this._isTripDataVisible; }
            set { this.SetProperty(ref this._isTripDataVisible, value); }
        }

        private bool _isGlanceVisible;
        public bool IsGlanceVisible
        {
            get { return this._isGlanceVisible; }
            set { this.SetProperty(ref this._isGlanceVisible, value); }
        }

        private TravelerInfoViewModel _travelerInfo;
        public TravelerInfoViewModel TravelerInfo
        {
            get { return this._travelerInfo; }
            set { this.SetProperty(ref this._travelerInfo, value); }
        }

        private bool _forceRefresh;
        public bool ForceRefresh
        {
            get { return _forceRefresh; }
            set { this.SetProperty(ref this._forceRefresh, value); }
        }

        public TripListViewModel()
        {
            this._tripCategories = new ObservableCollection<TripCategory>();
            this._data = new DataManager();

            this.TravelerInfo = new TravelerInfoViewModel();

            IsLoginCommandVisible = true;
            IsLogoutCommandVisible = false;
            IsTripDataVisible = false;
            IsGlanceVisible = false;

            SearchCommand = new DelegateCommand(ShowSearch);
            LoginCommand = new DelegateCommand(Login);
            LogoutCommand = new DelegateCommand(Logout);
        }

        public override async void Initialize(Frame frame)
        {
            base.Initialize(frame);

            TravelerInfo.Initialize(frame);

            var isLoggedIn = UserAuth.Instance.IsLoggedIn;

            IsTripDataVisible = isLoggedIn;
            IsLoginCommandVisible = !isLoggedIn;
            IsLogoutCommandVisible = isLoggedIn;

            await LoadTrips(isLoggedIn);
            await InitializeWeather(CurrentTrip);
        }

        private void InitializeCurrentTrip(bool isLoggedIn)
        {
            var currentTripCategory = TripCategories.FirstOrDefault(t => t.Type == CategoryType.CurrentTrip);
            var currentTrip =
                !isLoggedIn || currentTripCategory == null || currentTripCategory.Items.Count == 0
                    ? null
                    : currentTripCategory.Items[0];

            CurrentTrip = currentTrip;
            IsGlanceVisible = currentTrip != null;
        }

        public override void Uninitialize()
        {
            base.Uninitialize();

            UninitializeWeather();
        }

        private async Task LoadTrips(bool isLoggedIn)
        {
            if (isLoggedIn)
            {
                var cacheItem = await CacheManager.Load<ObservableCollection<TripCategory>>(CacheType.Categories);
                if (cacheItem != null && cacheItem.Data != null)
                {
                    TripCategories = (ObservableCollection<TripCategory>) cacheItem.Data;
                }

                if (cacheItem == null || cacheItem.Data == null || cacheItem.RequireRefresh)
                {
                    await GetTravelerFlightsFromServer(ForceRefresh);
                }
            }
            InitializeCurrentTrip(isLoggedIn);
        }

        private async Task GetTravelerFlightsFromServer(bool forceRefresh)
        {
            Working = true;
            TripCategories = await ReservationDataFetcher.Instance.GetCategoriesAsync(forceRefresh);
            Working = false;
        }

        private void ShowSearch(object parameter)
        {
            SearchPane.GetForCurrentView().Show();
        }

        private async void Login(object parameter)
        {
            //Module 13 - Securing Windows 8 App Data
            await UserAuth.Instance.Login();
            Initialize(Frame);
        }

        private void Logout(object parameter)
        {
            //Module 13 - Securing Windows 8 App Data
            UserAuth.Instance.Logout();
            Initialize(Frame);
        }

        private async Task InitializeWeather(Reservation currentTrip)
        {
            WeatherForecast weather = null;
            if (currentTrip != null)
            {
                var flightInfo = currentTrip.DepartureFlight.FlightInfo;
                var locationId = flightInfo.Flight.Destination.LocationId;
                var departure = flightInfo.Departure ?? DateTime.Now;

                weather = await _data.GetWeatherForecastByIdAsync(locationId, departure);

                ApplicationData.Current.LocalSettings.Values["locationId"] = locationId;
                ApplicationData.Current.LocalSettings.Values["locationName"] = flightInfo.Flight.Source.City;
                ApplicationData.Current.LocalSettings.Values["departure"] = string.Format("{0:yyyy-MM-dd}", departure);
            }

            Weather = weather;

            var weatherUpdateTask = BackgroundTaskHelper.FindRegisteredTask(Constants.WeatherTaskName);
            if (weatherUpdateTask != null)
            {
                weatherUpdateTask.Completed += WeatherUpdateTaskOnCompleted;
            }
        }

        private void UninitializeWeather()
        {
            var weatherUpdateTask = BackgroundTaskHelper.FindRegisteredTask(Constants.WeatherTaskName);
            if (weatherUpdateTask != null)
            {
                weatherUpdateTask.Completed -= WeatherUpdateTaskOnCompleted;
            }
        }

        private void WeatherUpdateTaskOnCompleted(BackgroundTaskRegistration sender, BackgroundTaskCompletedEventArgs args)
        {
            try
            {
                args.CheckResult();

                var settings = ApplicationData.Current.LocalSettings;

                WeatherCondition condition;
                Enum.TryParse(settings.Values["weather.condition"].ToString(), out condition);

                double celcius;
                double.TryParse(settings.Values["weather.celcius"].ToString(), out celcius);

                double fahrenheit;
                double.TryParse(settings.Values["weather.fahrenheit"].ToString(), out fahrenheit);

                CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                {
                    Weather = new WeatherForecast()
                    {
                        Condition = condition,
                        TemperatureCelcius = celcius,
                        TemperatureFahrenheit = fahrenheit
                    };
                });
            }
            catch (Exception exc)
            {
                new MessageDialog(exc.Message).ShowAsync();
            }
        }
    }
}
