import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import { getImageUrl } from "../services/api";

function MovieCard({ movie, hideActions = false, onClick }) {
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
    const favorite = isFavorite(movie.id);

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        if (favorite) {
            removeFromFavorites(movie.id);
        } else {
            addToFavorites(movie);
        }
    };

    const imageUrl = getImageUrl(movie.poster_path);
    const title = movie.title || movie.name;
    const year = movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0];
    const rating = movie.vote_average?.toFixed(1);

    return (
        <div className="movie-card" onClick={onClick}>
            <div className="movie-card__poster">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        loading="lazy"
                    />
                ) : (
                    <div className="movie-card__placeholder">
                        <svg viewBox="0 0 24 24" width="48" height="48">
                            <path fill="currentColor" d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
                        </svg>
                    </div>
                )}

                {/* Overlay */}
                <div className="movie-card__overlay">
                    {!hideActions && (
                        <div className="movie-card__actions">
                            <button
                                className={`action-btn favorite-btn ${favorite ? "active" : ""}`}
                                onClick={handleFavoriteClick}
                                aria-label={favorite ? "Remove from My List" : "Add to My List"}
                            >
                                {favorite ? (
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Rating Badge */}
                    {rating && (
                        <div className="movie-card__rating">
                            <svg viewBox="0 0 24 24" width="14" height="14">
                                <path fill="#ffc107" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            <span>{rating}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="movie-card__info">
                <h3 className="movie-card__title">{title}</h3>
                {year && <span className="movie-card__year">{year}</span>}
            </div>
        </div>
    );
}

export default MovieCard;