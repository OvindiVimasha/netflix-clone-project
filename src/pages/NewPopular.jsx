import { useState, useEffect } from "react";
import ContentRow from "../components/ContentRow";
import MovieModal from "../components/MovieModal";
import { getTrendingMovies, getTrendingTVShows, getUpcomingMovies } from "../services/api";
import "../css/NewPopular.css";

function NewPopular() {
    const [activeTab, setActiveTab] = useState("trending");
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [trendingTV, setTrendingTV] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const loadContent = async () => {
            try {
                setLoading(true);

                const [movies, tv, comingSoon] = await Promise.all([
                    getTrendingMovies("week"),
                    getTrendingTVShows("week"),
                    getUpcomingMovies()
                ]);

                setTrendingMovies(movies);
                setTrendingTV(tv);
                setUpcoming(comingSoon);
            } catch (error) {
                console.error("Error loading content:", error);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, []);

    const tabs = [
        { id: "trending", label: "🔥 Trending" },
        { id: "movies", label: "🎬 Movies" },
        { id: "tv", label: "📺 TV Shows" },
        { id: "coming-soon", label: "📅 Coming Soon" },
    ];

    const handleItemClick = (item, type) => {
        setSelectedItem({ ...item, media_type: type });
    };

    const getActiveContent = () => {
        switch (activeTab) {
            case "trending":
                return [
                    { id: "trending-movies", title: "Trending Movies", movies: trendingMovies, type: "movie" },
                    { id: "trending-tv", title: "Trending TV Shows", movies: trendingTV, type: "tv" },
                ];
            case "movies":
                return [
                    { id: "trending-movies", title: "Trending Movies This Week", movies: trendingMovies, type: "movie" },
                ];
            case "tv":
                return [
                    { id: "trending-tv", title: "Trending TV Shows This Week", movies: trendingTV, type: "tv" },
                ];
            case "coming-soon":
                return [
                    { id: "upcoming", title: "Coming Soon to Theaters", movies: upcoming, type: "movie" },
                ];
            default:
                return [];
        }
    };

    return (
        <div className="new-popular-page">
            <div className="new-popular-page__header">
                <h1>New & Popular</h1>
                <p>See what's trending, new releases, and what's coming soon</p>
            </div>

            {/* Tabs */}
            <div className="new-popular-page__tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="new-popular-page__content">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    getActiveContent().map((row) => (
                        <ContentRow
                            key={row.id}
                            title={row.title}
                            movies={row.movies}
                            type={row.type}
                            onItemClick={(item) => handleItemClick(item, row.type)}
                        />
                    ))
                )}
            </div>

            {/* Modal */}
            {selectedItem && (
                <MovieModal
                    item={selectedItem}
                    type={selectedItem.media_type || "movie"}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}

export default NewPopular;
