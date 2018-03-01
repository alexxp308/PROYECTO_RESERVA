using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication1.Controllers
{
	[Authorize]
	public class HomeController : Controller
	{
		[Authorize(Roles = "Admin,User,Administrador")]
		public ActionResult Index()
		{
			return View("~/Views/Home/Index.cshtml");
		}

		[Authorize(Roles = "Admin,User,Administrador")]
		public ActionResult About()
		{
			ViewBag.Message = "Your application description page.";

			return View();
		}

		[Authorize(Roles = "Admin,User,Administrador")]
		public ActionResult Contact()
		{
			ViewBag.Message = "Your contact page.";

			return View();
		}
	}
}