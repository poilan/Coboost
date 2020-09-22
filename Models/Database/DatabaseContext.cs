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

        public DbSet<SessionFolder> Folders { get; set; }

        /// <summary>
        /// The user-session join table
        /// </summary>
        public DbSet<UserSession> UserSessions { get; set; }

        public DbSet<UserFolder> SessionFolders { get; set; }

        #endregion Public Properties

        #region Public Constructors

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

        #endregion Public Constructors

        #region Protected Methods

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<UserSession>().HasKey(us => new { us.UserId, us.SessionId }); // Composite Key for User-Session JOIN
            builder.Entity<UserFolder>().HasKey(uf => new { uf.FolderId, uf.SessionId, uf.UserId }); // Composite Key for Session-Folder-User JOIN

            // The index of the JOIN table starts at 100000
            builder.HasSequence<int>("SessionOrder_seq", schema: "dbo")
                .StartsAt(100000)
                .IncrementsBy(1);

            builder.Entity<Session>()
                .Property(o => o.Identity)
                .HasDefaultValueSql("NEXT VALUE FOR dbo.SessionOrder_seq");
        }
        #endregion
    }
}