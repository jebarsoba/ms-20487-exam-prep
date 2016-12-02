using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.WindowsAzure.Storage.Table.DataServices;
using System;
using System.Collections.Generic;
using System.Data.Services.Client;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TableStorage.Controllers
{
    public class CountriesController : Controller
    {
        const string CountriesTable = "Countries";

        private TableServiceContext GetTableContext()
        {
            // Connect to the storage account
            CloudStorageAccount storageAccount =
                CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("StorageAccount"));

            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
            // Verify the table exists
            CloudTable table = tableClient.GetTableReference(CountriesTable);
            table.CreateIfNotExists();
            TableServiceContext tableContext = tableClient.GetTableServiceContext();

            return tableContext;
        }

        public ActionResult Index(string continent)
        {
            TableServiceContext tableContext = GetTableContext();
            List<Country> countries;
            if (string.IsNullOrEmpty(continent))
            {
                // No specific continent required. Retrieve entire table content
                countries = tableContext.CreateQuery<Country>(CountriesTable).ToList();
            }
            else
            {
                // Filter by continent
                IQueryable<Country> query =
                    from e in tableContext.CreateQuery<Country>(CountriesTable)
                    where e.PartitionKey == continent
                    select e;
                countries = query.ToList();
            }
            return View(countries);
        }

        [HttpPost]
        public ActionResult Add(FormCollection collection)
        {
            // Create the country entity from the form content
            Country country = new Country(collection["Name"], collection["Continent"])
            {
                Language = collection["Language"],
                Population = int.Parse(collection["Population"])
            };

            // Add the country entity to the table
            TableServiceContext tableContext = GetTableContext();

            tableContext.AddObject(CountriesTable, country);
            tableContext.SaveChanges();

            // Reload the countries list
            return RedirectToAction("Index");
        }
    }
}
