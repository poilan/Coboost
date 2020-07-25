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

                    if (admin.Active < admin.Tasks.Count && (question == null || question.Index != admin.Active))
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

                    if (question is OpenText open)
                    {
                        await Response.WriteAsync("event:" + "Groups\n");
                        string group = $"data: {JsonConvert.SerializeObject(open.Groups)}\n\n";
                        await Response.WriteAsync(group);
                        await Response.Body.FlushAsync();
                    }
                    else if (question is MultipleChoice choice)
                    {
                        await Response.WriteAsync("event:" + "Options\n");
                        string options = $"data: {JsonConvert.SerializeObject(choice.Options)}\n\n";
                        await Response.WriteAsync(options);
                        await Response.Body.FlushAsync();

                        await Response.WriteAsync("event:" + "Total\n");
                        string total = $"data: {JsonConvert.SerializeObject(choice.TotalVotes)}\n\n";
                        await Response.WriteAsync(total);
                        await Response.Body.FlushAsync();
                    }
                    else if(question is Points point)
                    {
                        await Response.WriteAsync("event:" + "Options\n");
                        string options = $"data: {JsonConvert.SerializeObject(point.Options)}\n\n";
                        await Response.WriteAsync(options);
                        await Response.Body.FlushAsync();

                        await Response.WriteAsync("event:" + "Votes\n");
                        string votes = $"data: {JsonConvert.SerializeObject(point.Votes)}\n\n";
                        await Response.WriteAsync(votes);
                        await Response.Body.FlushAsync();
                    }
                    else if(question is Rate slider)
                    {
                        await Response.WriteAsync("event:" + "Options\n");
                        string options = $"data: {JsonConvert.SerializeObject(slider.Options)}\n\n";
                        await Response.WriteAsync(options);
                        await Response.Body.FlushAsync();

                        await Response.WriteAsync("event:" + "Votes\n");
                        string votes = $"data: {JsonConvert.SerializeObject(slider.Votes)}\n\n";
                        await Response.WriteAsync(votes);
                        await Response.Body.FlushAsync();
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
                //Response.StatusCode = 200;
                //return;
            }
            else
            {
                Response.StatusCode = 404;
                //return;
            }
        }

        #endregion Public Methods
    }
}