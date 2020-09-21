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
        #region Private Fields
        private readonly string[] DefaultColors = { "#F47373", "#697689", "#37D67A", "#2CCCE4", "#555555", "#dce775", "#ff8a65", "#ba68c8", "#D9E3F0" };

        private string color;

        #endregion Private Fields

        #region Public Properties

        /// <summary>
        /// "Removed" votes are stored here
        /// </summary>
        public List<MultipleChoice_Input> Archive { get; set; }

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
        /// All the votes for this option
        /// </summary>
        public List<MultipleChoice_Input> Votes { get; set; }

        #endregion Public Properties
    }
}