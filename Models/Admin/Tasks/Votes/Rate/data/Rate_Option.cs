using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    public class Rate_Option : OpenText_Input
    {
        #region Private Fields
        private readonly string[] DefaultColors = { "#F47373", "#697689", "#37D67A", "#2CCCE4", "#555555", "#dce775", "#ff8a65", "#ba68c8", "#D9E3F0" };

        private string color;

        #endregion Private Fields

        #region Public Properties

        /// <summary>
        /// The average rating of this option
        /// </summary>
        public double Average
        {
            get
            {
                double i = 0;
                foreach (int rateing in Ratings)
                {
                    i += rateing;
                }
                if (Ratings.Count > 1)
                    i /= Ratings.Count;

                return Math.Round(i, 1);
            }
        }

        /// <summary>
        /// The color of the option Hex code (eg. '#575b75')
        /// </summary>
        public string Color
        {
            get
            {
                if (string.IsNullOrWhiteSpace(color))
                {
                    int i = Index;
                    while (i > 8)
                    {
                        i -= 9;
                    }
                    color = DefaultColors[i];
                }

                return color;
            }
            set
            {
                if (value.Length == 7 && value.StartsWith("#"))
                    color = value;
            }
        }

        /// <summary>
        /// The Rating this option has recieved, index 0 = the rating this option recieved from the vote at index 0
        /// </summary>
        public List<int> Ratings { get; set; }

        #endregion Public Properties
    }
}