using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlueYonder.Companion.WNS.Notifications
{
    public class ToastNotificationTemplates
    {
        public const string TOAST_IMAGE_AND_TEXT_02 = 
@"<toast>
<visual version='1'>
<binding template='toastImageAndText02'>
<text id='1'>{0}</text>
<text id='2'>{1}</text>
<image id='1' src='{2}' alt='{3}'/>
</binding>
</visual>
</toast>";


        public const string TOAST_TEXT_02 =
@"<toast>
<visual>
<binding template='ToastText02'>
<text id='1'>{0}</text>
<text id='2'>{1}</text>
</binding>
</visual>
</toast>";
    }
}
