using Coboost.Models.Admin.Tasks.Input.Standard.data;

namespace Coboost.Models.Admin.Tasks.Votes.Points.data
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class PointsOption : OpenTextInput
    {
        private readonly string[] _defaultColors =
        {
            "#F47373",
            "#697689",
            "#37D67A",
            "#2CCCE4",
            "#555555",
            "#dce775",
            "#ff8a65",
            "#ba68c8",
            "#D9E3F0"
        };

        private string _color;

        /// <summary>
        ///     The color of the option Hex code (e.g. '#374785')
        /// </summary>
        public string Color
        {
            // ReSharper disable once UnusedMember.Global
            get
            {
                if (!string.IsNullOrWhiteSpace(_color))
                    return _color;
                int i = Index;
                while (i > 8)
                    i -= 9;
                _color = _defaultColors[i];

                return _color;
            }
            set
            {
                if (value.Length == 7 && value.StartsWith("#"))
                    _color = value;
            }
        }

        public int Points
        {
            get;
            set;
        }
    }
}