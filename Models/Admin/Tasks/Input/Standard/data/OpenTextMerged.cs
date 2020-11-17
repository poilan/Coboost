using System.Collections.Generic;

namespace Coboost.Models.Admin.Tasks.Input.Standard.data
{
    /// <summary>
    ///     A Merged OpenTextInput
    ///     <para>Keeps a record of the individual inputs</para>
    /// </summary>
    public class OpenTextMerged : OpenTextInput
    {
        /// <summary>
        ///     The Inputs that was merged into this one
        /// </summary>
        public List<OpenTextInput> Children
        {
            get;
            set;
        }
    }
}