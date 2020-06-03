using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Slagkraft.Services
{
    /// <summary>
    /// Sends Emails, one instance of this class is one Email.
    /// </summary>
    public class Email
    {
        #region Public Fields

        public const string From = "donotreply@mathiastb.no";

        #endregion Public Fields

        #region Public Properties

        public string Body { get; set; }
        public string Recipient { get; set; }
        public string Title { get; set; }

        #endregion Public Properties

        #region Public Constructors

        /// <summary>
        /// Creates a new email
        /// </summary>
        /// <param name="recipient">The email you are sending to</param>
        /// <param name="title">The title of the email</param>
        /// <param name="body">The main text of the email</param>
        public Email(string recipient, string title, string body)
        {
            Recipient = recipient;
            Title = title;
            Body = body;
        }

        #endregion Public Constructors

        #region Public Methods

        /// <summary>
        /// Returns true if the paramater is an email, doesn't detect invalid email adresses (123@notgmail.com, still returns true)
        /// </summary>
        /// <param name="address"></param>
        /// <returns></returns>
        public static bool IsEmail(string address)
        {
            try
            {
                MailAddress addr = new MailAddress(address);
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Sends the email in the parameter, returns true if succesfull false otherwise
        /// </summary>
        /// <param name="email">An instance of this class</param>
        public static async Task<bool> Send(Email email)
        {
            try
            {
                SmtpClient smtp = new SmtpClient("mathiastb.no");
                smtp.Port = 25;
                smtp.Credentials = new NetworkCredential(Email.From, "BSM66");

                MailMessage message = email.ToMailMessage();
                await smtp.SendMailAsync(message);

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Method that sends this instance(itself)
        /// </summary>
        public async Task<bool> Send()
        {
            return await Send(this);
        }

        /// <summary>
        /// Returns a MailMessage class from the properties of itself(this instance)
        /// </summary>
        /// <returns></returns>
        public MailMessage ToMailMessage()
        {
            return new MailMessage(From, Recipient, Title, Body);
        }

        #endregion Public Methods
    }
}