using System.ComponentModel.DataAnnotations;

// ReSharper disable UnusedAutoPropertyAccessor.Global

// ReSharper disable UnusedMember.Global

namespace Coboost.Models.Database.data
{
    /// <summary>
    ///     Database Class to store sessions in
    /// </summary>
    public class Session
    {
        public string Email
        {
            get;
            set;
        }

        //public IEnumerable<UserFolder> Folders
        //{
        //    get;
        //    set;
        //}

        [Key]
        public int Identity
        {
            get;
            set;
        }

        public string LastOpen
        {
            get;
            set;
        }

        public string Questions
        {
            get;
            set;
        }

        public string Settings
        {
            get;
            set;
        }

        public string Slides
        {
            get;
            set;
        }

        public string Title
        {
            get;
            set;
        }

        //public IEnumerable<UserSession> Users
        //{
        //    get;
        //    set;
        //}
    }
}