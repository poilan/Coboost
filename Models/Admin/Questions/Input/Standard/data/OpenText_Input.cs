using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    /// <summary>
    /// The information we
    /// </summary>
    public class OpenText_Input
    {
        #region Protected Fields

        protected string title;

        #endregion Protected Fields

        #region Public Properties

        /// <summary>
        /// The Main Data of the Input
        /// </summary>
        public string Description { get; set; }

        public int Index { get; set; }

        /// <summary>
        /// Optional Title
        /// <para>Becomes null if set to empty or whitespace</para>
        /// Returns Description if null
        /// </summary>
        public string Title
        {
            get
            {
                if (string.IsNullOrWhiteSpace(title))
                {
                    return Description;
                }
                else
                {
                    return title;
                }
            }
            set
            {
                if (string.IsNullOrWhiteSpace(Description))
                {
                    Description = value;
                }
                else if (string.IsNullOrWhiteSpace(value) || string.Equals(value, Description))
                {
                    title = "";
                }
                else
                {
                    title = value;
                }
            }
        }

        /// <summary>
        /// The User that sent it in
        /// </summary>
        public string UserID { get; set; }

        #endregion Public Properties
    }
}