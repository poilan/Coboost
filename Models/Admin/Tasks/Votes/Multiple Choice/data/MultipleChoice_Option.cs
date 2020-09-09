using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    /// <summary>
    /// All the data we need for each option in this Vote
    /// </summary>
    public class MultipleChoice_Option : OpenText_Input
    {
        #region Public Properties

        /// <summary>
        /// "Removed" votes are stored here
        /// </summary>
        public List<MultipleChoice_Input> Archive { get; set; }

        /// <summary>
        /// All the votes for this option
        /// </summary>
        public List<MultipleChoice_Input> Votes { get; set; }

        #endregion Public Properties
    }
}