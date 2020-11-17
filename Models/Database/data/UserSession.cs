using JetBrains.Annotations;

namespace Coboost.Models.Database.data
{
    public class UserSession
    {
        // ReSharper disable once UnusedAutoPropertyAccessor.Global
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

        [UsedImplicitly]
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