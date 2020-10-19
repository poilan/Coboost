using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

// ReSharper disable UnusedAutoPropertyAccessor.Global

namespace Coboost.Models.Database.data
{
    /// <summary>
    ///     Database class to store Users
    /// </summary>
    public class User
    {
        #region Public Properties

        /// <summary>
        ///     The email used for the account.
        ///     <para>This is the Primary Key</para>
        /// </summary>
        [Key]
        public string Email { get; set; }

        /// <summary>
        ///     User's first name
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        ///     Folders the user has
        /// </summary>
        public IEnumerable<UserFolder> Folders { get; set; }

        /// <summary>
        ///     User's last name
        /// </summary>
        // ReSharper disable once UnusedMember.Global
        public string LastName { get; set; }

        /// <summary>
        ///     Hashed version of the user's password
        ///     <para>The Salt is included</para>
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        ///     Sessions the user has
        /// </summary>
        public IEnumerable<UserSession> Sessions { get; set; }

        #endregion Public Properties
    }
}