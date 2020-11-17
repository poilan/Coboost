namespace Coboost.Models.Admin.Tasks.Input.Standard.data
{
    /// <summary>
    ///     Contains the Data from a Participant Input
    /// </summary>
    public class OpenTextInput
    {
        private string _title;

        /// <summary>
        ///     The Main Data of the Input
        /// </summary>
        public string Description
        {
            get;
            set;
        }

        public int Index
        {
            get;
            set;
        }

        /// <summary>
        ///     Optional Title
        ///     <para>Becomes null if set to empty or whitespace</para>
        ///     Returns Description if null
        /// </summary>
        public string Title
        {
            get =>
                string.IsNullOrWhiteSpace(_title) ?
                    Description :
                    _title;
            set
            {
                if (string.IsNullOrWhiteSpace(Description))
                    Description = value;
                else if (string.IsNullOrWhiteSpace(value) || string.Equals(value, Description))
                    _title = "";
                else
                    _title = value;
            }
        }

        /// <summary>
        ///     The User that sent it in
        /// </summary>
        public string UserID
        {
            get;
            set;
        }
    }
}