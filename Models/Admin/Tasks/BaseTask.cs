using System;
using System.Threading;
using Newtonsoft.Json;

// ReSharper disable UnusedMember.Global

namespace Coboost.Models.Admin.Tasks
{
    /// <summary>
    ///     The Abstract Base for all Question Types
    /// </summary>
    public abstract class BaseTask
    {
        #region Public Enums

        /// <summary>
        ///     The types of questions that exists.
        /// </summary>
        public enum TaskType
        {
            OpenText,

            MultipleChoice,

            Points,

            Slider,

            Planned
        }

        #endregion Public Enums

        #region Protected Fields

        /// <summary>
        ///     Lock to prevent bugs from MultiThreading Client Requests
        ///     <para>We don't need things to run parallel, we just need them to not hog the main thread</para>
        /// </summary>
        protected readonly object ThreadLock = new object();

        #endregion Protected Fields

        #region Public Fields

        /// <summary>
        ///     This is used for SSE(Continuous Post Request), so that data is only sent when it is changed.
        /// </summary>
        public ManualResetEvent Reset = new ManualResetEvent(false);

        #endregion Public Fields

        #region Protected Methods

        public void EventStream()
        {
            Reset ??= new ManualResetEvent(false);
            Reset.Set();
        }

        #endregion Protected Methods

        #region Public Properties

        /// <summary>
        ///     The Index this task has.
        /// </summary>
        public int Index { get; set; }

        /// <summary>
        ///     Decides if this task should accept new data
        /// </summary>
        // ReSharper disable once UnusedAutoPropertyAccessor.Global
        public bool InProgress { get; set; }

        /// <summary>
        ///     Decides whether the results should be shown or hidden.
        /// </summary>
        public bool ShowResults { get; set; }

        public int Countdown { get; set; }

        public int Timer { get; set; }

        /// <summary>
        ///     The question that is asked.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        ///     The type of question this is.
        /// </summary>
        public TaskType Type { get; set; }

        #endregion Public Properties

        #region Public Methods

        public string Serialize(object target)
        {
            try
            {
                lock (ThreadLock)
                {
                    string json = JsonConvert.SerializeObject(target);
                    return json;
                }
            }
            catch
            {
                Thread.Sleep(100);
                return Serialize(target);
            }
        }

        public void ToggleResults()
        {
            lock (ThreadLock)
            {
                try
                {
                    bool change = !ShowResults;
                    ShowResults = change;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
            }

            EventStream();
        }

        public void ToggleTask()
        {
            lock (ThreadLock)
            {
                try
                {
                    bool change = !InProgress;
                    InProgress = change;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
            }

            EventStream();
        }

        #endregion Public Methods
    }
}