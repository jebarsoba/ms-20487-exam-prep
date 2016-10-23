using BlueYonder.DataAccess;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;

namespace BlueYonder.Server.FrequentFlyerServiceWebHost
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            var dbInitializer = new DropCreateDatabaseIfModelChanges<FrequentFlyersContext>();
            dbInitializer.InitializeDatabase(new FrequentFlyersContext(BlueYonder.FrequentFlyerService.Implementation.FrequentFlyerService.ConnectionName));

        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}