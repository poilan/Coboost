using System.Collections.Generic;
using Coboost.Models.Admin.Tasks.Votes.Points.data;

// ReSharper disable UnusedMember.Global
// ReSharper disable UnusedAutoPropertyAccessor.Global

namespace Coboost.Models.Admin.Tasks.Votes.Points
{
    public class Points : BaseTask
    {
        /// <summary>
        ///     The amount of points to spread
        /// </summary>
        public int Amount
        {
            get;
            set;
        }

        /// <summary>
        ///     All the deleted options
        /// </summary>
        public List<PointsOption> Archive
        {
            get;
            set;
        }

        public List<int> Favorites
        {
            get;
            set;
        }

        /// <summary>
        ///     The maximum points you can assign to a single option
        /// </summary>
        public int Max
        {
            get;
            set;
        }

        /// <summary>
        ///     The options you can vote for
        /// </summary>
        public List<PointsOption> Options
        {
            get;
            set;
        }

        /// <summary>
        ///     The votes we have received
        /// </summary>
        public List<PointsVote> Votes
        {
            get;
            set;
        }

        public void SetFavorite(int option)
        {
            lock (ThreadLock)
            {
                if (Options.Count > option || option < 0)
                    return;

                if (Favorites.Contains(option))
                    Favorites.Remove(option);
                else
                    Favorites.Add(option);
            }

            EventStream();
        }

        public void AddClientVote(PointsVote vote)
        {
            lock (ThreadLock)
            {
                vote.Index = Votes.Count;
                Votes.Add(vote);
                RecountVotes();
            }

            EventStream();
        }

        /// <summary>
        ///     Changes the Color of a option
        /// </summary>
        /// <param name="option">List Index of the Option</param>
        /// <param name="color">Color in Hex format EG. '#AABBCC'</param>
        public void ColorOption(int option, string color)
        {
            lock (ThreadLock)
            {
                if (option >= Options.Count || option < 0 || color == null)
                    return;

                if (color.Length == 7 && color.StartsWith("#"))
                    Options[option].Color = color;
            }

            EventStream();
        }

        private void RecountVotes()
        {
            foreach (PointsOption option in Options)
                option.Points = 0;

            foreach (PointsVote vote in Votes)
                for (int j = 0; j < vote.Points.Count; j++)
                    Options[j].Points += vote.Points[j];
        }
    }
}