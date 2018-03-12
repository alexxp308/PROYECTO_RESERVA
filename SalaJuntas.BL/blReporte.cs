using General.Librerias.CodigoUsuario;
using SalaJuntas.Librerias.DL;
using System;
using System.Data.SqlClient;
using System.Web;
using WebApplication1.Librerias.BL;

namespace SalaJuntas.BL
{
    public class blReporte:blGeneral
    {
        public string reporteDetallado(int sedeId, int salaId, string fechaI, string fechaF)
        {
            string result = "";
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                try
                {
                    con.Open();
                    dlReporte odlReporte = new dlReporte();
                    result = odlReporte.reporteDetallado(sedeId, salaId, fechaI, fechaF, con);
                }
                catch (Exception ex)
                {
                    string url = HttpContext.Current.Request.Url.ToString();
                    Log.Error(logPath, "blReporte_reporteDetallado", url, ex);
                }
            }
            return result;
        }

        public string reporteOcupacion(int sedeId, string fechaI, string fechaF)
        {
            string result = "";
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                try
                {
                    con.Open();
                    dlReporte odlReporte = new dlReporte();
                    result = odlReporte.reporteOcupacion(sedeId, fechaI, fechaF, con);
                }
                catch (Exception ex)
                {
                    string url = HttpContext.Current.Request.Url.ToString();
                    Log.Error(logPath, "blReporte_reporteOcupacion", url, ex);
                }
            }
            return result;
        }

        public string reporteResumen(int sedeId, string fechaI, string fechaF)
        {
            string result = "";
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                try
                {
                    con.Open();
                    dlReporte odlReporte = new dlReporte();
                    result = odlReporte.reporteResumen(sedeId, fechaI, fechaF, con);
                }
                catch (Exception ex)
                {
                    string url = HttpContext.Current.Request.Url.ToString();
                    Log.Error(logPath, "blReporte_reporteResumen", url, ex);
                }
            }
            return result;
        }
    }
}
