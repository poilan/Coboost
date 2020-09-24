using Slagkraft.Models.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Database
{
    public class UserSession
    {
        public string UserId { get; set; }
        public User User { get; set; }

        public int SessionId { get; set; }
        public Session Session { get; set; }
    }
}
