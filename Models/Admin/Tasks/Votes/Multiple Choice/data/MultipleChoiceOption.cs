using System.Collections.Generic;
using Coboost.Models.Admin.Tasks.Input.Standard.data;

// ReSharper disable UnusedMember.Global

// ReSharper disable UnusedAutoPropertyAccessor.Global

namespace Coboost.Models.Admin.Tasks.Votes.Multiple_Choice.data
{
    /// <summary>
    ///     All the data we need for each option in this Vote
    /// </summary>
    public class MultipleChoiceOption : OpenTextInput
    {
        #region Private Fields

        private readonly string[] _defaultColors =
            {"#F47373", "#697689", "#37D67A", "#2CCCE4", "#555555", "#dce775", "#ff8a65", "#ba68c8", "#D9E3F0"};

        private string _color;

        #endregion Private Fields

        #region Public Properties

        /// <summary>
        ///     "Removed" votes are stored here
        /// </summary>
        public List<MultipleChoiceVote> Archive { get; set; }

        /// <summary>
        ///     The color of the option Hex code (e.g. '#575b75')
        /// </summary>
        public string Color
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(_color)) return _color;
                int i = Index;
                while (i > 8) i -= 9;
                _color = _defaultColors[i];

                return _color;
            }
            set
            {
                if (value.Length == 7 && value.StartsWith("#"))
                    _color = value;
            }
        }

        /// <summary>
        ///     All the votes for this option
        /// </summary>
        public List<MultipleChoiceVote> Votes { get; set; }

        #endregion Public Properties
    }
}