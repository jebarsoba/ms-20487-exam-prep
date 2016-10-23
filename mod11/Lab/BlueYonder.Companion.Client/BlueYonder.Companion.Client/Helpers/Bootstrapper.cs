using System;

namespace BlueYonder.Companion.Client.Helpers
{
    public class Bootstrapper
    {
        public event EventHandler Finished;

        public async void Start()
        {
            var loginResult = await UserAuth.Instance.Login();
            if (loginResult.IsLoggedIn)
            {
                await ReservationDataFetcher.Instance.GetCategoriesAsync(false);
            }

            var wnsManager = new WnsManager();
            await wnsManager.Register();

            var handler = Finished;
            if (handler != null)
            {
                handler(this, EventArgs.Empty);
            }
        }
    }
}