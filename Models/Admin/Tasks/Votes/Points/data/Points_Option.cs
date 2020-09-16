using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    public class Points_Option : OpenText_Input
    {
        #region Private Fields

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
                    color = "#575b75";

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