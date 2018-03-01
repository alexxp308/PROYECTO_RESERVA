using SalaJuntas.BL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication1.App_Helpers;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Authorize]
    public class UsuariosController : Controller
    {
        // GET: Registro
        [Authorize(Roles = "Admin,Administrador")]
        public ActionResult Index()
        {
            string pais = Request.QueryString["Pais"];
            if (pais=="PERU" || pais=="MEXICO")
            {
                string result = "";
                blSede oblSede = new blSede();
                result = oblSede.listarSedesxPais(pais);
                ViewBag.sedexPais = result;
                ViewBag.pais = pais;
                ViewBag.sede = 0;
                return View("~/Views/Usuarios/Usuarios.cshtml");
            }
            else if (Request.Cookies["role"].Value== "Administrador")
            {
                ViewBag.sedexPais = "";
                ViewBag.pais = "";
                ViewBag.sede = Request.Cookies["sedeId"].Value;
                return View("~/Views/Usuarios/Usuarios.cshtml");
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Administrador")]
        public string guardarUsuario(usuarioDTO usuario)
        {
            string result = "";
            blUsuarios oblUser = new blUsuarios();
            result = oblUser.guardarUsuario(usuario.userName, usuario.roles, usuario.cargo, usuario.nombreCompleto, usuario.email, usuario.idSede);
            return result;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Administrador")]
        public string listarUsuarios(string pais,int sedeId)
        {
            string result = "";
            blUsuarios oblUser = new blUsuarios();
            result = oblUser.listarUsuarios(pais,sedeId);
            return result;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Administrador")]
        public int actualizarEstado(usuarioDTO usuario)
        {
            int result = 0;
            blUsuarios oblUser = new blUsuarios();
            result = oblUser.actualizarEstado(usuario.UserId, usuario.IsActive);
            return result;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Administrador")]
        public string actualizarUsuario(usuarioDTO usuario)
        {
            string result = "";
            blUsuarios oblUser = new blUsuarios();
            result = oblUser.actualizarUsuario(usuario.UserId,usuario.userName, usuario.roles, usuario.cargo, usuario.nombreCompleto, usuario.email, usuario.idSede);
            return result;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Administrador")]
        public int resetearContrasenia(usuarioDTO usuario)
        {
            int result = 0;
            blUsuarios oblUser = new blUsuarios();
            result = oblUser.resetearContrasenia(usuario.UserId);
            return result;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Administrador,User")]
        public string getUser(usuarioDTO usuario)
        {
            string result = "";
            blUsuarios oblUser = new blUsuarios();
            result = oblUser.getUser(usuario.UserId);
            return result;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Administrador,User")]
        public int cambiarContrasenia(usuarioDTO usuario)
        {
            int result = 0;
            blUsuarios oblUser = new blUsuarios();
            result = oblUser.cambiarContrasenia(usuario.UserId,usuario.password);
            return result;
        }
    }
}