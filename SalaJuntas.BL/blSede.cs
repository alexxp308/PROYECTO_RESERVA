using General.Librerias.CodigoUsuario;
using SalaJuntas.Librerias.DL;
using System;
using System.Data.SqlClient;
using System.Web;
using WebApplication1.Librerias.BL;

namespace SalaJuntas.BL
{
	public class blSede:blGeneral
	{
		public string guardarSede(string nombre,string pais,int torres,string pisos,string activos,string service)
		{
			string result = "";
			using (SqlConnection con = new SqlConnection(ConnectionString))
			{
				try
				{
					con.Open();
					dlSede odlSede = new dlSede();
					result = odlSede.guardarSede(nombre, pais,torres,pisos,activos,service,con);
				}
				catch (Exception ex)
				{
					string url = HttpContext.Current.Request.UrlReferrer.ToString();
					Log.Error(logPath, "blSede_guardarSede", url, ex);
				}
			}
			return result;
		}

		public string listarSedes()
		{
			string result = "";
			using (SqlConnection con = new SqlConnection(ConnectionString))
			{
				try
				{
					con.Open();
					dlSede odlSede = new dlSede();
					result = odlSede.listarSedes(con);
				}
				catch (Exception ex)
				{
					string url = HttpContext.Current.Request.UrlReferrer.ToString();
					Log.Error(logPath, "blSede_ListarSedes", url, ex);
				}
			}
			return result;
		}

		public string Actualizar(int id, string nombre, string pais, int torres, string pisos,string activos,string service)
		{
			string result = "";
			using (SqlConnection con = new SqlConnection(ConnectionString))
			{
				try
				{
					con.Open();
					dlSede odlSede = new dlSede();
					result = odlSede.Actualizar(id,nombre,pais,torres,pisos,activos,service,con);
				}
				catch (Exception ex)
				{
					string url = HttpContext.Current.Request.UrlReferrer.ToString();
					Log.Error(logPath, "blSede_Actualizar", url, ex);
				}
			}
			return result;
		}

		public int Eliminar(int id)
		{
			int result = 0;
			using (SqlConnection con = new SqlConnection(ConnectionString))
			{
				try
				{
					con.Open();
					dlSede odlSede = new dlSede();
					result = odlSede.Eliminar(id, con);
				}
				catch (Exception ex)
				{
					string url = HttpContext.Current.Request.UrlReferrer.ToString();
					Log.Error(logPath, "blSede_Actualizar", url, ex);
				}
			}
			return result;
		}

        public string getSede(int id)
        {
            string result = "";
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                try
                {
                    con.Open();
                    dlSede odlSede = new dlSede();
                    result = odlSede.getSede(id, con);
                }
                catch (Exception ex)
                {
                    string url = HttpContext.Current.Request.UrlReferrer.ToString();
                    Log.Error(logPath, "blSede_getSede", url, ex);
                }
            }
            return result;
        }

        public string listarSedesxPais(string pais)
		{
			string result = "";
			using (SqlConnection con = new SqlConnection(ConnectionString))
			{
				try
				{
					con.Open();
					dlSede odlSede = new dlSede();
					result = odlSede.listarSedesxPais(pais, con);
				}
				catch (Exception ex)
				{
					string url = HttpContext.Current.Request.Url.ToString();
					Log.Error(logPath, "blSede_guardarSede", url, ex);
				}
			}
			return result;
		}
	}
}
