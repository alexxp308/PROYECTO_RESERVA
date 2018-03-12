using SalaJuntas.BL;
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

        [HttpPost]
        [Authorize(Roles = "Admin,User,Administrador")]
        public string reporteDetallado(int sedeId,int salaId,string fechaI,string fechaF)
        {
            string result = "";
            blReporte oblReporte = new blReporte();
            result = oblReporte.reporteDetallado(sedeId, salaId, fechaI, fechaF);
            return result;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,User,Administrador")]
        public string reporteOcupacion(int sedeId, string fechaI, string fechaF)
        {
            string result = "";
            blReporte oblReporte = new blReporte();
            result = oblReporte.reporteOcupacion(sedeId, fechaI, fechaF);
            return result;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,User,Administrador")]
        public string reporteResumen(int sedeId, string fechaI, string fechaF)
        {
            string result = "";
            blReporte oblReporte = new blReporte();
            result = oblReporte.reporteResumen(sedeId, fechaI, fechaF);
            return result;
        }
    }
}