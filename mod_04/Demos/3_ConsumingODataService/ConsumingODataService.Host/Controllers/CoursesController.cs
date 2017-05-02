using ConsumingODataService.Host.Infra;
using ConsumingODataService.Host.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.OData;
using System.Web.Http.OData.Builder;

namespace ConsumingODataService.Host.Controllers
{
    public class CoursesController : ODataController
    {
        SchoolContext ctx = new SchoolContext();

        [Queryable]
        public IQueryable<Course> Get()
        {
            return ctx.Courses;
        }
    }
}