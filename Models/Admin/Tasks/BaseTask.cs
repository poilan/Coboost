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

            Planned,
        }

        #endregion Public Enums

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
        protected readonly object ThreadLock = new object();

        #endregion Protected Fields

        #region Public Properties

        /// <summary>
        /// The Index this task has.
        /// </summary>
        public int Index { get; set; }

        /// <summary>
        /// Decides if this task should accept new data
        /// </summary>
        public bool InProgress { get; set; }

        /// <summary>
        /// Decides whether the results should be shown or hidden.
        /// </summary>
        public bool ShowResults { get; set; }

        /// <summary>
        /// The question that is asked.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// The type of question this is.
        /// </summary>
        public TaskType Type { get; set; }

        #endregion Public Properties

        #region Protected Methods

        protected void EventStream()
        {
            if (Reset == null)
                Reset = new ManualResetEvent(false);
            Reset.Set();
        }

        #endregion Protected Methods
    }
}