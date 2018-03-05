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
        public string obtenerReservaxUsuario(int idSala, int idUser,int idSede,int estado)
        {
            var result = "";
            List<elReserva> lelReserva = new List<elReserva>();
            blReserva blReserva = new blReserva();
            lelReserva = blReserva.obtenerReservaxUsuario(idSala, idUser,idSede,estado);
            result = JsonConvert.SerializeObject(lelReserva);
            return result;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,User,Administrador")]
        public int eliminarReserva(int idReserva)
        {
            int result = 0;
            blReserva blReserva = new blReserva();
            result = blReserva.eliminarReserva(idReserva);
            return result;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,User,Administrador")]
        public string CheckList(int idReserva, int iniFin, string check)
        {
            string result = "";
            blReserva blReserva = new blReserva();
            result = blReserva.CheckList(idReserva, iniFin, check);
            return result;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,User,Administrador")]
        public int actualizarReserva(List<elReserva> lelReserva)
        {
            int result = 0;
            blReserva blReserva = new blReserva();
            result = blReserva.actualizarReserva(lelReserva);
            return result;
        }
    }
}