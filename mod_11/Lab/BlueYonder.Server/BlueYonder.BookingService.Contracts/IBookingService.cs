using System.ServiceModel;
using BlueYonder.BookingService.Contracts.Faults;

namespace BlueYonder.BookingService.Contracts
{
    [ServiceContract(Namespace = "http://blueyonder.server.interfaces/")]
    public interface IBookingService
    {         
        [OperationContract]
        [FaultContract(typeof(ReservationCreationFault))]
        string CreateReservation(ReservationDto request);

        [OperationContract]
        void UpdateTrip(TripUpdateDto trip);

        [OperationContract]
        void CancelReservation(string confirmationCode);
    }
}
