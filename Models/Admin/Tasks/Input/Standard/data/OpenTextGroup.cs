using System.Collections.Generic;

// ReSharper disable UnusedAutoPropertyAccessor.Global

// ReSharper disable UnusedMember.Global

namespace Coboost.Models.Admin.Tasks.Input.Standard.data
{
    /// <summary>
    ///     A Group to store client sent Inputs In
    ///     <para>All Inputs has to be in a group</para>
    /// </summary>
    public class OpenTextGroup
    {
        #region Private Fields

        private string _color;

        private string _title;

        #endregion Private Fields

        #region Public Properties

        /// <summary>
        ///     Decides if the group is collapsed in organizer and hidden on Big Screen
        /// </summary>
        public bool Collapsed { get; set; }

        /// <summary>
        ///     The color of the group, Hex code (e.g. '#575b75')
        /// </summary>
        public string Color
        {
            get
            {
                if (string.IsNullOrWhiteSpace(_color))
                    _color = "#575b75";

                return _color;
            }
            set
            {
                if (value.Length == 7 && value.StartsWith("#"))
                    _color = value;
            }
        }

        /// <summary>
        ///     This is used by front-end to determine which column it is going to place the group in.
        /// </summary>
        public int Column { get; set; }

        /// <summary>
        ///     The index of this group
        /// </summary>
        public int Index { get; set; }

        /// <summary>
        ///     The individual user inputs that belong to this group
        /// </summary>
        public List<OpenTextInput> Members { get; set; }

        /// <summary>
        ///     The name of this group, takes its name from Member[0] if not set
        /// </summary>
        public string Title
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(_title))
                    return _title;
                return Members.Count > 0 ? Members[0].Title : "Group " + Index;
            }
            set
            {
                if (Members.Count > 0 && string.Equals(value, Members[0].Title))
                    _title = "";
                else
                    _title = value;
            }
        }

        #endregion Public Properties
    }
}