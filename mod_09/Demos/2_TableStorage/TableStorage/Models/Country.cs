using Microsoft.WindowsAzure.Storage.Table.DataServices;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace TableStorage
{
    public partial class Country : TableServiceEntity
    {
        public Country(string name, string continent)
        {
            PartitionKey = continent;
            RowKey = name;
        }

        public Country()
        {

        }

        public string Language { get; set; }
        public int Population { get; set; }
    }
}