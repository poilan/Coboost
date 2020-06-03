using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Slagkraft.Models.Database;
using Slagkraft.Services;
using Microsoft.EntityFrameworkCore;
using Slagkraft.Models.Admin;
using Slagkraft.Models.Admin.Questions;
using Newtonsoft.Json;
using System.IO.Pipelines;

namespace Slagkraft.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        #region Private Fields

        private readonly DatabaseContext Context;

        #endregion Private Fields

        #region Public Structs

        public struct Help
        {
            #region Public Properties

            public string Title { get; set; }

            #endregion Public Properties
        }

        #endregion Public Structs

        #region Public Constructors

        public AdminController(DatabaseContext context)
        {
            Context = context;
        }

        #endregion Public Constructors

        #region Public Methods

        [HttpPost("{code}/change-group{group}-column{column}")]
        public void ChangeColumn(int code, int group, int column)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                if (admin.Questions[admin.Active] is OpenText open)
                {
                    ThreadPool.QueueUserWorkItem(o => open.ChangeColumn(group, column));
                    HttpContext.Response.StatusCode = 202;
                }
                else
                    HttpContext.Response.StatusCode = 412;
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
            }
        }

        [HttpPost("{code}/group-{group}/change-{target}/member-{member}")]
        public void ChangeGroup(int code, int group, int member, int target)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Questions[admin.Active] as OpenText;
                OpenText.Key key = new OpenText.Key
                {
                    Group = group,
                    Member = member,
                };
                ThreadPool.QueueUserWorkItem(o => open.SwitchGroup(key, target));
                HttpContext.Response.StatusCode = 202;
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
            }
        }

        [HttpPost("{code}/question-create-group-c{column}")]
        public void CreateGroup(int code, int column)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Questions[admin.Active] as OpenText;
                ThreadPool.QueueUserWorkItem(o => open.AddGroup("", column));
                HttpContext.Response.StatusCode = 201;
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
            }
        }

        [HttpPost("{code}/questions-create-multiplechoice")]
        public void CreateMultipleChoice(int code, [FromBody]MultipleChoice question)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.AddMultipleChoice(question));
                HttpContext.Response.StatusCode = 201;
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
            }
        }

        [HttpPost("{code}/questions-create-opentext")]
        public void CreateOpenText(int code, [FromBody]OpenText question)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.AddOpenText(question));
                HttpContext.Response.StatusCode = 201;
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
            }
        }

        [HttpPost("create")]
        public async Task CreateSession([FromBody]Session data)
        {
            if (string.IsNullOrWhiteSpace(data.Title))
            {
                HttpContext.Response.StatusCode = 406;
                return;
            }

            //Session last = Context.Sessions.ElementAt(Context.Sessions.Count());
            Session last = null;
            int count = Context.Sessions.Count();

            if (count > 0)
                last = Context.Sessions.AsEnumerable().Last();

            if (last == null)
            {
                data.Identity = 100000;
            }
            else
            {
                data.Identity = last.Identity + 1;

                if (data.Identity < 100000)
                    data.Identity = 100000;
            }

            data.LastOpen = DateTime.Now.ToString();
            await Context.Sessions.AddAsync(data);
            await Context.SaveChangesAsync();

            HttpContext.Response.StatusCode = 202;
        }

        [HttpGet("{code}/question-{index}")]
        public QuestionBase GetQuestion(int code, int index)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                if (admin.Questions.Count <= index)
                    return null;

                admin.Active = index;
                HttpContext.Response.StatusCode = 202;
                return admin.Questions[index].QuestionType switch
                {
                    QuestionBase.Type.MultipleChoice => admin.Questions[index] as MultipleChoice,
                    _ => admin.Questions[index] as OpenText,
                };
            }
            else
            {
                HttpContext.Response.StatusCode = 402;
                return null;
            }
        }

        [HttpGet("{code}/questions-all")]
        public IEnumerable<QuestionBase> GetQuestions(int code)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                HttpContext.Response.StatusCode = 202;
                return admin.Questions;
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
                return null;
            }
        }

        [HttpGet("sessions-{email}")]
        public async Task<List<Session>> GetSessions(string email)
        {
            List<Session> sessions = await Context.Sessions.ToListAsync();

            List<Session> userSessions = new List<Session>();

            foreach (Session session in sessions)
            {
                if (session.Email == email)
                {
                    userSessions.Add(session);
                }
            }
            return userSessions;
        }

        [HttpPost("load-{code}")]
        public async Task LoadSession(int code)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                HttpContext.Response.StatusCode = 200;
                return; //Session already active?
            }
            else
            {
                Session session = await Context.Sessions.FindAsync(code);
                if (session == null)
                {
                    HttpContext.Response.StatusCode = 404;
                    return; //Session doesn't exist!
                }

                AdminInstance model = new AdminInstance();

                if (!session.Questions.Equals("{}"))
                    model.LoadSession(session.Questions);

                Context.Active.Sessions.Add(code, model);
                HttpContext.Response.StatusCode = 201;
                return; //Loaded from database
            }
        }

        [HttpPost("{code}/question-merge{masterGroup}-{masterMember}with{subjectGroup}-{subjectMember}")]
        public void Merge(int code, int masterGroup, int masterMember, int subjectGroup, int subjectMember)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText.Key master = new OpenText.Key
                {
                    Group = masterGroup,
                    Member = masterMember,
                };

                OpenText.Key subject = new OpenText.Key
                {
                    Group = subjectGroup,
                    Member = subjectMember,
                };

                OpenText open = admin.Questions[admin.Active] as OpenText;
                ThreadPool.QueueUserWorkItem(o => open.Merge(master, subject));
                HttpContext.Response.StatusCode = 202;
                return;
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
                return;
            }
        }

        [HttpPost("{code}/question{current}-move{target}")]
        public void MoveQuestion(int code, int current, int target)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.MoveQuestion(current, target));
                Response.StatusCode = 200;
            }
            else
                Response.StatusCode = 404;
        }

        [HttpPost("{code}/question-rename-group-{group}")]
        public void RenameGroup(int code, int group, [FromBody]Help help)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Questions[admin.Active] as OpenText;

                ThreadPool.QueueUserWorkItem(o => open.RenameGroup(group, help.Title));
                HttpContext.Response.StatusCode = 202;
                return;
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
                return;
            }
        }

        [HttpPost("{code}/question-rename-member-{group}-{member}")]
        public void RenameMember(int code, int group, int member, [FromBody]Help help)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Questions[admin.Active] as OpenText;

                OpenText.Key key = new OpenText.Key
                {
                    Group = group,
                    Member = member,
                };
                ThreadPool.QueueUserWorkItem(o => open.RenameMember(key, help.Title));
                HttpContext.Response.StatusCode = 202;
                return;
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
                return;
            }
        }

        [HttpGet("{code}/stream-question-{index}")]
        public async void StreamQuestion(int code, int index)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                if (admin.Questions.Count <= index)
                {
                    Response.StatusCode = 406;
                    return;
                }

                admin.Active = index;
                Response.ContentType = "text/event-stream";

                if (admin.Questions[admin.Active] is OpenText)
                {
                    OpenText subject = admin.Questions[admin.Active] as OpenText;
                    while (true)
                    {
                        if (Response.HttpContext.RequestAborted.IsCancellationRequested)
                            break;

                        await Response.WriteAsync("event:" + "Groups\n");
                        string group = $"data: {JsonConvert.SerializeObject(subject.Groups)}\n\n";
                        await Response.WriteAsync(group);
                        await Response.Body.FlushAsync();

                        await Response.WriteAsync("event:" + "Archive\n");
                        string archive = $"data: {JsonConvert.SerializeObject(subject.Archive)}\n\n";
                        await Response.WriteAsync(archive);
                        await Response.Body.FlushAsync();

                        subject.Reset.Reset();
                        subject.Reset.WaitOne();
                    }
                }
                else if (admin.Questions[admin.Active] is MultipleChoice)
                {
                    MultipleChoice subject = admin.Questions[admin.Active] as MultipleChoice;
                    while (true)
                    {
                        if (Response.HttpContext.RequestAborted.IsCancellationRequested)
                            break;

                        await Response.WriteAsync("event:" + "Options\n");
                        string options = $"data: {JsonConvert.SerializeObject(subject.Options)}\n\n";
                        await Response.WriteAsync(options);
                        await Response.Body.FlushAsync();

                        await Response.WriteAsync("event:" + "Total\n");
                        string total = $"data: {JsonConvert.SerializeObject(subject.TotalVotes)}\n\n";
                        await Response.WriteAsync(total);
                        await Response.Body.FlushAsync();

                        await Response.WriteAsync("event:" + "Archive\n");
                        string archive = $"data: {JsonConvert.SerializeObject(subject.Archive)}\n\n";
                        await Response.WriteAsync(archive);
                        await Response.Body.FlushAsync();

                        subject.Reset.Reset();
                        subject.Reset.WaitOne();
                    }
                }
                else if (admin.Questions[admin.Active] is Points)
                {
                    Points subject = admin.Questions[admin.Active] as Points;
                    while (true)
                    {
                        if (Response.HttpContext.RequestAborted.IsCancellationRequested)
                            break;

                        await Response.WriteAsync("event:" + "Options\n");
                        string options = $"data: {JsonConvert.SerializeObject(subject.Options)}\n\n";
                        await Response.WriteAsync(options);
                        await Response.Body.FlushAsync();

                        await Response.WriteAsync("event:" + "Votes\n");
                        string votes = $"data: {JsonConvert.SerializeObject(subject.Votes)}\n\n";
                        await Response.WriteAsync(votes);
                        await Response.Body.FlushAsync();

                        await Response.WriteAsync("event:" + "Archive\n");
                        string archive = $"data: {JsonConvert.SerializeObject(subject.Archive)}\n\n";
                        await Response.WriteAsync(archive);
                        await Response.Body.FlushAsync();

                        subject.Reset.Reset();
                        subject.Reset.WaitOne();
                    }
                }
                else if (admin.Questions[admin.Active] is Rate)
                {
                    Rate subject = admin.Questions[admin.Active] as Rate;
                    while (true)
                    {
                        if (Response.HttpContext.RequestAborted.IsCancellationRequested)
                            break;

                        await Response.WriteAsync("event:" + "Options\n");
                        string options = $"data: {JsonConvert.SerializeObject(subject.Options)}\n\n";
                        await Response.WriteAsync(options);
                        await Response.Body.FlushAsync();

                        await Response.WriteAsync("event:" + "Votes\n");
                        string votes = $"data: {JsonConvert.SerializeObject(subject.Votes)}\n\n";
                        await Response.WriteAsync(votes);
                        await Response.Body.FlushAsync();

                        await Response.WriteAsync("event:" + "Archive\n");
                        string archive = $"data: {JsonConvert.SerializeObject(subject.Archive)}\n\n";
                        await Response.WriteAsync(archive);
                        await Response.Body.FlushAsync();

                        subject.Reset.Reset();
                        subject.Reset.WaitOne();
                    }
                }

                Response.Body.Close();
            }
            else
            {
                HttpContext.Response.StatusCode = 404;
            }
        }

        #endregion Public Methods
    }
}