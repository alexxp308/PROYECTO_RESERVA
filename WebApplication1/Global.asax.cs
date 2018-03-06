using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;
using RESERVA_SALA;

namespace WebApplication1
{
	public class MvcApplication : System.Web.HttpApplication
	{
		protected void Application_Start()
		{
            ViewEngines.Engines.Clear();
            ViewEngines.Engines.Add(new RazorViewEngine());
            AreaRegistration.RegisterAllAreas();
			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
			BundleConfig.RegisterBundles(BundleTable.Bundles);
		}

		protected void Application_PostAuthenticateRequest(Object sender, EventArgs e)
		{
			var authCookie = HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
			if (authCookie != null)
			{
				FormsAuthenticationTicket authTicket = FormsAuthentication.Decrypt(authCookie.Value);
				if (authTicket != null && !authTicket.Expired)
				{
					var roles = authTicket.UserData.Split(',');
					HttpContext.Current.User = new System.Security.Principal.GenericPrincipal(new FormsIdentity(authTicket), roles);
				}
			}
		}
	}
}
