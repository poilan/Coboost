using System.Collections.Generic;
using JetBrains.Annotations;

namespace Coboost.Future_Code.Phase.Backend.Task.Tree
{
    /// <summary>
    ///     Tree Node, has "public T Data" to store data in
    /// </summary>
    /// <typeparam name="T">Type of Data For this Tree</typeparam>
    public class Node<T>
    {
        /// <summary>
        ///     The Data To Store in each Node.
        /// </summary>
        public T Data
        {
            get;
            set;
        }

        /// <summary>
        ///     My Children
        /// </summary>
        public List<Node<T>> Children
        {
            get;
            set;
        }

        /// <summary>
        ///     My Parent, Only Root has Null
        /// </summary>
        [CanBeNull]
        internal Node<T> Parent
        {
            get;
            set;
        }

        /// <summary>
        ///     My level, Level 0 is Root
        /// </summary>
        internal int Level
        {
            get
            {
                int level = 0;
                Node<T> p = Parent;
                while (p != null)
                {
                    level++;
                    p = p.Parent;
                }

                return level;
            }
        }

        /// <summary>
        ///     My index in Parent.Children
        /// </summary>
        internal int Index
        {
            get;
            set;
        }

        /// <summary>
        ///     The Index Path to me from Root.
        /// </summary>
        public int[] Path
        {
            get
            {
                List<int> index = new List<int>();

                Node<T> p = this; //Start at ME
                while (p.Parent != null) //End when p is Root
                {
                    index.Add(p.Index); //Add Index
                    p = p.Parent; //Goto Parent
                }

                index.Reverse(); //"FROM: this, TO: Root" => "FROM: Root, TO: this"
                return index.ToArray();
            }
        }

        public Node()
        {
            Children = new List<Node<T>>();
        }
    }
}