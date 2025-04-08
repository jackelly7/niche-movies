import { useEffect, useState } from "react";
import axios from "axios";

interface Movie {
  id: string;
  title: string;
  year: number;
  rating: string;
  posterUrl?: string;
}

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [posters, setPosters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Optional: loading spinner
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  function getFileNameFromUrl(url: string) {
    return url.split("/").pop()?.split(".")[0] ?? "";
  }

  useEffect(() => {
    async function loadData() {
      try {
        // 1. Fetch movies
        const moviesResponse = await axios.get(
          "https://localhost:4000/AllMovies"
        );
        const loadedMovies = moviesResponse.data; // Array
        console.log(loadedMovies);

        // 2. Fetch posters
        const postersResponse = await axios.get(
          "https://localhost:4000/poster"
        );
        const posterUrls: string[] = postersResponse.data;
        console.log(posterUrls);

        // 3. Map poster URLs to movies
        const moviesWithPosters = loadedMovies.map((movie: Movie) => {
          const matchingPoster = posterUrls.find((url) => {
            const posterName = getFileNameFromUrl(url);
            return (
              posterName &&
              movie.title &&
              posterName.toLowerCase() === movie.title.toLowerCase()
            );
          });

          return {
            ...movie,
            posterUrl: matchingPoster || "", // fallback
          };
        });

        setMovies(moviesWithPosters);
        setPosters(posterUrls);
      } catch (err) {
        console.error("Failed to load movies or posters", err);
      } finally {
        setLoading(false);
      }
    }

    loadData(); // ✅ Only call this ONCE when the page loads
  }, []); // <<<<< NOTICE: Empty dependency array [] so it only runs once

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Movies</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => setSelectedMovie(movie)}
          >
            <div className="aspect-[2/3] rounded-lg overflow-hidden">
              <img
                src={movie.posterUrl || "/no-image-placeholder.png"}
                alt={movie.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-300">
                  {movie.year} • {movie.rating}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;
