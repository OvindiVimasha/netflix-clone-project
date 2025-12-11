import { useState, useEffect } from "react";
import ContentRow from "../components/ContentRow";
import MovieModal from "../components/MovieModal";
import {
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getNowPlayingMovies,
    getMoviesByGenre
} from "../services/api";
import "../css/Movies.css";

// Movie Genre IDs from TMDB
const MOVIE_GENRES = [
    { id: "", name: "All Genres" },
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
];

function Movies() {
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [contentRows, setContentRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [filteredContent, setFilteredContent] = useState([]);
    const [filterLoading, setFilterLoading] = useState(false);

    // Load initial content
    useEffect(() => {
        const loadContent = async () => {
            try {
                setLoading(true);

                const [popular, topRated, upcoming, nowPlaying] = await Promise.all([
                    getPopularMovies(),
                    getTopRatedMovies(),
                    getUpcomingMovies(),
                    getNowPlayingMovies()
                ]);

                // Set featured movie
                if (nowPlaying.length > 0) {
                    setFeaturedMovie(nowPlaying[0]);
                }

                setContentRows([
                    { id: "now-playing", title: "Now Playing", movies: nowPlaying, type: "movie" },
                    { id: "popular", title: "Popular Movies", movies: popular, type: "movie" },
                    { id: "top-rated", title: "Top Rated", movies: topRated, type: "movie" },
                    { id: "upcoming", title: "Coming Soon", movies: upcoming, type: "movie" },
                ]);
            } catch (error) {
                console.error("Error loading movies:", error);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, []);

    // Handle genre filter change
    const handleGenreChange = async (e) => {
        const genreId = e.target.value;
        setSelectedGenre(genreId);

        if (!genreId) {
            // Reset to show all content rows
            setFilteredContent([]);
            return;
        }

        try {
            setFilterLoading(true);
            const genreMovies = await getMoviesByGenre(genreId);
            const genreName = MOVIE_GENRES.find(g => g.id.toString() === genreId)?.name || "Selected Genre";
            setFilteredContent([
                { id: `genre-${genreId}`, title: `${genreName} Movies`, movies: genreMovies, type: "movie" }
            ]);
        } catch (error) {
            console.error("Error loading genre content:", error);
        } finally {
            setFilterLoading(false);
        }
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    // Determine which content to display
    const displayContent = selectedGenre && filteredContent.length > 0 ? filteredContent : contentRows;

    return (
        <div className="movies-page">
            {/* Page Header with Featured Movie */}
            <div
                className="movies-page__hero"
                style={{
                    backgroundImage: featuredMovie?.backdrop_path
                        ? `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`
                        : 'none'
                }}
            >
                <div className="movies-page__hero-gradient"></div>
                <div className="movies-page__hero-content">
                    <span className="page-badge">
                        <span className="netflix-n">N</span>
                        <span>FILM</span>
                    </span>
                    <h1 className="page-title">Movies</h1>
                    <p className="page-description">
                        Discover blockbuster hits, critically acclaimed films, and hidden gems.
                        From action-packed thrillers to touching dramas.
                    </p>
                </div>
            </div>

            {/* Genre Filter */}
            <div className="movies-page__filter">
                <select
                    className="genre-select"
                    value={selectedGenre}
                    onChange={handleGenreChange}
                >
                    {MOVIE_GENRES.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))}
                </select>
                {selectedGenre && (
                    <button
                        className="clear-filter-btn"
                        onClick={() => {
                            setSelectedGenre("");
                            setFilteredContent([]);
                        }}
                    >
                        Clear Filter
                    </button>
                )}
            </div>

            {/* Content Rows */}
            <div className="movies-page__content">
                {loading || filterLoading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    displayContent.map((row) => (
                        <ContentRow
                            key={row.id}
                            title={row.title}
                            movies={row.movies}
                            type={row.type}
                            onItemClick={handleItemClick}
                        />
                    ))
                )}
            </div>

            {/* Modal */}
            {selectedItem && (
                <MovieModal
                    item={selectedItem}
                    type="movie"
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}

export default Movies;
