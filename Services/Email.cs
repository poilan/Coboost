using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Coboost.Services
{
    /// <summary>
    ///     Sends Emails, one instance of this class is one Email.
    /// </summary>
    public class Email
    {
        private const string From = "donotreply@mathiastb.no";

        private string Body
        {
            get;
        }

        private string Recipient
        {
            get;
        }

        private string Title
        {
            get;
        }

        /// <summary>
        ///     Creates a new email
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

        /// <summary>
        ///     Returns true if the parameter is an email, doesn't detect invalid email addressees (123@notgmail.com, still returns
        ///     true)
        /// </summary>
        /// <param name="address"></param>
        /// <returns></returns>
        public static bool IsEmail(string address)
        {
            try
            {
                // ReSharper disable once UnusedVariable
                MailAddress emailAddress = new MailAddress(address);
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        ///     Method that sends this instance(itself)
        /// </summary>
        public async Task Send()
        {
            await Send(this);
        }

        /// <summary>
        ///     Sends the email in the parameter, returns true if successful false otherwise
        /// </summary>
        /// <param name="email">An instance of this class</param>
        private static async Task Send(Email email)
        {
            try
            {
                SmtpClient smtp = new SmtpClient("mathiastb.no")
                {
                    Port = 25,
                    Credentials = new NetworkCredential(From, "BSM66")
                };

                MailMessage message = email.ToMailMessage();
                await smtp.SendMailAsync(message);
            }

            // ReSharper disable once EmptyGeneralCatchClause
            catch
            {
            }
        }

        /// <summary>
        ///     Returns a MailMessage class from the properties of itself(this instance)
        /// </summary>
        /// <returns></returns>
        private MailMessage ToMailMessage()
        {
            return new MailMessage(From, Recipient, Title, Body);
        }
    }
}