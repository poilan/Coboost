using System.Collections.Generic;
using Coboost.Models.Admin.Tasks.Input.Standard.data;

namespace Coboost.Models.Admin.Tasks.Input.Standard
{
    /// <summary>
    ///     The Primary Class for all OpenText Polls
    ///     <para>Contains all the logic used in OpenText Polls</para>
    /// </summary>
    public class OpenText : BaseTask
    {
        #region Public Structs

        /// <summary>
        ///     Stores two integers that allows us to locate specified inputs.
        /// </summary>
        public struct Key
        {
            #region Public Fields

            /// <summary>
            ///     The Group Index the Input has
            /// </summary>
            public int Group;

            /// <summary>
            ///     The Member Index the Input has
            /// </summary>
            public int Member;

            #endregion Public Fields
        }

        #endregion Public Structs

        #region Public Properties

        /// <summary>
        ///     "Removed" inputs are stored here
        /// </summary>
        public List<OpenTextInput> Archive { get; set; }

        /// <summary>
        ///     All groups of inputs
        /// </summary>
        public List<OpenTextGroup> Groups { get; set; }

        #endregion Public Properties

        #region Public Constructors

        public OpenText()
        {
            Archive = new List<OpenTextInput>();
            Groups = new List<OpenTextGroup>();
        }

        #endregion Public Constructors

        #region Public Methods

        /// <summary>
        ///     Creates a new group
        /// </summary>
        /// <param name="title">The name the group should have</param>
        /// <param name="column">the column we want to create it in</param>
        public void AddGroup(string title, int column)
        {
            lock (ThreadLock)
            {
                OpenTextGroup group = new OpenTextGroup
                {
                    Members = new List<OpenTextInput>(),
                    Title = title,
                    Index = Groups.Count,
                    Column = column,
                    Color = "#575b75"
                };
                Groups.Add(group);
            }

            EventStream();
        }

        /// <summary>
        ///     This method is how users add new key
        /// </summary>
        /// <param name="input">The Input the user sent us.</param>
        public void AddUserInput(OpenTextInput input)
        {
            lock (ThreadLock)
            {
                Groups[0].Members.Add(input);
                UpdateMemberIndexes(0);
            }

            EventStream();
        }

        public void ArchiveGroup(int group)
        {
            lock (ThreadLock)
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

                    ArchiveInput(key);
                }

                Groups.RemoveAt(group);
                UpdateGroupIndexes();
            }

