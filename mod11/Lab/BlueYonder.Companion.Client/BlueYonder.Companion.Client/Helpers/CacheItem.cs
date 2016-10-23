using System;

namespace BlueYonder.Companion.Client.Helpers
{
    //Module 5 - Advanced Data Scenarios in Windows 8 App
    //The student will be able to use various storage mechanisms, choose a suitable caching strategy for their app, and use advanced file access methods.
    public class CacheItem
    {
        public DateTime CreatedDate { get; set; }
        public string JsonData { get; set; }
        public object Data { get; set; }

        public bool RequireRefresh
        {
            get { return this.CreatedDate < DateTime.Now.AddMinutes(-5); }
        }
    }
}