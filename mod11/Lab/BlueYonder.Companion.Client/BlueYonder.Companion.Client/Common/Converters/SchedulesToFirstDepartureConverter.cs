using BlueYonder.Companion.Client.DataModel;
using System;
using System.Collections;
using System.Collections.Generic;
using Windows.UI.Xaml.Data;
using System.Linq;

namespace BlueYonder.Companion.Client.Common
{
    /// <summary>
    /// Value converter that returns a string representation of the departure
    /// <see cref="DateTime" /> of the earliest schedule in a list of given schedules.
    /// </summary>
    public sealed class SchedulesToFirstDepartureConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            if (value is List<Schedule>)
            {
                var schedules = (List<Schedule>)value;
                var first = schedules.OrderByDescending(s => s.Departure).FirstOrDefault();
                return first != null ? first.Departure.ToString() : "N/A";
            }
            else
            {
                return "N/A";
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
