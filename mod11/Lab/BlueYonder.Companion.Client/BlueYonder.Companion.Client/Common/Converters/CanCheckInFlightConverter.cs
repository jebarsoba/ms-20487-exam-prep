using BlueYonder.Companion.Client.DataModel;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Data;

namespace BlueYonder.Companion.Client.Common
{
    /// <summary>
    /// Value converter that returns Visible for current trips and Collapsed for the others.
    /// </summary>
    public sealed class CanCheckInFlightConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            return (value is Reservation && ((Reservation)value).Type == CategoryType.CurrentTrip) ? Visibility.Visible : Visibility.Collapsed;
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
