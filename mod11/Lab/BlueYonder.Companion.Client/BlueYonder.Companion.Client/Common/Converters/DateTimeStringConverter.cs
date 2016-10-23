using BlueYonder.Companion.Client.DataModel;
using System;
using System.Collections;
using System.Collections.Generic;
using Windows.UI.Xaml.Data;
using System.Linq;

namespace BlueYonder.Companion.Client.Common
{
    /// <summary>
    /// Value converter that translates a <see cref="DateTime" /> object to an equivalent formatted string.
    /// </summary>
    public sealed class DateTimeStringConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            if (value is DateTime)
            {
                return ((DateTime)value).ToString("MM/dd/yyyy h:mm tt");
            }
            else
            {
                return value;
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            if (value is Schedule)
                return System.Convert.ToDateTime(((Schedule)value).Departure);
            else
                return System.Convert.ToDateTime(value);
        }
    }
}
