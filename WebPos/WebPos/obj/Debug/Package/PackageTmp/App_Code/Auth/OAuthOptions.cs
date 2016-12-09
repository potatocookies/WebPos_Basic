using Microsoft.Owin.Security.OAuth;
using System;


namespace WebPos.App_Code.Auth
{
    public class OAuthOptions : OAuthAuthorizationServerOptions
    {
        public OAuthOptions(string ip)
        {
            TokenEndpointPath = new Microsoft.Owin.PathString("/token");

            AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(60);
            AccessTokenFormat = new JwtFormat(this, ip);
            Provider = new OAuthProvider();

            // ToDo: Please do not forget to uncomment following #if debug line on production
            //#if DEBUG
            AllowInsecureHttp = true;
            //#endif
        }
    }
}