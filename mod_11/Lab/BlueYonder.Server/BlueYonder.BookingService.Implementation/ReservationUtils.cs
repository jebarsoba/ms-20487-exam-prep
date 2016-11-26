using System;
using System.Linq;
using System.Text;
using BlueYonder.DataAccess.Interfaces;

namespace BlueYonder.BookingService.Implementation
{
    public static class ReservationUtils
    {
        private const int ConfirmationCodeLength = 5;
        private static readonly string ConfirmationCodeCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";


        public static string GenerateConfirmationCode(IReservationRepository repository)
        {
            int length = ConfirmationCodeCharacters.Length;
            Random rand = new Random();
            bool confirmationCodeFound;
            StringBuilder rs = new StringBuilder();
            string confirmationCode;

            do
            {
                for (int i = 0; i < ConfirmationCodeLength; i++)
                {
                    rs.Append(ConfirmationCodeCharacters[rand.Next(0, length)]);
                }
                confirmationCode = rs.ToString();

                confirmationCodeFound =
                    repository.FindBy(r => r.ConfirmationCode == confirmationCode).FirstOrDefault() != null;

                rs.Clear();
            } while (confirmationCodeFound);

            return confirmationCode;
        }
    }
}
