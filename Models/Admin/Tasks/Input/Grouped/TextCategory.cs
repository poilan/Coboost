using System.Collections.Generic;
using Coboost.Models.Admin.Tasks.Input.Grouped.data;

namespace Coboost.Models.Admin.Tasks.Input.Grouped
{
    public class TextCategory : BaseTask
    {
        #region Public Properties

        public List<TextCategoryOption> Archive { get; set; }

        public List<TextCategoryOption> Options { get; set; }

        #endregion Public Properties
    }
}