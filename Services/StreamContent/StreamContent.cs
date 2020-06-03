using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace Slagkraft.Services
{
    /// <summary>
    /// Class that allows us to send data in HttpBody before the request is complete
    /// </summary>
    public class StreamContent : IActionResult
    {
        #region Private Fields

        private readonly string _contentType;
        private readonly Action<Stream, CancellationToken, int> _onStreamAvailable;
        private readonly int _required;

        #endregion Private Fields

        #region Public Constructors

        /// <summary>
        /// Use this as a Return method to be able to push data using StreamWriter.Flush()
        /// </summary>
        /// <param name="onStreamAvailable">The Method Containing the Logic you want performed.<para>This method will require the Parameters: {"Stream", "CancelationToken", "int"}</para>These parameters are: What you are writing into, Token that knows if the client disconnected, the eventcode for the session you are reading from</param>
        /// <param name="contentType">The content type that will be written in the header of the response</param>
        /// <param name="required">The int you need for the Stream method</param>
        public StreamContent(Action<Stream, CancellationToken, int> onStreamAvailable, string contentType, int required)
        {
            _onStreamAvailable = onStreamAvailable;
            _contentType = contentType;
            _required = required;
        }

        #endregion Public Constructors

        #region Public Methods

        public Task ExecuteResultAsync(ActionContext context)
        {
            context.HttpContext.Response.ContentType = _contentType;
            var stream = context.HttpContext.Response.Body;

            _onStreamAvailable(stream, context.HttpContext.RequestAborted, _required);
            return Task.CompletedTask;
        }

        #endregion Public Methods
    }
}