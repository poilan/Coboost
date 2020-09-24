using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    /// <summary>
    /// A Group to store client sent Inputs In
    /// <para>All Inputs has to ne in a group</para>
    /// </summary>
    public class OpenText_Group
    {
        #region Private Fields

        private string color;

        private string title;

        #endregion Private Fields

        #region Public Properties

        /// <summary>
        /// Decides if the group is collapsed in organizer and hidden on Big Screen
        /// </summary>
        public bool Collapsed { get; set; }

        /// <summary>
        /// The color of the group, Hex code (eg. '#575b75')
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

        /// <summary>
        /// This is used by frontend to determine which column it is going to place the group in.
        /// </summary>
        public int Column { get; set; }

        /// <summary>
        /// The index of this group
        /// </summary>
        public int Index { get; set; }

        /// <summary>
        /// The individual user inputs that belong to this group
        /// </summary>
        public List<OpenText_Input> Members { get; set; }

        /// <summary>
        /// The name of this group, takes its name from Member[0] if not set
        /// </summary>
        public string Title
        {
            get
            {
                if (string.IsNullOrWhiteSpace(title))
                {
                    if (Members.Count > 0)
                        return Members[0].Title;
                    else
                        return "Group " + Index;
                }
                else
                    return title;
            }
            set
            {
                if (Members.Count > 0 && string.Equals(value, Members[0].Title))
                    title = "";
                else
                    title = value;
            }
        }

        #endregion Public Properties
    }
}