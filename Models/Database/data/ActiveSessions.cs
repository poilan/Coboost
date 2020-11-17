using System.Collections.Generic;
using Coboost.Models.Admin;

namespace Coboost.Models.Database.data
{
    public class ActiveSessions
    {
        private static readonly object Padlock = new object();

        private static ActiveSessions _instance;

        public static ActiveSessions Instance
        {
            get
            {
                lock (Padlock)
                {
                    _instance ??= new ActiveSessions();
                }

                return _instance;
            }
        }

        // ReSharper disable once MemberCanBePrivate.Global
        public Dictionary<int, AdminInstance> Sessions
        {
            get;
        }

        private ActiveSessions()
        {
            Sessions = new Dictionary<int, AdminInstance>();
        }
    }
}