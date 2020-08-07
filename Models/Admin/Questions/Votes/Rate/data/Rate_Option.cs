using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    public class Rate_Option : OpenText_Input
    {
        #region Public Properties

        /// <summary>
        /// The average rating of this option
        /// </summary>
        public int Average
        {
            get
            {
                int i = 0;
                foreach (int rateing in Ratings)
                {
                    i += rateing;
                }
                if (Ratings.Count > 1)
                    i /= Ratings.Count;

                return i;
            }
        }

        /// <summary>
        /// The Rating this option has recieved, index 0 = the rating this option recieved from the vote at index 0
        /// </summary>
        public List<int> Ratings { get; set; }

        #endregion Public Properties
    }
}