import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import { searchMulti } from "../services/api";
import "../css/Search.css";

function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const performSearch = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const searchResults = await searchMulti(query);
                // Filter out person results
                const filteredResults = searchResults.filter(
                    (item) => item.media_type === "movie" || item.media_type === "tv"
                );
                setResults(filteredResults);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [query]);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <div className="search-page">
            <div className="search-page__header">
                {query ? (
                    <h1>
                        Search results for: <span className="search-query">"{query}"</span>
                    </h1>
                ) : (
                    <h1>Search for Movies & TV Shows</h1>
                )}
            </div>

            <div className="search-page__content">
                {loading ? (
                    <div className="search-loading">
                        <div className="loading-spinner"></div>
                        <p>Searching...</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="search-results-grid">
                        {results.map((item) => (
                            <div
                                key={item.id}
                                className="search-result-item"
                                onClick={() => handleItemClick(item)}
                            >
                                <MovieCard movie={item} hideActions />
                            </div>
                        ))}
                    </div>
                ) : query ? (
                    <div className="no-results">
                        <h2>No results found</h2>
                        <p>
                            Your search for "{query}" did not have any matches.
                        </p>
                        <ul>
                            <li>Try different keywords</li>
                            <li>Looking for a movie or TV show?</li>
                            <li>Try using a movie, TV show title, an actor or director</li>
                        </ul>
                    </div>
                ) : (
                    <div className="search-placeholder">
                        <svg viewBox="0 0 24 24" width="64" height="64">
                            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                        <p>Search for your favorite movies and TV shows</p>
                    </div>
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

export default Search;
