using System.Collections.Generic;
using System.Linq;
using Coboost.Models.Admin.Tasks.Input.Standard.data;
using Coboost.Models.Admin.Tasks.Votes.Multiple_Choice.data;

// ReSharper disable UnusedMember.Global

// ReSharper disable AutoPropertyCanBeMadeGetOnly.Global

// ReSharper disable MemberCanBePrivate.Global

namespace Coboost.Models.Admin.Tasks.Votes.Multiple_Choice
{
    /// <summary>
    ///     The Primary Class for Multiple Choice Votes
    ///     <para>This class holds all the logic used in Multiple Choice</para>
    /// </summary>
    public class MultipleChoice : BaseTask
    {
        /// <summary>
        ///     "Removed" options are stored here.
        /// </summary>
        public List<MultipleChoiceOption> Archive
        {
            get;
            set;
        }

        public List<int> Favorites
        {
            get;
            set;
        }

        /// <summary>
        ///     The maximum number of choices users can vote for.
        /// </summary>
        // ReSharper disable once UnusedMember.Global
        public int Max
        {
            get;
            set;
        }

        /// <summary>
        ///     The options you can pick from
        /// </summary>
        public List<MultipleChoiceOption> Options
        {
            get;
            set;
        }

        /// <summary>
        ///     The total number of votes
        /// </summary>
        public int TotalVotes
        {
            get
            {
                int i = 0;
                if (Options.Count > 0)
                    i += Options.Where(opt => opt.Votes.Count > 0).Sum(opt => opt.Votes.Count);
                return i;
            }
        }

        public MultipleChoice()
        {
            Archive = new List<MultipleChoiceOption>();
            Options = new List<MultipleChoiceOption>();
        }

        /// <summary>
        ///     Adds another option to the vote
        /// </summary>
        /// <param name="input">A Open Text input, that is converted into a option</param>
        public void AddOption(OpenTextInput input)
        {
            lock (ThreadLock)
            {
                MultipleChoiceOption option = new MultipleChoiceOption
                {
                        Archive = new List<MultipleChoiceVote>(),
                        Votes = new List<MultipleChoiceVote>(),
                        Description = input.Description,
                        UserID = input.UserID

                        //Title = input.Title,
                };

                Options.Add(option);
            }

            EventStream();
        }

        /// <summary>
        ///     Adds a User input to the targeted option
        /// </summary>
        /// <param name="vote">The Vote the user sent in</param>
        public void AddUserVote(MultipleChoiceVote vote)
        {
            lock (ThreadLock)
            {
                Options[vote.Option].Votes.Add(vote);
                Options.Sort(Compare);
            }

            EventStream();
        }

        /// <summary>
        ///     Changes the Color of a option
        /// </summary>
        /// <param name="option">List Index of the Option</param>
        /// <param name="color">Color in Hex format e.g. '#AABBCC'</param>
        public void ColorOption(int option, string color)
        {
            lock (ThreadLock)
            {
                if (option >= Options.Count || option < 0 || color == null)
                    return;

                if (color.Length == 7 && color.StartsWith("#"))
                    Options[option].Color = color;
            }

            EventStream();
        }

        /// <summary>
        ///     Removes one of the options
        /// </summary>
        /// <param name="option">The index of the option you want removed</param>
        public void RemoveOptions(int option)
        {
            lock (ThreadLock)
            {
                Options.RemoveAt(option);
            }

            EventStream();
        }

        public void SetFavorite(int option)
        {
            lock (ThreadLock)
            {
                if (Options.Count > option || option < 0)
                    return;

                if (Favorites.Contains(option))
                    Favorites.Remove(option);
                else
                    Favorites.Add(option);
            }

            EventStream();
        }

        private int Compare(MultipleChoiceOption x, MultipleChoiceOption y)
        {
            return y.Votes.Count - x.Votes.Count;
        }
    }
}