using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Coboost.Models.Database;
using Coboost.Models.Database.data;
using Coboost.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Coboost.Controllers
{
    [RequireHttps]
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DatabaseContext _context;

        /// <summary>
        ///     Instantiates the controller and retrieves an instance of the database context
        /// </summary>
        /// <param name="context"></param>
        /// <param name="userManager"></param>
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

            //User user = await _context.Users.Include(u => u.Sessions).ThenInclude(s => s.Session).Include(u => u.Folders).ThenInclude(f => f.Session).Where(u => u.Email.Equals(email)).SingleAsync();
            User user = await _context.Users.FindAsync(email);
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
            //List<User> userList = await _context.Users.Include(u => u.Sessions).ThenInclude(u => u.Session).ToListAsync();
            List<User> userList = await _context.Users.ToListAsync();
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
            {
                if (PasswordHasher.Verify(user.Password, foundUser.Password))
                {
                    if (foundUser.EmailConfirmed)
                    {
                        HttpContext.Response.StatusCode = 202;
                    }
                    else
                    {
                        string token = Guid.NewGuid().ToString();
                        string callbackUrl = Url.Action("ConfirmEmail", "user", new
                        {
                            userId = foundUser.Email,
                            token
                        }, HttpContext.Request.Scheme);

                        foundUser.Token = token;
                        _context.Users.Update(foundUser);
                        await _context.SaveChangesAsync();

                        //TODO: Add this to the Email Class
                        string recipient = foundUser.Email;
                        string title = "Coboost - Confirm Email";
                        string body = $"Dear {foundUser.FirstName},\n" + "Your new account is waiting, you only have to confirm this email is yours!.\n" + "If you haven't attempted to create a user, you can safely ignore this email.\n" + "\n" +
                                      "\n" + "To enable your Account please click on the link below:\n" + callbackUrl + "\n" + "\n" + "\n" + "Regards,\n" + "Coboost";

                        Email email = new Email(recipient, title, body);
                        await email.Send();
                        HttpContext.Response.StatusCode = 409;
                    }
                }
                else
                {
                    HttpContext.Response.StatusCode = 404;
                }
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
            }
        }

        /// <summary>
        ///     Creates a new user, makes sure the email isn't already in use.
        /// </summary>
        /// <param name="user">The New Users Information</param>
        /// <returns>Success or failure</returns>
        [HttpPost("register")]
        public async Task Register([FromBody] User user)
        {
            //TODO: Move Valid User Check into own Method
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

            user.EmailConfirmed = false;
            user.LastUsed = DateTime.UtcNow.ToString(CultureInfo.InvariantCulture);
            user.UniqueDaysUsed = 0;

            User userExistence = await _context.Users.SingleOrDefaultAsync(u => u.Email.Equals(user.Email));
            if (userExistence != null)
            {
                //Email address is already in use
                HttpContext.Response.StatusCode = 409;
                return;
            }

            //Hash their Password
            user.Password = PasswordHasher.GetHash(user.Password);


            string token = Guid.NewGuid().ToString();
            string callbackUrl = Url.Action("ConfirmEmail", "user", new
            {
                userId = user.Email,
                token
            }, HttpContext.Request.Scheme);

            user.Token = token;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            //TODO: Add this to the Email Class
            string recipient = user.Email;
            string title = "Coboost - Confirm Email";
            string body = $"Dear {user.FirstName},\n" + "Your new account is waiting, you only have to confirm this email is yours!.\n" + "If you haven't attempted to create a user, you can safely ignore this email.\n" + "\n" + "\n" +
                          "To enable your Account please click on the link below:\n" + callbackUrl + "\n" + "\n" + "\n" + "Regards,\n" + "Coboost";

            Email email = new Email(recipient, title, body);
            await email.Send();

            HttpContext.Response.StatusCode = 201;
        }

        [HttpGet("confirm-email")]
        public async Task ConfirmEmail(string userid, string token)
        {
            User user = await _context.Users.FindAsync(userid);

            bool result = string.Equals(user.Token, token);

            if (result)
            {
                user.LastUsed = DateTime.UtcNow.ToString(CultureInfo.InvariantCulture);
                user.EmailConfirmed = true;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                string recipient = user.Email;
                const string title = "Coboost";
                string body = $"Dear {user.FirstName},\nYour new account is now created an is available for use.\n\nRegards,\nCoboost";

                Email mail = new Email(recipient, title, body);
                await mail.Send();
                HttpContext.Response.StatusCode = 202;
            }

            HttpContext.Response.Redirect("http://innonor.mathiastb.no");
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


            string token = PasswordHasher.GetHash(user.Password);
            string callbackUrl = Url.Action("ConfirmRecovery", "user", new
            {
                userId = user.Email,
                token
            }, HttpContext.Request.Scheme);

            userExistence.Token = token;

            _context.Users.Update(userExistence);
            await _context.SaveChangesAsync();

            string recipient = user.Email;


            const string title = "Coboost Account Recovery";

            string body = $"Dear {userExistence.FirstName},\n" + "You recently requested to reset your password for your Coboost account.\n" +
                          "If you didn't, or simply don't want to change your password after all. DO NOT CLICK ON THAT LINK, since that link will confirm the change as soon as it loads\n" +
                          "If you did make the request, and are sure you want to change it. Then the new password will replace the old one THE VERY SECOND you click that link. Copy-pasting it would also work.\n\n" + callbackUrl + "\n\n" +
                          "Regards\nTeam Coboost";

            Email email = new Email(recipient, title, body);
            await email.Send();
            HttpContext.Response.StatusCode = 202;
        }

        [HttpGet("confirm-recovery")]
        public async Task ConfirmRecovery(string userid, string token)
        {
            User user = await _context.Users.FindAsync(userid);

            bool result = string.Equals(user.Token, token);

            if (result)
            {
                user.Password = user.Token;
                user.EmailConfirmed = true;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                HttpContext.Response.StatusCode = 202;
            }

            HttpContext.Response.Redirect("http://innonor.mathiastb.no");
        }
    }
}