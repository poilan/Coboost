// ReSharper disable UnusedAutoPropertyAccessor.Global

namespace Coboost.Models.Database.data
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class UserFolder
    {
        public SessionFolder Folder
        {
            get;
            set;
        }

        public int FolderId
        {
            get;
            set;
        }

        public Session Session
        {
            get;
            set;
        }

        public int SessionId
        {
            get;
            set;
        }

        // ReSharper disable once UnusedMember.Global
        public User User
        {
            get;
            set;
        }

        public string UserId
        {
            get;
            set;
        }
    }
}