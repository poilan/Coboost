using System.Collections.Generic;

// ReSharper disable CollectionNeverUpdated.Global

namespace Coboost.Models.Admin.Tasks.Votes.Points.data
{
    public class PointsVote
    {
        // ReSharper disable once UnusedAutoPropertyAccessor.Global
        public int Index
        {
            get;
            set;
        }

        /// <summary>
        ///     List of points, Index 0 = how many points this vote gives to the Option at index 0
        /// </summary>
        // ReSharper disable once UnusedAutoPropertyAccessor.Global
        public List<int> Points
        {
            get;
            set;
        }

        /// <summary>
        ///     The Primary Key for the user that sent this vote
        /// </summary>
        // ReSharper disable once UnusedMember.Global
        // ReSharper disable once InconsistentNaming
        public string UserID
        {
            get;
            set;
        }
    }
}