using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Core;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;

namespace BlueYonder.Companion.Client.Common
{
    /// <summary>
    /// Allow to create generic Settings Flyout instead of duplicating Settings in each page.
    /// </summary>
    class SettingsFlyout
    {
        private const int _width = 346;
        private Popup _popupMenu;

        /// <summary>
        /// Show Settings Flyout
        /// </summary>
        /// <param name="control">Page to present in the settings flyout</param>
        public void ShowFlyout(UserControl control)
        {
            _popupMenu = new Popup();
            _popupMenu.IsLightDismissEnabled = true;
            _popupMenu.Width = _width;
            _popupMenu.Height = Window.Current.Bounds.Height;
            _popupMenu.Child = control;
            _popupMenu.HorizontalOffset = Window.Current.Bounds.Width - _width;
            _popupMenu.VerticalOffset = 0;
            _popupMenu.Closed += OnPopupClosed;

            control.Width = _width;
            control.Height = Window.Current.Bounds.Height;

            Window.Current.Activated += OnWindowActivated;

            _popupMenu.IsOpen = true;
        }

        /// <summary>
        /// Hide Settings Flyout if you has activate the main window(clicked outside the Settings Flyout window)
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnWindowActivated(object sender, WindowActivatedEventArgs e)
        {
            if (e.WindowActivationState == CoreWindowActivationState.Deactivated)
            {
                _popupMenu.IsOpen = false;
            }
        }

        void OnPopupClosed(object sender, object e)
        {
            Window.Current.Activated -= OnWindowActivated;
        }
    }
}
