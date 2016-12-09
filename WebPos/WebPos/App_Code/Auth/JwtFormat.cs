using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using System;
using System.IdentityModel.Tokens;

namespace WebPos.App_Code.Auth
{
    public class JwtFormat : ISecureDataFormat<AuthenticationTicket>
    {
        private readonly OAuthAuthorizationServerOptions _options;
        private readonly string _ip;

        public JwtFormat(OAuthAuthorizationServerOptions options, string ip)
        {
            _options = options;
            _ip = ip;
        }

        public string SignatureAlgorithm
        {
            get { return "http://www.w3.org/2001/04/xmldsig-more#hmac-sha256"; }
        }

        public string DigestAlgorithm
        {
            get { return "http://www.w3.org/2001/04/xmlenc#sha256"; }
        }

        public string Protect(AuthenticationTicket data)
        {
            if (data == null) throw new ArgumentNullException("data");

            var issuer = _ip;
            var audience = "all";
            var key = System.Text.Encoding.Unicode.GetBytes("2961835d-adf7-4955-8d33-a23254bffb98");
            var now = DateTime.UtcNow;
            var expires = now.AddMinutes(_options.AccessTokenExpireTimeSpan.TotalMinutes);
            var signingCredentials = new SigningCredentials(
                                        new InMemorySymmetricSecurityKey(key),
                                        SignatureAlgorithm,
                                        DigestAlgorithm);

            var token = new JwtSecurityToken(issuer, audience, data.Identity.Claims,
                                             now, expires, signingCredentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public AuthenticationTicket Unprotect(string protectedText)
        {
            throw new NotImplementedException();
        }
    }
}