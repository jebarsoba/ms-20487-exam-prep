using ConsumingODataService.Host.Infra;
using ConsumingODataService.Host.Model;
using Microsoft.Data.Edm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.OData.Builder;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace ConsumingODataService.Host
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            // Initializing the database and populating seed data using DropCreateDatabaseIfModelChanges initializer
            (new DropCreateDBOnModelChanged()).InitializeDatabase(new SchoolContext());

            SetupOData();

            GlobalConfiguration.Configuration.Formatters.Remove(GlobalConfiguration.Configuration.Formatters.JsonFormatter);
            AreaRegistration.RegisterAllAreas();
            
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        private static void SetupOData()
        {
            ODataConventionModelBuilder modelBuilder = new ODataConventionModelBuilder();
            modelBuilder.EntitySet<Course>("Courses");
            modelBuilder.EntitySet<Student>("Students");
            modelBuilder.EntitySet<Teacher>("Teachers");

            IEdmModel model = modelBuilder.GetEdmModel();

            GlobalConfiguration.Configuration.Routes.MapODataRoute(routeName: "OData",
                                                                   routePrefix: "odata",
                                                                   model: model);
        }
    }
}