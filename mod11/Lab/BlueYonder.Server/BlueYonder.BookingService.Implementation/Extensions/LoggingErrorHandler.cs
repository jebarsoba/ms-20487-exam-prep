using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Dispatcher;
using System.Diagnostics;

namespace BlueYonder.BookingService.Implementation.Extensions
{
    public class LoggingErrorHandler : IErrorHandler
    {
        private TraceSource _traceSource = new TraceSource("ErrorHandlerTrace");

        public void ProvideFault(Exception error, MessageVersion version, ref Message fault)
        {
        }

        public bool HandleError(Exception error)
        {
            ParametersInfo parametersInfo = OperationContext.Current.Extensions.Find<ParametersInfo>();
            if (parametersInfo != null)
            {
                // Convert the parameters to strings and concatenate them to a string with new lines
                string message = string.Format
                    ("Exception of type {0} occured: {1}\n operation paramers are:\n{2}\n",
                    error.GetType().Name,
                    error.Message,
                    parametersInfo.Parameters.Select
                        (o => ErrorLoggingUtils.GetObjectAsXml(o)).Aggregate((prev, next) => prev + "\n" + next));

                _traceSource.TraceEvent(TraceEventType.Error, 0, message);
            }

            return true;
        }
    }
}
