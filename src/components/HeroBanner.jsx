import { useState, useEffect } from "react";
import { getImageUrl, getBackdropUrl } from "../services/api";
import "../css/HeroBanner.css";

function HeroBanner({ movies, onPlayClick, onInfoClick }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const featuredMovies = movies?.slice(0, 5) || [];
    const currentMovie = featuredMovies[currentIndex];

    useEffect(() => {
        if (featuredMovies.length <= 1) return;

        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
                setIsAnimating(false);
            }, 500);
        }, 8000);

        return () => clearInterval(interval);
    }, [featuredMovies.length]);

    const handleDotClick = (index) => {
        if (index === currentIndex) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsAnimating(false);
        }, 300);
    };

    if (!currentMovie) {
        return (
            <div className="hero-banner hero-banner--skeleton">
                <div className="hero-banner__skeleton-content">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text short"></div>
                    <div className="skeleton-buttons">
                        <div className="skeleton skeleton-button"></div>
                        <div className="skeleton skeleton-button"></div>
                    </div>
                </div>
            </div>
        );
    }

    const backdropUrl = getBackdropUrl(currentMovie.backdrop_path);
    const rating = currentMovie.vote_average?.toFixed(1);
    const year = currentMovie.release_date?.split("-")[0] ||
        currentMovie.first_air_date?.split("-")[0];
    const title = currentMovie.title || currentMovie.name;
    const overview = currentMovie.overview?.length > 250
        ? currentMovie.overview.substring(0, 250) + "..."
        : currentMovie.overview;

    return (
        <section className="hero-banner">
            {/* Background Image */}
            <div
                className={`hero-banner__background ${isAnimating ? "fade-out" : ""}`}
                style={{
                    backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none'
                }}
            >
                <div className="hero-banner__gradient"></div>
            </div>

            {/* Content */}
            <div className={`hero-banner__content ${isAnimating ? "fade-out" : ""}`}>
                <div className="hero-banner__logo-container">
                    {/* Netflix "N" Series/Film Badge */}
                    <div className="hero-banner__badge">
                        <span className="netflix-n">N</span>
                        <span className="badge-text">{currentMovie.media_type === "tv" ? "SERIES" : "FILM"}</span>
                    </div>

                    {/* Title */}
                    <h1 className="hero-banner__title">{title}</h1>
                </div>

                {/* Metadata */}
                <div className="hero-banner__metadata">
                    {rating && (
                        <span className="metadata-item rating">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="#46d369" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            {rating}
                        </span>
                    )}
                    {year && <span className="metadata-item year">{year}</span>}
                    <span className="metadata-item maturity">16+</span>
                    <span className="metadata-item duration">2h 15m</span>
                    <span className="metadata-item quality">HD</span>
                </div>

                {/* Overview */}
                <p className="hero-banner__overview">{overview}</p>

                {/* Buttons */}
                <div className="hero-banner__buttons">
                    <button
                        className="btn btn-primary btn-play"
                        onClick={() => onPlayClick?.(currentMovie)}
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M8 5v14l11-7z" />
                        </svg>
                        <span>Play</span>
                    </button>

                    <button
                        className="btn btn-secondary btn-info"
                        onClick={() => onInfoClick?.(currentMovie)}
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                        <span>More Info</span>
                    </button>
                </div>
            </div>

            {/* Navigation Dots */}
            {featuredMovies.length > 1 && (
                <div className="hero-banner__nav">
                    {featuredMovies.map((_, index) => (
                        <button
                            key={index}
                            className={`hero-nav-dot ${index === currentIndex ? "active" : ""}`}
                            onClick={() => handleDotClick(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Maturity Rating Badge */}
            <div className="hero-banner__maturity-badge">
                <span>16+</span>
            </div>
        </section>
    );
}

export default HeroBanner;
