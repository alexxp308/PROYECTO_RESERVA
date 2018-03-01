using General.Librerias.CodigoUsuario;
using SalaJuntas.Librerias.DL;
using SalaJuntas.Librerias.EL;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using WebApplication1.Librerias.BL;

namespace SalaJuntas.BL
{
    public class blReserva : blGeneral
    {
        public List<elReserva> reservaXsalaEvents(int salaId, string fhinicio, string fhfin)
        {
            List<elReserva> lelReserva = null;
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                try
                {
                    lelReserva = new List<elReserva>();
                    con.Open();
                    dlReserva odlReserva = new dlReserva();
                    lelReserva = odlReserva.reservaXsalaEvents(salaId, fhinicio, fhfin, con);
                }
                catch (Exception ex)
                {
                    string url = HttpContext.Current.Request.Url.ToString();
                    Log.Error(logPath, "blReserva_reservaXsalaEvents", url, ex);
                }
            }
            return lelReserva;
        }

        public List<elReserva> obtenerReservaxUsuario(int salaId, int userId)
        {
            List<elReserva> lelReserva = null;
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                try
                {
                    lelReserva = new List<elReserva>();
                    con.Open();
                    dlReserva odlReserva = new dlReserva();
                    lelReserva = odlReserva.obtenerReservaxUsuario(salaId, userId, con);
                }
                catch (Exception ex)
                {
                    string url = HttpContext.Current.Request.Url.ToString();
                    Log.Error(logPath, "blReserva_reservaXsalaEvents", url, ex);
                }
            }
            return lelReserva;
        }

        public int guardarReserva(List<elReserva> lelReserva)
        {
            int result = 0;
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                try
                {
                    con.Open();
                    dlReserva odlReserva = new dlReserva();
                    result = odlReserva.guardarReserva(lelReserva, con);
                }
                catch (Exception ex)
                {
                    string url = HttpContext.Current.Request.Url.ToString();
                    Log.Error(logPath, "blReserva_guardarReserva", url, ex);
                }
            }
            return result;
        }

        public int EnviarCorreo(List<elReserva> lelReserva)
        {
            int result = 0;
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                try
                {
                    con.Open();
                    string correos = "";
                    dlReserva odlReserva = new dlReserva();
                    correos = odlReserva.obtenerCorreos(lelReserva[0].idSala, con);
                    result = EnviarCorreo(lelReserva, correos);
                }
                catch (Exception ex)
                {
                    string url = HttpContext.Current.Request.Url.ToString();
                    Log.Error(logPath, "blReserva_EnviarCorreo", url, ex);
                }
            }
            return result;
        }

        public int EnviarCorreo(List<elReserva> lelReserva, string correos)
        {
            string[] param = correos.Split('|');
            int result = 0;
            string mensaje = "<br><p style='font-size:20px;font-weight:bold;'>.: RESERVA DE SALAS :.</p>";
            mensaje += "<table>";
            mensaje+= "<tr><td style='font-weight:bold;'>Pais:</td><td>" + param[4] + "</td><td style='font-weight:bold;'>Solicitante:</td><td>" + lelReserva[0].nombreCompletoCreator + "</td></tr>";
            mensaje += "<tr><td style='font-weight:bold;'>Sede:</td><td>" + param[3] + "</td><td style='font-weight:bold;'>Sala de reserva:</td><td>" + param[0]+" - "+ param[1] + "</td></tr>";
            mensaje += "<tr><td style='font-weight:bold;'>Administrador \n del centro:</td><td>" + lelReserva[0].nombreCompletoCharge + "</td><td style='font-weight:bold;'>Ubicación:</td><td>" + param[2] + "</td></tr>";
            mensaje += "</table>";
            mensaje += "************************************************************************************";
            mensaje += "<p style='font-size:20px;font-weight:bold;'>Activos:</p>";
            string Jsonactivos = param[5].Replace("{","").Replace("}","").Replace("\"","");
            string[] keyvalue = Jsonactivos.Split(',');
            string[] activos = null;
            string msg = "";
            for(int j=0;j< keyvalue.Length; j++)
            {
                activos = keyvalue[j].Split(':');
                msg += "<tr><td>" + activos[0] + "</td><td>" + activos[1] + "</td></tr>";
            }
            mensaje += "<table><thead><tr><th>Activo</th><th>Cantidad</th></tr><thead><tbody>"+msg+"</tbody></table>";
            mensaje += "************************************************************************************";
            for (int i = 0; i < lelReserva.Count; i++)
            {
                mensaje += "<p style='font-weight:bold;'>Reserva #" + (i + 1) + "</p>";
                mensaje += "<p><span style='font-weight:bold;'>Descripción: </span>" + lelReserva[i].descripcion + "</p>";
                mensaje += "<p><span style='font-weight:bold;'>Fecha y hora inicio: </span>" + lelReserva[i].fhinicio.Replace("T"," ") +"</p>";
                mensaje += "<p><span style='font-weight:bold;'>Fecha y hora fin: </span>" + lelReserva[i].fhfin.Replace("T", " ") + "</p>";
                mensaje += "---------------------------------------------------------------------------------";
            }

            mensaje += "<p style='font-size:10px;font-style:italic;'>Este correo se envía automáticamente después de la validación, no responda a este correo.<p>";

            MailMessage Correo = new MailMessage();
            Correo.From = new MailAddress(CorreoUserName);
            Correo.To.Add(param[6]);
            Correo.Subject = "RESERVA DE SALAS";//CAMBIAR cuando sea actualizacion o guardado!
            Correo.Body = mensaje;
            Correo.IsBodyHtml = true;
            Correo.Priority = System.Net.Mail.MailPriority.High;
            SmtpClient smtp = new SmtpClient();
            smtp.Host = smtp_Host;
            smtp.Credentials = new System.Net.NetworkCredential(CorreoUserName, CorreoPassword);
            smtp.Timeout = 100000;
            smtp.Send(Correo);
            result = 1;
            return result;
        }
    }
}
