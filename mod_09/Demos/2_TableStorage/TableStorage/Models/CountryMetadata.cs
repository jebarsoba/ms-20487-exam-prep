using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TableStorage
{
    [MetadataType(typeof(CountryMetadata))]
    public partial class Country { }

    public class CountryMetadata
    {
        [Display(Name="Continent")]
        public string PartitionKey { get; set; }
        [Display(Name="Name")]
        public string RowKey { get; set; }
        [ScaffoldColumn(false)]
        public DateTimeOffset Timestamp { get; set; }

    }
}