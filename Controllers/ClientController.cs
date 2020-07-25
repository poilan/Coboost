using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Slagkraft.Models.Admin;
using Slagkraft.Models.Admin.Questions;
using Slagkraft.Models.Database;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Slagkraft.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        #region Private Fields

        private readonly DatabaseContext Context;

        #endregion Private Fields

        #region Public Constructors

        public ClientController(DatabaseContext context)
        {
            Context = context;
        }

        #endregion Public Constructors

        #region Public Methods

        [HttpPost("{code}/add-multiplechoice")]
        public void AddMultipleChoice(int code, [FromBody]MultipleChoice_Input input)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.AddClientInput(input));
            }
            else
            {
                //Session not found
            }
        }

        [HttpPost("{code}/add-opentext")]
        public void AddOpenText(int code, [FromBody]OpenText_Input input)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.AddClientInput(input));
            }
            else
            {
                //Session not found
            }
        }

        [HttpPost("{code}/add-points")]
        public void AddPoints(int code, [FromBody]Points_Vote vote)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.AddClientInput(vote));
            }
            else
            {
                //Session not found
            }
        }

        [HttpPost("{code}/add-slider")]
        public void AddSlider(int code, [FromBody]Rate_Vote vote)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                ThreadPool.QueueUserWorkItem(o => admin.AddClientInput(vote));
            }
            else
            {
                //Session not found
            }
        }

        [HttpGet("{code}")]
        public bool CheckSession(int code)
        {
            if (Context.Active.Sessions.TryGetValue(code, out _))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        [HttpGet("{code}/question")]
        public async void GetQuestion(int code)
        {
            if (Context.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                Response.ContentType = "text/event-stream";
                BaseTask question = null;

                while (true)
                {
                    if (Response.HttpContext.RequestAborted.IsCancellationRequested)
                        break;

                    if (admin.Active < admin.Tasks.Count)
                    {
                        question = admin.Tasks[admin.Active].Type switch
                        {
                            BaseTask.TaskType.MultipleChoice => admin.Tasks[admin.Active] as MultipleChoice,
                            BaseTask.TaskType.Points => admin.Tasks[admin.Active] as Points,
                            BaseTask.TaskType.Rate => admin.Tasks[admin.Active] as Rate,
                            _ => admin.Tasks[admin.Active] as OpenText,
                        };
                    }

                    if (question != null)
                    {
                        await Response.WriteAsync("event:" + "question\n");
                        string json = $"data: {JsonConvert.SerializeObject(question)}\n\n";
                        await Response.WriteAsync(json);
                        await Response.Body.FlushAsync();
                    }

                    admin.Client.Reset();
                    admin.Client.WaitOne();
                }
                Response.Body.Close();
            }
            else
            {
                HttpContext.Response.StatusCode = 402;
                return;
            }
        }

        #endregion Public Methods
    }
}