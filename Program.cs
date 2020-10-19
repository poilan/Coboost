using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace Coboost
{
    public static class Program
    {
        #region Public Methods

        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        #endregion Public Methods

        #region Private Methods

        private static IHostBuilder CreateHostBuilder(string[] args) =>
                    Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        #endregion Private Methods
    }
}