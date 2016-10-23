using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace BlueYonder.Companion.Client.Helpers
{
    public enum SettingsType
    {
        Local,
        Roaming
    }

    public class Settings
    {
        private ApplicationDataContainer _settings = null;

        public Settings(SettingsType type)
        {
            this._settings = GetContainer(type);
            //ApplicationDataContainer container = localSettings.CreateContainer("Login", ApplicationDataCreateDisposition.Existing);
        }

        public void Add(string name, string value)
        {
            _settings.Values[name] = value;
        }

        public void Remove(string name)
        {
            if (_settings.Values.ContainsKey(name))
                _settings.Values.Remove(name);
        }

        public string Get(string name)
        {
            if (_settings.Values.ContainsKey(name))
                return Convert.ToString(_settings.Values[name]);
            else
                return string.Empty;
        }

        private ApplicationDataContainer GetContainer(SettingsType type)
        {
            switch (type)
            {
                case SettingsType.Roaming:
                    return ApplicationData.Current.RoamingSettings;
                default:
                    return ApplicationData.Current.LocalSettings;
            }
        }
    }
}
