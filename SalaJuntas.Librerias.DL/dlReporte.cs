using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalaJuntas.Librerias.DL
{
    public class dlReporte
    {
        public string reporteDetallado(int sedeId, int salaId, string fechaI, string fechaF, SqlConnection con)
        {
            string result = "";
            SqlCommand cmd = new SqlCommand("USP_REPORTE_DETALLADO", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1800;
            cmd.Parameters.AddWithValue("@sedeId", sedeId);
            cmd.Parameters.AddWithValue("@salaId", salaId);
            cmd.Parameters.AddWithValue("@fechaI", fechaI+" 00:00");
            cmd.Parameters.AddWithValue("@fechaF", fechaF+" 23:59");
            SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleResult);
            if (drd != null)
            {
                while (drd.Read())
                {
                    result += drd.GetString(0) + "|" + drd.GetString(1)+ "|" + drd.GetString(2) + "|" + drd.GetString(3) + "|" + drd.GetString(4) + "|" + drd.GetString(5) + "|" + drd.GetInt32(6) + "|" + drd.GetString(7) + "|" + drd.GetString(8) + "|" + drd.GetString(9) + "|" + drd.GetInt32(10) + "|" + drd.GetString(11) + "|" + drd.GetString(12) + "|" + drd.GetString(13) + "|" + drd.GetInt32(14) + "#";
                }
                drd.Close();
            }

            return result.Substring(0, result.Length - 1);
        }
    }
}
