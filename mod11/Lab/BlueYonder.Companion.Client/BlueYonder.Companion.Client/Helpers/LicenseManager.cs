using BlueYonder.Companion.Client.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.ApplicationModel.Store;
using Windows.Storage;

namespace BlueYonder.Companion.Client.Helpers
{
    public class LicenseManager : BindableBase
    {
        private static LicenseManager _instance;
        public static LicenseManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new LicenseManager();
                }
                return _instance;
            }
        }

        private ListingInformation _listingInformation;

        private bool _isFull;
        public bool IsFull
        {
            get { return this._isFull; }
            set { this.SetProperty(ref this._isFull, value); }
        }

        private bool _isMediaEnabled;
        public bool IsMediaEnabled
        {
            get { return this._isMediaEnabled; }
            set { this.SetProperty(ref this._isMediaEnabled, value); }
        }

        public LicenseManager()
        {
            CurrentAppSimulator.LicenseInformation.LicenseChanged += LicenseInformation_LicenseChanged;
        }

        private bool _loaded = false;
        public async Task LoadLicenses()
        {
            if (_loaded)
                return;

            var installedFolder = await Windows.ApplicationModel.Package.Current.InstalledLocation.GetFolderAsync("data");
            var installedFile = await installedFolder.GetFileAsync("license.xml");
            await Windows.ApplicationModel.Store.CurrentAppSimulator.ReloadSimulatorAsync(installedFile);
            _listingInformation = await CurrentAppSimulator.LoadListingInformationAsync();

            _loaded = true;
        }

        public async Task PurchaseApp()
        {
            await LoadLicenses();

            if (!this.IsFull)
                await CurrentAppSimulator.RequestAppPurchaseAsync(false);
            else
                return;
        }

        public async Task PurchaseMediaFunctionality()
        {
            await LoadLicenses();

            var message = string.Empty;

            if (CurrentAppSimulator.LicenseInformation.IsTrial)
            {
                message = Accessories.resourceLoader.GetString("TrialMessage");
            }
            else
            {
                var product = _listingInformation.ProductListings["MediaFunctionality"];

                if (this.IsMediaEnabled)
                {
                    message = string.Format("{0} '{1}'", Accessories.resourceLoader.GetString("YouAlreadyOwn"), product.Name);
                }
                else
                {
                    try
                    {
                        await CurrentAppSimulator.RequestProductPurchaseAsync(product.ProductId, false);
                        message = string.Format("{0} '{1}'", Accessories.resourceLoader.GetString("BoughtMessage"), product.Name);
                    }
                    catch (Exception)
                    {
                        message = string.Format("{0} '{1}'", Accessories.resourceLoader.GetString("UnableToBuy"), product.Name);
                    }
                }
            }

            var msg = new Windows.UI.Popups.MessageDialog(message, "In App Purchase");
            await msg.ShowAsync();
        }

        private void LicenseInformation_LicenseChanged()
        {
            if (!CurrentAppSimulator.LicenseInformation.IsActive)
                return;

            this.IsFull = !CurrentAppSimulator.LicenseInformation.IsTrial;
            this.IsMediaEnabled = CurrentAppSimulator.LicenseInformation.ProductLicenses["MediaFunctionality"].IsActive;
        }
    }
}
