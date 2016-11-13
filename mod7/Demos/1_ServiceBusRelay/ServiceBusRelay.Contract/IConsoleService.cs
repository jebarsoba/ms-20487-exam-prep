using System.ServiceModel;

namespace ServiceBusRelay.Contract
{
    [ServiceContract]
    public interface IConsoleService
    {
        [OperationContract]
        void Write(string text);
    }
}
