using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    public class Points : BaseTask
    {
        #region Public Properties

        /// <summary>
        /// The amount of points to spread
        /// </summary>
        public int Amount { get; set; }

        /// <summary>
        /// All the deleted options
        /// </summary>
        public List<Points_Option> Archive { get; set; }

        /// <summary>
        /// The maximum points you can assign to a single option
        /// </summary>
        public int Max { get; set; }

        /// <summary>
        /// The options you can vote for
        /// </summary>
        public List<Points_Option> Options { get; set; }

        /// <summary>
        /// The votes we have recieved
        /// </summary>
        public List<Points_Vote> Votes { get; set; }

        #endregion Public Properties

        public void AddClientVote(Points_Vote vote)
        {
            lock (QuestionLock)
            {
                Votes.Add(vote);
                RecountVotes();
            }
        }

        private void RecountVotes()
        {
            for (int i = 0; i < Options.Count; i++)
            {
                Options[i].Points = 0;
            }

            for(int i = 0; i < Votes.Count; i++)
            {
                for(int j = 0; j < Votes[i].Points.Count; i++)
                {
                    Options[j].Points += Votes[i].Points[j];
                }
            }
        }
    }
}