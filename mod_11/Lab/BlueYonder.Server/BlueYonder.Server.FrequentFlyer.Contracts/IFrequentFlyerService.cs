using System.Collections.Generic;
using System.ServiceModel;
using BlueYonder.Entities;

namespace BlueYonder.FrequentFlyerService.Contracts
{
    [ServiceContract(Namespace = "http://blueyonder.server.interfaces/")]
    public interface IFrequentFlyerService
    {
        [OperationContract]        
        [TransactionFlow(TransactionFlowOption.Allowed)]
        int AddFrequentFlyerMiles(int travelerId, int miles);

        [OperationContract]        
        [TransactionFlow(TransactionFlowOption.Allowed)]
        int RevokeFrequentFlyerMiles(int travelerId, int milesToRevoke);

        [OperationContract]
        int GetAccumulatedMiles(int travelerId);
    }
}
