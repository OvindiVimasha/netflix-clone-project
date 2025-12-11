import { useRef, useState, useEffect } from "react";
import { getImageUrl } from "../services/api";
import "../css/ContentRow.css";

function ContentRow({ title, movies, type = "movie", onItemClick, size = "normal" }) {
    const rowRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [isHovering, setIsHovering] = useState(false);

    const checkArrows = () => {
        if (!rowRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        checkArrows();
        window.addEventListener('resize', checkArrows);
        return () => window.removeEventListener('resize', checkArrows);
    }, [movies]);

    const scroll = (direction) => {
        if (!rowRef.current) return;

        const scrollAmount = rowRef.current.clientWidth * 0.8;
        rowRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    const handleScroll = () => {
        checkArrows();
    };

    if (!movies || movies.length === 0) {
        return null;
    }

    return (
        <section
            className={`content-row ${size === "large" ? "content-row--large" : ""}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <h2 className="content-row__title">
                {title}
                <span className="explore-all">
                    Explore All
                    <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                </span>
            </h2>

            <div className="content-row__container">
                {/* Left Arrow */}
                <button
                    className={`content-row__arrow content-row__arrow--left ${showLeftArrow && isHovering ? 'visible' : ''}`}
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                >
                    <svg viewBox="0 0 24 24" width="36" height="36">
                        <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>

                {/* Content Slider */}
                <div
                    className="content-row__slider"
                    ref={rowRef}
                    onScroll={handleScroll}
                >
                    {movies.map((item, index) => (
                        <ContentCard
                            key={item.id}
                            item={item}
                            type={type}
                            size={size}
                            index={index}
                            totalItems={movies.length}
                            onClick={() => onItemClick?.(item)}
                        />
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    className={`content-row__arrow content-row__arrow--right ${showRightArrow && isHovering ? 'visible' : ''}`}
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                >
                    <svg viewBox="0 0 24 24" width="36" height="36">
                        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                </button>
            </div>
        </section>
    );
}

function ContentCard({ item, type, size, index, totalItems, onClick }) {
    const [isHovered, setIsHovered] = useState(false);
    const [showExpanded, setShowExpanded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const hoverTimeoutRef = useRef(null);

    const imageUrl = size === "large"
        ? getImageUrl(item.poster_path, "w500")
        : getImageUrl(item.backdrop_path || item.poster_path, "w500");

    const title = item.title || item.name;
    const rating = item.vote_average?.toFixed(1);
    const year = item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0];
    const matchPercent = rating ? Math.round(rating * 10) : 95;

    // Determine card position for transform origin
    const isFirst = index === 0;
    const isLast = index === totalItems - 1;

    const handleMouseEnter = () => {
        setIsHovered(true);
        // Delay before showing expanded content
        hoverTimeoutRef.current = setTimeout(() => {
            setShowExpanded(true);
        }, 400);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setShowExpanded(false);
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
    };

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    const cardClasses = [
        'content-card',
        isHovered ? 'content-card--hovered' : '',
        showExpanded ? 'content-card--expanded' : '',
        isFirst ? 'content-card--first' : '',
        isLast ? 'content-card--last' : '',
    ].filter(Boolean).join(' ');

    return (
        <div
            className={cardClasses}
            style={{ '--index': index }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {/* Card Wrapper for proper scaling */}
            <div className="content-card__wrapper">
                <div className="content-card__image-container">
                    {!imageLoaded && <div className="content-card__skeleton skeleton"></div>}
                    <img
                        src={imageUrl || '/placeholder.jpg'}
                        alt={title}
                        className={`content-card__image ${imageLoaded ? 'loaded' : ''}`}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />

                    {/* Video Preview Placeholder - shows on expanded */}
                    {showExpanded && (
                        <div className="content-card__video-preview">
                            {/* Could add video preview here */}
                        </div>
                    )}
                </div>

                {/* Expanded Info Panel */}
                {showExpanded && (
                    <div className="content-card__info">
                        {/* Title */}
                        <h3 className="content-card__info-title">{title}</h3>

                        {/* Action Buttons */}
                        <div className="content-card__buttons">
                            <button className="card-btn card-btn--play" aria-label="Play">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor" d="M8 5v14l11-7z" />
                                </svg>
                            </button>
                            <button className="card-btn" aria-label="Add to My List">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                </svg>
                            </button>
                            <button className="card-btn" aria-label="Like">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                                </svg>
                            </button>
                            <button className="card-btn card-btn--expand" aria-label="More info">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor" d="M7 10l5 5 5-5z" />
                                </svg>
                            </button>
                        </div>

                        {/* Metadata */}
                        <div className="content-card__meta">
                            <span className="meta-match">{matchPercent}% Match</span>
                            <span className="meta-maturity">16+</span>
                            {year && <span className="meta-year">{year}</span>}
                        </div>

                        {/* Genre Tags */}
                        <div className="content-card__tags">
                            <span>{type === 'tv' ? 'Series' : 'Movie'}</span>
                            <span className="dot">•</span>
                            <span>Drama</span>
                            <span className="dot">•</span>
                            <span>Thriller</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Title for mobile/fallback */}
            <div className="content-card__title-container">
                <h3 className="content-card__title">{title}</h3>
            </div>
        </div>
    );
}

export default ContentRow;
