import { useEffect, useState } from "react";
import axios from "axios";
import MovieDetails from "../components/MovieDetails";

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  year: number;
  rating: string;
}

const MoviesPage = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [posters, setPosters] = useState<string[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function fetchPosters() {
      const response = await axios.get("https://localhost:4000/poster");
      setPosters(response.data);
    }
    fetchPosters();
  }, []);

  useEffect(() => {
    async function fetchMovies() {
      const response = await axios.get<Movie[]>(
        "https://localhost:4000/AllMovies"
      ); // Adjust this URL if needed
      setMovies(response.data);
    }
    fetchMovies();
  }, []);

  function normalizeTitle(title: string) {
    return title.toLowerCase().replace(/\s+/g, "-");
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Posters</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {posters.map((posterUrl, index) => {
          const matchedMovie = movies.find((movie) =>
            posterUrl.toLowerCase().includes(normalizeTitle(movie.title))
          );

          return (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => matchedMovie && setSelectedMovie(matchedMovie)}
            >
              <div className="aspect-[2/3] rounded-lg overflow-hidden">
                <img
                  src={posterUrl}
                  alt={matchedMovie ? matchedMovie.title : `Poster ${index}`}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
                {matchedMovie && (
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {matchedMovie.title}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {matchedMovie.year} • {matchedMovie.rating}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* You can later show <MovieDetails movie={selectedMovie} /> here if selectedMovie is set */}
    </div>
  );

  // return (
  //   <div className="min-h-screen pt-20 pb-12">
  //     <div className="container mx-auto px-4">
  //       <h1 className="text-3xl font-bold mb-8">Movies</h1>

  //       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
  //         {movies.map((movie) => (
  //           <div
  //             key={movie.id}
  //             className="relative group cursor-pointer"
  //             onClick={() => setSelectedMovie(movie)}
  //           >
  //             <div className="aspect-[2/3] rounded-lg overflow-hidden">
  //               <img
  //                 src={movie.posterUrl}
  //                 alt={movie.title}
  //                 className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
  //               />
  //             </div>
  //             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
  //               <div>
  //                 <h3 className="text-lg font-semibold">{movie.title}</h3>
  //                 <p className="text-sm text-gray-300">
  //                   {movie.year} • {movie.rating}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     {selectedMovie && (
  //       <MovieDetails
  //         movie={selectedMovie}
  //         onClose={() => setSelectedMovie(null)}
  //       />
  //     )}
  //     <div className="container mx-auto px-4">
  //       <h1 className="text-3xl font-bold mb-8">Posters</h1>

  //       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
  //         {posters.map((url, index) => (
  //           <div key={index} className="relative group cursor-pointer">
  //             <div className="aspect-[2/3] rounded-lg overflow-hidden">
  //               <img
  //                 src={url}
  //                 alt={`Poster ${index}`}
  //                 className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
  //               />
  //             </div>
  //             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
  //             <div>
  //               <h3 className="text-lg font-semibold text-white">{posters.title}</h3>
  //               <p className="text-sm text-gray-300">
  //                 {posters.year} • {posters.rating}
  //               </p>
  //             </div>
  //           </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default MoviesPage;
