using System.Collections.Generic;
using Coboost.Models.Admin.Tasks.Input.Standard.data;

namespace Coboost.Models.Admin.Tasks.Input.Grouped.data
{
    public class TextCategoryOption : OpenTextInput
    {
        public List<TextCategoryGroup> Archive
        {
            get;
            set;
        }

        public List<TextCategoryGroup> Groups
        {
            get;
            set;
        }
    }
}