using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
	public class sedeDTO
	{
		public int idSede { get; set; }
		public string nombreSede { get; set; }
		public string paisSede { get; set; }
		public int torres { get; set; }
		public string pisos { get; set; }
        public string activos { get; set; }
	}
}