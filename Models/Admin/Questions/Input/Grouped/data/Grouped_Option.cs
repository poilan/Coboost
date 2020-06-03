using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    public class Grouped_Option : OpenText_Input
    {
        #region Public Properties

        public List<Grouped_Group> Archive { get; set; }
        public List<Grouped_Group> Groups { get; set; }

        #endregion Public Properties
    }
}