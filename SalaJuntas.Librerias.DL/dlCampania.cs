using System.Data;
using System.Data.SqlClient;

namespace SalaJuntas.Librerias.DL
{
    public class dlCampania
    {
        public string guardarCampania(string nombre,int idSede, SqlConnection con)
        {
            string result = "";
            SqlCommand cmd = new SqlCommand("USP_CREAR_CAMPANIA", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@nombreCampania", nombre);
            cmd.Parameters.AddWithValue("@idSede", idSede);
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

        public string listarCampanias(int idSede,SqlConnection con)
        {
            string result = "";
            SqlCommand cmd = new SqlCommand("USP_LISTAR_CAMPANIAS", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@idSede", idSede);
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

        public string actualizarCampania(int idSede, string nombre,int idCampania, SqlConnection con)
        {
            string result = "";
            SqlCommand cmd = new SqlCommand("USP_ACTUALIZAR_CAMPANIA", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@nombreCampania", nombre);
            cmd.Parameters.AddWithValue("@idSede", idSede);
            cmd.Parameters.AddWithValue("@idCampania", idCampania);
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
