using SalaJuntas.BL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Authorize]
    public class CampaniasController : Controller
    {
        [Authorize(Roles = "Admin,Administrador")]
        public ActionResult Index()
        {
            return View("~/Views/Campanias/Campanias.cshtml");
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Administrador,User")]
        public string listarCampanias(CampaniaDTO campania)
        {
            string result = "";
            blCampania oblCampania = new blCampania();
            result = oblCampania.listarCampanias(campania.idSede);
            return result;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Administrador")]
        public string guardarCampania(CampaniaDTO campania)
        {
            string result = "";
            blCampania oblCampania = new blCampania();
            result = oblCampania.guardarCampania(campania.nombreCampania,campania.idSede);
            return result;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Administrador")]
        public string actualizarCampania(CampaniaDTO campania)
        {
            string result = "";
            blCampania oblCampania = new blCampania();
            result = oblCampania.actualizarCampania(campania.idSede,campania.nombreCampania,campania.idCampania);
            return result;
        }
    }
}