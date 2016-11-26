using BlueYonder.Companion.Client.DataModel;
using System;
using System.Collections;
using System.Collections.Generic;
using Windows.UI.Xaml.Data;
using System.Linq;
using BlueYonder.Companion.Client.Helpers;

namespace BlueYonder.Companion.Client.Common
{
    /// <summary>
    /// Value converter that displays a preview icon for video files.
    /// </summary>
    public sealed class VideoImagePreviewConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            if (value == null) return value;

            var fileName = (string)value;
            return fileName.EndsWith(".mp4") ? "ms-appx:///Assets/BlueYonderGraphics/video_icon.png" : value;
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
