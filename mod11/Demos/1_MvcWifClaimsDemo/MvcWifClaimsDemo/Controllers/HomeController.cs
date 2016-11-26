using System.Security.Claims;
using System.Web.Mvc;

namespace MvcWifClaimsDemo.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ClaimsIdentity claimsIdentity = System.Web.HttpContext.Current.User.Identity as ClaimsIdentity;
            ViewBag.Claims = claimsIdentity.Claims;

            ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
