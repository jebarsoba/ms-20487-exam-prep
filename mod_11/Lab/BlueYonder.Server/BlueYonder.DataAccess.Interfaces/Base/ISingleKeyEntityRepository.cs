using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BlueYonder.DataAccess.Interfaces
{
    public interface ISingleKeyEntityRepository<T, K> : IRepository<T> where T : class 
    {
        T GetSingle(K entityKey);
    }
}
