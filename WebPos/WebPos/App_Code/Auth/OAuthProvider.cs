using Microsoft.Owin.Security.OAuth;
using System.Security.Claims;
using System.Threading.Tasks;

namespace WebPos.App_Code.Auth
{
    public class OAuthProvider : OAuthAuthorizationServerProvider
    {
        public override Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var identity = new ClaimsIdentity("otc");
            var username = context.OwinContext.Get<string>("otc:username");
            //context.OwinContext.Request.Headers["Access-Control-Allow-Origin"] = "*";

            identity.AddClaim(new Claim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name", username));
            identity.AddClaim(new Claim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", "user"));
            identity.AddClaim(new Claim("sub", username));
            context.Validated(identity);
            return Task.FromResult(0);
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            var username = context.Parameters["username"];
            var password = context.Parameters["password"];


            if (username.Equals("ivan") && password.Equals("sivak"))
            {
                context.OwinContext.Set("otc:username", username);
                context.OwinContext.Set("otc:username", username);
                context.Validated();
            }
            else
            {
                context.Rejected();
            }

            return Task.FromResult(0);
        }
    }
}