using System.Threading;
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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Coboost.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        #region Private Fields

        // ReSharper disable once NotAccessedField.Local
        private readonly DatabaseContext _context;

        #endregion Private Fields

        #region Public Constructors

        public ClientController(DatabaseContext context)
        {
            _context = context;
        }

        #endregion Public Constructors

        #region Public Methods

        [HttpPost("{code}/add-vote-multi")]
        public void AddMultipleChoice(int code, [FromBody] MultipleChoiceVote vote)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
                ThreadPool.QueueUserWorkItem(o => admin.AddClientInput(vote));
        }

        [HttpPost("{code}/add-text-open")]
        public void AddOpenText(int code, [FromBody] OpenTextInput input)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
                ThreadPool.QueueUserWorkItem(o => admin.AddClientInput(input));
        }

        [HttpPost("{code}/add-vote-points")]
        public void AddPoints(int code, [FromBody] PointsVote vote)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
                ThreadPool.QueueUserWorkItem(o => admin.AddClientInput(vote));
        }

        [HttpPost("{code}/add-vote-slider")]
        public void AddSlider(int code, [FromBody] SliderVote vote)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
                ThreadPool.QueueUserWorkItem(o => admin.AddClientInput(vote));
        }

        [HttpGet("{code}")]
        public bool CheckSession(int code)
        {
            return DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance _);
        }

        [HttpGet("{code}/question")]
        public async void GetQuestion(int code)
        {
            if (DatabaseContext.Active.Sessions.TryGetValue(code, out AdminInstance admin))
            {
                Response.ContentType = "text/event-stream";
                BaseTask question = null;

                while (!HttpContext.RequestAborted.IsCancellationRequested)
                {
                    if (admin.Active < admin.Tasks.Count)
                        question = admin.Tasks[admin.Active].Type switch
                        {
                            BaseTask.TaskType.MultipleChoice => admin.Tasks[admin.Active] as MultipleChoice,
                            BaseTask.TaskType.Points => admin.Tasks[admin.Active] as Points,
                            BaseTask.TaskType.Slider => admin.Tasks[admin.Active] as Slider,
                            var _ => admin.Tasks[admin.Active] as OpenText
                        };

                    if (question != null)
                    {
                        await Response.WriteAsync("event:" + "question\n");
                        string json = $"data: {JsonConvert.SerializeObject(question)}\n\n";
                        await Response.WriteAsync(json);
                        await Response.Body.FlushAsync();
                    }

                    admin.Client.Reset();
                    admin.Client.WaitOne(10000);
                }

                Response.Body.Close();
            }
            else
            {
                HttpContext.Response.StatusCode = 402;
            }
        }

        #endregion Public Methods
    }
}