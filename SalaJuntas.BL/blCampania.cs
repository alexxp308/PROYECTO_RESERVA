using General.Librerias.CodigoUsuario;
using SalaJuntas.Librerias.DL;
using System;
using System.Data.SqlClient;
using System.Web;
using WebApplication1.Librerias.BL;

namespace SalaJuntas.BL
{
    public class blCampania:blGeneral
    {
        public string guardarCampania(string nombre, int idSede)
        {
            string result = "";
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                try
                {
                    con.Open();
                    dlCampania odlCampania = new dlCampania();
                    result = odlCampania.guardarCampania(nombre,idSede, con);
                }
                catch (Exception ex)
                {
                    string url = HttpContext.Current.Request.UrlReferrer.ToString();
                    Log.Error(logPath, "blCampania_guardarCampania", url, ex);
                }
            }
            return result;
        }

        public string listarCampanias(int idSede)
        {
            string result = "";
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                try
                {
                    con.Open();
                    dlCampania odlCampania = new dlCampania();
                    result = odlCampania.listarCampanias(idSede,con);
                }
                catch (Exception ex)
                {
                    string url = HttpContext.Current.Request.UrlReferrer.ToString();
                    Log.Error(logPath, "blCampania_listarCampanias", url, ex);
                }
            }
            return result;
        }

        public string actualizarCampania(int idSede, string nombre, int idCampania)
        {
            string result = "";
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                try
                {
                    con.Open();
                    dlCampania odlCampania = new dlCampania();
                    result = odlCampania.actualizarCampania(idSede, nombre,idCampania, con);
                }
                catch (Exception ex)
                {
                    string url = HttpContext.Current.Request.UrlReferrer.ToString();
                    Log.Error(logPath, "blCampania_actualizarCampania", url, ex);
                }
            }
            return result;
        }
    }
}
