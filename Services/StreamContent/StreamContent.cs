using System;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Coboost.Services.StreamContent
{
    /// <summary>
    ///     Class that allows us to send data in HttpBody before the request is complete
    /// </summary>
    [SuppressMessage("ReSharper", "UnusedType.Global")]
    public class StreamContent : IActionResult
    {
        #region Private Fields

        private readonly Action<Stream, CancellationToken> _onStreamAvailable;

        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private CancellationToken _cancelToken;

        #endregion Private Fields

        #region Public Constructors

        /// <summary>
        ///     Use this as a Return method to be able to push data using StreamWriter.Flush()
        /// </summary>
        /// <param name="onStreamAvailable">
        ///     The Method Containing the Logic you want performed.
        ///     <para>This method will require the Parameters: {"Stream", "CancellationToken", "int"}</para>
        ///     These parameters are: What you are writing into, Token that knows if the client disconnected, the event code for
        ///     the session you are reading from
        /// </param>
        /// <param name="cancelToken">How we know the user disconnected</param>
        public StreamContent(Action<Stream, CancellationToken> onStreamAvailable, CancellationToken cancelToken)
        {
            _onStreamAvailable = onStreamAvailable;

            //ContentType = contentType;
            _cancelToken = cancelToken;
        }

        #endregion Public Constructors

        #region Public Methods

        public Task ExecuteResultAsync(ActionContext context)
        {
            Stream stream = context.HttpContext.Response.Body;

            _onStreamAvailable(stream, _cancelToken);
            return Task.CompletedTask;
        }

        #endregion Public Methods
    }
}