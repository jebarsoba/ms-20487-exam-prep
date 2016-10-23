using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.WNS.Notifications
{
    public class ToastNotificationText : ToastNotificationBase
    {
        public override string GetNotificationXML()
        {
            return string.Format
                (ToastNotificationTemplates.TOAST_TEXT_02,
                base.TextHeading,
                base.TextBodyWrap);
        }
    }
}
