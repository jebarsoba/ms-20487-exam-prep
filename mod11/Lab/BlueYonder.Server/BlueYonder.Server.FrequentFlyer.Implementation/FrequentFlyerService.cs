using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;
using BlueYonder.DataAccess.Repositories;
using BlueYonder.FrequentFlyerService.Contracts;
using BlueYonder.Entities;

namespace BlueYonder.FrequentFlyerService.Implementation
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall)]
    public class FrequentFlyerService : IFrequentFlyerService
    {
        public static readonly string ConnectionName = "BlueYonderFrequentFlyer";

        [OperationBehavior(TransactionAutoComplete=true, TransactionScopeRequired = true)]
        public int AddFrequentFlyerMiles(int travelerId, int miles)
        {
            using (FrequentFlyerRepository repository = new FrequentFlyerRepository(ConnectionName))
            {
                FrequentFlyer member = repository.GetSingle(travelerId);

                if (member == null)
                {
                    member = new FrequentFlyer { TravelerId = travelerId, Miles = miles };
                    repository.Add(member);
                }
                else
                {
                    member.Miles += miles;
                    repository.Edit(member);
                }                
                
                repository.Save();
            }

            return miles;
        }

        [OperationBehavior(TransactionAutoComplete = true, TransactionScopeRequired = true)]
        public int RevokeFrequentFlyerMiles(int travelerId, int milesToRevoke)
        {
            int actualMilesToRevoke = 0;

            using (FrequentFlyerRepository repository = new FrequentFlyerRepository(ConnectionName))
            {
                FrequentFlyer member = repository.GetSingle(travelerId);

                //the traveler is not a BB member - 0 miles revoked
                if (member == null)
                {
                    return 0;
                }

                //if the number of miles to revoke exceeds the accumulated miles, just set the accumulated miles to zero
                actualMilesToRevoke = Math.Min(member.Miles, milesToRevoke);

                member.Miles -= actualMilesToRevoke;

                repository.Edit(member);
                repository.Save();
            }

            return actualMilesToRevoke;
        }


        public int GetAccumulatedMiles(int travelerId)
        {
            using (FrequentFlyerRepository repository = new FrequentFlyerRepository(ConnectionName))
            {
                FrequentFlyer member = repository.GetSingle(travelerId);

                if (member == null)
                    return -1;
                else
                    return member.Miles;
            }
        }
    }
}
