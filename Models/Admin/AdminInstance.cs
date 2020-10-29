using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Coboost.Models.Admin.Tasks;
using Coboost.Models.Admin.Tasks.Input.Standard;
using Coboost.Models.Admin.Tasks.Input.Standard.data;
using Coboost.Models.Admin.Tasks.Votes.Multiple_Choice;
using Coboost.Models.Admin.Tasks.Votes.Multiple_Choice.data;
using Coboost.Models.Admin.Tasks.Votes.Points;
using Coboost.Models.Admin.Tasks.Votes.Points.data;
using Coboost.Models.Admin.Tasks.Votes.Slider;
using Coboost.Models.Admin.Tasks.Votes.Slider.data;
using Newtonsoft.Json;

namespace Coboost.Models.Admin
{
    public class AdminInstance
    {
        #region Private Fields

        private int _active;

        #endregion Private Fields

        #region Public Fields

        public ManualResetEvent Client = new ManualResetEvent(false);

        #endregion Public Fields

        #region Public Constructors

        public AdminInstance()
        {
            Active = 0;
            Tasks = new List<BaseTask>();
        }

        #endregion Public Constructors

        #region Public Properties

        public int Active
        {
            get => _active < Tasks.Count ? _active : 0;
            set
            {
                if (Tasks == null || value >= Tasks.Count || value < 0 ||
                    Tasks[value].Type == BaseTask.TaskType.Planned)
                    return;

                int i = _active;
                _active = value;
                ClientSet();
                if (Tasks.Count > i) Tasks[i].Reset.Set();
            }
        }

        public int EventCode { get; set; }

        // ReSharper disable once UnusedAutoPropertyAccessor.Global
        public string Owner { get; set; }

        public List<BaseTask> Tasks { get; set; }

        #endregion Public Properties

        #region Public Methods

        public void AddClientInput(object clientInput)
        {
            switch (clientInput)
            {
                case OpenTextInput open when Tasks[Active] is OpenText text:
                    text.AddUserInput(open);
                    return;

                case MultipleChoiceVote multi when Tasks[Active] is MultipleChoice choice:
                    choice.AddUserVote(multi);
                    return;

                case PointsVote point when Tasks[Active] is Points points:
                    points.AddClientVote(point);
                    return;

                case SliderVote slide:
                {
                    if (Tasks[Active] is Slider slider)
                        slider.AddClientVote(slide);
                    break;
                }
            }
        }

        public void StartCountdown()
        {
            BaseTask task = Tasks[Active];

            if (task.Countdown != 0)
                return;
            try
            {
                task.Countdown = task.Timer;

                if (!task.InProgress)
                    task.InProgress = true;

                while (task.InProgress && task.Countdown > 0)
                {
                    task.EventStream();
                    ClientSet();
                    Thread.Sleep(999);
                    task.Countdown -= 1;
                }
            }
            finally
            {
                task.Countdown = 0;
                task.InProgress = false;
                task.EventStream();
                ClientSet();
            }
        }

        public void AddMultipleChoice(MultipleChoice question)
        {
            question.Index = Tasks.Count;
            question.Archive = new List<MultipleChoiceOption>();
            question.Type = BaseTask.TaskType.MultipleChoice;
            question.ShowResults = true;
            question.Timer = 180;
            question.Countdown = 0;
            question.InProgress = false;
            foreach (MultipleChoiceOption option in question.Options)
            {
                option.Votes = new List<MultipleChoiceVote>();
                option.Archive = new List<MultipleChoiceVote>();
            }

            Tasks.Add(question);
        }

        public void AddOpenText(OpenText question)
        {
            question.Index = Tasks.Count;
            question.Groups = new List<OpenTextGroup>();
            question.AddGroup("Unorganized", 0);
            question.Archive = new List<OpenTextInput>();
            question.Type = BaseTask.TaskType.OpenText;
            question.ShowResults = true;
            question.Timer = 180;
            question.Countdown = 0;
            question.InProgress = true;
            Tasks.Add(question);
        }