            EventStream();
        }

        public void ArchiveMember(Key input)
        {
            lock (ThreadLock)
            {
                if (input.Group >= Groups.Count || input.Member >= Groups[input.Group].Members.Count)
                    return;

                ArchiveInput(input);

                UpdateMemberIndexes(input.Group);
            }

            EventStream();
        }

        /// <summary>
        ///     Changes the column the specified group is displayed in
        /// </summary>
        /// <param name="group">Index of the Group you want changed</param>
        /// <param name="column">Index of the Column you want it in</param>
        public void ChangeColumn(int group, int column)
        {
            lock (ThreadLock)
            {
                if (group < Groups.Count) Groups[group].Column = column;
            }

            EventStream();
        }

        /// <summary>
        ///     Changes the "Background" Color of a Group
        /// </summary>
        /// <param name="group">Index of the Group to Recolor</param>
        /// <param name="color">The new Color in Hex format</param>
        public void ColorGroup(int group, string color)
        {
            if (group >= Groups.Count || group < 0 || color == null)
                return;

            lock (ThreadLock)
            {
                if (color.Length == 7 && color.StartsWith("#")) Groups[group].Color = color;
            }

            EventStream();
        }

        /// <summary>
        ///     Collapses or Expands a Group. Collapsed Groups are hidden on Big Screen
        /// </summary>
        /// <param name="group"></param>
        public void GroupCollapse(int group)
        {
            if (group >= Groups.Count || group < 0)
                return;

            lock (ThreadLock)
            {
                Groups[group].Collapsed = !Groups[group].Collapsed;
            }

            EventStream();
        }

        /// <summary>
        ///     Merges two inputs into one another
        /// </summary>
        /// <param name="parent">This is the key that will still be visible</param>
        /// <param name="child">This key will be hidden inside parent</param>
        public void Merge(Key parent, Key child)
        {
            lock (ThreadLock)
            {
                if (parent.Group >= Groups.Count || parent.Member >= Groups[parent.Group].Members.Count ||
                    child.Group >= Groups.Count || child.Member >= Groups[child.Group].Members.Count)
                    return;

                //Check if parent is already merged with something
                if (Groups[parent.Group].Members[parent.Member] is OpenTextMerged mergedParent)
                {
                    //Check if child is merged with something
                    if (Groups[child.Group].Members[child.Member] is OpenTextMerged mergedChild)
                    {
                        //Separate the child from all the grand-kids(The child's children)
                        OpenTextInput singleChild = new OpenTextInput
                        {
                            Description = mergedChild.Description,
                            Title = mergedChild.Title,
                            UserID = mergedChild.UserID
                        };

                        //Gather the grand-kids
                        List<OpenTextInput> grandKids = mergedChild.Children;

                        //Add child and all grand-kids to parent
                        mergedParent.Children.Add(singleChild);

                        foreach (OpenTextInput kid in grandKids) mergedParent.Children.Add(kid);
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
                    OpenTextMerged merge = new OpenTextMerged
                    {
                        Children = new List<OpenTextInput>(),
                        Description = Groups[parent.Group].Members[parent.Member].Description,
                        Title = Groups[parent.Group].Members[parent.Member].Title,
                        UserID = "Multiple Users",
                        Index = Groups[parent.Group].Members[parent.Member].Index
                    };

                    //Add Parent as the first child
                    merge.Children.Add(Groups[parent.Group].Members[parent.Member]);

                    //Check if child is merged with something
                    if (Groups[child.Group].Members[child.Member] is OpenTextMerged mergedChild)
                    {
                        //Separate the child from all the grand-kids(The child's children)
                        OpenTextInput singleChild = new OpenTextInput
                        {
                            Description = mergedChild.Description,
                            Title = mergedChild.Title,
                            UserID = mergedChild.UserID
                        };

                        //Gather the grand-kids
                        List<OpenTextInput> grandKids = mergedChild.Children;

                        //Add child and all grand-kids to parent
                        merge.Children.Add(singleChild);

                        foreach (OpenTextInput kid in grandKids) merge.Children.Add(kid);
                    }
                    else
                    {
                        //Add child to new parent
                        merge.Children.Add(Groups[child.Group].Members[child.Member]);
                        Groups[child.Group].Members.RemoveAt(child.Member);
                    }

                    Groups[parent.Group].Members[parent.Member] = merge;
                    UpdateMemberIndexes(child.Group);
                }
            }

            EventStream();
        }

        /// <summary>
        ///     Un-merges all the inputs in a merged key
        /// </summary>
        /// <param name="target">The Input Key to the Input you want Un-merged</param>
        public void MergeSplit(Key target)
        {
            lock (ThreadLock)
            {
                if (target.Group >= Groups.Count || target.Member >= Groups[target.Group].Members.Count)
                    return;

                //Check if target is a merged key
                if (Groups[target.Group].Members[target.Member] is OpenTextMerged merged)
                {
                    //Add all the children to the same group
                    foreach (OpenTextInput inp in merged.Children) Groups[target.Group].Members.Add(inp);

                    //Remove the merged key
                    Groups[target.Group].Members.RemoveAt(target.Member);

                    //Update indexes
                    UpdateMemberIndexes(target.Group);
                }
            }

            EventStream();
        }

        /// <summary>
        ///     Renames the specified group
        /// </summary>
        /// <param name="group">The Index of the Group you want renamed</param>
        /// <param name="title">The new name of the group</param>
        public void RenameGroup(int group, string title)
        {
            lock (ThreadLock)
            {
                if (Groups.Count > group) Groups[group].Title = title;
            }

            EventStream();
        }

        public void RenameMember(Key target, string title)
        {
            lock (ThreadLock)
            {
                if (Groups.Count > target.Group && Groups[target.Group].Members.Count > target.Member)
                    Groups[target.Group].Members[target.Member].Title = title;
            }

            EventStream();
        }

        /// <summary>
        ///     Switches the group of a specified index
        /// </summary>
        /// <param name="key">The Input-Key to the key you want moved</param>
        /// <param name="targetGroup">The Index of the Group you want the key moved to</param>
        public void SwitchGroup(Key key, int targetGroup)
        {
            lock (ThreadLock)
            {
                if (key.Group >= Groups.Count || key.Member >= Groups[key.Group].Members.Count ||
                    targetGroup >= Groups.Count)
                    return;

                //Grab the Input we want moved
                OpenTextInput input = Groups[key.Group].Members[key.Member];

                //Remove it from its old location
                Groups[key.Group].Members.RemoveAt(key.Member);

                //Update the Index of the Input
                input.Index = Groups[targetGroup].Members.Count;

                //Add it to the desired group
                Groups[targetGroup].Members.Add(input);

                //Remove the Group if it is empty
                if (key.Group != 0 && Groups[key.Group].Members.Count < 1)
                {
                    Groups.RemoveAt(key.Group);
                    UpdateGroupIndexes();
                }
                else //Otherwise update the Member Indexes
                {
                    UpdateMemberIndexes(key.Group);
                }
            }

            EventStream();
        }

        #endregion Public Methods

        #region Private Methods

        private void ArchiveInput(Key member)
        {
            //Grab the Input we want moved
            OpenTextInput input = Groups[member.Group].Members[member.Member];

            //Remove it from its old location
            Groups[member.Group].Members.RemoveAt(member.Member);
            input.Index = Archive.Count;
            Archive.Add(input);
        }

        /*

                /// <summary>
                /// Moves a key to the desired index within its group
                /// </summary>
                /// <param name="input">The Input-Key to the key you want moved</param>
                /// <param name="target">The new Index you want the key to have</param>
                private void MoveInput(Key input, int target)
                {
                    lock (ThreadLock)
                    {
                        if (input.Group >= Groups.Count || input.Member >= Groups[input.Group].Members.Count || target >= Groups[input.Group].Members.Count)
                            return;

                        //Grab the Input we want moved
                        OpenTextInput holder = Groups[input.Group].Members[input.Member];

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

                        //Finally put the key into the desired spot
                        holder.Index = target;
                        Groups[input.Group].Members[target] = holder;
                    }
                    EventStream();
                }
        */

        /*

                /// <summary>
                /// Method that Switches Group and places the key in the desired location.
                /// </summary>
                /// <param name="input">The Input-Key to the key you want moved</param>
                /// <param name="targetGroup">The Group you want it moved too</param>
                /// <param name="targetIndex">The Index you want it to have in the new group</param>
                public void PlaceInput(Key input, int targetGroup, int targetIndex)
                {
                    SwitchGroup(input, targetGroup);
                    MoveInput(input, targetIndex);

                    EventStream();
                }
        */

        private void UpdateGroupIndexes()
        {
            for (int i = 0; i < Groups.Count; i++) Groups[i].Index = i;
        }

        private void UpdateMemberIndexes(int group)
        {
            for (int i = 0; i < Groups[group].Members.Count; i++) Groups[group].Members[i].Index = i;
        }

        #endregion Private Methods
    }
}