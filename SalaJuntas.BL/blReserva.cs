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

        public List<elReserva> obtenerReservaxUsuario(int salaId, int userId,int idSede,int estado)
        {
            List<elReserva> lelReserva = null;
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                try
                {
                    lelReserva = new List<elReserva>();
                    con.Open();
                    dlReserva odlReserva = new dlReserva();
                    lelReserva = odlReserva.obtenerReservaxUsuario(salaId, userId,idSede,estado, con);
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


        public int actualizarReserva(List<elReserva> lelReserva)
        {
            int result = 0;
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                try
                {
                    con.Open();
                    dlReserva odlReserva = new dlReserva();
                    result = odlReserva.actualizarReserva(lelReserva, con);
                }
                catch (Exception ex)
                {
                    string url = HttpContext.Current.Request.Url.ToString();
                    Log.Error(logPath, "blReserva_actualizarReserva", url, ex);
                }
            }
            return result;
        }

        public int eliminarReserva(int idReserva)
        {
            int result = 0;
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                try
                {
                    con.Open();
                    dlReserva odlReserva = new dlReserva();
                    result = odlReserva.eliminarReserva(idReserva, con);
                }
                catch (Exception ex)
                {
                    string url = HttpContext.Current.Request.Url.ToString();
                    Log.Error(logPath, "blReserva_eliminarReserva", url, ex);
                }
            }
            return result;
        }

        public string CheckList(int idReserva, int iniFin, string checkList)
        {
            string result = "";
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                try
                {
                    con.Open();
                    dlReserva odlReserva = new dlReserva();
                    result = odlReserva.CheckList(idReserva, iniFin, checkList, con);
                }
                catch (Exception ex)
                {
                    string url = HttpContext.Current.Request.Url.ToString();
                    Log.Error(logPath, "blReserva_CheckList", url, ex);
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
                    correos = odlReserva.obtenerCorreos(lelReserva[0].idSala, lelReserva[0].idCreator, con);
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
            string mensaje = "<div style='border:1px solid black;width:50%;'><br><p style='font-size:20px;font-weight:bold;'>.: RESERVA DE SALAS :.</p>";
            mensaje += "<table>";
            mensaje+= "<tr><td style='font-weight:bold;'>Pais:</td><td>" + param[4] + "</td><td style='font-weight:bold;'>Solicitante:</td><td>" + lelReserva[0].nombreCompletoCreator + "</td></tr>";
            mensaje += "<tr><td style='font-weight:bold;'>Sede:</td><td>" + param[3] + "</td><td style='font-weight:bold;'>Sala de reserva:</td><td>" + param[0]+" - "+ param[1] + "</td></tr>";
            mensaje += "<tr><td style='font-weight:bold;'>Administrador \n del centro:</td><td>" + lelReserva[0].nombreCompletoCharge + "</td><td style='font-weight:bold;'>Ubicación:</td><td>" + param[2] + "</td></tr>";
            if(lelReserva[0].nombreCampania!="") mensaje += "<tr><td style='font-weight:bold;'>Campaña:</td><td>" + lelReserva[0].nombreCampania + "</td><td style='font-weight:bold;'></td><td></td></tr>";
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
                msg += "<tr><td style='border: 1px solid black;text-align:left;'>" + activos[0] + "</td><td style='border: 1px solid black;text-align:center;'>" + activos[1] + "</td></tr>";
            }
            mensaje += "<table style='border: 1px solid black;border-collapse: collapse;'><thead><tr><th style='border: 1px solid black;'>Activo</th><th style='border: 1px solid black;'>Cantidad</th></tr><thead><tbody>" + msg+"</tbody></table>";
            mensaje += "************************************************************************************";
            for (int i = 0; i < lelReserva.Count; i++)
            {
                mensaje += "<p style='font-weight:bold;'>Reserva #" + (i + 1) + "</p>";
                mensaje += "<p><span style='font-weight:bold;'>Descripción: </span>" + lelReserva[i].descripcion + "</p>";
                mensaje += "<p><span style='font-weight:bold;'>Fecha y hora inicio: </span>" + lelReserva[i].fhinicio.Replace("T"," ") +"</p>";
                mensaje += "<p><span style='font-weight:bold;'>Fecha y hora fin: </span>" + lelReserva[i].fhfin.Replace("T", " ") + "</p><br>";
            }

            mensaje += "<p style='font-size:10px;font-style:italic;'>Este correo se envía automáticamente después de la validación, no responda a este correo.<p></div>";

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
