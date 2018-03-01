using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalaJuntas.Librerias.DL
{
	public class dlActivo
	{
		public string guardarActivo(string nombre,SqlConnection con)
		{
			string result = "";
			SqlCommand cmd = new SqlCommand("USP_CREAR_ACTIVO", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			cmd.Parameters.AddWithValue("@nombreActivo", nombre);
			SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleRow);
			if (drd != null)
			{
				while (drd.Read())
				{
					result = drd.GetInt32(0) + "|" + drd.GetString(1);
				}
				drd.Close();
			}

			return result;
		}

		public string ListarActivos(SqlConnection con)
		{
			string result = "";
			SqlCommand cmd = new SqlCommand("USP_LISTAR_ACTIVOS", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleResult);
			if (drd != null)
			{
				while (drd.Read())
				{
					result += drd.GetInt32(0) + "|" + drd.GetString(1) + "#";
				}
				drd.Close();
			}

			return result.Substring(0, result.Length - 1);
		}

		public string ActualizarActivo(int id, string nombre, SqlConnection con)
		{
			string result = "";
			SqlCommand cmd = new SqlCommand("USP_ACTUALIZAR_ACTIVO", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			cmd.Parameters.AddWithValue("@idActivo", id);
			cmd.Parameters.AddWithValue("@nombreActivo", nombre);
			SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleRow);
			if (drd != null)
			{
				while (drd.Read())
				{
					result = drd.GetInt32(0) + "|" + drd.GetString(1);
				}
				drd.Close();
			}

			return result;
		}

	}
}
