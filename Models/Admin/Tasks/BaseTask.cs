using System;
using System.Threading;
using JetBrains.Annotations;
using Newtonsoft.Json;

// ReSharper disable UnusedMember.Global

namespace Coboost.Models.Admin.Tasks
{
    /// <summary>
    ///     The Abstract Base for all Question Types
    /// </summary>
    public abstract class BaseTask
    {
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

        /// <summary>
        ///     Lock to prevent bugs from MultiThreading Client Requests
        ///     <para>We don't need things to run parallel, we just need them to not hog the main thread</para>
        /// </summary>
        protected readonly object ThreadLock = new object();

        /// <summary>
        ///     This is used for SSE(Continuous Post Request), so that data is only sent when it is changed.
        /// </summary>
        public ManualResetEvent Reset = new ManualResetEvent(false);

        /// <summary>
        ///     The Index tree to the phase this task is a part of.
        ///     <para>Null == not part of a phase / stand alone task</para>
        /// </summary>
        [CanBeNull]
        public int[] Phase
        {
            get;
            set;
        }

        public int Countdown
        {
            get;
            set;
        }

        /// <summary>
        ///     The Index this task has.
        /// </summary>
        public int Index
        {
            get;
            set;
        }

        /// <summary>
        ///     Decides if this task should accept new data
        /// </summary>
        // ReSharper disable once UnusedAutoPropertyAccessor.Global
        public bool InProgress
        {
            get;
            set;
        }

        /// <summary>
        ///     Decides whether the results should be shown or hidden.
        /// </summary>
        public bool ShowResults
        {
            get;
            set;
        }

        public int Timer
        {
            get;
            set;
        }

        /// <summary>
        ///     The question that is asked.
        /// </summary>
        public string Title
        {
            get;
            set;
        }

        /// <summary>
        ///     The type of question this is.
        /// </summary>
        public TaskType Type
        {
            get;
            set;
        }

        public void EventStream()
        {
            Reset ??= new ManualResetEvent(false);
            Reset.Set();
        }

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
    }
}