using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    /// <summary>
    /// A Merged OpenText_Input
    /// <para>Keeps a record of the individual inputs</para>
    /// </summary>
    public class OpenText_Merged : OpenText_Input
    {
        #region Public Properties

        /// <summary>
        /// The Inputs that was merged into this one
        /// </summary>
        public List<OpenText_Input> Children { get; set; }

        public new string Title
        {
            get
            {
                if (string.IsNullOrWhiteSpace(title))
                {
                    return Description + " (" + (Children.Count + 1) + ")";
                }
                else
                {
                    return title + " (" + (Children.Count + 1) + ")";
                }
            }
            set
            {
                if (string.IsNullOrWhiteSpace(Description))
                {
                    Description = value;
                }
                else if (string.Equals(value, Description) || string.IsNullOrWhiteSpace(value))
                {
                    title = "";
                }
                else
                {
                    title = value;
                }
            }
        }

        #endregion Public Properties
    }
}