using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using BlueYonder.Companion.Client.DataTransferObjects;
using Windows.Networking.PushNotifications;
using Windows.Security.Cryptography;

namespace BlueYonder.Companion.Client.Helpers
{
    //WNS
    public class WnsManager
    {
        private readonly Settings _settings = new Settings(SettingsType.Local);

        public async Task<bool> Register()
        {
            // Check if a unique channel uri exists in local settings
            var channelUri = _settings.Get(Constants.WnsChannelUri);
            if (!NetworkManager.IsNetworkAvailable && string.IsNullOrEmpty(channelUri))
            {
                return false;
            }

            // Register for push notifications
            var uniqueChannelUri = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
            if (!string.IsNullOrEmpty(channelUri))
            {
                var currentChannel = DecryptChannelUri(channelUri);
                // If the new channel uri is the same as the stored channel uri, we don't need to resend it
                if (currentChannel == uniqueChannelUri.Uri)
                {
                    return true;
                }
            }

            if (!NetworkManager.IsNetworkAvailable)
            {
                return false;
            }

            // Encypt the new unique channel uri
            var newChannelUri = EncryptChannelUri(uniqueChannelUri.Uri);
            // Send the encrypted channel uri to the server
            var success =  await SendChannelToServer(newChannelUri);
            if (success)
            {
                // Store the encrypted channel uri in the application settings
                _settings.Add(Constants.WnsChannelUri, newChannelUri);
            }
            return success;
        }

        private string EncryptChannelUri(string uri)
        {
            var channelBuffer = CryptographicBuffer.ConvertStringToBinary(uri, BinaryStringEncoding.Utf8);
            return CryptographicBuffer.EncodeToBase64String(channelBuffer);
        }

        private string DecryptChannelUri(string uri)
        {
            var channelBuffer = CryptographicBuffer.DecodeFromBase64String(uri);
            return CryptographicBuffer.ConvertBinaryToString(BinaryStringEncoding.Utf8, channelBuffer);
        }

        private async Task<bool> SendChannelToServer(string channelUri)
        {
            var dataManager = new DataManager();
            return await dataManager.RegisterNotificationsChannel(channelUri);
        }
    }
}
