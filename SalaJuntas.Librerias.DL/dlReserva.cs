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
                    oelReserva.idSala = drd.GetInt32(1);
                    oelReserva.descripcion = drd.GetString(2);
                    oelReserva.fhinicio = drd.GetString(3);
                    oelReserva.fhfin = drd.GetString(4);
                    oelReserva.duracion = drd.GetString(5);
                    oelReserva.idCreator = drd.GetInt32(6);
                    oelReserva.UserNameCreator = drd.GetString(7);
                    oelReserva.idCharge = drd.GetInt32(9);
                    oelReserva.UserNameCharge = drd.GetString(10);
                    oelReserva.checkList = drd.GetString(11);

                    lelReserva.Add(oelReserva);
                }
                drd.Close();
            }

            return lelReserva;
        }

        public List<elReserva> obtenerReservaxUsuario(int salaId, int userId, SqlConnection con)
        {
            List<elReserva> lelReserva = null;
            elReserva oelReserva = null;
            SqlCommand cmd = new SqlCommand("USP_OBTENER_RESERVASXUSUARIO", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@idSala", salaId);
            cmd.Parameters.AddWithValue("@userId", userId);
            SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleResult);
            if (drd != null)
            {
                lelReserva = new List<elReserva>();
                while (drd.Read())
                {
                    oelReserva = new elReserva();
                    oelReserva.idReserva = drd.GetInt32(0);
                    oelReserva.idSala = drd.GetInt32(1);
                    oelReserva.descripcion = drd.GetString(2);
                    oelReserva.fhinicio = drd.GetString(3);
                    oelReserva.fhfin = drd.GetString(4);
                    oelReserva.duracion = drd.GetString(5);
                    oelReserva.idCreator = drd.GetInt32(6);
                    oelReserva.UserNameCreator = drd.GetString(7);
                    oelReserva.nombreCompletoCreator = drd.GetString(8);
                    oelReserva.idCharge = drd.GetInt32(9);
                    oelReserva.UserNameCharge = drd.GetString(10);
                    oelReserva.nombreCompletoCharge = drd.GetString(11);
                    oelReserva.checkList = drd.GetString(12);

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

        public string obtenerCorreos(int idSala, SqlConnection con)
        {
            string result = "";
            SqlCommand cmd = new SqlCommand("USP_OBTENER_CORREOS", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@idSala", idSala);
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
    }
}
