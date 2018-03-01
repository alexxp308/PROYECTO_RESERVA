using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalaJuntas.Librerias.DL
{
	public class dlSala
	{
		public string guardarSala(string nombre, string horario, string activos, string ubicacion, int idSede,string tipo, SqlConnection con)
		{
			string result = "";
			SqlCommand cmd = new SqlCommand("USP_CREAR_SALA", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			cmd.Parameters.AddWithValue("@nombre", nombre);
			cmd.Parameters.AddWithValue("@horario", horario);
			cmd.Parameters.AddWithValue("@activos", activos);
			cmd.Parameters.AddWithValue("@ubicacion", ubicacion);
			cmd.Parameters.AddWithValue("@tipo", tipo);
			cmd.Parameters.AddWithValue("@idSede", idSede);
			SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleRow);
			if (drd != null)
			{
				while (drd.Read())
				{
					result = drd.GetInt32(0) + "|" + drd.GetString(1) +"|" + drd.GetBoolean(2) + "|" + drd.GetString(3) + "|" + drd.GetString(4) + "|" + drd.GetString(5) +"|"+ drd.GetString(6) + "|"+drd.GetInt32(7);
				}
				drd.Close();
			}

			return result;
		}

		public string ListarSalas(string pais,string tipo,SqlConnection con)
		{
			string result = "";
			SqlCommand cmd = new SqlCommand("USP_LISTAR_SALA", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			cmd.Parameters.AddWithValue("@pais", pais);
			cmd.Parameters.AddWithValue("@tipo", tipo);
			SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleResult);
			if (drd != null)
			{
				while (drd.Read())
				{
					result += drd.GetInt32(0) + "|" + drd.GetString(1) + "|" + drd.GetBoolean(2) + "|" + drd.GetString(3) + "|" + drd.GetString(4) + "|" + drd.GetString(5) + "|" + drd.GetString(6) + "|" + drd.GetInt32(7) + "#";
				}
				drd.Close();
			}

			return result.Substring(0, result.Length - 1);
		}

		public int ActualizarEstado(int id,bool estado,SqlConnection con)
		{
			int result = 0;
			SqlCommand cmd = new SqlCommand("USP_ACTUALIZAR_ESTADO_SALA", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			cmd.Parameters.AddWithValue("@idSala", id);
			cmd.Parameters.AddWithValue("@estado", estado);
			result = cmd.ExecuteNonQuery();
			return result;
		}
		
		public string ActualizarSala(int id,string nombre, string horario, string activos, string ubicacion, int idSede,string tipo, SqlConnection con)
		{
			string result = "";
			SqlCommand cmd = new SqlCommand("USP_ACTUALIZAR_SALA", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			cmd.Parameters.AddWithValue("@idSala", id);
			cmd.Parameters.AddWithValue("@nombre", nombre);
			cmd.Parameters.AddWithValue("@horario", horario);
			cmd.Parameters.AddWithValue("@activos", activos);
			cmd.Parameters.AddWithValue("@ubicacion", ubicacion);
			cmd.Parameters.AddWithValue("@idSede", idSede);
			cmd.Parameters.AddWithValue("@tipo", tipo);
			SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleRow);
			if (drd != null)
			{
				while (drd.Read())
				{
					result = drd.GetInt32(0) + "|" + drd.GetString(1) + "|" + drd.GetBoolean(2) + "|" + drd.GetString(3) + "|" + drd.GetString(4) + "|" + drd.GetString(5) + "|" + drd.GetString(6) + "|" + drd.GetInt32(7);
				}
				drd.Close();
			}

			return result;
		}

		public string obtenerSala(string tipo,int idSede,string ubicacion, SqlConnection con)
		{
			string result = "";
			SqlCommand cmd = new SqlCommand("USP_OBTENER_SALA", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			cmd.Parameters.AddWithValue("@tipo", tipo);
            cmd.Parameters.AddWithValue("@idSede", idSede);
            cmd.Parameters.AddWithValue("@ubicacion", ubicacion);
            SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleRow);
			if (drd != null)
			{
				while (drd.Read())
				{
					result += drd.GetInt32(0) + "|" + drd.GetString(1) + "|" + drd.GetString(2) + "|" + drd.GetString(3) + "|" + drd.GetString(4) + "|" + drd.GetInt32(5) + "|" + drd.GetString(6) + "|" + drd.GetString(7) + "#";
				}
				drd.Close();
			}

			return result.Substring(0, result.Length - 1);
		}

		public int EliminarSala(int id, SqlConnection con)
		{
			int result = 0;
			SqlCommand cmd = new SqlCommand("USP_ELIMINAR_SALA", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			cmd.Parameters.AddWithValue("@idSala", id);
			result = cmd.ExecuteNonQuery();
			return result;
		}

		public string listarSalasxSede(int sede, SqlConnection con)
		{
			string result = "";
			SqlCommand cmd = new SqlCommand("USP_LISTAR_SALASXSEDE", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			cmd.Parameters.AddWithValue("@SEDE", sede);
			SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleResult);
			if (drd != null)
			{
				while (drd.Read())
				{
					result += drd.GetInt32(0) + "|" + drd.GetString(1) + "|" + drd.GetString(2) + "|" + drd.GetString(3) + "|" + drd.GetString(4) +"|" + drd.GetString(5) + "#";
				}
				drd.Close();
			}

			return result.Substring(0, result.Length - 1);
		}
	}
}
