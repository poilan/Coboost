using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Slagkraft.Models.Database;
using Slagkraft.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Slagkraft.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        #region Private Fields

        private readonly DatabaseContext Context;

        #endregion Private Fields

        #region Public Methods

        /// <summary>
        /// Instantiates the controller and retrieves an instance of the database context
        /// </summary>
        /// <param name="context"></param>
        public UserController(DatabaseContext context)
        {
            Context = context;
        }

        /// <summary>
        /// Attempts to find the user with the specified index and returns it. If no user is found,
        /// then null is returned
        /// </summary>
        /// <param name="email"></param>
        [HttpGet("get-{email}")]
        public async Task<User> GetUser(string email)
        {
            if (email == null)
                return null;

            User User = await Context.Users.FindAsync(email);

            if (User == null)
                return null;

            User.Password = "REDACTED";

            return User;
        }

        /// <summary>
        /// Returns a List of all users
        /// </summary>
        [HttpGet("getall")]
        public async Task<IEnumerable<User>> GetUsers()
        {
            List<User> userList = await Context.Users.ToListAsync();

            return userList;
        }

        /// <summary>
        /// Checks if login info matches any Created Accounts
        /// </summary>
        /// <param name="user">The user information</param>
        [HttpPost("login")]
        public async Task Login([FromBody]User user)
        {
            User foundUser = await Context.Users.FindAsync(user.Email);
            if (foundUser != null)
            {
                if (PasswordHasher.Verify(user.Password, foundUser.Password))
                {
                    HttpContext.Response.StatusCode = 202;
                    return;
                }
                else
                {
                    HttpContext.Response.StatusCode = 406;
                    return;
                }
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
                return;
            }
        }

        /// <summary>
        /// Creates a new user, makes sure the email isn't already in use.
        /// </summary>
        /// <param name="user">The New Users Information</param>
        /// <returns>Success or failure</returns>
        [HttpPost("register")]
        public async Task Register([FromBody]User user)
        {
            if (user == null)
            {
                //Data not recieved
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

            User userExistence = await Context.Users.SingleOrDefaultAsync(u => u.Email.Equals(user.Email));
            if (userExistence != null)
            //if (_context.Users.Find(user.Email) != null)
            {
                //Email address is already in use
                HttpContext.Response.StatusCode = 409;
                return;
            }

            user.Password = PasswordHasher.GetHash(user.Password);

            await Context.Users.AddAsync(user);
            await Context.SaveChangesAsync();

            string Recipient = user.Email;
            string Title = "Innonor Registration";
            string Body = $"Dear {user.FirstName},\n" +
                $"Your new account is now created an is available for use.\n\n" +
                $"Regards,\n" +
                $"Innonor";

            Email email = new Email(Recipient, Title, Body);
            await email.Send();
            HttpContext.Response.StatusCode = 202;
            return;
        }

        #endregion Public Methods
    }
}