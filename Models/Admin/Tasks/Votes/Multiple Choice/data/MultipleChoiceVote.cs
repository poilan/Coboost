// ReSharper disable InconsistentNaming
// ReSharper disable UnusedAutoPropertyAccessor.Global
// ReSharper disable UnusedMember.Global

namespace Coboost.Models.Admin.Tasks.Votes.Multiple_Choice.data
{
    /// <summary>
    ///     The data we need from each clients Vote
    /// </summary>
    public class MultipleChoiceVote
    {
        public int Index
        {
            get;
            set;
        }

        /// <summary>
        ///     The Index of the Option this vote is voting for
        /// </summary>
        public int Option
        {
            get;
            set;
        }

        /// <summary>
        ///     The Primary Key for the user that sent this vote
        /// </summary>
        public string UserID
        {
            get;
            set;
        }
    }
}