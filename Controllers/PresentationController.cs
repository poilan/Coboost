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
    public class PresentationController : ControllerBase
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

        public PresentationController(DatabaseContext context)
        {
            Context = context;
        }

        #endregion Public Constructors

        #region Public Methods

        [HttpGet("info-{code}")]
        public async Task<Session> GetSessionInfo(int code)
        {
            List<Session> sessions = await Context.Sessions.ToListAsync();

            Session theSession = null;

            foreach (Session session in sessions)
            {
                if (session.Identity == code)
                {
                    theSession = session;
                    break;
                }
            }

            return theSession;
        }

        [HttpGet("{code}/data")]
        public async void StreamData(int code)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                Response.ContentType = "text/event-stream";
                BaseTask question = null;

                while (true)
                {
                    if (Response.HttpContext.RequestAborted.IsCancellationRequested)
                        break;

                    if (admin.Tasks.Count > 0 && (admin.Active < admin.Tasks.Count && (question == null || question.Index != admin.Active)))
                    {
                        question = admin.Tasks[admin.Active].Type switch
                        {
                            BaseTask.TaskType.MultipleChoice => admin.Tasks[admin.Active] as MultipleChoice,
                            BaseTask.TaskType.Points => admin.Tasks[admin.Active] as Points,
                            BaseTask.TaskType.Rate => admin.Tasks[admin.Active] as Rate,
                            _ => admin.Tasks[admin.Active] as OpenText,
                        };

                        await Response.WriteAsync("event:" + "Question\n");
                        string json = $"data: {JsonConvert.SerializeObject(question)}\n\n";
                        await Response.WriteAsync(json);
                        await Response.Body.FlushAsync();
                    }

                    {
                        bool show = question.ShowResults;
                        await Response.WriteAsync("event:" + "ShowResults\n");
                        string results = $"data: {JsonConvert.SerializeObject(show)}\n\n";
                        await Response.WriteAsync(results);
                        await Response.Body.FlushAsync();
                    }

                    if (question is OpenText open)
                    {
                        OpenText_Group[] groups = open.Groups.ToArray();
                        await Response.WriteAsync("event:" + "Groups\n");
                        string json = $"data: {JsonConvert.SerializeObject(groups)}\n\n";
                        await Response.WriteAsync(json);
                        await Response.Body.FlushAsync();
                    }
                    else if (question is MultipleChoice choice)
                    {
                        {
                            MultipleChoice_Option[] options = choice.Options.ToArray();
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
                    }
                    else if (question is Points point)
                    {
                        {
                            Points_Option[] options = point.Options.ToArray();
                            await Response.WriteAsync("event:" + "Options\n");
                            string json = $"data: {JsonConvert.SerializeObject(options)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }
                        {
                            Points_Vote[] votes = point.Votes.ToArray();
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
                    }
                    else if (question is Rate slider)
                    {
                        {
                            Rate_Option[] options = slider.Options.ToArray();
                            await Response.WriteAsync("event:" + "Options\n");
                            string json = $"data: {JsonConvert.SerializeObject(options)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }
                        {
                            Rate_Vote[] votes = slider.Votes.ToArray();
                            await Response.WriteAsync("event:" + "Votes\n");
                            string json = $"data: {JsonConvert.SerializeObject(votes)}\n\n";
                            await Response.WriteAsync(json);
                            await Response.Body.FlushAsync();
                        }
                    }

                    if (question != null)
                    {
                        question.Reset.Reset();
                        question.Reset.WaitOne();
                    }
                    else
                    {
                        admin.Client.Reset();
                        admin.Client.WaitOne();
                    }
                }
                Response.Body.Close();
            }
            else
            {
                Response.StatusCode = 412;
            }
        }

        #endregion Public Methods
    }
}