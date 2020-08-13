using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    public class Grouped : BaseTask
    {
        #region Public Properties

        public List<Grouped_Option> Archive { get; set; }

        public List<Grouped_Option> Options { get; set; }

        #endregion Public Properties
    }
}