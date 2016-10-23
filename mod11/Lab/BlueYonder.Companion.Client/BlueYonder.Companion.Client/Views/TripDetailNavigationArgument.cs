using BlueYonder.Companion.Client.Common;

namespace BlueYonder.Companion.Client.Views
{
    public class TripDetailNavigationArgument
    {
        public CategoryType CategoryType { get; set; }

        public int? ReservationId { get; set; }

        public string QueryText { get; set; }
    }
}