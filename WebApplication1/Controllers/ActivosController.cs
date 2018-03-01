using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Models;
using SalaJuntas.BL;

namespace WebApplication1.Controllers
{
    [Authorize]
    public class ActivosController : Controller
    {
		// GET: Activos
		[Authorize(Roles = "Admin,Administrador")]
		public ActionResult Index()
        {
            return View("~/Views/Activos/Activos.cshtml");
        }

		[HttpPost]
		[Authorize(Roles = "Admin,Administrador")]
		public string GuardarActivo(activosDTO activo)
		{
			string result = "";
			blActivo oblActivo = new blActivo();
			result = oblActivo.guardarActivo(activo.nombreActivo);
			return result;
		}

		[HttpPost]
		[Authorize(Roles = "Admin,Administrador")]
		public string ListarActivos()
		{
			string result = "";
			blActivo oblActivo = new blActivo();
			result = oblActivo.ListarActivos();
			return result;
		}

		[HttpPost]
		[Authorize(Roles = "Admin,Administrador")]
		public string ActualizarActivo(activosDTO activo)
		{
			string result = "";
			blActivo oblActivo = new blActivo();
			result = oblActivo.ActualizarActivo(activo.idActivo,activo.nombreActivo);
			return result;
		}
	}
}