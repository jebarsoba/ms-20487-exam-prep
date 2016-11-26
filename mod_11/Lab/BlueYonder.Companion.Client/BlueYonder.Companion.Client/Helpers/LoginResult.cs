using System;

namespace BlueYonder.Companion.Client.Helpers
{
    public class LoginResult
    {
        public LoginResult(bool isLoggedIn, Exception error = null)
        {
            IsLoggedIn = isLoggedIn;
            Error = error;
        }

        public bool IsLoggedIn { get; private set; }

        public Exception Error { get; private set; }
    }
}