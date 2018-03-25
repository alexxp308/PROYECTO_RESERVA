#region using
using WebApplication1.BL;
using System.Web.Mvc;
using System.Web.Security;
using WebApplication1.App_Helpers;
using WebApplication1.Models;
using System.Threading.Tasks;
using System;
using System.Web;
#endregion

namespace WebApplication1.Controllers
{
	public class LoginController : Controller
	{
		// GET: Login
		public ActionResult Index()
		{
			return View("~/Views/Login/Login.cshtml");
		}

		[HttpPost]
		[AllowAnonymous]
		[ValidateAntiForgeryToken]
		public async Task<ActionResult> Login(LoginModel model, string returnUrl)
		{
			if (!ModelState.IsValid)
			{
				return View(model);
			}

			string user = "";
			blLogin oblLogin = new blLogin();
			user = oblLogin.checkLogin(model.UserName, model.Password);

			if (user.Length > 0)
			{
				FormsAuthentication.SetAuthCookie(model.UserName, false);
				string[] param = user.Split('|');
				var authTicket = new FormsAuthenticationTicket(1, param[0], DateTime.Now, DateTime.Now.AddDays(1), false, param[2]);
				string encryptedTicket = FormsAuthentication.Encrypt(authTicket);
				var authCookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket);
				HttpContext.Response.Cookies.Add(authCookie);

				Cookie.EraseCookie("userId");
				Cookie.EraseCookie("userName");
				Cookie.EraseCookie("role");
                Cookie.EraseCookie("sedeId");
                Cookie.EraseCookie("adminId");
                Cookie.EraseCookie("userNameAdmin");
                Cookie.EraseCookie("PAIS");

                Cookie.CreateCookie("userId", param[0], 1);
				Cookie.CreateCookie("userName", param[1], 1);
				Cookie.CreateCookie("role", param[2], 1);
                Cookie.CreateCookie("sedeId", param[3], 1);
                Cookie.CreateCookie("adminId", param[4], 1);
                Cookie.CreateCookie("userNameAdmin", param[5], 1);
                Cookie.CreateCookie("PAIS", param[6], 1);

                return RedirectToAction("Index", "Home");
			}

			else
			{
				ModelState.AddModelError("", "");
				return View(model);
			}
		}

		[ValidateAntiForgeryToken]
		public ActionResult LogOff()
		{
			if (Request.Cookies["userId"] != null && Request.Cookies["userName"] != null && Request.Cookies["role"] != null && Request.Cookies["sedeId"] != null && Request.Cookies["adminId"] != null && Request.Cookies["userNameAdmin"] != null && Request.Cookies["PAIS"] != null)
			{
                Cookie.EraseCookie("userId");
                Cookie.EraseCookie("userName");
                Cookie.EraseCookie("role");
                Cookie.EraseCookie("sedeId");
                Cookie.EraseCookie("adminId");
                Cookie.EraseCookie("userNameAdmin");
                Cookie.EraseCookie("PAIS");
            }

			Response.Cache.SetCacheability(HttpCacheability.NoCache);
			Response.Cache.SetExpires(DateTime.Now.AddSeconds(-1));
			Response.Cache.SetNoStore();
			FormsAuthentication.SignOut();
			return RedirectToAction("Index", "Login");
		}
    }
}