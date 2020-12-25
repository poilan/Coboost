using System.Collections.Generic;
using Coboost.Models.Admin;

namespace Coboost.Models.Database.data
{
    public class ActiveData
    {
        private static readonly object Padlock = new object();

        private static ActiveData _instance;

        public static ActiveData Instance
        {
            get
            {
                lock (Padlock)
                {
                    _instance ??= new ActiveData();
                }

                return _instance;
            }
        }

        /// <summary>
        ///     Contains the Models of the Sessions currently in use
        ///     <para>Int is the Code needed to join the room</para>
        /// </summary>
        public Dictionary<int, AdminInstance> Sessions
        {
            get;
        }

        /// <summary>
        ///     Dictionary containing users that haven't Confirmed their email.
        ///     <para>int is the Confirmation Code they've been sent.</para>
        /// </summary>
        public Dictionary<string, User> Users
        {
            get;
        }

        /// <summary>
        ///     Constructor that creates the Dictionaries
        /// </summary>
        private ActiveData()
        {
            Sessions = new Dictionary<int, AdminInstance>();
            Users = new Dictionary<string, User>();
        }
    }
}