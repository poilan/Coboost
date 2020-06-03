using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    public class Points_Vote
    {
        #region Public Properties

        /// <summary>
        /// List of points, Index 0 = how many points this vote gives to the Option at index 0
        /// </summary>
        public List<int> Points { get; set; }

        #endregion Public Properties
    }
}