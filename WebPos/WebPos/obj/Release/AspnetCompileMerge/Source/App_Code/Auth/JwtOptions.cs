using Microsoft.Owin.Security.Jwt;

namespace WebPos.App_Code.Auth
{
    public class JwtOptions : JwtBearerAuthenticationOptions
    {
        public JwtOptions(string ip)
        {
            var issuer = ip;
            var audience = "all";
            var key = System.Text.Encoding.Unicode.GetBytes("2961835d-adf7-4955-8d33-a23254bffb98");

            AllowedAudiences = new[] { audience };
            IssuerSecurityTokenProviders = new[] { new SymmetricKeyIssuerSecurityTokenProvider(issuer, key) };
        }
    }
}