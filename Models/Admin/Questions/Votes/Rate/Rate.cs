using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    public class Rate : BaseTask
    {
        #region Public Properties

        /// <summary>
        /// The deleted options
        /// </summary>
        public List<Rate_Option> Archive { get; set; }

        /// <summary>
        /// The maximum value a option can recieve
        /// </summary>
        public int Max { get; set; }

        /// <summary>
        /// The description of what the max represents
        /// </summary>
        public string MaxDescription { get; set; }

        /// <summary>
        /// The minimum value a option can recieve
        /// </summary>
        public int Min { get; set; }

        /// <summary>
        /// The description of what the minimum represents
        /// </summary>
        public string MinDescription { get; set; }

        /// <summary>
        /// The options for this vote
        /// </summary>
        public List<Rate_Option> Options { get; set; }

        /// <summary>
        /// The total amount of votes we have recieved
        /// </summary>
        public List<Rate_Vote> Votes { get; set; }

        #endregion Public Properties

        #region Public Methods

        public void AddClientVote(Rate_Vote vote)
        {
            lock (QuestionLock)
            {
                vote.Index = Votes.Count;
                Votes.Add(vote);
                RecountVotes();
            }
            EventStream();
        }

        #endregion Public Methods

        #region Private Methods

        private void RecountVotes()
        {
            for (int i = 0; i < Options.Count; i++)
            {
                Options[i].Ratings.Clear();
            }

            for (int i = 0; i < Votes.Count; i++)
            {
                for (int j = 0; j < Votes[i].Ratings.Count; j++)
                {
                    Options[j].Ratings.Add(Votes[i].Ratings[j]);
                }
            }
        }

        #endregion Private Methods
    }
}