import { useState } from "react";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import "../css/MyList.css";

function MyList() {
    const { favorites } = useMovieContext();
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <div className="my-list-page">
            <div className="my-list-page__header">
                <h1>My List</h1>
                {favorites.length > 0 && (
                    <p>{favorites.length} {favorites.length === 1 ? 'title' : 'titles'}</p>
                )}
            </div>

            <div className="my-list-page__content">
                {favorites.length > 0 ? (
                    <div className="my-list-grid">
                        {favorites.map((item) => (
                            <div
                                key={item.id}
                                className="my-list-item"
                                onClick={() => handleItemClick(item)}
                            >
                                <MovieCard movie={item} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-list">
                        <div className="empty-list__icon">
                            <svg viewBox="0 0 24 24" width="80" height="80">
                                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                        </div>
                        <h2>Your list is empty</h2>
                        <p>
                            Add movies and TV shows to your list so you can easily find them later.
                        </p>
                        <p className="empty-list__hint">
                            Click the <strong>+</strong> icon on any title to add it to your list.
                        </p>
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

export default MyList;