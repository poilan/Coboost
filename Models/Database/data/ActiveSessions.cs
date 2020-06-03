using Slagkraft.Models.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Database
{
    public class ActiveSessions
    {
        #region Private Fields

        private static readonly object padlock = new object();

        private static ActiveSessions instance = null;

        #endregion Private Fields

        #region Public Properties

        public static ActiveSessions Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                        instance = new ActiveSessions();
                }
                return instance;
            }
        }

        public Dictionary<int, AdminInstance> Sessions { get; set; }

        #endregion Public Properties

        #region Private Constructors

        private ActiveSessions()
        {
            Sessions = new Dictionary<int, AdminInstance>();
            AdminInstance instance = new AdminInstance { Owner = "erlend.marcus@gmail.com", SessionIdentity = 123123 };
            Sessions.Add(instance.SessionIdentity, instance);
        }

        #endregion Private Constructors
    }
}