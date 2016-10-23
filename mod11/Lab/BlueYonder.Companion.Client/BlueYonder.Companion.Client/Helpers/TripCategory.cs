using System.Collections.ObjectModel;
using BlueYonder.Companion.Client.Common;
using BlueYonder.Companion.Client.DataModel;

namespace BlueYonder.Companion.Client.Helpers
{
    public class TripCategory : BindableBase
    {
        public TripCategory(string title, CategoryType type)
        {
            this._items = new ObservableCollection<Reservation>();
            this.Title = title;
            this.Type = type;
        }

        private CategoryType _type;
        public CategoryType Type
        {
            get { return this._type; }
            set { this.SetProperty(ref this._type, value); }
        }

        private string _title;
        public string Title
        {
            get { return this._title; }
            set { this.SetProperty(ref this._title, value); }
        }

        private readonly ObservableCollection<Reservation> _items;
        public ObservableCollection<Reservation> Items
        {
            get { return this._items; }
        }
    }
}