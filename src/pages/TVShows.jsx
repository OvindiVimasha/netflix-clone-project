import { useState, useEffect } from "react";
import ContentRow from "../components/ContentRow";
import MovieModal from "../components/MovieModal";
import {
    getPopularTVShows,
    getTopRatedTVShows,
    getTrendingTVShows,
    getTVShowsByGenre,
    getTVGenres
} from "../services/api";
import "../css/TVShows.css";

// TV Genre IDs from TMDB
const TV_GENRES = [
    { id: "", name: "All Genres" },
    { id: 10759, name: "Action & Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 10762, name: "Kids" },
    { id: 9648, name: "Mystery" },
    { id: 10763, name: "News" },
    { id: 10764, name: "Reality" },
    { id: 10765, name: "Sci-Fi & Fantasy" },
    { id: 10766, name: "Soap" },
    { id: 10767, name: "Talk" },
    { id: 10768, name: "War & Politics" },
    { id: 37, name: "Western" },
];

function TVShows() {
    const [featuredShow, setFeaturedShow] = useState(null);
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

                const [trending, popular, topRated] = await Promise.all([
                    getTrendingTVShows("week"),
                    getPopularTVShows(),
                    getTopRatedTVShows()
                ]);

                // Set featured show
                if (trending.length > 0) {
                    setFeaturedShow(trending[0]);
                }

                setContentRows([
                    { id: "trending-tv", title: "Trending TV Shows", movies: trending, type: "tv" },
                    { id: "popular-tv", title: "Popular on Netflix", movies: popular, type: "tv" },
                    { id: "top-rated-tv", title: "Top Rated Series", movies: topRated, type: "tv" },
                ]);
            } catch (error) {
                console.error("Error loading TV shows:", error);
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
            const genreShows = await getTVShowsByGenre(genreId);
            const genreName = TV_GENRES.find(g => g.id.toString() === genreId)?.name || "Selected Genre";
            setFilteredContent([
                { id: `genre-${genreId}`, title: `${genreName} TV Shows`, movies: genreShows, type: "tv" }
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
        <div className="tv-shows-page">
            {/* Page Header with Featured Show */}
            <div
                className="tv-shows-page__hero"
                style={{
                    backgroundImage: featuredShow?.backdrop_path
                        ? `url(https://image.tmdb.org/t/p/original${featuredShow.backdrop_path})`
                        : 'none'
                }}
            >
                <div className="tv-shows-page__hero-gradient"></div>
                <div className="tv-shows-page__hero-content">
                    <span className="page-badge">
                        <span className="netflix-n">N</span>
                        <span>SERIES</span>
                    </span>
                    <h1 className="page-title">TV Shows</h1>
                    <p className="page-description">
                        Explore our collection of binge-worthy TV series, from award-winning dramas to
                        thrilling action and heartwarming comedies.
                    </p>
                </div>
            </div>

            {/* Genre Filter */}
            <div className="tv-shows-page__filter">
                <select
                    className="genre-select"
                    value={selectedGenre}
                    onChange={handleGenreChange}
                >
                    {TV_GENRES.map((genre) => (
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
            <div className="tv-shows-page__content">
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
                    type="tv"
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}

export default TVShows;
