using BlueYonder.Companion.Client.Common;
using BlueYonder.Companion.Client.DataModel;
using BlueYonder.Companion.Client.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The User Control item template is documented at http://go.microsoft.com/fwlink/?LinkId=234236

namespace BlueYonder.Companion.Client.Controls
{
    public sealed partial class ReservationDetailsControl : UserControl
    {
        //Module 6 - Creating Reusable Controls and Components 
        //The student will be able to create custom controls, extend templated controls, and create and consume WinMD components.

        public static readonly DependencyProperty ReservationProperty =
        DependencyProperty.Register("Reservation", typeof(Reservation), typeof(ReservationDetailsControl), null);

        public Reservation Reservation
        {
            get { return (Reservation)GetValue(ReservationProperty); }
            set { SetValue(ReservationProperty, value); }
        }

        public ReservationDetailsControl()
        {
            this.InitializeComponent();
        }

        private void HyperlinkButton_Click(object sender, RoutedEventArgs e)
        {
            Reservation.IsCheckIn = !Reservation.IsCheckIn;
        }
    }
}
