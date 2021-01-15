using System.Collections.Generic;

namespace Coboost.Models.Admin.Tasks.Phases
{
    public class Phase
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

        private int _index;

        public List<Phase> Children
        {
            get;
            set;
        }

        public int InputIndex
        {
            get;
            set;
        }

        public List<int> VoteIndexes
        {
            get;
            set;
        }

        public string Title
        {
            get;
            set;
        }

        public string Color
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(_color))
                    return _color;
                while (_index > 8)
                    _index -= 9;
                _color = _defaultColors[_index];
                _index += 1;

                return _color;
            }
            set
            {
                if (value.Length == 7 && value.StartsWith("#"))
                    _color = value;
            }
        }


        public Phase()
        {
            Children = new List<Phase>();
            VoteIndexes = new List<int>();
        }
    }
}