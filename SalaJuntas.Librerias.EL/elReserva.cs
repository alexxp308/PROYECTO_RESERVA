using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalaJuntas.Librerias.EL
{
    public class elReserva
    {
        public int idReserva { get; set; }
        public int estadoReserva { get; set; }
        public int idSala { get; set; }
        public int idCampania { get; set; }
        public string nombreCampania { get; set; }
        public string descripcion { get; set; }
        public string fhCreacion { get; set; }
        public string fhinicio { get; set; }
        public string fhfin { get; set; }
        public string duracion { get; set; }
        public int idCreator { get; set; }
        public string UserNameCreator { get; set; }
        public string nombreCompletoCreator { get; set; }
        public int idCharge { get; set; }
        public string UserNameCharge { get; set; }
        public string nombreCompletoCharge { get; set; }
        public string checkListInicial { get; set; }
        public string fhCheckInicial { get; set; }
        public string checkListFinal { get; set; }
        public string fhCheckFinal { get; set; }
    }
}