using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
	public class salaDTO
	{
		public int idSala { get; set; }
		public string nombreSala { get; set; }
		public bool estado { get; set; }
		public int idSede { get; set; }
		public string ubicacion { get; set; }
		public string activos { get; set; }
		public string horario { get; set; }
		public string tipo { get; set; }
	}
}