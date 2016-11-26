using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.Client.Common
{
    public abstract class DataFetcher
    {
        private const int MaxDataObsoleteMinutes = 5;

        protected DateTime LastRefreshDateTime { get; set; }

        protected bool RequireRefresh
        {
            get
            {
                var delta = DateTime.Now - LastRefreshDateTime;
                return delta.TotalMinutes > MaxDataObsoleteMinutes;
            }
        }
    }
}
