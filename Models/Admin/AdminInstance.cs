using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Slagkraft.Models.Admin.Questions;
using Newtonsoft.Json;
using System.Threading;

namespace Slagkraft.Models.Admin
{
    public class AdminInstance
    {
        #region Public Fields

        public ManualResetEvent Client = new ManualResetEvent(false);

        #endregion Public Fields

        #region Private Fields

        private int active;

        #endregion Private Fields

        #region Public Properties

        public int Active
        {
            get
            {
                return active;
            }
            set
            {
                int i = active;
                active = value;
                Client.Set();
                if (Tasks != null && Tasks.Count > i)
                {
                    Tasks[i].Reset.Set();
                }
            }
        }

        public int Admin { get; set; }

        public int EventCode { get; set; }
        public bool Open { get; set; }
        public string Owner { get; set; }
        public List<BaseTask> Tasks { get; set; }

        #endregion Public Properties

        #region Public Constructors

        public AdminInstance()
        {
            Active = 0;
            Open = false;
            Tasks = new List<BaseTask>();
        }

        #endregion Public Constructors

        #region Public Methods

        public void AddClientInput(object clientInput)
        {
            if (clientInput is OpenText_Input Open)
            {
                if (Tasks[Active] is OpenText Text)
                {
                    Text.AddUserInput(Open);
                    return;
                }
            }

            if (clientInput is MultipleChoice_Input Multi)
            {
                if (Tasks[Active] is MultipleChoice Choice)
                {
                    Choice.AddUserVote(Multi);
                }
            }
        }

        public void AddMultipleChoice(MultipleChoice question)
        {
            question.Index = Tasks.Count;
            question.Archive = new List<MultipleChoice_Option>();
            question.QuestionType = BaseTask.Type.MultipleChoice;
            Tasks.Add(question);
        }

        public void AddOpenText(OpenText question)
        {
            question.Index = Tasks.Count;
            question.Groups = new List<OpenText_Group>();
            question.AddGroup("Unorganized", 0);
            question.Archive = new List<OpenText_Input>();
            question.QuestionType = BaseTask.Type.OpenText;
            Tasks.Add(question);
        }

        public void DeleteTask(int index)
        {
            Tasks[index].Reset.Set();
            Tasks.RemoveAt(index);
            UpdateIndexes();
        }

        public BaseTask GetActiveQuestion()
        {
            switch (Tasks[Active].QuestionType)
            {
                case BaseTask.Type.OpenText:
                    return Tasks[Active] as OpenText;

                case BaseTask.Type.MultipleChoice:
                    return Tasks[Active] as MultipleChoice;

                default:
                    return null;
            }
        }

        public void LoadSession(string questionJson)
        {
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.All
            };
            List<BaseTask> questions = JsonConvert.DeserializeObject<List<BaseTask>>(questionJson, settings);
            Tasks = questions;

            foreach(BaseTask task in Tasks)
            {
                task.Reset = new ManualResetEvent(false);
            }
        }

        public void MoveQuestion(int current, int target)
        {
            if (current < Tasks.Count && target < Tasks.Count && current != target)
            {
                if (Tasks[current] is OpenText)
                {
                    OpenText open = Tasks[current] as OpenText;
                    Tasks.RemoveAt(current);
                    Tasks.Insert(target, open);
                }
                else if (Tasks[current] is MultipleChoice)
                {
                    MultipleChoice choice = Tasks[current] as MultipleChoice;
                    Tasks.RemoveAt(current);
                    Tasks.Insert(target, choice);
                }
                UpdateIndexes();
                if (active == current)
                {
                    active = target;
                    Tasks[target].Reset.Set();
                    Client.Set();
                }
                else if (active == target)
                {
                    if (target > current)
                    {
                        active -= 1;
                        Tasks[active].Reset.Set();
                        Client.Set();
                    }
                    else if (target < current)
                    {
                        active += 1;
                        Tasks[active].Reset.Set();
                        Client.Set();
                    }
                }
                else if (active <= target && active > current)
                {
                    active -= 1;
                    Tasks[active].Reset.Set();
                    Client.Set();
                }
                else if (active >= target && active < current)
                {
                    active += 1;
                    Tasks[active].Reset.Set();
                    Client.Set();
                }
            }
        }

        public string SaveSession()
        {
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.All
            };
            string json = JsonConvert.SerializeObject(Tasks, settings);

            return json;
        }

        public void Start(int index)
        {
        }

        public void Stop()
        {
        }

        #endregion Public Methods

        #region Private Methods

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