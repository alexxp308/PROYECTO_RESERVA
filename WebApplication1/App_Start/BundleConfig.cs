using System.Web;
using System.Web.Optimization;

namespace WebApplication1
{
	public static class BundleConfig
	{
		// For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
						"~/Scripts/jquery-{version}.js"));

			bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
						"~/Scripts/jquery.validate*"));

			// Utilice la versión de desarrollo de Modernizr para desarrollar y obtener información. De este modo, estará
			// ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
			bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
						"~/Scripts/modernizr-*"));

			bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
					  "~/Scripts/bootstrap.js",
					  "~/Scripts/respond.js"));

			bundles.Add(new StyleBundle("~/Content/css").Include(
					  "~/Content/bootstrap.min.css",
					  "~/Content/font-awesome.min.css",
					  "~/Content/css/Site.css"));

			bundles.Add(new ScriptBundle("~/scripts/ProcesoReserva").Include("~/scripts/lib/fullCalendar/moment.min.js", "~/scripts/lib/fullCalendar/fullcalendar.min.js","~/scripts/lib/fullCalendar/es.js","~/scripts/ng/procesoReserva.js"));
			bundles.Add(new StyleBundle("~/styles/ProcesoReserva").Include("~/Content/css/ProcesoReserva.css", "~/Content/css/fullCalendar/fullcalendar.min.css"));
            bundles.Add(new StyleBundle("~/styles/MisReservas").Include("~/Content/css/MisReservas.css", "~/Content/css/select/dd.css"));
            bundles.Add(new ScriptBundle("~/scripts/Login").Include("~/Scripts/ng/Login.js","~/Content/css/vendor/popper.min.js", "~/Content/css/vendor/slect2.min.js", "~/Content/css/vendor/main.js"));
			bundles.Add(new ScriptBundle("~/scripts/SalaJuntas").Include("~/Scripts/ng/SalaJuntas.js"));
			bundles.Add(new ScriptBundle("~/scripts/Activos").Include("~/Scripts/ng/Activos.js"));
			bundles.Add(new StyleBundle("~/styles/SalaJuntas").Include("~/Content/css/SalaJuntas.css"));
			bundles.Add(new ScriptBundle("~/scripts/Sedes").Include("~/Scripts/ng/Sedes.js"));
            bundles.Add(new ScriptBundle("~/scripts/Usuarios").Include("~/Scripts/ng/usuarios.js"));
            bundles.Add(new ScriptBundle("~/scripts/MisReservas").Include("~/scripts/lib/fullCalendar/moment.min.js", "~/scripts/lib/fullCalendar/fullcalendar.min.js", "~/scripts/lib/fullCalendar/es.js", "~/scripts/lib/select/jquery.dd.min.js", "~/Scripts/ng/misReservas.js"));
            bundles.Add(new ScriptBundle("~/scripts/Campañas").Include("~/Scripts/ng/Campañas.js"));
            bundles.Add(new ScriptBundle("~/scripts/Reportes").Include("~/Scripts/ng/Reportes.js"));
            BundleTable.EnableOptimizations = true;
        }
	}
}
