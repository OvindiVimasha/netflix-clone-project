import { useState, useEffect } from "react";
import HeroBanner from "../components/HeroBanner";
import ContentRow from "../components/ContentRow";
import MovieModal from "../components/MovieModal";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getPopularTVShows,
  getTopRatedTVShows
} from "../services/api";
import "../css/Home.css";

function Home() {
  const [featuredContent, setFeaturedContent] = useState([]);
  const [contentRows, setContentRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);

        // Load all content in parallel
        const [
          trending,
          popular,
          topRated,
          nowPlaying,
          upcoming,
          tvPopular,
          tvTopRated
        ] = await Promise.all([
          getTrendingMovies("week"),
          getPopularMovies(),
          getTopRatedMovies(),
          getNowPlayingMovies(),
          getUpcomingMovies(),
          getPopularTVShows(),
          getTopRatedTVShows()
        ]);

        // Set featured content from trending
        setFeaturedContent(trending);

        // Set content rows
        setContentRows([
          { id: "trending", title: "Trending Now", movies: trending, type: "movie" },
          { id: "popular-tv", title: "Popular on Netflix", movies: tvPopular, type: "tv" },
          { id: "now-playing", title: "Now Playing in Theaters", movies: nowPlaying, type: "movie" },
          { id: "top-rated", title: "Top 10 Movies Today", movies: topRated?.slice(0, 10), type: "movie", size: "large" },
          { id: "tv-top-rated", title: "Top Rated TV Shows", movies: tvTopRated, type: "tv" },
          { id: "upcoming", title: "Coming Soon", movies: upcoming, type: "movie" },
          { id: "popular", title: "Popular Movies", movies: popular, type: "movie" },
        ]);

        setError(null);
      } catch (err) {
        console.error("Error loading content:", err);
        setError("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleItemClick = (item, type) => {
    setSelectedItem({ ...item, media_type: type });
  };

  const handlePlayClick = (movie) => {
    console.log("Play:", movie.title || movie.name);
    // Could open a video player or redirect to watch page
  };

  const handleInfoClick = (movie) => {
    setSelectedItem(movie);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  if (error) {
    return (
      <div className="home">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Banner */}
      <HeroBanner
        movies={featuredContent}
        onPlayClick={handlePlayClick}
        onInfoClick={handleInfoClick}
      />

      {/* Content Rows */}
      <div className="home__content">
        {loading ? (
          // Skeleton loading rows
          <div className="skeleton-rows">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-row">
                <div className="skeleton skeleton-row-title"></div>
                <div className="skeleton-cards">
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <div key={j} className="skeleton skeleton-card"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          contentRows.map((row) => (
            <ContentRow
              key={row.id}
              title={row.title}
              movies={row.movies}
              type={row.type}
              size={row.size}
              onItemClick={(item) => handleItemClick(item, row.type)}
            />
          ))
        )}
      </div>

      {/* Movie Modal */}
      {selectedItem && (
        <MovieModal
          item={selectedItem}
          type={selectedItem.media_type || "movie"}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default Home;
