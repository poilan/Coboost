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
using System.Globalization;

namespace Slagkraft.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        #region Public Structs

        public struct Help
        {
            #region Public Properties

            public string Title { get; set; }

            #endregion Public Properties
        }

        #endregion Public Structs

        #region Private Fields

        private readonly DatabaseContext Context;

        #endregion Private Fields

        #region Public Constructors

        public AdminController(DatabaseContext context)
        {
            Context = context;
        }

        #endregion Public Constructors

        #region Public Methods

        [HttpPost("{code}/active-{index}")]
        public void Active(int code, int index)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                if (admin.Tasks.Count <= index)
                {
                    Response.StatusCode = 406;
                    return;
                }

                admin.Active = index;
                HttpContext.Response.StatusCode = 200;
            }
            else
            {
                Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/question-archive-group-{group}")]
        public void ArchiveGroup(int code, int group)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;

                ThreadPool.QueueUserWorkItem(o => open.ArchiveGroup(group));
                HttpContext.Response.StatusCode = 202;
                return;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
                return;
            }
        }

        [HttpPost("{code}/question-archive-member-{group}-{member}")]
        public void ArchiveMember(int code, int group, int member)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;

                OpenText.Key key = new OpenText.Key
                {
                    Group = group,
                    Member = member,
                };
                ThreadPool.QueueUserWorkItem(o => open.ArchiveMember(key));
                HttpContext.Response.StatusCode = 202;
                return;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
                return;
            }
        }

        [HttpPost("{code}/change-group{group}-column{column}")]
        public void ChangeColumn(int code, int group, int column)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                if (admin.Tasks[admin.Active] is OpenText open)
                {
                    ThreadPool.QueueUserWorkItem(o => open.ChangeColumn(group, column));
                    HttpContext.Response.StatusCode = 202;
                }
                else
                    HttpContext.Response.StatusCode = 412;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/group-{group}/change-{target}/member-{member}")]
        public void ChangeGroup(int code, int group, int member, int target)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;
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
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/close")]
        public async void CloseSession(int code)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                Session session = await Context.Sessions.FindAsync(admin.EventCode);
                if (session != null)
                {
                    session.Questions = admin.SaveSession();
                    session.LastOpen = DateTime.UtcNow.ToString("G", CultureInfo.CreateSpecificCulture("en-US"));
                    Context.Sessions.Update(session);
                }
            }
            Context.Active.Sessions.Remove(code);
            Context.SaveChanges();

            HttpContext.Response.StatusCode = 200;
        }

        [HttpPost("{code}/question-create-group-c{column}")]
        public void CreateGroup(int code, int column)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;
                ThreadPool.QueueUserWorkItem(o => open.AddGroup("", column));
                HttpContext.Response.StatusCode = 201;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/questions-create-multiplechoice")]
        public void CreateMultipleChoice(int code, [FromBody] MultipleChoice question)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.AddMultipleChoice(question));
                HttpContext.Response.StatusCode = 201;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/questions-create-opentext")]
        public void CreateOpenText(int code, [FromBody] OpenText question)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.AddOpenText(question));
                HttpContext.Response.StatusCode = 201;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/questions-create-points")]
        public void CreatePoints(int code, [FromBody] Points question)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.AddPoints(question));
                HttpContext.Response.StatusCode = 201;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/questions-create-slider")]
        public void CreateRate(int code, [FromBody] Rate question)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.AddRate(question));
                HttpContext.Response.StatusCode = 201;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("create")]
        public async Task CreateSession([FromBody] Session data)
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

            data.LastOpen = DateTime.UtcNow.ToString("G", CultureInfo.CreateSpecificCulture("en-US"));
            await Context.Sessions.AddAsync(data);
            await Context.SaveChangesAsync();

            HttpContext.Response.StatusCode = 202;
        }

        [HttpPost("{code}/delete")]
        public async Task DeleteSession(int code)
        {
            Session session = await Context.Sessions.FindAsync(code);
            if (session == null)
            {
                HttpContext.Response.StatusCode = 400;
            }
            else
            {
                Context.Sessions.Remove(session);
                if (Context.Active.Sessions.ContainsKey(code))
                {
                    Context.Active.Sessions.Remove(code);
                }
                await Context.SaveChangesAsync();
                HttpContext.Response.StatusCode = 200;
            }
        }

        [HttpPost("{code}/task-delete-{index}")]
        public void DeleteTask(int code, int index)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.DeleteTask(index));
                HttpContext.Response.StatusCode = 200;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpGet("{code}/question-{index}")]
        public BaseTask GetQuestion(int code, int index)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                if (admin.Tasks.Count <= index)
                    return null;

                admin.Active = index;
                HttpContext.Response.StatusCode = 202;
                return admin.Tasks[index].Type switch
                {
                    BaseTask.TaskType.MultipleChoice => admin.Tasks[index] as MultipleChoice,
                    _ => admin.Tasks[index] as OpenText,
                };
            }
            else
            {
                HttpContext.Response.StatusCode = 402;
                return null;
            }
        }

        [HttpGet("{code}/questions-all")]
        public string GetQuestions(int code)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                HttpContext.Response.StatusCode = 202;
                string tasks = JsonConvert.SerializeObject(admin.Tasks);

                return tasks;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
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

        [HttpPost("{code}/group{group}-member{member}")]
        public void LastGroup(int code, int group, int member)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;
                OpenText.Key key = new OpenText.Key
                {
                    Group = group,
                    Member = member,
                };
                ThreadPool.QueueUserWorkItem(o => open.SwitchGroup(key, open.Groups.Count - 1));
                HttpContext.Response.StatusCode = 202;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
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
                    HttpContext.Response.StatusCode = 412;
                    return; //Session doesn't exist!
                }

                AdminInstance model = new AdminInstance
                {
                    EventCode = session.Identity,
                    Owner = session.Email
                };

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

                OpenText open = admin.Tasks[admin.Active] as OpenText;
                ThreadPool.QueueUserWorkItem(o => open.Merge(master, subject));
                HttpContext.Response.StatusCode = 202;
                return;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
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
                Response.StatusCode = 412;
        }

        [HttpPost("{code}/question-rename-group-{group}")]
        public void RenameGroup(int code, int group, [FromBody] Help help)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;

                ThreadPool.QueueUserWorkItem(o => open.RenameGroup(group, help.Title));
                HttpContext.Response.StatusCode = 202;
                return;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
                return;
            }
        }

        [HttpPost("{code}/question-rename-member-{group}-{member}")]
        public void RenameMember(int code, int group, int member, [FromBody] Help help)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;

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
                HttpContext.Response.StatusCode = 412;
                return;
            }
        }

        [HttpPost("{code}/save")]
        public async void SaveSession(int code)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                Session session = await Context.Sessions.FindAsync(admin.EventCode);
                if (session != null)
                {
                    session.Questions = admin.SaveSession();
                    session.LastOpen = DateTime.UtcNow.ToString("G", CultureInfo.CreateSpecificCulture("en-US"));
                    Context.Sessions.Update(session);
                    Context.SaveChanges();
                }
            }

            HttpContext.Response.StatusCode = 200;
        }

        [HttpGet("{code}/stream-question-{index}")]
        public async void StreamQuestion(int code, int index)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                Response.ContentType = "text/event-stream";

                if (index >= admin.Tasks.Count)
                {
                    Response.StatusCode = 406;
                    return;
                }

                if (admin.Tasks[index] is OpenText)
                {
                    OpenText subject = admin.Tasks[index] as OpenText;
                    while (true)
                    {
                        if (Response.HttpContext.RequestAborted.IsCancellationRequested)
                            break;
                        {
                            OpenText_Group[] groups = subject.Groups.ToArray();
                            await Response.WriteAsync("event:" + "Groups\n");
                            string json = $"data: {JsonConvert.SerializeObject(groups)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }
                        {
                            OpenText_Input[] archive = subject.Archive.ToArray();
                            await Response.WriteAsync("event:" + "Archive\n");
                            string json = $"data: {JsonConvert.SerializeObject(archive)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }
                        subject.Reset.Reset();
                        subject.Reset.WaitOne();
                    }
                }
                else if (admin.Tasks[index] is MultipleChoice)
                {
                    MultipleChoice subject = admin.Tasks[index] as MultipleChoice;
                    while (true)
                    {
                        if (Response.HttpContext.RequestAborted.IsCancellationRequested)
                            break;
                        {
                            MultipleChoice_Option[] options = subject.Options.ToArray();
                            await Response.WriteAsync("event:" + "Options\n");
                            string json = $"data: {JsonConvert.SerializeObject(options)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }
                        {
                            int total = subject.TotalVotes;
                            await Response.WriteAsync("event:" + "Total\n");
                            string json = $"data: {JsonConvert.SerializeObject(total)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }
                        {
                            MultipleChoice_Option[] archive = subject.Archive.ToArray();
                            await Response.WriteAsync("event:" + "Archive\n");
                            string json = $"data: {JsonConvert.SerializeObject(archive)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }

                        subject.Reset.Reset();
                        subject.Reset.WaitOne();
                    }
                }
                else if (admin.Tasks[index] is Points)
                {
                    Points subject = admin.Tasks[index] as Points;
                    {
                        int amount = subject.Amount;
                        await Response.WriteAsync("event:" + "Amount\n");
                        string json = $"data: {JsonConvert.SerializeObject(amount)}\n\n";
                        await Response.WriteAsync(json);
                        await Response.Body.FlushAsync();
                    }

                    while (true)
                    {
                        if (Response.HttpContext.RequestAborted.IsCancellationRequested)
                            break;

                        {
                            Points_Option[] options = subject.Options.ToArray();
                            await Response.WriteAsync("event:" + "Options\n");
                            string json = $"data: {JsonConvert.SerializeObject(options)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }

                        {
                            Points_Vote[] votes = subject.Votes.ToArray();
                            await Response.WriteAsync("event:" + "Votes\n");
                            string json = $"data: {JsonConvert.SerializeObject(votes)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }

                        {
                            Points_Option[] archive = subject.Archive.ToArray();
                            await Response.WriteAsync("event:" + "Archive\n");
                            string json = $"data: {JsonConvert.SerializeObject(archive)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }

                        subject.Reset.Reset();
                        subject.Reset.WaitOne();
                    }
                }
                else if (admin.Tasks[index] is Rate)
                {
                    Rate subject = admin.Tasks[index] as Rate;
                    while (true)
                    {
                        if (Response.HttpContext.RequestAborted.IsCancellationRequested)
                            break;
                        {
                            Rate_Option[] options = subject.Options.ToArray();
                            await Response.WriteAsync("event:" + "Options\n");
                            string json = $"data: {JsonConvert.SerializeObject(options)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }
                        {
                            Rate_Vote[] votes = subject.Votes.ToArray();
                            await Response.WriteAsync("event:" + "Votes\n");
                            string json = $"data: {JsonConvert.SerializeObject(votes)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }
                        {
                            Rate_Option[] archive = subject.Archive.ToArray();
                            await Response.WriteAsync("event:" + "Archive\n");
                            string json = $"data: {JsonConvert.SerializeObject(archive)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }

                        subject.Reset.Reset();
                        subject.Reset.WaitOne();
                    }
                }

                Response.Body.Close();
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        #endregion Public Methods

        #region Private Methods

        private async Task SaveAdmin(int code)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                Session session = await Context.Sessions.FindAsync(admin.EventCode);
                if (session != null)
                {
                    session.Questions = admin.SaveSession();
                    session.LastOpen = DateTime.UtcNow.ToString("G", CultureInfo.CreateSpecificCulture("en-US"));
                    Context.Sessions.Update(session);
                    Context.SaveChanges();
                }
            }
            return;
        }

        #endregion Private Methods
    }
}