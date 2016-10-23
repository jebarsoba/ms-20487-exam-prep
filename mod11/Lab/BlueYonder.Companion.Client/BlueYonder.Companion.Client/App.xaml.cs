using BlueYonder.Companion.Client.Common;
using BlueYonder.Companion.Client.Helpers;
using BlueYonder.Companion.Client.ViewModels;
using BlueYonder.Companion.Client.Views;
using BlueYonder.Companion.Client.Views.Settings;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Windows.ApplicationModel;
using Windows.ApplicationModel.Activation;
using Windows.ApplicationModel.Search;
using Windows.Devices.Geolocation;
using Windows.Devices.Sensors;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage;
using Windows.UI.ApplicationSettings;
using Windows.UI.ViewManagement;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Grid App template is documented at http://go.microsoft.com/fwlink/?LinkId=234226

namespace BlueYonder.Companion.Client
{
    /// <summary>
    /// Provides application-specific behavior to supplement the default Application class.
    /// </summary>
    sealed partial class App : Application
    {
        private const int SEARCH_PANE_MAX_SUGGESTIONS = 5;
        private Frame rootFrame;

        /// <summary>
        /// Initializes the singleton Application object.  This is the first line of authored code
        /// executed, and as such is the logical equivalent of main() or WinMain().
        /// </summary>
        public App()
        {
            this.InitializeComponent();
            this.Suspending += OnSuspending;
        }

        protected override void OnWindowCreated(WindowCreatedEventArgs args)
        {
            base.OnWindowCreated(args);
            SearchPane searchPane = SearchPane.GetForCurrentView();
            searchPane.SuggestionsRequested += OnSearchPaneSuggestionsRequested;

            var sos = SimpleOrientationSensor.GetDefault();
            if(sos != null)
                sos.OrientationChanged += SimpleOrientationSensor_OrientationChanged;
        }

        private void SimpleOrientationSensor_OrientationChanged(SimpleOrientationSensor sender, SimpleOrientationSensorOrientationChangedEventArgs args)
        {
            string orientation = "";
            if (args.Orientation == SimpleOrientation.Rotated270DegreesCounterclockwise || args.Orientation == SimpleOrientation.Rotated90DegreesCounterclockwise)
                orientation = ApplicationViewState.FullScreenPortrait.ToString();
            else
                orientation = ApplicationViewState.FullScreenLandscape.ToString();

            Control control = Window.Current.Content as Control;
            if (control != null)
                VisualStateManager.GoToState(control, orientation, false);
        }

        /// <summary>
        /// Populates the search pane suggestions
        /// </summary>
        private async void OnSearchPaneSuggestionsRequested(SearchPane sender, SearchPaneSuggestionsRequestedEventArgs e)
        {
            //Request deferral must be recieved to allow async search suggestion population
            var deferal = e.Request.GetDeferral();

            // Add suggestions to Search Pane
            var destinations = await LocationsDataFetcher.Instance.FetchLocationsAsync(e.QueryText, false);
            var suggestions =
                destinations
                    .OrderBy(location => location.City)
                    .Take(SEARCH_PANE_MAX_SUGGESTIONS)
                    .Select(location => location.City);
            e.Request.SearchSuggestionCollection.AppendQuerySuggestions(suggestions);

            deferal.Complete();
        }

        /// <summary>
        /// Invoked when the application is launched normally by the end user.  Other entry points
        /// will be used when the application is launched to open a specific file, to display
        /// search results, and so forth.
        /// </summary>
        /// <param name="args">Details about the launch request and process.</param>
        protected override async void OnLaunched(LaunchActivatedEventArgs args)
        {
            rootFrame = Window.Current.Content as Frame;
            // Do not repeat app initialization when the Window already has content,
            // just ensure that the window is active

            if (rootFrame == null)
            {
                // Create a Frame to act as the navigation context and navigate to the first page
                rootFrame = new Frame();
                //Associate the frame with a SuspensionManager key                                
                SuspensionManager.RegisterFrame(rootFrame, "AppFrame");

                // Register Windows Store app events
                SettingsPane.GetForCurrentView().CommandsRequested += App_CommandsRequested;
                SearchPane.GetForCurrentView().QueryChanged += App_QueryChanged;

                if (args.PreviousExecutionState == ApplicationExecutionState.Terminated)
                {
                    // Restore the saved session state only when appropriate
                    try
                    {
                        await SuspensionManager.RestoreAsync();
                    }
                    catch (SuspensionManagerException)
                    {
                        //Something went wrong restoring state.
                        //Assume there is no state and continue
                    }
                }

                // Place the frame in the current Window
                Window.Current.Content = rootFrame;
            }
            if (rootFrame.Content == null)
            {
                await ShowSplash(args.SplashScreen);

                var bootstrapper = new Bootstrapper();
                bootstrapper.Finished += BootStrapper_Finished;
                bootstrapper.Start();
            }

            // Ensure the current window is active
            Window.Current.Activate();
        }

