using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Coboost.Models.Database;
using Coboost.Models.Database.data;
using Coboost.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Coboost.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DatabaseContext _context;

        /// <summary>
        ///     Instantiates the controller and retrieves an instance of the database context
        /// </summary>
        /// <param name="context"></param>
        public UserController(DatabaseContext context)
        {
            _context = context;
        }

        /// <summary>
        ///     Attempts to find the user with the specified index and returns it. If no user is found,
        ///     then null is returned
        /// </summary>
        /// <param name="email"></param>
        [HttpGet("get-{email}")]
        public async Task<User> GetUser(string email)
        {
            if (email == null)
                return null;

            User user = await _context.Users.Include(u => u.Sessions).ThenInclude(s => s.Session).Include(u => u.Folders).ThenInclude(f => f.Session).Where(u => u.Email.Equals(email)).SingleAsync();

            if (user == null)
                return null;

            user.Password = "REDACTED";

            return user;
        }

        /// <summary>
        ///     Returns a List of all users
        /// </summary>
        [HttpGet("get-all")]
        public async Task<IEnumerable<User>> GetUsers()
        {
            List<User> userList = await _context.Users.Include(u => u.Sessions).ThenInclude(u => u.Session).ToListAsync();

            return userList;
        }

        /// <summary>
        ///     Checks if login info matches any Created Accounts
        /// </summary>
        /// <param name="user">The user information</param>
        [HttpPost("login")]
        public async Task Login([FromBody] User user)
        {
            User foundUser = await _context.Users.FindAsync(user.Email);
            if (foundUser != null)
                HttpContext.Response.StatusCode = PasswordHasher.Verify(user.Password, foundUser.Password) ?
                    202 :
                    401;
            else
                HttpContext.Response.StatusCode = 404;
        }

        /// <summary>
        ///     Creates a new user, makes sure the email isn't already in use.
        /// </summary>
        /// <param name="user">The New Users Information</param>
        /// <returns>Success or failure</returns>
        [HttpPost("register")]
        public async Task Register([FromBody] User user)
        {
            if (user == null)
            {
                //Data not received
                HttpContext.Response.StatusCode = 400;
                return;
            }

            if (!Email.IsEmail(user.Email))
            {
                //Invalid Email address
                HttpContext.Response.StatusCode = 406;
                return;
            }

            if (user.Password.Length < 8)
            {
                //Password too short
                HttpContext.Response.StatusCode = 406;
                return;
            }

            User userExistence = await _context.Users.SingleOrDefaultAsync(u => u.Email.Equals(user.Email));
            if (userExistence != null)
            {
                //Email address is already in use
                HttpContext.Response.StatusCode = 409;
                return;
            }

            user.Password = PasswordHasher.GetHash(user.Password);

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            string recipient = user.Email;
            const string title = "Coboost Registration!";
            string body = $"Dear {user.FirstName},\nYour new account is now created an is available for use.\n\nRegards,\nCoboost";

            Email email = new Email(recipient, title, body);
            await email.Send();
            HttpContext.Response.StatusCode = 201;
        }

        [HttpPost("start-recovery")]
        public async Task StartRecovery([FromBody] User user)
        {
            if (user == null)
            {
                // Data not received
                HttpContext.Response.StatusCode = 400;
                return;
            }

            if (!Email.IsEmail(user.Email))
            {
                // Invalid Email address
                HttpContext.Response.StatusCode = 406;
                return;
            }

            User userExistence = await _context.Users.SingleOrDefaultAsync(u => u.Email.Equals(user.Email));
            if (userExistence == null)
            {
                HttpContext.Response.StatusCode = 404;
                return;
            }

            string recipient = user.Email;
            const string title = "Coboost Account Recovery";

            const int code = 239210;

            string body = $"Dear {userExistence.FirstName},\n" + "You recently requested to reset your password for your Coboost account. Please use the code below into the recovery code field to recover your account.\n\n" + $"Code: {code}\n\n" +
                          "Regards\nTeam Coboost";

            Email email = new Email(recipient, title, body);
            await email.Send();
            HttpContext.Response.StatusCode = 202;
        }
    }
}