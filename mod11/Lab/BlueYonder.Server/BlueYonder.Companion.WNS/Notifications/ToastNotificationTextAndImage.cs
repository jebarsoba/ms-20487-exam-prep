using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.WNS.Notifications
{
    public class ToastNotificationTextAndImage : ToastNotificationBase
    {
        public string Image { get; set; }

        public override string GetNotificationXML()
        {
            return string.Format
                (ToastNotificationTemplates.TOAST_IMAGE_AND_TEXT_02,
                base.TextHeading,
                base.TextBodyWrap,
                Image, 
                "Misssing Image");
        }
    }
}
