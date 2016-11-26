using BlueYonder.Companion.Client.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace BlueYonder.Companion.Client.Common
{
    public class MediaTypeTemplateSelector : DataTemplateSelector
    {
        protected override Windows.UI.Xaml.DataTemplate SelectTemplateCore(object item, Windows.UI.Xaml.DependencyObject container)
        {
            if (item == null) return base.SelectTemplateCore(item, container);

            var mediaItem = (MediaItem)item;
            if (mediaItem.FolderType == FolderType.Local)
                return mediaItem.Name.EndsWith(".mp4") ? (DataTemplate)Application.Current.Resources["LocalVideoTemplate"] : (DataTemplate)Application.Current.Resources["LocalImageTemplate"];
            else
                return mediaItem.Name.EndsWith(".mp4") ? (DataTemplate)Application.Current.Resources["VideoTemplate"] : (DataTemplate)Application.Current.Resources["ImageTemplate"];
        }
    }
}
