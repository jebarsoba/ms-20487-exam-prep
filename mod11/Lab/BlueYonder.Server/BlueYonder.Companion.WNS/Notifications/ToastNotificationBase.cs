using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.WNS.Notifications
{
    public abstract class ToastNotificationBase
    {
        /// <summary>
        /// A heading text field.
        /// </summary>
        public string TextHeading { get; set; }

        /// <summary>
        /// A body text field.
        /// </summary>
        public string TextBodyWrap { get; set; }

        /// <summary>
        /// On derived classes returnes the notification XML.
        /// </summary>
        /// <returns></returns>
        public abstract string GetNotificationXML();

        /// <summary>
        /// contains the list of target clients to dispatch the message to.
        /// </summary>
        public List<string> TargetClientDevices
        {
            get;
            set;
        }
    }
}
