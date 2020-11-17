using Coboost.Models.Database.data;
using Microsoft.EntityFrameworkCore;

namespace Coboost.Models.Database
{
    /// <summary>
    ///     Context For the Database
    /// </summary>
    public class DatabaseContext : DbContext
    {
        /// <summary>
        ///     The sessions that are currently being worked in
        /// </summary>
        public static ActiveSessions Active => ActiveSessions.Instance;

        // ReSharper disable once UnusedMember.Global
        public DbSet<SessionFolder> Folders
        {
            get;
            set;
        }

        // ReSharper disable once UnusedMember.Global
        public DbSet<UserFolder> SessionFolders
        {
            get;
            set;
        }

        /// <summary>
        ///     The stored sessions
        /// </summary>
        // ReSharper disable once UnusedAutoPropertyAccessor.Global
        public DbSet<Session> Sessions
        {
            get;
            set;
        }

        /// <summary>
        ///     The stored Users
        /// </summary>
        // ReSharper disable once UnusedAutoPropertyAccessor.Global
        public DbSet<User> Users
        {
            get;
            set;
        }

        /// <summary>
        ///     The user-session join table
        /// </summary>
        // ReSharper disable once UnusedAutoPropertyAccessor.Global
        public DbSet<UserSession> UserSessions
        {
            get;
            set;
        }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<UserSession>().HasKey(us => new
            {
                us.UserId,
                us.SessionId
            }); // Composite Key for User-Session JOIN
            builder.Entity<UserFolder>().HasKey(uf => new
            {
                uf.FolderId,
                uf.SessionId,
                uf.UserId
            }); // Composite Key for Session-Folder-User JOIN

            // The index of the JOIN table starts at 100000
            builder.HasSequence<int>("SessionOrder_seq", "dbo").StartsAt(100000).IncrementsBy(1);

            builder.Entity<Session>().Property(o => o.Identity).HasDefaultValueSql("NEXT VALUE FOR dbo.SessionOrder_seq");
        }
    }
}