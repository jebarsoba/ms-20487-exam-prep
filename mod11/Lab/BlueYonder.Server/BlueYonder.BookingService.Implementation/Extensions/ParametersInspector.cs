using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ServiceModel;
using System.ServiceModel.Dispatcher;

namespace BlueYonder.BookingService.Implementation.Extensions
{
    class ParametersInspector : IParameterInspector
    {
        public void AfterCall(string operationName, object[] outputs, object returnValue, object correlationState)
        {
        }

        public object BeforeCall(string operationName, object[] inputs)
        {
            OperationContext.Current.Extensions.Add(new ParametersInfo(inputs));
            return null;
        }
    }
}
