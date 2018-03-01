#region using
using System.Data;
using System.Data.SqlClient;
#endregion


namespace WebApplication1.Librerias.DL
{
    public class dlLogin
    {
		public string checkLogin(string userName, string password,SqlConnection con)
		{
			string result="";
			SqlCommand cmd = new SqlCommand("USP_CHECK_LOGIN", con);
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandTimeout = 1800;
			cmd.Parameters.AddWithValue("@userName", userName);
			cmd.Parameters.AddWithValue("@password", password);
			SqlDataReader drd = cmd.ExecuteReader(CommandBehavior.SingleRow);
			if(drd!=null)
			{
				while (drd.Read())
				{
					result = drd.GetInt32(0) + "|" + drd.GetString(1)+"|"+drd.GetString(2)+"|"+ drd.GetInt32(3) + "|" + drd.GetInt32(4) + "|" + drd.GetString(5);
				}
				drd.Close();
			}

			return result;
		}
    }
}
