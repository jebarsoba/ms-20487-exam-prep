using BlueYonder.Companion.Client.DataModel;
using BlueYonder.Companion.Client.Helpers;
using System;
using System.Collections;
using System.Collections.Generic;
using Windows.UI.Xaml.Data;
using System.Linq;

namespace BlueYonder.Companion.Client.Common
{
    /// <summary>
    /// Value converter that determines the title of the detail page based on the type of data displayed on the page.
    /// </summary>
    public sealed class DetailPageTitleConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            if (value is CategoryType)
            {
                var type = (CategoryType)value;
                switch (type)
                {
                    case CategoryType.UpcomingTrips: return Accessories.resourceLoader.GetString("UpcomingTrips");
                    case CategoryType.HistoricTrips: return Accessories.resourceLoader.GetString("HistoricTrips");
                    case CategoryType.SearchResult: return Accessories.resourceLoader.GetString("SearchResult");
                    default: return Accessories.resourceLoader.GetString("CurrentTrip");
                }
            }
            else
            {
                return string.Empty;
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
