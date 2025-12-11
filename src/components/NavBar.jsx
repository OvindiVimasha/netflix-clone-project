import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";

function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery("");
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/tv-shows", label: "TV Shows" },
    { path: "/movies", label: "Movies" },
    { path: "/new-popular", label: "New & Popular" },
    { path: "/my-list", label: "My List" },
  ];

  return (
    <header className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__container">
        {/* Left Section */}
        <div className="navbar__left">
          {/* Netflix Logo - Text-based for reliability */}
          <Link to="/" className="navbar__logo">
            <span className="navbar__brand-text">NETFLIX</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="navbar__mobile-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            <span>Browse</span>
            <svg viewBox="0 0 24 24" className={`dropdown-arrow ${showMobileMenu ? 'rotated' : ''}`}>
              <path d="M7 10l5 5 5-5z" fill="currentColor" />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="navbar__nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar__nav-link ${location.pathname === link.path ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="navbar__right">
          {/* Search */}
          <div className={`navbar__search ${showSearch ? "expanded" : ""}`}>
            <button
              className="navbar__search-btn"
              onClick={handleSearchToggle}
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
            {showSearch && (
              <form onSubmit={handleSearchSubmit} className="navbar__search-form">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Titles, people, genres"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="navbar__search-input"
                />
                <button
                  type="button"
                  className="navbar__search-close"
                  onClick={handleSearchToggle}
                >
                  ✕
                </button>
              </form>
            )}
          </div>

          {/* Notifications */}
          <button className="navbar__icon-btn" aria-label="Notifications">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
            </svg>
          </button>

          {/* Profile - Guest Only */}
          <div className="navbar__profile">
            <button
              className="navbar__profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="Profile menu"
            >
              <div className="navbar__profile-avatar">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <span className="navbar__profile-name">Guest</span>
              <svg viewBox="0 0 24 24" className={`dropdown-arrow ${showProfileMenu ? 'rotated' : ''}`}>
                <path d="M7 10l5 5 5-5z" fill="currentColor" />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="navbar__profile-dropdown">
                <div className="profile-dropdown__section">
                  <div className="profile-dropdown__user">
                    <div className="profile-avatar profile-avatar--red">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="profile-dropdown__user-info">
                      <span className="profile-dropdown__user-name">Guest</span>
                      <span className="profile-dropdown__user-email">Welcome to Netflix Clone</span>
                    </div>
                  </div>
                </div>
                <div className="profile-dropdown__section">
                  <button className="profile-dropdown__item signout">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <nav className="navbar__mobile-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__mobile-link ${location.pathname === link.path ? "active" : ""}`}
              onClick={() => setShowMobileMenu(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export default NavBar;
