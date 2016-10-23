using BlueYonder.Companion.WNS.Notifications;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace BlueYonder.Companion.WNS
{
    /// <summary>
    /// Provides authentication and notifications broadcast services using WNS.
    /// </summary>
    public class WNSManager
    {
        private static OAuthToken _accessToken = null;
        private static BlockingCollection<ToastNotificationBase> _notificationsQueue = new BlockingCollection<ToastNotificationBase>(100);
        private static Thread _consumerThread = new Thread(new ThreadStart(DispatchNotifications)) { IsBackground = true };
        private static ManualResetEvent _waitHandle = new ManualResetEvent(false);
        private static ConcurrentDictionary<string, string> _subscribersMap = new ConcurrentDictionary<string, string>();       

        static WNSManager()
        {
            _consumerThread.Start();
        }

        public static async void Authenticate()
        {
            _accessToken = null;

            IsAuthenticated = false;

            _waitHandle.Reset();

            string clientSecret = ConfigurationManager.AppSettings.Get("ClientSecret");

            string packageSID = ConfigurationManager.AppSettings.Get("PackageSID");

            if (!string.IsNullOrEmpty(clientSecret) && !string.IsNullOrEmpty(packageSID))
            {
                _accessToken = await GetAccessToken(clientSecret, packageSID);
                IsAuthenticated = true;
                _waitHandle.Set();
            }
            else
            {
                throw new ConfigurationErrorsException
                    ("ClientSecret or PackageSID keys are either missing on the application configuration file or contains an empty string");
            }
        }

        public static void EnqueueNotifications(ToastNotificationBase notification)
        {           
            _notificationsQueue.Add(notification);            
        }

        public static void RegisterDevice(string deviceID, string deviceURL)
        {
            _subscribersMap[deviceID] = deviceURL;
        }

        public static void UnregisterDevice(string deviceID, string deviceURL)
        {
            string removedValue;
            _subscribersMap.TryRemove(deviceID, out removedValue);
        }

        /// <summary>
        /// dispatch the notifications to the subscribers.
        /// </summary>
        private static void DispatchNotifications()
        {
            while (true)
            {
                _waitHandle.WaitOne();

                ToastNotificationBase notification = _notificationsQueue.Take();
                
                Parallel.ForEach<string>
                    (notification.TargetClientDevices, 
                    (deviceID) => DispatchNotification(deviceID, notification));             
            }
        }

        private static void DispatchNotification(string deviceID, ToastNotificationBase notification)
        {
            string clientURL;

            if (_subscribersMap.TryGetValue(deviceID, out clientURL))
            {
                string response;

                try
                {
                    using (var client = new WebClient())
                    {
                        client.Headers.Add("Content-Type", "text/xml");
                        client.Headers.Add("X-WNS-Type", "wns/toast");
                        client.Headers[HttpRequestHeader.Authorization] =
                            string.Format("Bearer {0}", HttpUtility.UrlEncode(_accessToken.AccessToken));
                        response = client.UploadString(clientURL, notification.GetNotificationXML());
                    }
                }
                catch (Exception)
                {                
                }  
            }                     
        }

        private static OAuthToken GetOAuthTokenFromJson(string jsonString)
        {
            using (var ms = new MemoryStream(Encoding.Unicode.GetBytes(jsonString)))
            {
                var ser = new DataContractJsonSerializer(typeof(OAuthToken));
                var oAuthToken = (OAuthToken)ser.ReadObject(ms);                   
                return oAuthToken;
            }
        }

        private static Task<OAuthToken> GetAccessToken(string secret, string sid)
        {
            Task<OAuthToken> task = Task<OAuthToken>.Factory.StartNew(() =>
                {
                    try
                    {
                        var urlEncodedSecret = HttpUtility.UrlEncode(secret);
                        var urlEncodedSid = HttpUtility.UrlEncode(sid);

                        var body =
                          String.Format("grant_type=client_credentials&client_id={0}&client_secret={1}&scope=notify.windows.com", urlEncodedSid, urlEncodedSecret);

                        string response;
                        using (var client = new WebClient())
                        {
                            client.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
                            response = client.UploadString("https://login.live.com/accesstoken.srf", body);
                        }

                        return GetOAuthTokenFromJson(response);
                    }
                    catch (Exception)
                    {                        
                        return null;
                    }
                });

            return task;
        }

        public static bool IsAuthenticated { get; private set; }          
    }
}
