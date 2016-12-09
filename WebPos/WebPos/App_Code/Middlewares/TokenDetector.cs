using Microsoft.Owin;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppFunc = System.Func<System.Collections.Generic.IDictionary<string, object>,
    System.Threading.Tasks.Task
>;

namespace WebPos.App_Code.Middlewares
{
    public class TokenDetector
    {
        AppFunc _next;

        public TokenDetector(AppFunc next)
        {
            _next = next;
        }

        public async Task Invoke(IDictionary<string, object> environment)
        {
            var ctx = new OwinContext(environment);

            string token = ctx.Request.Query["token"];
            if (!string.IsNullOrEmpty(token))
            {
                ctx.Request.Headers.Add("Authorization", new[] { "Bearer " + token });
            }

            await _next(environment);
        }
    }
}