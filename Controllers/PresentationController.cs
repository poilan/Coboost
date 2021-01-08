using System.Collections.Generic;
using System.Linq;
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

namespace Coboost.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PresentationController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public PresentationController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet("info-{code}")]
        public async Task<Session> GetSessionInfo(int code)
        {
            List<Session> sessions = await _context.Sessions.ToListAsync();

            return sessions.FirstOrDefault(session => session.Identity == code);
        }

        [HttpGet("{code}/data")]
        public async void StreamData(int code)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                Response.ContentType = "text/event-stream";
                BaseTask question = null;

                while (!HttpContext.RequestAborted.IsCancellationRequested && DatabaseContext.Active.Sessions.ContainsKey(code))
                {
                    if (admin.Tasks.Count > 0 && admin.Active < admin.Tasks.Count && (question == null || question.Index != admin.Active))
                    {
                        question = admin.Tasks[admin.Active].Type switch
                        {
                            BaseTask.TaskType.MultipleChoice => admin.Tasks[admin.Active] as MultipleChoice,
                            BaseTask.TaskType.Points => admin.Tasks[admin.Active] as Points,
                            BaseTask.TaskType.Slider => admin.Tasks[admin.Active] as Slider,
                            var _ => admin.Tasks[admin.Active] as OpenText
                        };

                        await Response.WriteAsync("event:" + "Question\n");
                        string json = $"data: {JsonConvert.SerializeObject(question)}\n\n";
                        await Response.WriteAsync(json);
                        await Response.Body.FlushAsync();
                    }

                    if (question != null)
                    {
                        {
                            bool results = question.ShowResults;
                            await Response.WriteAsync("event:" + "Results\n");
                            string json = $"data: {JsonConvert.SerializeObject(results)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }
                        {
                            bool status = question.InProgress;
                            await Response.WriteAsync("event:" + "Status\n");
                            string json = $"data: {JsonConvert.SerializeObject(status)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }
                        {
                            int countdown = question.Countdown;
                            await Response.WriteAsync("event:" + "Countdown\n");
                            string str = $"data: {JsonConvert.SerializeObject(countdown)}\n\n";
                            await Response.WriteAsync(str);
                            await Response.Body.FlushAsync();
                        }
                    }

                    switch (question)
                    {
                        case OpenText open:
                        {
                            {
                                OpenTextGroup[] groups = open.Groups.ToArray();
                                await Response.WriteAsync("event:" + "Groups\n");
                                string json = $"data: {JsonConvert.SerializeObject(groups)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                int[] favoriteGroups = open.FavoriteGroups.ToArray();
                                await Response.WriteAsync("event:" + "FavoriteGroups\n");
                                string json = $"data: {JsonConvert.SerializeObject(favoriteGroups)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                string[] favoriteMembers = open.FavoriteMembers.ToArray();
                                await Response.WriteAsync("event:" + "FavoriteMembers\n");
                                string json = $"data: {JsonConvert.SerializeObject(favoriteMembers)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            break;
                        }
                        case MultipleChoice choice:
                        {
                            {
                                MultipleChoiceOption[] options = choice.Options.ToArray();
                                await Response.WriteAsync("event:" + "Options\n");
                                string json = $"data: {JsonConvert.SerializeObject(options)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                int total = choice.TotalVotes;
                                await Response.WriteAsync("event:" + "Total\n");
                                string json = $"data: {JsonConvert.SerializeObject(total)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                int[] favorites = choice.Favorites.ToArray();
                                await Response.WriteAsync("event:" + "Favorites\n");
                                string json = $"data: {JsonConvert.SerializeObject(favorites)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            break;
                        }
                        case Points point:
                        {
                            {
                                PointsOption[] options = point.Options.ToArray();
                                await Response.WriteAsync("event:" + "Options\n");
                                string json = $"data: {JsonConvert.SerializeObject(options)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                PointsVote[] votes = point.Votes.ToArray();
                                await Response.WriteAsync("event:" + "Votes\n");
                                string json = $"data: {JsonConvert.SerializeObject(votes)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                int amount = point.Amount;
                                await Response.WriteAsync("event:" + "Amount\n");
                                string json = $"data: {JsonConvert.SerializeObject(amount)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                int[] favorites = point.Favorites.ToArray();
                                await Response.WriteAsync("event:" + "Favorites\n");
                                string json = $"data: {JsonConvert.SerializeObject(favorites)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            break;
                        }
                        case Slider slider:
                        {
                            {
                                SliderOption[] options = slider.Options.ToArray();
                                await Response.WriteAsync("event:" + "Options\n");
                                string json = $"data: {JsonConvert.SerializeObject(options)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                int[] favorites = slider.Favorites.ToArray();
                                await Response.WriteAsync("event:" + "Favorites\n");
                                string json = $"data: {JsonConvert.SerializeObject(favorites)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            {
                                SliderVote[] votes = slider.Votes.ToArray();
                                await Response.WriteAsync("event:" + "Votes\n");
                                string json = $"data: {JsonConvert.SerializeObject(votes)}\n\n";
                                await Response.WriteAsync(json);
                                await Response.Body.FlushAsync();
                            }
                            break;
                        }
                    }

                    if (question != null)
                    {
                        question.Reset.Reset();
                        question.Reset.WaitOne(10000);
                    }
                    else
                    {
                        admin.Client.Reset();
                        admin.Client.WaitOne(10000);
                    }
                }

                Response.Body.Close();
            }
            else
            {
                Response.StatusCode = 412;
            }
        }
    }
}