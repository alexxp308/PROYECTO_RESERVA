#region Using
using System;
using System.Web;
#endregion

namespace WebApplication1.App_Helpers
{
	public class Cookie
	{
		public static void CreateCookie(string name, string value, double days)
		{
			HttpCookie cookie = new HttpCookie(name, value);
			cookie.Expires = DateTime.Now.AddDays(days);
			HttpContext.Current.Response.Cookies.Add(cookie);
		}
		public static string ReadCookie(string name)
		{
			string result = "";
			if (HttpContext.Current.Request.Cookies[name] != null)
			{
				HttpCookie cookie = new HttpCookie(name);
				result = cookie.Value;
			}
			return result;
		}
		public static void EraseCookie(string name)
		{
			if (HttpContext.Current.Request.Cookies[name] != null)
			{
				HttpCookie cookie = new HttpCookie(name);
				cookie.Expires = DateTime.Now.AddDays(-1);
				HttpContext.Current.Response.Cookies.Add(cookie);
			}
		}
	}
}