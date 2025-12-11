import { useState, useEffect, useRef } from "react";
import { getImageUrl, getBackdropUrl, getMovieDetails, getTVShowDetails } from "../services/api";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/MovieModal.css";

function MovieModal({ item, type = "movie", onClose }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const modalRef = useRef(null);
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

    const favorite = item ? isFavorite(item.id) : false;

    useEffect(() => {
        const loadDetails = async () => {
            if (!item) return;

            setLoading(true);
            try {
                const data = type === "tv"
                    ? await getTVShowDetails(item.id)
                    : await getMovieDetails(item.id);
                setDetails(data);
            } catch (error) {
                console.error("Error loading details:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDetails();
    }, [item, type]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        document.addEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "auto";
        };
    }, [onClose]);

    const handleFavoriteClick = () => {
        if (favorite) {
            removeFromFavorites(item.id);
        } else {
            addToFavorites(item);
        }
    };

    if (!item) return null;

    const title = details?.title || details?.name || item.title || item.name;
    const backdropUrl = getBackdropUrl(details?.backdrop_path || item.backdrop_path);
    const posterUrl = getImageUrl(details?.poster_path || item.poster_path);
    const rating = (details?.vote_average || item.vote_average)?.toFixed(1);
    const year = (details?.release_date || details?.first_air_date || item.release_date || item.first_air_date)?.split("-")[0];
    const runtime = details?.runtime || details?.episode_run_time?.[0];
    const genres = details?.genres?.map(g => g.name).join(", ");
    const overview = details?.overview || item.overview;

    // Get trailer
    const trailer = details?.videos?.results?.find(
        v => v.type === "Trailer" && v.site === "YouTube"
    );

    // Get cast (first 6)
    const cast = details?.credits?.cast?.slice(0, 6);

    // Get similar content (first 6)
    const similar = details?.similar?.results?.slice(0, 6);

    return (
        <div className="modal-overlay">
            <div className="modal" ref={modalRef}>
                {/* Close Button */}
                <button className="modal__close" onClick={onClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>

                {/* Hero Section */}
                <div className="modal__hero">
                    {backdropUrl && (
                        <img
                            src={backdropUrl}
                            alt={title}
                            className="modal__backdrop"
                        />
                    )}
                    <div className="modal__hero-gradient"></div>

                    <div className="modal__hero-content">
                        <h1 className="modal__title">{title}</h1>

                        <div className="modal__buttons">
                            <button className="btn btn-primary">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="currentColor" d="M8 5v14l11-7z" />
                                </svg>
                                <span>Play</span>
                            </button>

                            <button
                                className={`btn-icon ${favorite ? 'active' : ''}`}
                                onClick={handleFavoriteClick}
                                aria-label={favorite ? "Remove from My List" : "Add to My List"}
                            >
                                {favorite ? (
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                )}
                            </button>

                            <button className="btn-icon" aria-label="Like">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="modal__content">
                    {loading ? (
                        <div className="modal__loading">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : (
                        <>
                            {/* Main Info Grid */}
                            <div className="modal__grid">
                                <div className="modal__main">
                                    {/* Metadata */}
                                    <div className="modal__meta">
                                        {rating && (
                                            <span className="meta-match">{Math.round(rating * 10)}% Match</span>
                                        )}
                                        {year && <span className="meta-year">{year}</span>}
                                        <span className="meta-maturity">16+</span>
                                        {runtime && <span className="meta-runtime">{runtime}m</span>}
                                        <span className="meta-quality">HD</span>
                                    </div>

                                    {/* Overview */}
                                    <p className="modal__overview">{overview}</p>
                                </div>

                                <div className="modal__sidebar">
                                    {/* Cast */}
                                    {cast && cast.length > 0 && (
                                        <div className="modal__info-item">
                                            <span className="info-label">Cast: </span>
                                            <span className="info-value">
                                                {cast.map(c => c.name).join(", ")}
                                            </span>
                                        </div>
                                    )}

                                    {/* Genres */}
                                    {genres && (
                                        <div className="modal__info-item">
                                            <span className="info-label">Genres: </span>
                                            <span className="info-value">{genres}</span>
                                        </div>
                                    )}

                                    {/* Type */}
                                    <div className="modal__info-item">
                                        <span className="info-label">This {type === "tv" ? "series" : "movie"} is: </span>
                                        <span className="info-value">Exciting, Suspenseful</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trailer Section */}
                            {trailer && (
                                <div className="modal__trailer">
                                    <h3>Trailer</h3>
                                    <div className="trailer-container">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${trailer.key}`}
                                            title={trailer.name}
                                            allowFullScreen
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        ></iframe>
                                    </div>
                                </div>
                            )}

                            {/* Similar Content */}
                            {similar && similar.length > 0 && (
                                <div className="modal__similar">
                                    <h3>More Like This</h3>
                                    <div className="similar-grid">
                                        {similar.map((item) => (
                                            <div key={item.id} className="similar-card">
                                                <div className="similar-card__image">
                                                    <img
                                                        src={getBackdropUrl(item.backdrop_path, "w300") || getImageUrl(item.poster_path, "w300")}
                                                        alt={item.title || item.name}
                                                        loading="lazy"
                                                    />
                                                    <div className="similar-card__overlay">
                                                        <span className="similar-card__duration">2h 15m</span>
                                                    </div>
                                                </div>
                                                <div className="similar-card__info">
                                                    <div className="similar-card__meta">
                                                        <span className="meta-match">95% Match</span>
                                                        <span className="meta-maturity">16+</span>
                                                    </div>
                                                    <p className="similar-card__overview line-clamp-3">
                                                        {item.overview || "No description available."}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* About Section */}
                            <div className="modal__about">
                                <h3>About {title}</h3>
                                <div className="about-grid">
                                    {details?.production_companies?.length > 0 && (
                                        <div className="about-item">
                                            <span className="about-label">Studio: </span>
                                            <span>{details.production_companies.map(c => c.name).join(", ")}</span>
                                        </div>
                                    )}
                                    {details?.original_language && (
                                        <div className="about-item">
                                            <span className="about-label">Original Language: </span>
                                            <span>{details.original_language.toUpperCase()}</span>
                                        </div>
                                    )}
                                    {details?.status && (
                                        <div className="about-item">
                                            <span className="about-label">Status: </span>
                                            <span>{details.status}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MovieModal;
