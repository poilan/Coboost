using JetBrains.Annotations;

namespace Coboost.Future_Code.Phase.Backend.Task.Tree
{
    /// <summary>
    ///     General Tree Data Structure. (Unlimited number of Children/Branches)
    /// </summary>
    /// <typeparam name="T">Type of Data to Store in this Tree</typeparam>
    public class Tree<T>
    {
        /// <summary>
        ///     The Root/Start of the Tree.
        /// </summary>
        public Node<T> Root
        {
            get;
        }

        /// <summary>
        ///     Constructor where Root.Name = root
        /// </summary>
        public Tree()
        {
            Node<T> root = new Node<T>
            {
                Parent = null,
                Index = -1
            };
            Root = root;
        }

        /// <summary>
        ///     Constructor where Root.Name = title
        /// </summary>
        /// <param name="data">The Data to store in Root</param>
        public Tree(T data)
        {
            Node<T> root = new Node<T>
            {
                Parent = null,
                Index = -1,
                Data = data
            };
            Root = root;
        }

        /// <summary>
        ///     Adds a Child to the specified Node
        /// </summary>
        /// <param name="node">The Node to add.</param>
        /// <param name="parent">The Index Path of the Parent, Null or empty adds it to Root.</param>
        public void AddNode(Node<T> node, [CanBeNull] int[] parent)
        {
            if (parent == null || parent.Length == 0) //Add New Node to Root
            {
                node.Index = Root.Children.Count;
                node.Parent = Root;
                Root.Children.Add(node);
            }
            else //Add new Node to a targeted Node
            {
                Node<T> target = GetNode(parent);

                node.Index = target.Children.Count;
                node.Parent = target;
                target.Children.Add(node);
            }
        }

        /// <summary>
        ///     Change the Position of a Node, Brings it's children
        /// </summary>
        /// <param name="currentPath">Index Path to the Node to Move</param>
        /// <param name="newParentsPath"></param>
        public void MoveNode(int[] currentPath, int[] newParentsPath)
        {
            //Find Node to move
            Node<T> target = GetNode(currentPath);

            //Find the Parent you want it to have
            Node<T> parent = GetNode(newParentsPath);

            //Change Index & Add it to the parent
            target.Index = parent.Children.Count;
            target.Parent = parent;
            parent.Children.Add(target);

            //Remove it from it's old location
            RemoveNode(currentPath);
        }

        /// <summary>
        ///     Removes the Node at targeted position
        /// </summary>
        /// <param name="target">The Index Path to target Node</param>
        public void RemoveNode(int[] target)
        {
            if (target.Length <= 0)
                return;

            Node<T> child = GetNode(target);
            Node<T> parent = child.Parent;

            parent?.Children.RemoveAt(target[^1]);

            ChildrenIndexUpdate(parent);
        }

        /// <summary>
        ///     Sets data on a Node
        /// </summary>
        /// <param name="data">The new data for the Node</param>
        /// <param name="path">The Index Path to the Node</param>
        public void SetNodeData(T data, int[] path)
        {
            if (path.Length <= 0)
                return;

            Node<T> node = GetNode(path);

            node.Data = data;
        }

        /// <summary>
        ///     Ensures the Correct Index for All "Children"
        /// </summary>
        /// <param name="node">Node</param>
        private void ChildrenIndexUpdate(Node<T> node)
        {
            if (node.Children.Count <= 0)
                return;

            for (int i = 0; i < node.Children.Count; i++)
                node.Children[i].Index = i; //Set Child Index
        }

        /// <summary>
        ///     Finds and Returns the specified Node. Returns Null if Index was out of range.
        /// </summary>
        /// <param name="index">The Indexes to the Node you want</param>
        /// <returns>The Target Node</returns>
        private Node<T> GetNode(int[] index)
        {
            Node<T> target = Root; //Start of Search

            foreach (int i in index) //For Each Index: Find the next node
            {
                if (i >= target.Children.Count)
                    return null; //TODO: Create Something That Solves Itself, Currently This should throw an exception.

                target = target.Children[i];
            }

            return target; //Return the Last Node
        }

        /// <summary>
        ///     Ensures the Correct Index for All "Children" & Recursively Correct Their Children
        /// </summary>
        /// <param name="node">Starting Node, Give Root to correct the entire tree.</param>
        private void TreeIndexUpdate(Node<T> node)
        {
            if (node.Children.Count <= 0)
                return;

            for (int i = 0; i < node.Children.Count; i++)
            {
                node.Children[i].Index = i; //Set Child Index
                TreeIndexUpdate(node.Children[i]); //Then check their children
            }
        }
    }
}