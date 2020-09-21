using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    public class Points_Option : OpenText_Input
    {
        #region Private Fields

        private readonly string[] DefaultColors = {"#F47373", "#697689", "#37D67A", "#2CCCE4", "#555555", "#dce775", "#ff8a65", "#ba68c8", "#D9E3F0" };

        private string color;

        #endregion Private Fields

        #region Public Properties

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

        public int Points { get; set; }

        #endregion Public Properties
    }
}