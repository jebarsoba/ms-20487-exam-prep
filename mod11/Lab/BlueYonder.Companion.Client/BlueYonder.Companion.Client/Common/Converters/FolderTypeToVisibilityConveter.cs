using BlueYonder.Companion.Client.DataModel;
using System;
using System.Collections;
using System.Collections.Generic;
using Windows.UI.Xaml.Data;
using System.Linq;
using Windows.UI.Xaml;

namespace BlueYonder.Companion.Client.Common
{
    //The student will be able to create and consume background tasks.
    /// <summary>
    /// Value converter that translates true to false and vice versa.
    /// </summary>
    public sealed class FolderTypeToVisibilityConveter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            if (value is FolderType)
            {
                var type = (FolderType)value;
                return type == FolderType.Local ? Visibility.Visible : Visibility.Collapsed;
            }
            else
            {
                return Visibility.Collapsed;
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            return !(value is bool && (bool)value);
        }
    }
}
