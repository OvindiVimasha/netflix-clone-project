import { Route, Routes } from "react-router-dom";
import "./css/index.css";
import "./css/App.css";
import Home from "./pages/home.jsx";
import MyList from "./pages/favourite.jsx";
import TVShows from "./pages/TVShows.jsx";
import Movies from "./pages/Movies.jsx";
import Search from "./pages/Search.jsx";
import NewPopular from "./pages/NewPopular.jsx";
import { MovieProvider } from "./contexts/MovieContext.jsx";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <MovieProvider>
      <div className="app">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/new-popular" element={<NewPopular />} />
            <Route path="/my-list" element={<MyList />} />
            <Route path="/favourite" element={<MyList />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </MovieProvider>
  );
}

function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1>Lost your way?</h1>
        <p>
          Sorry, we can't find that page. You'll find lots to explore on the home page.
        </p>
        <a href="/" className="btn btn-primary">
          Netflix Home
        </a>
        <div className="error-code">
          <span>Error Code</span>
          <strong>NSES-404</strong>
        </div>
      </div>
    </div>
  );
}

export default App;
