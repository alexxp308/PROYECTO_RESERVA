using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Http;
using System.Web.Http.Results;
using WebApplication1.Librerias.BL;

namespace WebApplication1.API
{
    public class MisReservasController : ApiController
    {
        [HttpPost]
        public string Upload()
        {
            string path = HttpContext.Current.Server.MapPath("~/Img/");
            if (!Directory.Exists(path)) Directory.CreateDirectory(path);
            HttpFileCollection files = HttpContext.Current.Request.Files;
            HttpPostedFile fl;
            string file,flName, ext,newName,result="";
            string[] testfiles;
            for (int i = 0; i < files.Count; i++)
            {
                fl = files[i];
                if (HttpContext.Current.Request.Browser.Browser.ToUpper() == "IE" || HttpContext.Current.Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                {
                    testfiles = fl.FileName.Split(new char[] { '\\' });
                    file = testfiles[testfiles.Length - 1];
                }
                else
                {
                    file = fl.FileName;
                }
                flName = Path.GetFileName(path + "\\" + file);
                ext = Path.GetExtension(path + "\\" + file);
                newName = path + "\\" + (flName.Substring(0, flName.Length - 4) + "_" + DateTime.Now.ToString("yyyy_MM_ddTHH_mm_ss") + ext);
                fl.SaveAs(newName);
                result += newName + "|";
            }
            return result.Substring(0,result.Length-1);
        }
    }
}
