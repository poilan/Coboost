using Slagkraft.Models.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Database
{
    public class SessionFolder
    {
        /// <summary>
        /// Session Group Id
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Name of the group
        /// </summary>
        public string Name { get; set; }
    }
}
