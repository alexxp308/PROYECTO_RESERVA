using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class reservaDTO
    {
        public int idReserva { get; set; }
        public int idSala { get; set; }
        public string descripcion { get; set; }
        public string fhinicio { get; set; }
        public string fhfin { get; set; }
        public string duracion { get; set; }
        public int idCreator { get; set; }
        public string UserNameCreator { get; set; }
        public int idCharge { get; set; }
        public string UserNameCharge { get; set; }
        public string checkList { get; set; }
    }
}