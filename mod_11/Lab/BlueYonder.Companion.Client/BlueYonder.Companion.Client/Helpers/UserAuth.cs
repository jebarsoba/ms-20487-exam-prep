using BlueYonder.Companion.Client.Common;
using BlueYonder.Companion.Client.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Security.Authentication.Web;
using Windows.Security.Credentials;
using Windows.UI.Xaml;

namespace BlueYonder.Companion.Client.Helpers
{
    public class UserAuth : BindableBase
    {
        private const string _passwordCredentialResource = "blueyonder.cloudapp.net";
        private const string _passwordCredentialUserName = "tempusername";

        private readonly DataManager _data;
        private readonly Settings _settings;

        private string _userName;
        public string UserName
        {
            get { return this._userName; }
            set { this.SetProperty(ref this._userName, value); }
        }

        private bool _isLoggedIn;
        public bool IsLoggedIn
        {
            get { return this._isLoggedIn; }
            set { this.SetProperty(ref this._isLoggedIn, value); }
        }

        private bool _busy;
        public bool Busy
        {
            get { return this._busy; }
            set { this.SetProperty(ref this._busy, value); }
        }

        private Traveler _traveler;
        public Traveler Traveler
        {
            get { return this._traveler; }
            set { this.SetProperty(ref this._traveler, value); }
        }

        private UserAuth()
        {
            _settings = new Settings(SettingsType.Local);
            _data = new DataManager();
        }

        public async Task<LoginResult> Login()
        {
            if (this.IsLoggedIn)
                return new LoginResult(true);

            this.Busy = true;

            try
            {
                await VerifyConnectionExists();

                bool isAuthenticated = WasPreviouslyAuthenticated();
                if (!isAuthenticated)
                {
                    isAuthenticated = await AuthenticateAsync();
                }
                if (isAuthenticated)
                {
                    AddAuthenticationTokenToAllServerRequests();
                }

                this.IsLoggedIn = isAuthenticated && await LoadTraveler();

                return new LoginResult(this.IsLoggedIn);
            }
            catch (Exception ex)
            {
                return new LoginResult(false, ex);
            }
            finally
            {
                this.Busy = false;
            }
        }

        public void Logout()
        {
            this.IsLoggedIn = false;
            _settings.Remove(Constants.TravelerId);
            ClearSecurelyStoredAuthenticationData();
        }

        private async Task VerifyConnectionExists()
        {
            var errorMessage = Accessories.resourceLoader.GetString("LoginErrorNoInternetConnection");

            var isConnected = await NetworkManager.CheckInternetConnection(true, errorMessage);

            if (!isConnected)
            {
                throw new InvalidOperationException(errorMessage);
            }
        }

        private async Task<bool> LoadTraveler()
        {
            _settings.Remove(Constants.TravelerId);

            var traveler = await _data.GetTravelerAsync() ?? await _data.CreateTravelerAsync();
            if (traveler != null)
            {
                _settings.Add(Constants.TravelerId, traveler.TravelerId.ToString());
            }

            this.Traveler = traveler;

            return traveler != null;
        }

        private static UserAuth _instance;
        public static UserAuth Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new UserAuth();
                }
                return _instance;
            }
        }

        private async Task<bool> AuthenticateAsync()
        {
            Response response = await _data.AuthenticateAsync();

            bool isAuthenticated = response.Success;

            if (isAuthenticated)
            {
                SecurelyStoreAuthenticationData(response.Content);
            }
            else
            {
                var msg = new Windows.UI.Popups.MessageDialog(response.Content);
                await msg.ShowAsync();
            }

            return isAuthenticated;
        }

        private static bool WasPreviouslyAuthenticated()
        {
            var vault = new PasswordVault();
            try
            {
                var credential = vault.Retrieve(_passwordCredentialResource, _passwordCredentialUserName);
                return credential != null;
            }
            catch (Exception ex)
            {
                // The credential was not found
                return false;
            }
        }

        private static void SecurelyStoreAuthenticationData(string password)
        {
            var credential = new PasswordCredential(_passwordCredentialResource, _passwordCredentialUserName, password);

            var vault = new PasswordVault();
            vault.Add(credential);
        }

        private static void ClearSecurelyStoredAuthenticationData()
        {
            var vault = new PasswordVault();
            try
            {
                var credential = vault.Retrieve(_passwordCredentialResource, _passwordCredentialUserName);
                vault.Remove(credential);
            }
            catch (Exception ex)
            {
                // The credential was not found
            }
        }

        private void AddAuthenticationTokenToAllServerRequests()
        {
            var vault = new PasswordVault();
            var credential = vault.Retrieve(_passwordCredentialResource, _passwordCredentialUserName);
            DataManager.Token = "Session " + credential.Password;
        }
    }
}