        private async static Task ShowSplash(SplashScreen splashScreen)
        {
            Splash splash = new Splash(splashScreen);
            Window.Current.Content = splash;
            Window.Current.Activate();
            await Task.Delay(2000);
        }

        private async void BootStrapper_Finished(object sender, EventArgs e)
        {
            await LicenseManager.Instance.LoadLicenses();

            if (!rootFrame.Navigate(typeof(TripListPage), false))
            {
                throw new Exception("Failed to create initial page");
            }

            Window.Current.Content = rootFrame;

            // Ensure the current window is active
            Window.Current.Activate();
        }

        private void RegisterMetroEvents()
        {
            SearchPane.GetForCurrentView().SuggestionsRequested += App_SuggestionsRequested;
        }

        async void App_SuggestionsRequested(SearchPane sender, SearchPaneSuggestionsRequestedEventArgs args)
        {
            //var deferral = args.Request.GetDeferral();

            //var query = args.QueryText;

            //var pos = await GeopositionDataFetcher.Instance.GetLocationAsync();
            //var possibleDestinations = await LocationsDataFetcher.Instance.SearchLocationsAsync(query);
            //var currentSource = await LocationsDataFetcher.Instance.GetLocationByCountryCodeAsync(pos.CivicAddress.Country);

            //if (currentSource != null)
            //{

            //    foreach (var destination in possibleDestinations)
            //    {
            //        var title = string.Format("{0} to {1}", currentSource.Country, destination.Country);
            //        var detail = string.Format("{0} to {1}", currentSource.City, destination.City);

            //        var img = RandomAccessStreamReference.CreateFromUri(new Uri("ms-appx:///Assets/BlueYonderGraphics/flightIcon.png"));
            //        args.Request.SearchSuggestionCollection.AppendResultSuggestion(title,
            //                                                                       detail,
            //                                                                       string.Format("{0}|{1}",
            //                                                                       currentSource.LocationId,
            //                                                                       destination.LocationId),
            //                                                                       img,
            //                                                                       "no image");
            //    }
            //}
            //deferral.Complete();
        }

        private async void App_QueryChanged(SearchPane sender, SearchPaneQueryChangedEventArgs args)
        {
            if (!IsSearchPage(rootFrame))
            {
                NavigateToSearchPage(args.QueryText);
            }
            else
            {
                await LocationsDataFetcher.Instance.FetchLocationsAsync(args.QueryText, false);
            }
        }

        private static bool IsSearchPage(Frame frame)
        {
            var page = frame.Content as TripDetailPage;
            if (page == null)
                return false;

            var tripDetailViewModel = page.DataContext as TripDetailViewModel;
            var isSearchPage = tripDetailViewModel != null && tripDetailViewModel.CategoryType == CategoryType.SearchResult;
            return isSearchPage;
        }

        private void NavigateToSearchPage(string queryText)
        {
            var argument = JsonSerializerHelper.Serialize(new TripDetailNavigationArgument()
            {
                CategoryType = CategoryType.SearchResult,
                QueryText = queryText
            });

            rootFrame.Navigate(typeof(TripDetailPage), argument);
            Window.Current.Content = rootFrame;
        }

        /// <summary>
        /// Define Settings Pages for the application once the OnCommandsRequested event is raised.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="args"></param>
        void App_CommandsRequested(SettingsPane sender, SettingsPaneCommandsRequestedEventArgs args)
        {
            var travelerInfo = new SettingsCommand("TravelerInfo", Accessories.resourceLoader.GetString("TravelerInfo"), (handler) =>
            {
                var settings = new SettingsFlyout();
                settings.ShowFlyout(new TravelerInfoControl());
            });
            args.Request.ApplicationCommands.Add(travelerInfo);

            var about = new SettingsCommand("About", Accessories.resourceLoader.GetString("About"), (handler) =>
            {
                var settings = new SettingsFlyout();
                settings.ShowFlyout(new AboutControl());
            });
            args.Request.ApplicationCommands.Add(about);

            var options = new SettingsCommand("Options", Accessories.resourceLoader.GetString("Options"), (handler) =>
            {
                var settings = new SettingsFlyout();
                settings.ShowFlyout(new OptionsControl());
            });
            args.Request.ApplicationCommands.Add(options);
        }

        /// <summary>
        /// Invoked when application execution is being suspended.  Application state is saved
        /// without knowing whether the application will be terminated or resumed with the contents
        /// of memory still intact.
        /// </summary>
        /// <param name="sender">The source of the suspend request.</param>
        /// <param name="e">Details about the suspend request.</param>
        private async void OnSuspending(object sender, SuspendingEventArgs e)
        {
            var deferral = e.SuspendingOperation.GetDeferral();
            await SuspensionManager.SaveAsync();
            deferral.Complete();
        }
    }
}
