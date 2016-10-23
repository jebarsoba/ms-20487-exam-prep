using BlueYonder.Companion.Client.Helpers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Globalization;
using Windows.UI.ApplicationSettings;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The User Control item template is documented at http://go.microsoft.com/fwlink/?LinkId=234236

namespace BlueYonder.Companion.Client.Views.Settings
{
    public sealed partial class OptionsControl : UserControl
    {
        List<ComboBoxValue> comboBoxValues;
        public OptionsControl()
        {
            this.InitializeComponent();
            Loaded += Control_Loaded;

            this.DataContext = LicenseManager.Instance;
        }

        void Control_Loaded(object sender, RoutedEventArgs e)
        {
            comboBoxValues = new List<ComboBoxValue>();

            // First show the default setting
            comboBoxValues.Add(new ComboBoxValue() { DisplayName = Accessories.resourceLoader.GetString("LanguagePreferences"), LanguageTag = "" });

            // If there are other languages the user speaks that aren't the default show them first
            if (ApplicationLanguages.PrimaryLanguageOverride != "" || ApplicationLanguages.Languages.Count > 1)
            {
                for (var i = 0; i < ApplicationLanguages.Languages.Count; i++)
                {
                    if ((ApplicationLanguages.PrimaryLanguageOverride == "" && i != 0) || (ApplicationLanguages.PrimaryLanguageOverride != "" && i != 1))
                    {
                        this.LanguageOverrideComboBox_AddLanguage(new Windows.Globalization.Language(ApplicationLanguages.Languages[i]));
                    }
                }
                comboBoxValues.Add(new ComboBoxValue() { DisplayName = "——————", LanguageTag = "" });
            }

            // Finally, add the rest of the languages the app supports
            List<Windows.Globalization.Language> manifestLanguageObjects = new List<Windows.Globalization.Language>();
            foreach (var lang in ApplicationLanguages.ManifestLanguages)
            {
                manifestLanguageObjects.Add(new Windows.Globalization.Language(lang));
            }
            IEnumerable<Windows.Globalization.Language> orderedManifestLanguageObjects = manifestLanguageObjects.OrderBy(lang => lang.DisplayName);
            foreach (var lang in orderedManifestLanguageObjects)
            {
                this.LanguageOverrideComboBox_AddLanguage(lang);
            }

            LanguageOverrideComboBox.ItemsSource = comboBoxValues;
            LanguageOverrideComboBox.SelectedIndex = comboBoxValues.FindIndex(FindCurrent);
            LanguageOverrideComboBox.SelectionChanged += LanguageOverrideComboBox_SelectionChanged;

        }

        private void LanguageOverrideComboBox_AddLanguage(Windows.Globalization.Language lang)
        {
            comboBoxValues.Add(new ComboBoxValue() { DisplayName = lang.DisplayName, LanguageTag = lang.LanguageTag });
        }

        private static bool FindCurrent(ComboBoxValue value)
        {

            if (value.LanguageTag == Windows.Globalization.ApplicationLanguages.PrimaryLanguageOverride)
            {
                return true;
            }
            return false;

        }

        private async void LanguageOverrideComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            ComboBox combo = sender as ComboBox;

            // Set the persistent application language override
            Windows.Globalization.ApplicationLanguages.PrimaryLanguageOverride = combo.SelectedValue.ToString();

            var msg = new Windows.UI.Popups.MessageDialog(Accessories.resourceLoader.GetString("ChangeLanguageMessage"));
            await msg.ShowAsync();
        }

        private void GoBack(object sender, RoutedEventArgs e)
        {
            SettingsPane.Show();
            this.Margin = new Thickness(0, 0, -346, 0);
        }

        private async void PurchaseApp_Click(object sender, RoutedEventArgs e)
        {
            await LicenseManager.Instance.PurchaseApp();
        }

        private async void PurchaseMediaFunctionality_Click(object sender, RoutedEventArgs e)
        {
            await LicenseManager.Instance.PurchaseMediaFunctionality();
        }
    }

    public class ComboBoxValue
    {
        public string DisplayName { get; set; }
        public string LanguageTag { get; set; }
    }
}
