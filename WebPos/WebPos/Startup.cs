
using Owin;
using System.Net;

namespace WebPos
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            //
            string hostName = System.Net.Dns.GetHostName();
            IPAddress[] ips;
            ips = System.Net.Dns.GetHostAddresses(hostName);
            string ip = ips[ips.Length - 1].ToString();
            // middleware
            //TODO
            //app.Use<TokenDetector>();
            //// JWT
            //app.UseOAuthAuthorizationServer(new OAuthOptions(ip));
            //app.UseJwtBearerAuthentication(new JwtOptions(ip));
        }
    }
}