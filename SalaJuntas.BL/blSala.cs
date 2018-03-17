using General.Librerias.CodigoUsuario;
using SalaJuntas.Librerias.DL;
using System;
using System.Data.SqlClient;
using System.Web;
using WebApplication1.Librerias.BL;

namespace SalaJuntas.BL
{
	public class blSala:blGeneral
	{
		public string guardarSala(string nombre, string horario, string activos, string ubicacion, int idSede,string tipo)
		{
			string result = "";
			using (SqlConnection con = new SqlConnection(ConnectionString))
			{
				try
				{
					con.Open();
					dlSala odlSala = new dlSala();
					result = odlSala.guardarSala(nombre,horario,activos,ubicacion,idSede,tipo,con);
				}
				catch (Exception ex)
				{
					string url = HttpContext.Current.Request.Url.ToString();
					Log.Error(logPath, "blSala_guardarSala", url, ex);
				}
			}
			return result;
		}

		public string ListarSalas(string pais,string tipo,int sedeId)
		{
			string result = "";
			using (SqlConnection con = new SqlConnection(ConnectionString))
			{
				try
				{
					con.Open();
					dlSala odlSala = new dlSala();
					result = odlSala.ListarSalas(pais,tipo,sedeId,con);
				}
				catch (Exception ex)
				{
					string url = HttpContext.Current.Request.Url.ToString();
					Log.Error(logPath, "blSala_ListarSalas", url, ex);
				}
			}
			return result;
		}

		public int ActualizarEstado(int id,bool estado)
		{
			int result = 0;
			using (SqlConnection con = new SqlConnection(ConnectionString))
			{
				try
				{
					con.Open();
					dlSala odlSala = new dlSala();
					result = odlSala.ActualizarEstado(id,estado,con);
				}
				catch (Exception ex)
				{
					string url = HttpContext.Current.Request.Url.ToString();
					Log.Error(logPath, "blSala_ListarSalas", url, ex);
				}
			}
			return result;
		}

		public string ActualizarSala(int id,string nombre, string horario, string activos, string ubicacion, int idSede,string tipo)
		{
			string result = "";
			using (SqlConnection con = new SqlConnection(ConnectionString))
			{
				try
				{
					con.Open();
					dlSala odlSala = new dlSala();
					result = odlSala.ActualizarSala(id,nombre, horario, activos, ubicacion, idSede,tipo,con);
				}
				catch (Exception ex)
				{
					string url = HttpContext.Current.Request.Url.ToString();
					Log.Error(logPath, "blSala_ActualizarSala", url, ex);
				}
			}
			return result;
		}
		
		public int EliminarSala(int id)
		{
			int result = 0;
			using (SqlConnection con = new SqlConnection(ConnectionString))
			{
				try
				{
					con.Open();
					dlSala odlSala = new dlSala();
					result = odlSala.EliminarSala(id, con);
				}
				catch (Exception ex)
				{
					string url = HttpContext.Current.Request.Url.ToString();
					Log.Error(logPath, "blSala_ActualizarSala", url, ex);
				}
			}
			return result;
		}

		public string listarSalasxSede(int sede)
		{
			string result = "";
			using (SqlConnection con = new SqlConnection(ConnectionString))
			{
				try
				{
					con.Open();
					dlSala odlSala = new dlSala();
					result = odlSala.listarSalasxSede(sede, con);
				}
				catch (Exception ex)
				{
					string url = HttpContext.Current.Request.Url.ToString();
					Log.Error(logPath, "blSede_listarSalasxSede", url, ex);
				}
			}
			return result;
		}

		public string obtenerSala(string tipo,int idSede,string ubicacion)
		{
			string result = "";
			using (SqlConnection con = new SqlConnection(ConnectionString))
			{
				try
				{
					con.Open();
					dlSala odlSala = new dlSala();
					result = odlSala.obtenerSala(tipo, idSede,ubicacion, con);
				}
				catch (Exception ex)
				{
					string url = HttpContext.Current.Request.Url.ToString();
					Log.Error(logPath, "blSala_obtenerSala", url, ex);
				}
			}
			return result;
		}
	}
}
