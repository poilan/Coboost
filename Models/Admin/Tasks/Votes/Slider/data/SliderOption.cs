using System;
using System.Collections.Generic;
using System.Linq;
using Coboost.Models.Admin.Tasks.Input.Standard.data;
using JetBrains.Annotations;

namespace Coboost.Models.Admin.Tasks.Votes.Slider.data
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class SliderOption : OpenTextInput
    {
        #region Private Fields

        private readonly string[] _defaultColors =
            {"#F47373", "#697689", "#37D67A", "#2CCCE4", "#555555", "#dce775", "#ff8a65", "#ba68c8", "#D9E3F0"};

        private string _color;

        #endregion Private Fields

        #region Public Properties

        /// <summary>
        ///     The average rating of this option
        /// </summary>
        // ReSharper disable once UnusedMember.Global
        public double Average
        {
            get
            {
                double i = Ratings.Aggregate<int, double>(0, (current, rating) => current + rating);
                if (Ratings.Count > 1)
                    i /= Ratings.Count;

                return Math.Round(i, 1);
            }
        }

        /// <summary>
        ///     The color of the option Hex code (E.G. '#575b75')
        /// </summary>
        public string Color
        {
            [UsedImplicitly]
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
        ///     The Rating this option has received, index 0 = the rating this option received from the vote at index 0
        /// </summary>
        public List<int> Ratings { get; set; }

        #endregion Public Properties
    }
}