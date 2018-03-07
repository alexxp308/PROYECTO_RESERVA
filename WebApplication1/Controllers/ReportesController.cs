using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication1.Controllers
{
    [Authorize]
    public class ReportesController : Controller
    {
        [Authorize(Roles = "Admin,Administrador")]
        public ActionResult Index()
        {
            return View("~/Views/Reportes/Reportes.cshtml");
        }
    }
}