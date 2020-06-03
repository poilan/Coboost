using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    public class Rate_Vote
    {
        #region Public Properties

        /// <summary>
        /// The list of Ratings this vote is using, Index 0 = the rating for the option at index 0
        /// </summary>
        public List<int> Ratings { get; set; }

        #endregion Public Properties
    }
}