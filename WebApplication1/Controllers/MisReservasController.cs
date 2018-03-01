using Newtonsoft.Json;
using SalaJuntas.BL;
using SalaJuntas.Librerias.EL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication1.Controllers
{
    [Authorize]
    public class MisReservasController : Controller
    {
        [Authorize(Roles = "Admin,User,Administrador")]
        public ActionResult Index()
        {
            return View("~/Views/MisReservas/MisReservas.cshtml");
        }

        [HttpPost]
        [Authorize(Roles = "Admin,User,Administrador")]
        public string listarSalasxSede(int sede)
        {
            string result = "";
            blSala oblSala = new blSala();
            result = oblSala.listarSalasxSede(sede);
            return result;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,User,Administrador")]
        public string obtenerReservaxUsuario(int idSala, int idUser)
        {
            var result = "";
            List<elReserva> lelReserva = new List<elReserva>();
            blReserva blReserva = new blReserva();
            lelReserva = blReserva.obtenerReservaxUsuario(idSala, idUser);
            result = JsonConvert.SerializeObject(lelReserva);
            return result;
        }
    }
}