using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Coboost.Models.Admin;
using Coboost.Models.Admin.Tasks;
using Coboost.Models.Admin.Tasks.Input.Standard;
using Coboost.Models.Admin.Tasks.Input.Standard.data;
using Coboost.Models.Admin.Tasks.Votes.Multiple_Choice;
using Coboost.Models.Admin.Tasks.Votes.Multiple_Choice.data;
using Coboost.Models.Admin.Tasks.Votes.Points;
using Coboost.Models.Admin.Tasks.Votes.Points.data;
using Coboost.Models.Admin.Tasks.Votes.Slider;
using Coboost.Models.Admin.Tasks.Votes.Slider.data;
using Coboost.Models.Database;
using Coboost.Models.Database.data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

// ReSharper disable UnusedAutoPropertyAccessor.Global

namespace Coboost.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        #region Private Fields

        private readonly DatabaseContext _context;

        #endregion Private Fields

        #region Public Constructors

        public AdminController(DatabaseContext context)
        {
            _context = context;
        }

        #endregion Public Constructors

        #region Public Structs

        public struct Help
        {
            #region Public Properties

            public string Title { get; set; }

            #endregion Public Properties
        }

        #endregion Public Structs

        #region Public Methods

        [HttpPost("{code}/active-{index}")]
        public void Active(int code, int index)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
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
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;

                ThreadPool.QueueUserWorkItem(o => open?.ArchiveGroup(group));
                HttpContext.Response.StatusCode = 202;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/text-duplicate")]
        public void Duplicate(int code, [FromBody] OpenTextInput[] inputs)
        {
            if (!DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
                return;

            if (!(admin.Tasks[admin.Active] is OpenText task))
                return;

            ThreadPool.QueueUserWorkItem(o => task.Duplicate(inputs));
        }

        [HttpPost("{code}/question-archive-member-{group}-{member}")]
        public void ArchiveMember(int code, int group, int member)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;

                OpenText.Key key = new OpenText.Key
                {
                    Group = group,
                    Member = member
                };
                ThreadPool.QueueUserWorkItem(o => open?.ArchiveMember(key));
                HttpContext.Response.StatusCode = 202;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/question-archive-members")]
        public void ArchiveMember(int code, [FromBody] OpenText.Key[] keys)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;


                ThreadPool.QueueUserWorkItem(o => open?.ArchiveMembers(keys));
                HttpContext.Response.StatusCode = 202;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/change-group{group}-column{column}")]
        public void ChangeColumn(int code, int group, int column)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                if (admin.Tasks[admin.Active] is OpenText open)
                {
                    ThreadPool.QueueUserWorkItem(o => open.ChangeColumn(group, column));
                    HttpContext.Response.StatusCode = 202;
                }
                else
                {
                    HttpContext.Response.StatusCode = 412;
                }
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/group-{group}/change-{target}/member-{member}")]
        public void ChangeGroup(int code, int group, int member, int target)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;
                OpenText.Key key = new OpenText.Key
                {
                    Group = group,
                    Member = member
                };
                ThreadPool.QueueUserWorkItem(o => open?.SwitchGroup(key, target));
                HttpContext.Response.StatusCode = 202;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/close")]
        public async Task CloseSession(int code)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                Session session = await _context.Sessions.FindAsync(admin.EventCode);
                if (session != null)
                {
                    session.Questions = admin.SaveSession();
                    if (session.Questions == null)
                    {
                        HttpContext.Response.StatusCode = 500;
                        return;
                    }

                    session.LastOpen = DateTime.UtcNow.ToString("G", CultureInfo.CreateSpecificCulture("en-US"));
                    _context.Sessions.Update(session);
                }
            }

            DatabaseContext.Active.Sessions.Remove(code);
            await _context.SaveChangesAsync();

            HttpContext.Response.StatusCode = 200;
        }

        [HttpPost("{code}/text-group{group}-collapse")]
        public void CollapseGroup(int code, int group)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;

                ThreadPool.QueueUserWorkItem(o => open?.GroupCollapse(group));
                HttpContext.Response.StatusCode = 202;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/question-create-group-c{column}")]
        public void CreateGroup(int code, int column)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;
                ThreadPool.QueueUserWorkItem(o => open?.AddGroup("", column));
                HttpContext.Response.StatusCode = 201;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/create-vote-multi")]
        public void CreateMultipleChoice(int code, [FromBody] MultipleChoice question)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.AddMultipleChoice(question));
                HttpContext.Response.StatusCode = 201;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/create-text-open")]
        public void CreateOpenText(int code, [FromBody] OpenText question)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
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
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
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
        public void CreateRate(int code, [FromBody] Slider question)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
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

            data.LastOpen = DateTime.UtcNow.ToString("G", CultureInfo.CreateSpecificCulture("en-US"));
            await _context.Sessions.AddAsync(data);
            await _context.SaveChangesAsync();

            // Join the user and session
            UserSession userSession = new UserSession
            {
                UserId = data.Email,
                SessionId = data.Identity
            };

            await _context.UserSessions.AddAsync(userSession);
            await _context.SaveChangesAsync();

            HttpContext.Response.StatusCode = 202;
        }

        [HttpPost("{code}/delete")]
        public async Task DeleteSession(int code)
        {
            Session session = await _context.Sessions.FindAsync(code);
            if (session == null)
            {
                HttpContext.Response.StatusCode = 400;
            }
            else
            {
                _context.Sessions.Remove(session);
                if (DatabaseContext.Active.Sessions.ContainsKey(code)) DatabaseContext.Active.Sessions.Remove(code);
                await _context.SaveChangesAsync();
                HttpContext.Response.StatusCode = 200;
            }
        }

        [HttpPost("{code}/task-delete-{index}")]
        public async Task DeleteTask(int code, int index)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.DeleteTask(index));
                await Task.Delay(1000);
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
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                if (admin.Tasks.Count <= index)
                    return null;

                admin.Active = index;
                HttpContext.Response.StatusCode = 202;
                return admin.Tasks[index].Type switch
                {
                    BaseTask.TaskType.MultipleChoice => admin.Tasks[index] as MultipleChoice,
                    BaseTask.TaskType.Points => admin.Tasks[index] as Points,
                    BaseTask.TaskType.Slider => admin.Tasks[index] as Slider,
                    var _ => admin.Tasks[index] as OpenText
                };
            }

            HttpContext.Response.StatusCode = 402;
            return null;
        }

        [HttpGet("{code}/questions-all")]
        public string GetQuestions(int code)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                HttpContext.Response.StatusCode = 202;
                string json = JsonConvert.SerializeObject(admin.Tasks);

                return json;
            }

            HttpContext.Response.StatusCode = 412;
            return null;
        }

        [HttpGet("sessions-{email}")]
        public async Task<List<Session>> GetSessions(string email)
        {
            User user = await _context.Users
                .Include(u => u.Sessions)
                .ThenInclude(s => s.Session)
                .ThenInclude(s => s.Users)
                .Include(u => u.Folders)
                .ThenInclude(f => f.Session)
                .ThenInclude(s => s.Folders)
                .ThenInclude(f => f.Folder)
                .Where(u => u.Email.Equals(email))
                .SingleOrDefaultAsync();

            IEnumerable<Session> sessions = from userSession in user.Sessions
                select userSession.Session;
            return sessions.ToList();
        }

        [HttpPost("{code}/group{group}-recolor")]
        public void GroupColor(int code, int group, [FromBody] string color)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                if (color == null) HttpContext.Response.StatusCode = 400;

                if (admin.Tasks[admin.Active] is OpenText open)
                {
                    ThreadPool.QueueUserWorkItem(o => open.ColorGroup(group, color));
                    HttpContext.Response.StatusCode = 202;
                }
                else
                {
                    HttpContext.Response.StatusCode = 400;
                }
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/group{group}-member{member}")]
        public void LastGroup(int code, int group, int member)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;
                OpenText.Key key = new OpenText.Key
                {
                    Group = group,
                    Member = member
                };
                ThreadPool.QueueUserWorkItem(o => open?.SwitchGroup(key, open.Groups.Count - 1));
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
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance _))
            {
                HttpContext.Response.StatusCode = 200;
            }
            else
            {
                Session session = await _context.Sessions.FindAsync(code);
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

                DatabaseContext.Active.Sessions.Add(code, model);
                HttpContext.Response.StatusCode = 201;
            }
        }

        [HttpPost("{code}/question-merge{masterGroup}-{masterMember}with{subjectGroup}-{subjectMember}")]
        public void Merge(int code, int masterGroup, int masterMember, int subjectGroup, int subjectMember)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText.Key master = new OpenText.Key
                {
                    Group = masterGroup,
                    Member = masterMember
                };

                OpenText.Key subject = new OpenText.Key
                {
                    Group = subjectGroup,
                    Member = subjectMember
                };

                OpenText open = admin.Tasks[admin.Active] as OpenText;
                ThreadPool.QueueUserWorkItem(o => open?.Merge(master, subject));
                HttpContext.Response.StatusCode = 202;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/question{current}-move{target}")]
        public void MoveQuestion(int code, int current, int target)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.MoveQuestion(current, target));
                Response.StatusCode = 200;
            }
            else
            {
                Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/option{option}-recolor")]
        public void OptionColor(int code, int option, [FromBody] string color)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                if (color == null) HttpContext.Response.StatusCode = 400;

                switch (admin.Tasks[admin.Active])
                {
                    case MultipleChoice mp:
                        ThreadPool.QueueUserWorkItem(o => mp.ColorOption(option, color));
                        HttpContext.Response.StatusCode = 202;
                        break;

                    case Points points:
                        ThreadPool.QueueUserWorkItem(o => points.ColorOption(option, color));
                        HttpContext.Response.StatusCode = 202;
                        break;

                    case Slider slider:
                        ThreadPool.QueueUserWorkItem(o => slider.ColorOption(option, color));
                        HttpContext.Response.StatusCode = 202;
                        break;

                    default:
                        HttpContext.Response.StatusCode = 400;
                        break;
                }
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/question-rename-group-{group}")]
        public void RenameGroup(int code, int group, [FromBody] Help help)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;

                ThreadPool.QueueUserWorkItem(o => open?.RenameGroup(group, help.Title));
                HttpContext.Response.StatusCode = 202;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/question-rename-member-{group}-{member}")]
        public void RenameMember(int code, int group, int member, [FromBody] Help help)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText open = admin.Tasks[admin.Active] as OpenText;

                OpenText.Key key = new OpenText.Key
                {
                    Group = group,
                    Member = member
                };
                ThreadPool.QueueUserWorkItem(o => open?.RenameMember(key, help.Title));
                HttpContext.Response.StatusCode = 202;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/save")]
        public async Task SaveSession(int code)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                Session session = await _context.Sessions.FindAsync(admin.EventCode);
                if (session != null)
                {
                    session.Questions = admin.SaveSession();
                    if (session.Questions == null)
                    {
                        HttpContext.Response.StatusCode = 500;
                        return;
                    }

                    //session.LastOpen = DateTime.UtcNow.ToString("G", CultureInfo.CreateSpecificCulture("en-US"));
                    session.LastOpen = DateTime.UtcNow.ToString("G", new CultureInfo("en-US"));
                    _context.Sessions.Update(session);
                    await _context.SaveChangesAsync();
                }
            }

            HttpContext.Response.StatusCode = 200;
        }

        [HttpPost("{code}/question-split{masterGroup}-{masterMember}")]
        public void Separate(int code, int masterGroup, int masterMember)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                OpenText.Key master = new OpenText.Key
                {
                    Group = masterGroup,
                    Member = masterMember
                };

                OpenText open = admin.Tasks[admin.Active] as OpenText;
                ThreadPool.QueueUserWorkItem(o => open?.MergeSplit(master));
                HttpContext.Response.StatusCode = 202;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/task{index}-timer-{time}")]
        public void SetTimer(int code, int index, int time)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                BaseTask task = admin.Tasks[index];
                ThreadPool.QueueUserWorkItem(o => task.Timer = time);
                HttpContext.Response.StatusCode = 202;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/start-countdown")]
        public void StartCountdown(int code)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.StartCountdown());
                HttpContext.Response.StatusCode = 202;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpGet("{code}/stream-question-{index}")]
        public async void StreamQuestion(int code, int index)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                if (index >= admin.Tasks.Count)
                {
                    Response.StatusCode = 406;
                    return;
                }

                Response.ContentType = "text/event-stream";

                switch (admin.Tasks[index])
                {
                    case OpenText open:
                    {
                        while (!HttpContext.RequestAborted.IsCancellationRequested)
                        {
                            {
                                OpenTextGroup[] groups = open.Groups.ToArray();
                                await Response.WriteAsync("event:" + "Groups\n");
                                string json = $"data: {JsonConvert.SerializeObject(groups)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                OpenTextInput[] archive = open.Archive.ToArray();
                                await Response.WriteAsync("event:" + "Archive\n");
                                string json = $"data: {JsonConvert.SerializeObject(archive)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                bool task = open.InProgress;
                                await Response.WriteAsync("event:" + "Status\n");
                                string json = $"data: {JsonConvert.SerializeObject(task)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                int countdown = open.Countdown;
                                await Response.WriteAsync("event:" + "Countdown\n");
                                string str = $"data: {JsonConvert.SerializeObject(countdown)}\n\n";
                                await Response.WriteAsync(str);
                                await Response.Body.FlushAsync();
                            }
                            {
                                bool results = open.ShowResults;
                                await Response.WriteAsync("event:" + "Results\n");
                                string json = $"data: {JsonConvert.SerializeObject(results)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            open.Reset.Reset();
                            open.Reset.WaitOne(10000);
                        }

                        break;
                    }
                    case MultipleChoice multiple:
                    {
                        while (!HttpContext.RequestAborted.IsCancellationRequested)
                        {
                            {
                                MultipleChoiceOption[] options = multiple.Options.ToArray();
                                await Response.WriteAsync("event:" + "Options\n");
                                string json = $"data: {JsonConvert.SerializeObject(options)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                int total = multiple.TotalVotes;
                                await Response.WriteAsync("event:" + "Total\n");
                                string json = $"data: {JsonConvert.SerializeObject(total)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                MultipleChoiceOption[] archive = multiple.Archive.ToArray();
                                await Response.WriteAsync("event:" + "Archive\n");
                                string json = $"data: {JsonConvert.SerializeObject(archive)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                bool task = multiple.InProgress;
                                await Response.WriteAsync("event:" + "Status\n");
                                string json = $"data: {JsonConvert.SerializeObject(task)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                int countdown = multiple.Countdown;
                                await Response.WriteAsync("event:" + "Countdown\n");
                                string str = $"data: {JsonConvert.SerializeObject(countdown)}\n\n";
                                await Response.WriteAsync(str);
                                await Response.Body.FlushAsync();
                            }
                            {
                                bool results = multiple.ShowResults;
                                await Response.WriteAsync("event:" + "Results\n");
                                string json = $"data: {JsonConvert.SerializeObject(results)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }

                            multiple.Reset.Reset();
                            multiple.Reset.WaitOne(10000);
                        }

                        break;
                    }
                    case Points points:
                    {
                        {
                            int amount = points.Amount;
                            await Response.WriteAsync("event:" + "Amount\n");
                            string json = $"data: {JsonConvert.SerializeObject(amount)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }

                        while (!HttpContext.RequestAborted.IsCancellationRequested)
                        {
                            {
                                PointsOption[] options = points.Options.ToArray();
                                await Response.WriteAsync("event:" + "Options\n");
                                string json = $"data: {JsonConvert.SerializeObject(options)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }

                            {
                                PointsVote[] votes = points.Votes.ToArray();
                                await Response.WriteAsync("event:" + "Votes\n");
                                string json = $"data: {JsonConvert.SerializeObject(votes)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }

                            {
                                PointsOption[] archive = points.Archive.ToArray();
                                await Response.WriteAsync("event:" + "Archive\n");
                                string json = $"data: {JsonConvert.SerializeObject(archive)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                bool task = points.InProgress;
                                await Response.WriteAsync("event:" + "Status\n");
                                string json = $"data: {JsonConvert.SerializeObject(task)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                int countdown = points.Countdown;
                                await Response.WriteAsync("event:" + "Countdown\n");
                                string str = $"data: {JsonConvert.SerializeObject(countdown)}\n\n";
                                await Response.WriteAsync(str);
                                await Response.Body.FlushAsync();
                            }
                            {
                                bool results = points.ShowResults;
                                await Response.WriteAsync("event:" + "Results\n");
                                string json = $"data: {JsonConvert.SerializeObject(results)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            points.Reset.Reset();
                            points.Reset.WaitOne(10000);
                        }

                        break;
                    }
                    case Slider slide:
                    {
                        while (!HttpContext.RequestAborted.IsCancellationRequested)
                        {
                            {
                                SliderOption[] options = slide.Options.ToArray();
                                await Response.WriteAsync("event:" + "Options\n");
                                string json = $"data: {JsonConvert.SerializeObject(options)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                SliderVote[] votes = slide.Votes.ToArray();
                                await Response.WriteAsync("event:" + "Votes\n");
                                string json = $"data: {JsonConvert.SerializeObject(votes)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                SliderOption[] archive = slide.Archive.ToArray();
                                await Response.WriteAsync("event:" + "Archive\n");
                                string json = $"data: {JsonConvert.SerializeObject(archive)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                bool task = slide.InProgress;
                                await Response.WriteAsync("event:" + "Status\n");
                                string json = $"data: {JsonConvert.SerializeObject(task)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                int countdown = slide.Countdown;
                                await Response.WriteAsync("event:" + "Countdown\n");
                                string str = $"data: {JsonConvert.SerializeObject(countdown)}\n\n";
                                await Response.WriteAsync(str);
                                await Response.Body.FlushAsync();
                            }
                            {
                                bool results = slide.ShowResults;
                                await Response.WriteAsync("event:" + "Results\n");
                                string json = $"data: {JsonConvert.SerializeObject(results)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }

                            slide.Reset.Reset();
                            slide.Reset.WaitOne(10000);
                        }

                        break;
                    }
                }

                Response.Body.Close();
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/question-results-toggle{index}")]
        public void ToggleResults(int code, int index)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                if (index < 0 || index > admin.Tasks.Count - 1)
                    index = admin.Active;

                BaseTask task = admin.Tasks[index];

                ThreadPool.QueueUserWorkItem(o => task.ToggleResults());
                admin.Client.Set();
                HttpContext.Response.StatusCode = 201;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        [HttpPost("{code}/task-toggle{index}")]
        public void ToggleTask(int code, int index)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                if (index < 0 || index > admin.Tasks.Count - 1)
                    return;

                BaseTask task = admin.Tasks[index];

                ThreadPool.QueueUserWorkItem(o => task.ToggleTask());
                admin.Client.Set();
                HttpContext.Response.StatusCode = 202;
            }
            else
            {
                HttpContext.Response.StatusCode = 412;
            }
        }

        #endregion Public Methods
    }
}