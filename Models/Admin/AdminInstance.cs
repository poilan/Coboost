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
                if (Questions != null && Questions.Count > i)
                {
                    Questions[i].Reset.Set();
                }
            }
        }

        public int Admin { get; set; }

        public bool Open { get; set; }
        public string Owner { get; set; }
        public List<QuestionBase> Questions { get; set; }
        public int SessionIdentity { get; set; }

        #endregion Public Properties

        #region Public Constructors

        public AdminInstance()
        {
            Active = 0;
            Open = false;
            Questions = new List<QuestionBase>();
        }

        #endregion Public Constructors

        #region Public Methods

        public void AddClientInput(object clientInput)
        {
            if (clientInput is OpenText_Input Open)
            {
                if (Questions[Active] is OpenText Text)
                {
                    Text.AddUserInput(Open);
                    return;
                }
            }

            if (clientInput is MultipleChoice_Input Multi)
            {
                if (Questions[Active] is MultipleChoice Choice)
                {
                    Choice.AddUserVote(Multi);
                }
            }
        }

        public void AddMultipleChoice(MultipleChoice question)
        {
            question.Index = Questions.Count;
            question.Archive = new List<MultipleChoice_Option>();
            question.QuestionType = QuestionBase.Type.MultipleChoice;
            Questions.Add(question);
        }

        public void AddOpenText(OpenText question)
        {
            question.Index = Questions.Count;
            question.Groups = new List<OpenText_Group>();
            question.AddGroup("Unorganized", 0);
            question.Archive = new List<OpenText_Input>();
            question.QuestionType = QuestionBase.Type.OpenText;
            Questions.Add(question);
        }

        public QuestionBase GetActiveQuestion()
        {
            switch (Questions[Active].QuestionType)
            {
                case QuestionBase.Type.OpenText:
                    return Questions[Active] as OpenText;

                case QuestionBase.Type.MultipleChoice:
                    return Questions[Active] as MultipleChoice;

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
            List<QuestionBase> questions = JsonConvert.DeserializeObject<List<QuestionBase>>(questionJson, settings);
            Questions = questions;
        }

        public void MoveQuestion(int current, int target)
        {
            if (current < Questions.Count && target < Questions.Count && current != target)
            {
                if (Questions[current] is OpenText)
                {
                    OpenText open = Questions[current] as OpenText;
                    Questions.RemoveAt(current);
                    Questions.Insert(target, open);
                }
                else if (Questions[current] is MultipleChoice)
                {
                    MultipleChoice choice = Questions[current] as MultipleChoice;
                    Questions.RemoveAt(current);
                    Questions.Insert(target, choice);
                }
                UpdateIndexes();
                if (active == current)
                {
                    active = target;
                    Questions[target].Reset.Set();
                    Client.Set();
                }
                else if (active == target)
                {
                    if (target > current)
                    {
                        active += 1;
                        Questions[active].Reset.Set();
                        Client.Set();
                    }
                    else if (target < current)
                    {
                        active -= 1;
                        Questions[active].Reset.Set();
                        Client.Set();
                    }
                }
                else if (active <= target && active > current)
                {
                    active -= 1;
                    Questions[active].Reset.Set();
                    Client.Set();
                }
                else if (active >= target && active < current)
                {
                    active += 1;
                    Questions[active].Reset.Set();
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
            string json = JsonConvert.SerializeObject(Questions, settings);

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
            for (int i = 0; i < Questions.Count; i++)
            {
                Questions[i].Index = i;
            }
        }

        #endregion Private Methods
    }
}