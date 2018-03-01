using General.Librerias.CodigoUsuario;
using SalaJuntas.Librerias.DL;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using WebApplication1.Librerias.BL;

namespace SalaJuntas.BL
{
	public class blActivo:blGeneral
	{
		public string guardarActivo(string nombre)
		{
			string result = "";
			using (SqlConnection con = new SqlConnection(ConnectionString))
			{
				try
				{
					con.Open();
					dlActivo odlActivo = new dlActivo();
					result = odlActivo.guardarActivo(nombre,con);
				}
				catch (Exception ex)
				{
					string url = HttpContext.Current.Request.UrlReferrer.ToString();
					Log.Error(logPath, "blActivo_guardarActivo", url, ex);
				}
			}
			return result;
		}

		public string ListarActivos()
		{
			string result = "";
			using (SqlConnection con = new SqlConnection(ConnectionString))
			{
				try
				{
					con.Open();
					dlActivo odlActivo = new dlActivo();
					result = odlActivo.ListarActivos(con);
				}
				catch (Exception ex)
				{
					string url = HttpContext.Current.Request.UrlReferrer.ToString();
					Log.Error(logPath, "blActivo_listarActivo", url, ex);
				}
			}
			return result;
		}

		public string ActualizarActivo(int id,string nombre)
		{
			string result = "";
			using (SqlConnection con = new SqlConnection(ConnectionString))
			{
				try
				{
					con.Open();
					dlActivo odlActivo = new dlActivo();
					result = odlActivo.ActualizarActivo(id,nombre,con);
				}
				catch (Exception ex)
				{
					string url = HttpContext.Current.Request.UrlReferrer.ToString();
					Log.Error(logPath, "blActivo_ActualizarActivo", url, ex);
				}
			}
			return result;
		}
	}
}
