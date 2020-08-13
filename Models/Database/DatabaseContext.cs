using Slagkraft.Models.Admin;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Slagkraft.Models.Database
{
    /// <summary>
    /// Context For the Database
    /// </summary>
    public class DatabaseContext : DbContext
    {
        #region Public Properties

        /// <summary>
        /// The sessions that are currently being worked in
        /// </summary>
        public ActiveSessions Active
        {
            get
            {
                return ActiveSessions.Instance;
            }
        }

        /// <summary>
        /// The stored sessions
        /// </summary>
        public DbSet<Session> Sessions { get; set; }

        /// <summary>
        /// The stored Users
        /// </summary>
        public DbSet<User> Users { get; set; }

        #endregion Public Properties

        #region Public Constructors

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

        #endregion Public Constructors
    }
}