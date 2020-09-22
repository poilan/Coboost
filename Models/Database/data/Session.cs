using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Database
{
    /// <summary>
    /// Database Class to store sesssions in
    /// </summary>
    public class Session
    {
        #region Public Properties

        [Key]
        public int Identity { get; set; }

        public string Email { get; set; }

        public string LastOpen { get; set; }

        public string Questions { get; set; }

        public string Settings { get; set; }

        public string Slides { get; set; }

        public string Title { get; set; }

        #endregion Public Properties

        //public User User { get; set; }
        public IEnumerable<UserSession> Users { get; set; }
    }
}