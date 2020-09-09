using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    public class Planned : BaseTask
    {
        #region Public Properties

        public TaskType PlannedType { get; set; }

        #endregion Public Properties
    }
}