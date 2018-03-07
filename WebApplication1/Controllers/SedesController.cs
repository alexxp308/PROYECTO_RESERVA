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
    public class SedesController : Controller
	{
		// GET: Sedes
		[Authorize(Roles = "Admin,Administrador")]
		public ActionResult Index()
		{
			return View("~/Views/Sedes/Sedes.cshtml");
		}

		[HttpPost]
		[Authorize(Roles = "Admin,Administrador")]
		public string Guardar(sedeDTO sede)
		{
			string result = "";
			blSede oblSede = new blSede();
			result = oblSede.guardarSede(sede.nombreSede, sede.paisSede,sede.torres,sede.pisos,sede.activos);
			return result;
		}

		[HttpPost]
		[Authorize(Roles = "Admin,Administrador")]
		public string ListarSedes()
		{
			string result = "";
			blSede oblSede = new blSede();
			result = oblSede.listarSedes();
			return result;
		}

		[HttpPost]
		[Authorize(Roles = "Admin,Administrador")]
		public string Actualizar(sedeDTO sede)
		{
			string result = "";
			blSede oblSede = new blSede();
			result = oblSede.Actualizar(sede.idSede, sede.nombreSede, sede.paisSede, sede.torres, sede.pisos,sede.activos);
			return result;
		}

		[HttpPost]
		[Authorize(Roles = "Admin,Administrador")]
		public int Eliminar(sedeDTO sede)
		{
			int result = 0;
			blSede oblSede = new blSede();
			result = oblSede.Eliminar(sede.idSede);
			return result;
		}

        [HttpPost]
        [Authorize(Roles = "Admin,Administrador")]
        public string getSede(sedeDTO sede)
        {
            string result = "";
            blSede oblSede = new blSede();
            result = oblSede.getSede(sede.idSede);
            return result;
        }
    }
}