#region using
using System;
using System.IO;
using System.Text;
#endregion

namespace General.Librerias.CodigoUsuario
{
    public static class Log
    {
		private static int i = 0;
		public static void Info(string ruta, string message)
		{
			i++;
			StringBuilder sbFile = new StringBuilder();
			sbFile.Append(ruta);
			sbFile.Append("info");
			sbFile.Append("_");
			sbFile.Append(message);
			sbFile.Append("_");
			sbFile.Append(DateTime.Now.ToString("yyyy-MM-dd_hh_mm_ss.fff_"));
			sbFile.Append(i);
			sbFile.Append(".txt");
			using (FileStream fs = File.Open(sbFile.ToString(), FileMode.CreateNew))
			using (StreamWriter sw = new StreamWriter(fs))
			{
				sw.WriteLine(message);
			}
		}
		public static void Error(string ruta, string nombre, string url, Exception ex)
		{
			i++;
			StringBuilder sbFile = new StringBuilder();
			sbFile.Append(ruta);
			sbFile.Append("error");
			sbFile.Append("_");
			sbFile.Append(nombre);
			sbFile.Append("_");
			sbFile.Append(DateTime.Now.ToString("yyyy-MM-dd_hh_mm_ss.fff_"));
			sbFile.Append(i);
			sbFile.Append(".txt");
			using (FileStream fs = File.Open(sbFile.ToString(), FileMode.CreateNew))
			using (StreamWriter sw = new StreamWriter(fs))
			{
				StringBuilder sbContent = new StringBuilder();
				sbContent.Append("Nombre:\t\t");
				sbContent.AppendLine(nombre);
				sbContent.Append("URL:\t\t");
				sbContent.AppendLine(url);
				sbContent.Append("Mensaje:\t");
				sbContent.AppendLine(ex.Message);
				sbContent.Append("Detalle:\t");
				sbContent.Append(ex.StackTrace.Trim());
				sw.WriteLine(sbContent.ToString());
			}
		}
	}
}
