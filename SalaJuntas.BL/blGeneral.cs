#region Using
using System.Configuration;
#endregion

namespace WebApplication1.Librerias.BL
{
    public class blGeneral
    {
		public static readonly string ConnectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
		public static readonly string logPath = ConfigurationManager.AppSettings["config:log"];
        public static readonly string CorreoUserName = ConfigurationManager.AppSettings["userNameCorreoGlobal"];
        public static readonly string CorreoPassword = ConfigurationManager.AppSettings["passwordCorreoGlobal"];
        public static readonly string smtp_Host = ConfigurationManager.AppSettings["smtp_Host"];
    }
}
