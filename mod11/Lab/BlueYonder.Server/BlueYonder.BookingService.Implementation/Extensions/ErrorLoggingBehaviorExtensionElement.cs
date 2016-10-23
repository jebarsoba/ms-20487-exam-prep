using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ServiceModel.Configuration;

namespace BlueYonder.BookingService.Implementation.Extensions
{
    public class ErrorLoggingBehaviorExtensionElement : BehaviorExtensionElement
    {
        public override Type BehaviorType
        {
            get { return typeof(ErrorLoggingBehavior); }
        }

        protected override object CreateBehavior()
        {
            return new ErrorLoggingBehavior();
        }
    }
}
