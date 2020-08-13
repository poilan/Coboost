using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    /// <summary>
    /// The Primary Class for Multiple Choice Votes
    /// <para>This class holds all the logic used in Multiple Choice</para>
    /// </summary>
    public class MultipleChoice : BaseTask
    {
        #region Public Properties

        /// <summary>
        /// "Removed" options are stored here.
        /// </summary>
        public List<MultipleChoice_Option> Archive { get; set; }

        /// <summary>
        /// The maximum number of choices users can vote for.
        /// </summary>
        public int Max { get; set; }

        /// <summary>
        /// The options you can pick from
        /// </summary>
        public List<MultipleChoice_Option> Options { get; set; }

        /// <summary>
        /// The total number of votes
        /// </summary>
        public int TotalVotes
        {
            get
            {
                int i = 0;
                if (Options.Count > 0)
                {
                    foreach (MultipleChoice_Option opt in Options)
                    {
                        if (opt.Votes.Count > 0)
                            i += opt.Votes.Count;
                    }
                }
                return i;
            }
        }

        #endregion Public Properties

        #region Public Constructors

        public MultipleChoice()
        {
            Archive = new List<MultipleChoice_Option>();
            Options = new List<MultipleChoice_Option>();
        }

        #endregion Public Constructors

        #region Public Methods

        /// <summary>
        /// Adds another option to the vote
        /// </summary>
        /// <param name="input">A Open Text input, that is converted into a option</param>
        public void AddOption(OpenText_Input input)
        {
            lock (QuestionLock)
            {
                MultipleChoice_Option option = new MultipleChoice_Option
                {
                    Archive = new List<MultipleChoice_Input>(),
                    Votes = new List<MultipleChoice_Input>(),
                    Description = input.Description,
                    UserID = input.UserID,

                    //Title = input.Title,
                };

                Options.Add(option);
            }
            EventStream();
        }

        /// <summary>
        /// Adds a User input to the targeted option
        /// </summary>
        /// <param name="input">The Vote the user sent in</param>
        public void AddUserVote(MultipleChoice_Input input)
        {
            lock (QuestionLock)
            {
                Options[input.Option].Votes.Add(input);
            }
            EventStream();
        }

        /// <summary>
        /// Removes one of the options
        /// </summary>
        /// <param name="option">The index of the option you want removed</param>
        public void RemoveOptions(int option)
        {
            lock (QuestionLock)
            {
                Options.RemoveAt(option);
            }
            EventStream();
        }

        #endregion Public Methods
    }
}