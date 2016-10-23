using BlueYonder.Companion.Client.DataModel;
using System;
using System.Collections;
using System.Collections.Generic;
using Windows.UI.Xaml.Data;
using System.Linq;

namespace BlueYonder.Companion.Client.Common
{
    /// <summary>
    /// Value converter that determines whether a reservation can be canceled.
    /// </summary>
    public sealed class CanCancelFlightConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            return value is Reservation && ((Reservation)value).DepartureFlight.FlightInfo.Departure > DateTime.Now.AddDays(1);
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
