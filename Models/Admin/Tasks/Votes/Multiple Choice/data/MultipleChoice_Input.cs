using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    /// <summary>
    /// The data we need from each clients Vote
    /// </summary>
    public class MultipleChoice_Input
    {
        #region Public Properties

        public int Index { get; set; }

        /// <summary>
        /// The Index of the Option this vote is voting for
        /// </summary>
        public int Option { get; set; }

        /// <summary>
        /// The Primary Key for the user that sent this vote
        /// </summary>
        public string UserID { get; set; }

        #endregion Public Properties
    }
}