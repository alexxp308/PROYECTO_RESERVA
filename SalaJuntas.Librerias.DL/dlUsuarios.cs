using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalaJuntas.Librerias.DL
{
    public class dlUsuarios
    {
        public string listarUsuarios(string pais,int sedeId, SqlConnection con)
        {
            string result = "";
            SqlCommand cmd = new SqlCommand("USP_LISTAR_USUARIOS", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@PAIS", pais);
            cmd.Parameters.AddWithValue("@sedeId", sedeId);
            SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleResult);
            if (drd != null)
            {
                while (drd.Read())
                {
                    result += drd.GetInt32(0) + "|" + drd.GetString(1) + "|" + drd.GetString(2) + "|" + drd.GetString(3) + "|" + drd.GetString(4) + "|" + drd.GetString(5) + "|" + drd.GetInt32(6) + "|" + drd.GetBoolean(7) +"#";
                }
                drd.Close();
            }
            return result.Substring(0, result.Length - 1);
        }

        public string guardarUsuario(string username,string roles,string cargo,string nombreCompleto,string email,int idSede, SqlConnection con)
        {
            string result = "";
            SqlCommand cmd = new SqlCommand("USP_CREAR_USUARIO", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@username", username);
            cmd.Parameters.AddWithValue("@roles", roles);
            cmd.Parameters.AddWithValue("@cargo", cargo);
            cmd.Parameters.AddWithValue("@nombreCompleto", nombreCompleto);
            cmd.Parameters.AddWithValue("@email", email);
            cmd.Parameters.AddWithValue("@idSede", idSede);
            SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleRow);
            if (drd != null)
            {
                while (drd.Read())
                {
                    result = drd.GetInt32(0) + "|" + drd.GetString(1) + "|" + drd.GetString(2) + "|" + drd.GetString(3) + "|" + drd.GetString(4) + "|" + drd.GetString(5) + "|" + drd.GetInt32(6) + "|" + drd.GetBoolean(7);
                }
                drd.Close();
            }
            return result;
        }

        public int actualizarEstado(int iduser, bool estado, SqlConnection con)
        {
            int result = 0;
            SqlCommand cmd = new SqlCommand("USP_ACTUALIZAR_ESTADO_USUARIO", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@iduser", iduser);
            cmd.Parameters.AddWithValue("@estado", estado);
            result = cmd.ExecuteNonQuery();
            return result;
        }

        public int resetearContrasenia(int iduser, SqlConnection con)
        {
            int result = 0;
            SqlCommand cmd = new SqlCommand("USP_RESETEAR_CONTRASENIA", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@iduser", iduser);
            result = cmd.ExecuteNonQuery();
            return result;
        }

        public int cambiarContrasenia(int iduser,string password, SqlConnection con)
        {
            int result = 0;
            SqlCommand cmd = new SqlCommand("USP_CAMBIAR_CONTRASENIA", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@iduser", iduser);
            cmd.Parameters.AddWithValue("@password", password);
            result = cmd.ExecuteNonQuery();
            return result;
        }

        public string getUser(int iduser, SqlConnection con)
        {
            string result = "";
            SqlCommand cmd = new SqlCommand("USP_OBTENER_USUARIO", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@iduser", iduser);
            SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleRow);
            if (drd != null)
            {
                while (drd.Read())
                {
                    result = drd.GetString(0) + "|" + drd.GetString(1) + "|" + drd.GetString(2) + "|" + drd.GetString(3) + "|" + drd.GetString(4) + "|" + drd.GetString(5) + "|" + drd.GetString(6) + "|" + drd.GetBoolean(7) + "|" + drd.GetString(8) + "|" + drd.GetString(9) + "|" + drd.GetString(10) + "|" + drd.GetString(11);
                }
                drd.Close();
            }
            return result;
        }

        public string actualizarUsuario(int userId,string username, string roles, string cargo, string nombreCompleto, string email, int idSede, SqlConnection con)
        {
            string result = "";
            SqlCommand cmd = new SqlCommand("USP_ACTUALIZAR_USUARIO", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@userId", userId);
            cmd.Parameters.AddWithValue("@username", username);
            cmd.Parameters.AddWithValue("@roles", roles);
            cmd.Parameters.AddWithValue("@cargo", cargo);
            cmd.Parameters.AddWithValue("@nombreCompleto", nombreCompleto);
            cmd.Parameters.AddWithValue("@email", email);
            cmd.Parameters.AddWithValue("@idSede", idSede);
            SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleRow);
            if (drd != null)
            {
                while (drd.Read())
                {
                    result = drd.GetInt32(0) + "|" + drd.GetString(1) + "|" + drd.GetString(2) + "|" + drd.GetString(3) + "|" + drd.GetString(4) + "|" + drd.GetString(5) + "|" + drd.GetInt32(6);
                }
                drd.Close();
            }
            return result;
        }
    }
}
