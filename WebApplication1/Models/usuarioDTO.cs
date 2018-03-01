using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class usuarioDTO
    {
        public int UserId { get; set; }
        public string userName { get; set; }
        public string roles { get; set; }
        public string cargo { get; set; }
        public string nombreCompleto { get; set; }
        public string email { get; set; }
        public int idSede { get; set; }
        public bool IsActive { get; set; }
        public string password { get; set; }
    }
}