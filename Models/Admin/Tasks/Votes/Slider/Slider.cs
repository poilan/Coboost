using System.Collections.Generic;
using Coboost.Models.Admin.Tasks.Votes.Slider.data;

// ReSharper disable UnusedMember.Global
// ReSharper disable UnusedAutoPropertyAccessor.Global

namespace Coboost.Models.Admin.Tasks.Votes.Slider
{
    public class Slider : BaseTask
    {
        /// <summary>
        ///     The deleted options
        /// </summary>
        public List<SliderOption> Archive
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
        ///     The maximum value a option can receive
        /// </summary>
        public int Max
        {
            get;
            set;
        }

        /// <summary>
        ///     The description of what the max represents
        /// </summary>
        public string MaxDescription
        {
            get;
            set;
        }

        /// <summary>
        ///     The minimum value a option can receive
        /// </summary>
        public int Min
        {
            get;
            set;
        }

        /// <summary>
        ///     The description of what the minimum represents
        /// </summary>
        public string MinDescription
        {
            get;
            set;
        }

        /// <summary>
        ///     The options for this vote
        /// </summary>
        public List<SliderOption> Options
        {
            get;
            set;
        }

        /// <summary>
        ///     The total amount of votes we have received
        /// </summary>
        public List<SliderVote> Votes
        {
            get;
            set;
        }

        public void AddClientVote(SliderVote vote)
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
        /// <param name="color">Color in Hex format E.G. '#AABBCC'</param>
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

        private int Compare(SliderOption x, SliderOption y)
        {
            return y.Ratings.Count - x.Ratings.Count;
        }

        private void RecountVotes()
        {
            foreach (SliderOption rating in Options)
                rating.Ratings.Clear();

            foreach (SliderVote vote in Votes)
                for (int j = 0; j < vote.Ratings.Count; j++)
                    Options[j].Ratings.Add(vote.Ratings[j]);

            Options.Sort(Compare);
        }
    }
}