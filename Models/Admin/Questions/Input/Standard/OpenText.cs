using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Slagkraft.Models.Admin.Questions
{
    /// <summary>
    /// The Primary Class for all OpenText Polls
    /// <para>Contains all the logic used in OpenText Polls</para>
    /// </summary>
    public class OpenText : QuestionBase
    {
        #region Public Properties

        /// <summary>
        /// "Removed" inputs are stored here
        /// </summary>
        public List<OpenText_Input> Archive { get; set; }

        /// <summary>
        /// All groups of inputs
        /// </summary>
        public List<OpenText_Group> Groups { get; set; }

        #endregion Public Properties

        #region Public Structs

        /// <summary>
        /// Stores two integers that allows us to locate specified inputs.
        /// </summary>
        public struct Key
        {
            #region Public Fields

            /// <summary>
            /// The Group Index the Input has
            /// </summary>
            public int Group;

            /// <summary>
            /// The Member Index the Input has
            /// </summary>
            public int Member;

            #endregion Public Fields
        }

        #endregion Public Structs

        #region Public Constructors

        public OpenText()
        {
            Archive = new List<OpenText_Input>();
            Groups = new List<OpenText_Group>();

            AddGroup("Unorganized", 0);
        }

        #endregion Public Constructors

        #region Public Methods

        /// <summary>
        /// Creates a new group
        /// </summary>
        /// <param name="title">The name the group should have</param>
        public void AddGroup(string title, int column)
        {
            lock (QuestionLock)
            {
                OpenText_Group group = new OpenText_Group
                {
                    Members = new List<OpenText_Input>(),
                    Title = title,
                    Index = Groups.Count,
                    Column = column,
                };
                Groups.Add(group);
            }
            EventStream();
        }

        /// <summary>
        /// This method is how users add new input
        /// </summary>
        /// <param name="input">The Input the user sent us.</param>
        public void AddUserInput(OpenText_Input input)
        {
            lock (QuestionLock)
            {
                if (Groups[0].Members.Count == 0 || Groups[0].Members.Count == Groups[0].Members.Last().Index + 1)
                {
                    input.Index = Groups[0].Members.Count;
                    Groups[0].Members.Add(input);
                }
                else
                {
                    for (int i = 0; i < Groups[0].Members.Count; i++)
                    {
                        if (i == Groups[0].Members[i].Index)
                        {
                            input.Index = i;
                            Groups[0].Members.Insert(i, input);
                        }
                    }
                }
            }
            EventStream();
        }

        /// <summary>
        /// Changes the column the specified group is displayed in
        /// </summary>
        /// <param name="group">Index of the Group you want changed</param>
        /// <param name="column">Index of the Column you want it in</param>
        public void ChangeColumn(int group, int column)
        {
            lock (QuestionLock)
            {
                if (group < Groups.Count)
                {
                    Groups[group].Column = column;
                }
            }
            EventStream();
        }

        /// <summary>
        /// Merges two inputs into one another
        /// </summary>
        /// <param name="parent">This is the input that will still be visible</param>
        /// <param name="child">This input will be hidden inside parent</param>
        public void Merge(Key parent, Key child)
        {
            lock (QuestionLock)
            {
                //Check if parent is already merged with something
                if (Groups[parent.Group].Members[parent.Member] is OpenText_Merged mergedParent)
                {
                    //Check if child is merged with something
                    if (Groups[child.Group].Members[child.Member] is OpenText_Merged mergedChild)
                    {
                        //Seperate the child from all the grand-kids(The childs children)
                        OpenText_Input singleChild = new OpenText_Input
                        {
                            Description = mergedChild.Description,
                            Title = mergedChild.Title,
                            UserID = mergedChild.UserID,
                        };

                        //Gather the grand-kids
                        List<OpenText_Input> grandKids = mergedChild.Children;

                        //Add child and all grand-kids to parent
                        mergedParent.Children.Add(singleChild);

                        foreach (OpenText_Input kid in grandKids)
                        {
                            mergedParent.Children.Add(kid);
                        }
                    }
                    else
                    {
                        //Add the Child to parent
                        mergedParent.Children.Add(Groups[child.Group].Members[child.Member]);
                    }
                    //Remove the child from its old location
                    Groups[child.Group].Members.RemoveAt(child.Member);
                    UpdateMemberIndexes(child.Group);
                }
                else
                {
                    //Make parent into a merged Input
                    OpenText_Merged merge = new OpenText_Merged
                    {
                        Children = new List<OpenText_Input>(),
                        Description = Groups[parent.Group].Members[parent.Member].Description,
                        Title = Groups[parent.Group].Members[parent.Member].Title,
                        UserID = Groups[parent.Group].Members[parent.Member].UserID,
                        Index = Groups[parent.Group].Members[parent.Member].Index,
                    };

                    //Add child to new parent
                    merge.Children.Add(Groups[child.Group].Members[child.Member]);
                    Groups[parent.Group].Members[parent.Member] = merge;
                    Groups[child.Group].Members.RemoveAt(child.Member);
                    UpdateMemberIndexes(child.Group);
                }
            }
            EventStream();
        }

        /// <summary>
        /// Moves a input to the desired index within its group
        /// </summary>
        /// <param name="input">The Input-Key to the input you want moved</param>
        /// <param name="target">The new Index you want the input to have</param>
        public void MoveInput(Key input, int target)
        {
            lock (QuestionLock)
            {
                if (input.Group >= Groups.Count || input.Member >= Groups[input.Group].Members.Count || target >= Groups[input.Group].Members.Count)
                    return;

                //Grab the Input we want moved
                OpenText_Input holder = Groups[input.Group].Members[input.Member];

                if (input.Member < target) //If we are moving it to a higher index (Down the list)
                {
                    for (int i = input.Member; i < target; i++)
                    {
                        Groups[input.Group].Members[i] = Groups[input.Group].Members[i + 1];
                        Groups[input.Group].Members[i].Index = i;
                    }
                }
                else if (input.Member > target) //If we are moving it to a lower index (Up the list)
                {
                    for (int i = input.Member; i > target; i--)
                    {
                        Groups[input.Group].Members[i] = Groups[input.Group].Members[i - 1];
                        Groups[input.Group].Members[i].Index = i;
                    }
                }

                //Finally put the input into the desired spot
                holder.Index = target;
                Groups[input.Group].Members[target] = holder;
            }
            EventStream();
        }

        /// <summary>
        /// Method that Switches Group and places the input in the desired location.
        /// </summary>
        /// <param name="input">The Input-Key to the input you want moved</param>
        /// <param name="targetGroup">The Group you want it moved too</param>
        /// <param name="targetIndex">The Index you want it to have in the new group</param>
        public void PlaceInput(Key input, int targetGroup, int targetIndex)
        {
            SwitchGroup(input, targetGroup);
            MoveInput(input, targetIndex);

            EventStream();
        }

        public void RemoveGroup(int group)
        {
            lock (QuestionLock)
            {
                if (group >= Groups.Count)
                    return;

                for (int i = Groups[group].Members.Count - 1; i >= 0; i--)
                {
                    Key key = new Key
                    {
                        Group = group,
                        Member = i
                    };

                    RemoveMember(key);
                }

                Groups.RemoveAt(group);
                UpdateGroupIndexes();
            }
            EventStream();
        }

        public void RemoveInput(Key input)
        {
            lock (QuestionLock)
            {
                if (input.Group >= Groups.Count || input.Member >= Groups[input.Group].Members.Count)
                    return;

                RemoveMember(input);

                UpdateMemberIndexes(input.Group);
            }
            EventStream();
        }

        /// <summary>
        /// Renames the specified group
        /// </summary>
        /// <param name="group">The Index of the Group you want renamed</param>
        /// <param name="title">The new name of the group</param>
        public void RenameGroup(int group, string title)
        {
            lock (QuestionLock)
            {
                if (Groups.Count > group)
                {
                    Groups[group].Title = title;
                }
            }
            EventStream();
        }

        public void RenameMember(Key target, string title)
        {
            lock (QuestionLock)
            {
                if (Groups.Count > target.Group && Groups[target.Group].Members.Count > target.Member)
                {
                    Groups[target.Group].Members[target.Member].Title = title;
                }
            }
            EventStream();
        }

        /// <summary>
        /// Switches the group of a specified index
        /// </summary>
        /// <param name="input">The Input-Key to the input you want moved</param>
        /// <param name="targetGroup">The Index of the Group you want the input moved to</param>
        public void SwitchGroup(Key input, int targetGroup)
        {
            lock (QuestionLock)
            {
                if (input.Group >= Groups.Count || input.Member >= Groups[input.Group].Members.Count || targetGroup >= Groups.Count)
                    return;

                //Grab the Input we want moved
                OpenText_Input Input = Groups[input.Group].Members[input.Member];

                //Remove it from its old location
                Groups[input.Group].Members.RemoveAt(input.Member);

                Input.Index = Groups[targetGroup].Members.Count;
                //Add it to the desired group
                Groups[targetGroup].Members.Add(Input);

                UpdateMemberIndexes(input.Group);
            }
            EventStream();
        }

        /// <summary>
        /// Unmerges all the inputs in a merged input
        /// </summary>
        /// <param name="target">The Input Key to the Input you want Unmerged</param>
        public void Unmerge(Key target)
        {
            lock (QuestionLock)
            {
                if (target.Group >= Groups.Count || target.Member >= Groups[target.Group].Members.Count)
                    return;

                //Check if target is a merged input
                if (Groups[target.Group].Members[target.Member] is OpenText_Merged merged)
                {
                    //Add all the children to the same group
                    foreach (OpenText_Input inp in merged.Children)
                    {
                        Groups[target.Group].Members.Add(inp);
                    }

                    //Make target into a normal input
                    OpenText_Input parent = new OpenText_Input
                    {
                        Description = merged.Description,
                        Title = merged.Title,
                        UserID = merged.UserID,
                    };

                    //Put the new target into its old place.
                    Groups[target.Group].Members[target.Member] = parent;
                }
            }
            EventStream();
        }

        #endregion Public Methods

        #region Private Methods

        private void RemoveMember(Key member)
        {
            //Grab the Input we want moved
            OpenText_Input Input = Groups[member.Group].Members[member.Member];

            //Remove it from its old location
            Groups[member.Group].Members.RemoveAt(member.Member);
            Input.Index = Archive.Count;
            Archive.Add(Input);
        }

        private void UpdateGroupIndexes()
        {
            for (int i = 0; i < Groups.Count; i++)
            {
                Groups[i].Index = i;
            }
        }

        private void UpdateMemberIndexes(int Group)
        {
            for (int i = 0; i < Groups[Group].Members.Count; i++)
            {
                Groups[Group].Members[i].Index = i;
            }
        }

        #endregion Private Methods
    }
}