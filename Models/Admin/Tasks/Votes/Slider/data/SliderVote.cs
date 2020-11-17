using System.Collections.Generic;

// ReSharper disable UnusedAutoPropertyAccessor.Global
// ReSharper disable UnusedMember.Global
// ReSharper disable CollectionNeverUpdated.Global

namespace Coboost.Models.Admin.Tasks.Votes.Slider.data
{
    public class SliderVote
    {
        public int Index
        {
            get;
            set;
        }

        /// <summary>
        ///     The list of Ratings this vote is using, Index 0 = the rating for the option at index 0
        /// </summary>
        public List<int> Ratings
        {
            get;
            set;
        }

        /// <summary>
        ///     The Primary Key for the user that sent this vote
        /// </summary>
        // ReSharper disable once InconsistentNaming
        public string UserID
        {
            get;
            set;
        }
    }
}