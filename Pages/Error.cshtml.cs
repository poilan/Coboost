using System.Diagnostics;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace Coboost.Pages
{
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public class ErrorModel : PageModel
    {
        #region Private Fields

        [UsedImplicitly] private readonly ILogger<ErrorModel> _logger;

        #endregion Private Fields

        #region Public Properties

        public string RequestId { get; private set; }

        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

        #endregion Public Properties

        #region Public Constructors

        public ErrorModel(ILogger<ErrorModel> logger)
        {
            _logger = logger;
        }

        #endregion Public Constructors

        #region Public Methods

        [UsedImplicitly]
        public void OnGet()
        {
            RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
        }

        #endregion Public Methods
    }
}