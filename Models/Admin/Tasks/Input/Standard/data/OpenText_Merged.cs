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

        #endregion Public Properties
    }
}