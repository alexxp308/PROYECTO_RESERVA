using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalaJuntas.Librerias.DL
{
	public class dlSede
	{
		public string guardarSede(string nombre,string pais,int torres,string pisos,string activos, SqlConnection con)
		{
			string result = "";
			SqlCommand cmd = new SqlCommand("USP_CREAR_SEDE", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			cmd.Parameters.AddWithValue("@nombreSede", nombre);
			cmd.Parameters.AddWithValue("@torres", torres);
			cmd.Parameters.AddWithValue("@pisos", pisos);
			cmd.Parameters.AddWithValue("@PAIS", pais);
            cmd.Parameters.AddWithValue("@activos", activos);
            SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleRow);
			if (drd != null)
			{
				while (drd.Read())
				{
					result = drd.GetInt32(0) + "|" + drd.GetString(1) + "|" + drd.GetInt32(2) + "|" + drd.GetString(3) + "|" + drd.GetString(4) + "|" + drd.GetString(5);
				}
				drd.Close();
			}

			return result;
		}

		public string listarSedes(SqlConnection con)
		{
			string result = "";
			SqlCommand cmd = new SqlCommand("USP_LISTAR_SEDES", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleResult);
			if (drd != null)
			{
				while (drd.Read())
				{
					result += drd.GetInt32(0) + "|" + drd.GetString(1) + "|" + drd.GetInt32(2) + "|" + drd.GetString(3) + "|" + drd.GetString(4) + "|" + drd.GetString(5) + ";";
				}
				drd.Close();
			}

			return result.Substring(0,result.Length-1);
		}

		public string Actualizar(int id,string nombre,string pais,int torres,string pisos,string activos,SqlConnection con)
		{
			string result = "";
			SqlCommand cmd = new SqlCommand("USP_ACTUALIZAR_SEDE", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			cmd.Parameters.AddWithValue("@idSede", id);
			cmd.Parameters.AddWithValue("@nombreSede", nombre);
			cmd.Parameters.AddWithValue("@torres", torres);
			cmd.Parameters.AddWithValue("@pisos", pisos);
			cmd.Parameters.AddWithValue("@PAIS", pais);
            cmd.Parameters.AddWithValue("@activos", activos);
            SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleRow);
			if (drd != null)
			{
				while (drd.Read())
				{
					result = drd.GetInt32(0) + "|" + drd.GetString(1) + "|" + drd.GetInt32(2) + "|" + drd.GetString(3) + "|" + drd.GetString(4) + "|" + drd.GetString(5);
				}
				drd.Close();
			}

			return result;
		}

		public int Eliminar(int id, SqlConnection con)
		{
			int result = 0;
			SqlCommand cmd = new SqlCommand("USP_ELIMINAR_SEDE", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			cmd.Parameters.AddWithValue("@idSede", id);
			result = cmd.ExecuteNonQuery();
			return result;
		}

        public string getSede(int idSede, SqlConnection con)
        {
            string result = "";
            SqlCommand cmd = new SqlCommand("USP_OBTENER_SEDE", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@idSede", idSede);
            SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleRow);
            if (drd != null)
            {
                while (drd.Read())
                {
                    result += drd.GetInt32(0) + "|" + drd.GetString(1);
                }
                drd.Close();
            }

            return result;
        }

        public string listarSedesxPais(string pais, SqlConnection con)
		{
			string result = "";
			SqlCommand cmd = new SqlCommand("USP_LISTAR_SEDEXPAIS", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			cmd.Parameters.AddWithValue("@PAIS", pais);
			SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleResult);
			if (drd != null)
			{
				while (drd.Read())
				{
					result += drd.GetInt32(0) + "|" + drd.GetString(1) + "|" + drd.GetInt32(2) + "|" + drd.GetString(3) + "|" + string.Join(",",drd.GetString(4)) + ";";
				}
				drd.Close();
			}

			return result.Substring(0, result.Length - 1);
		}
	}
}
