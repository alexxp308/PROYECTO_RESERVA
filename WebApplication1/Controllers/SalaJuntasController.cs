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
	public class SalaJuntasController : Controller
    {
		// GET: SalaJuntas
		[Authorize(Roles = "Admin,Administrador")]
		public ActionResult Index()
        {
			string pais = Request.QueryString["Pais"];
			string tipo = Request.QueryString["tipo"];
			if (pais != null && pais!="" && tipo!="")
			{
				string result = "";
				blSede oblSede = new blSede();
				result = oblSede.listarSedesxPais(pais);
				ViewBag.sedexPais = result;
				ViewBag.pais = pais;
				ViewBag.tipo = tipo;
				return View("~/Views/SalaJuntas/SalaJuntas.cshtml");
			}
			else
			{
				return RedirectToAction("Index","Sedes");
			}

        }

		[HttpPost]
		[Authorize(Roles = "Admin,Administrador")]
		public string GuardarSala(salaDTO sala)
		{
			string result = "";
			blSala oblSala = new blSala();
			result = oblSala.guardarSala(sala.nombreSala,sala.horario,sala.activos,sala.ubicacion,sala.idSede,sala.tipo);
			return result;
		}
		
		[HttpPost]
		[Authorize(Roles = "Admin,Administrador")]
		public string ListarSalas(string param)
		{
			string result = "";
			blSala oblSala = new blSala();
			string[] datos = param.Split('|'); 
			result = oblSala.ListarSalas(datos[0],datos[1]);
			return result;
		}

		[HttpPost]
		[Authorize(Roles = "Admin,Administrador")]
		public int ActualizarEstado(salaDTO sala)
		{
			int result = 0;
			blSala oblSala = new blSala();
			result = oblSala.ActualizarEstado(sala.idSala,sala.estado);
			return result;
		}
		
		[HttpPost]
		[Authorize(Roles = "Admin,Administrador")]
		public string ActualizarSala(salaDTO sala)
		{
			string result = "";
			blSala oblSala = new blSala();
			result = oblSala.ActualizarSala(sala.idSala, sala.nombreSala, sala.horario, sala.activos, sala.ubicacion, sala.idSede,sala.tipo);
			return result;
		}

		[HttpPost]
		[Authorize(Roles = "Admin")]
		public int EliminarSala(salaDTO sala)
		{
			int result = 0;
			blSala oblSala = new blSala();
			result = oblSala.EliminarSala(sala.idSala);
			return result;
		}
	}
}