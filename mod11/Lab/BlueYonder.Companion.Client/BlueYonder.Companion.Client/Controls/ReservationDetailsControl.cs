using BlueYonder.Companion.Client.DataModel;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;

// The Templated Control item template is documented at http://go.microsoft.com/fwlink/?LinkId=234235

namespace BlueYonder.Companion.Client.Controls
{
    [TemplatePart(Name = PART_CheckInButton, Type = typeof(ButtonBase))]
    public sealed class ReservationDetailsControl : Control
    {
        public const string PART_CheckInButton = "PART_CheckInButton";

        private ButtonBase m_checkInButton;

        public ReservationDetailsControl()
        {
            DefaultStyleKey = typeof(ReservationDetailsControl);
        }

        public static readonly DependencyProperty ReservationProperty =
            DependencyProperty.Register("Reservation", typeof(Reservation), typeof(ReservationDetailsControl), null);

        public Reservation Reservation
        {
            get { return (Reservation)GetValue(ReservationProperty); }
            set { SetValue(ReservationProperty, value); }
        }

        protected override void OnApplyTemplate()
        {
            base.OnApplyTemplate();

            if (m_checkInButton != null)
                m_checkInButton.Click -= OnCheckInButtonClick;

            m_checkInButton = (ButtonBase)GetTemplateChild(PART_CheckInButton);

            if (m_checkInButton != null)
                m_checkInButton.Click += OnCheckInButtonClick;
        }

        private void OnCheckInButtonClick(object sender, RoutedEventArgs e)
        {
            if (Reservation == null)
                return;

            Reservation.IsCheckIn = !Reservation.IsCheckIn;
        }
    }
}
