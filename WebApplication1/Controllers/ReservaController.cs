using Newtonsoft.Json;
using SalaJuntas.BL;
using SalaJuntas.Librerias.EL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Authorize]
    public class ReservaController : Controller
    {
        // GET: Prueba
        [Authorize(Roles = "Admin,User,Administrador")]
        public ActionResult ProcesoReserva()
        {
            return View("~/Views/Reserva/ProcesoReserva.cshtml");
        }

        [HttpPost]
        [Authorize(Roles = "Admin,User,Administrador")]
        public string listarSedesxPais(string pais)
        {
            string result = "";
            blSede oblSede = new blSede();
            result = oblSede.listarSedesxPais(pais);
            return result;
        }

        /*[HttpPost]
        [Authorize(Roles = "Admin,User,Administrador")]
        public string listarSalasxSede(string sede)
        {
            string result = "";
            blSala oblSala = new blSala();
            result = oblSala.listarSalasxSede(sede);
            return result;
        }*/

        [HttpPost]
        [Authorize(Roles = "Admin,User,Administrador")]
        public string obtenerSala(salaDTO sala)
        {
            string result = "";
            blSala oblSala = new blSala();
            result = oblSala.obtenerSala(sala.tipo, sala.idSede, sala.ubicacion);
            return result;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,User,Administrador")]
        public string reservaXsalaEvents(reservaDTO reserva)
        {
            var result = "";
            List<elReserva> lelReserva = new List<elReserva>();
            blReserva oblReserva = new blReserva();
            lelReserva = oblReserva.reservaXsalaEvents(reserva.idSala, reserva.fhinicio, reserva.fhfin);
            result = JsonConvert.SerializeObject(lelReserva);
            return result;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,User,Administrador")]
        public string guardarReserva(List<elReserva> lreserva)
        {
            int result1 = 0;
            int result2 = 0;
            blReserva oblReserva = new blReserva();
            result1 = oblReserva.guardarReserva(lreserva);
            result2 = oblReserva.EnviarCorreo(lreserva);
            return result1 +"|"+result2;
        }
    }
}