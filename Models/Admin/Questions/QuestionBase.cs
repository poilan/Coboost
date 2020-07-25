using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    /// <summary>
    /// The Abstract Base for all Question Types
    /// </summary>
    public abstract class BaseTask
    {
        #region Public Fields

        /// <summary>
        /// This is used for SSE(Continuous Post Request), so that data is only sent when it is changed.
        /// </summary>
        public ManualResetEvent Reset = new ManualResetEvent(false);

        #endregion Public Fields

        #region Protected Fields

        /// <summary>
        /// Lock to prevent bugs from MultiThreading Client Requests
        /// <para>We don't need things to run parellel, we just need them to not hog the main thread</para>
        /// </summary>
        protected readonly object QuestionLock = new object();

        #endregion Protected Fields

        #region Public Properties

        public int Index { get; set; }

        /// <summary>
        /// The type of question this is.
        /// </summary>
        public TaskType Type { get; set; }

        /// <summary>
        /// The question that is asked.
        /// </summary>
        public string Title { get; set; }

        #endregion Public Properties

        #region Public Enums

        /// <summary>
        /// The types of questions that exists.
        /// </summary>
        public enum TaskType
        {
            OpenText,
            MultipleChoice,
            Points,
            Rate,
        }

        #endregion Public Enums

        #region Protected Methods

        protected void EventStream()
        {
            Reset.Set();
        }

        #endregion Protected Methods
    }
}