        public void AddPoints(Points task)
        {
            task.Index = Tasks.Count;
            task.Type = BaseTask.TaskType.Points;
            task.ShowResults = true;
            task.Votes = new List<PointsVote>();
            task.Archive = new List<PointsOption>();
            task.Timer = 180;
            task.Countdown = 0;
            task.InProgress = true;
            foreach (PointsOption option in task.Options) option.Points = 0;

            Tasks.Add(task);
        }

        public void AddRate(Slider task)
        {
            task.Index = Tasks.Count;
            task.Type = BaseTask.TaskType.Slider;
            task.ShowResults = true;
            task.Votes = new List<SliderVote>();
            task.Archive = new List<SliderOption>();
            task.Timer = 180;
            task.Countdown = 0;
            task.InProgress = true;
            foreach (SliderOption option in task.Options) option.Ratings = new List<int>();

            Tasks.Add(task);
        }

        public void DeleteTask(int index)
        {
            if (index >= Tasks.Count) return;
            Tasks[index].Reset.Set();
            Tasks.RemoveAt(index);
            UpdateIndexes();
        }

        public void LoadSession(string questionJson)
        {
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.All
            };
            List<BaseTask> questions = JsonConvert.DeserializeObject<List<BaseTask>>(questionJson, settings);
            Tasks = questions;

            if (Tasks == null) return;
            foreach (BaseTask task in Tasks)
            {
                task.Reset = new ManualResetEvent(false);
                task.ShowResults = true;
                task.InProgress = false;

                if (!(task is OpenText open)) continue;
                foreach (OpenTextGroup group in open.Groups.Where(group => group.Collapsed != true))
                    group.Collapsed = false;
            }
        }

        public void MoveQuestion(int current, int target)
        {
            if (current >= Tasks.Count || target >= Tasks.Count || current == target) return;
            switch (Tasks[current])
            {
                case OpenText _:
                {
                    OpenText open = Tasks[current] as OpenText;
                    Tasks.RemoveAt(current);
                    Tasks.Insert(target, open);
                    break;
                }
                case MultipleChoice _:
                {
                    MultipleChoice choice = Tasks[current] as MultipleChoice;
                    Tasks.RemoveAt(current);
                    Tasks.Insert(target, choice);
                    break;
                }
                case Points _:
                {
                    Points choice = Tasks[current] as Points;
                    Tasks.RemoveAt(current);
                    Tasks.Insert(target, choice);
                    break;
                }
                case Slider _:
                {
                    Slider choice = Tasks[current] as Slider;
                    Tasks.RemoveAt(current);
                    Tasks.Insert(target, choice);
                    break;
                }
            }

            UpdateIndexes();

            if (_active == current)
            {
                _active = target;
                Tasks[target].Reset.Set();
            }
            else if (_active == target)
            {
                if (target > current)
                {
                    _active -= 1;
                    Tasks[_active].Reset.Set();
                }
                else if (target < current)
                {
                    _active += 1;
                    Tasks[_active].Reset.Set();
                }
            }
            else if (_active < target && _active > current)
            {
                _active -= 1;
                Tasks[_active].Reset.Set();
            }
            else if (_active > target && _active < current)
            {
                _active += 1;
                Tasks[_active].Reset.Set();
            }
        }

        public string SaveSession()
        {
            try
            {
                JsonSerializerSettings settings = new JsonSerializerSettings
                {
                    TypeNameHandling = TypeNameHandling.All
                };
                List<BaseTask> tasks = Tasks;

                string json = JsonConvert.SerializeObject(tasks, settings);

                return json;
            }
            catch (Exception e)
            {
                Console.WriteLine("Error while saving session: {0}", e);

                return null;
            }
        }

        #endregion Public Methods

        #region Private Methods

        private void ClientSet()
        {
            Client ??= new ManualResetEvent(false);
            Client.Set();
        }

        private void UpdateIndexes()
        {
            for (int i = 0; i < Tasks.Count; i++)
            {
                Tasks[i].Index = i;
                Tasks[i].Reset.Set();
            }
        }

        #endregion Private Methods
    }
}