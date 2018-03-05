using SalaJuntas.Librerias.EL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalaJuntas.Librerias.DL
{
    public class dlReserva
    {
        public List<elReserva> reservaXsalaEvents(int salaId, string fhinicio, string fhfin, SqlConnection con)
        {
            List<elReserva> lelReserva = null;
            elReserva oelReserva = null;
            SqlCommand cmd = new SqlCommand("USP_OBTENER_RESERVAXSALA", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@idSala", salaId);
            cmd.Parameters.AddWithValue("@fhinicio", fhinicio);
            cmd.Parameters.AddWithValue("@fhfin", fhfin);
            SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleResult);
            if (drd != null)
            {
                lelReserva = new List<elReserva>();
                while (drd.Read())
                {
                    oelReserva = new elReserva();
                    oelReserva.idReserva = drd.GetInt32(0);
                    oelReserva.estadoReserva = drd.GetInt32(1);
                    oelReserva.idSala = drd.GetInt32(2);
                    oelReserva.descripcion = drd.GetString(3);
                    oelReserva.fhCreacion = drd.GetString(4);
                    oelReserva.fhinicio = drd.GetString(5);
                    oelReserva.fhfin = drd.GetString(6);
                    oelReserva.idCreator = drd.GetInt32(7);
                    oelReserva.UserNameCreator = drd.GetString(8);
                    oelReserva.nombreCompletoCreator = drd.GetString(9);
                    oelReserva.idCharge = drd.GetInt32(10);
                    oelReserva.UserNameCharge = drd.GetString(11);
                    oelReserva.nombreCompletoCharge = drd.GetString(12);
                    oelReserva.checkListInicial = drd.GetString(13);
                    oelReserva.fhCheckInicial = drd.GetString(14);
                    oelReserva.checkListFinal = drd.GetString(15);
                    oelReserva.fhCheckFinal = drd.GetString(16);

                    lelReserva.Add(oelReserva);
                }
                drd.Close();
            }

            return lelReserva;
        }

        public List<elReserva> obtenerReservaxUsuario(int salaId, int userId, int idSede,int estado, SqlConnection con)
        {
            List<elReserva> lelReserva = null;
            elReserva oelReserva = null;
            SqlCommand cmd = new SqlCommand("USP_OBTENER_RESERVASXUSUARIO", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@idSala", salaId);
            cmd.Parameters.AddWithValue("@userId", userId);
            cmd.Parameters.AddWithValue("@idSede", idSede);
            cmd.Parameters.AddWithValue("@estado", estado);
            SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleResult);
            if (drd != null)
            {
                lelReserva = new List<elReserva>();
                while (drd.Read())
                {
                    oelReserva = new elReserva();
                    oelReserva.idReserva = drd.GetInt32(0);
                    oelReserva.estadoReserva = drd.GetInt32(1);
                    oelReserva.idSala = drd.GetInt32(2);
                    oelReserva.descripcion = drd.GetString(3);
                    oelReserva.fhCreacion = drd.GetString(4);
                    oelReserva.fhinicio = drd.GetString(5);
                    oelReserva.fhfin = drd.GetString(6);
                    oelReserva.idCreator = drd.GetInt32(7);
                    oelReserva.UserNameCreator = drd.GetString(8);
                    oelReserva.nombreCompletoCreator = drd.GetString(9);
                    oelReserva.idCharge = drd.GetInt32(10);
                    oelReserva.UserNameCharge = drd.GetString(11);
                    oelReserva.nombreCompletoCharge = drd.GetString(12);
                    oelReserva.checkListInicial = drd.GetString(13);
                    oelReserva.fhCheckInicial = drd.GetString(14);
                    oelReserva.checkListFinal = drd.GetString(15);
                    oelReserva.fhCheckFinal = drd.GetString(16);

                    lelReserva.Add(oelReserva);
                }
                drd.Close();
            }

            return lelReserva;
        }

        public int guardarReserva(List<elReserva> lelreserva, SqlConnection con)
        {
            int result = 0;
            SqlCommand cmd = null;
            for (int i = 0; i < lelreserva.Count; i++)
            {
                cmd = new SqlCommand("USP_GUARDAR_RESERVA", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = 1800;
                cmd.Parameters.AddWithValue("@idSala", lelreserva[i].idSala);
                cmd.Parameters.AddWithValue("@descripcion", lelreserva[i].descripcion);
                cmd.Parameters.AddWithValue("@fhinicio", lelreserva[i].fhinicio);
                cmd.Parameters.AddWithValue("@fhfin", lelreserva[i].fhfin);
                cmd.Parameters.AddWithValue("@idCreator", lelreserva[i].idCreator);
                cmd.Parameters.AddWithValue("@UserNameCreator", lelreserva[i].UserNameCreator);
                cmd.Parameters.AddWithValue("@nombreCompletoCreator", lelreserva[i].nombreCompletoCreator);
                cmd.Parameters.AddWithValue("@idCharge", lelreserva[i].idCharge);
                cmd.Parameters.AddWithValue("@UserNameCharge", lelreserva[i].UserNameCharge);
                cmd.Parameters.AddWithValue("@nombreCompletoCharge", lelreserva[i].nombreCompletoCharge);
                result += cmd.ExecuteNonQuery();
            }
            return result;
        }

        public int actualizarReserva(List<elReserva> lelreserva, SqlConnection con)
        {
            int result = 0;
            SqlCommand cmd = null;
            for (int i = 0; i < lelreserva.Count; i++)
            {
                cmd = new SqlCommand("USP_ACTUALIZAR_RESERVA", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = 1800;
                cmd.Parameters.AddWithValue("@idReserva", lelreserva[i].idReserva);
                cmd.Parameters.AddWithValue("@descripcion", lelreserva[i].descripcion);
                cmd.Parameters.AddWithValue("@fhinicio", lelreserva[i].fhinicio);
                cmd.Parameters.AddWithValue("@fhfin", lelreserva[i].fhfin);
                result += cmd.ExecuteNonQuery();
            }
            return result;
        }

        public string obtenerCorreos(int idSala,int idCreator, SqlConnection con)
        {
            string result = "";
            SqlCommand cmd = new SqlCommand("USP_OBTENER_CORREOS", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@idSala", idSala);
            cmd.Parameters.AddWithValue("@idCreator", idCreator);
            SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleRow);
            if (drd != null)
            {
                while (drd.Read())
                {
                    result = drd.GetString(0) + "|" + drd.GetString(1) + "|" + drd.GetString(2) + "|" + drd.GetString(3) + "|" + drd.GetString(4) + "|" + drd.GetString(5) + "|" + drd.GetString(6);
                }
                drd.Close();
            }
            return result;
        }

        public int eliminarReserva(int idReserva, SqlConnection con)
        {
            int result = 0;
            SqlCommand cmd = new SqlCommand("USP_ELIMINAR_RESERVA", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@idReserva", idReserva);
            result = cmd.ExecuteNonQuery();
            return result;
        }

        public string CheckList(int idReserva, int iniFin, string checkList, SqlConnection con)
        {
            string result = "";
            SqlCommand cmd = new SqlCommand("USP_GUARDAR_CHECKLIST", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@idReserva", idReserva);
            cmd.Parameters.AddWithValue("@iniFin", iniFin);
            cmd.Parameters.AddWithValue("@checkList", checkList);
            SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleRow);
            if (drd != null)
            {
                while (drd.Read())
                {
                    result = drd.GetString(0) + "|" + drd.GetString(1) ;
                }
                drd.Close();
            }

            return result;
        }
    }
}
