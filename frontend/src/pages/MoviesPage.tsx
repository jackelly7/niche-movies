import { useEffect, useState } from "react";
import axios from "axios";
import MovieDetails from "../components/MovieDetails";
interface Movie {
  showId: string;
  title: string;
  releaseYear: number;
  rating: string;
  posterUrl?: string;
  description: string;
  genre: string[];
  cast: string[];
}
function extractGenresFromPython(movie: any): string[] {
  const genreKeys = [
    "Action",
    "Adventure",
    "Anime Series International TV Shows",
    "British TV Shows Docuseries International TV Shows",
    "Children",
    "Comedies",
    "Comedies Dramas International Movies",
    "Comedies International Movies",
    "Comedies Romantic Movies",
    "Crime TV Shows Docuseries",
    "Documentaries",
    "Documentaries International Movies",
    "Docuseries",
    "Dramas",
    "Dramas International Movies",
    "Dramas Romantic Movies",
    "Family Movies",
    "Fantasy",
    "Horror Movies",
    "International Movies Thrillers",
    "International TV Shows Romantic TV Shows TV Dramas",
    "Kids' TV",
    "Language TV Shows",
    "Musicals",
    "Nature TV",
    "Reality TV",
    "Spirituality",
    "TV Action",
    "TV Comedies",
    "TV Dramas",
    "Talk Shows TV Comedies",
    "Thrillers",
  ];
  const extracted = genreKeys.filter((key) => movie[key] === 1);
  return extracted.length > 0 ? extracted : ["Unknown Genre"];
}
const MoviesPage = () => {
  const [posters, setPosters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Optional: loading spinner
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showMfaPrompt, setShowMfaPrompt] = useState(false);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaSecret, setMfaSecret] = useState("");
  const email = localStorage.getItem("userEmail") || "";
  const [basedOnMovie, setBasedOnMovie] = useState("");

  useEffect(() => {
    const justSignedUp = sessionStorage.getItem("justSignedUp");
    if (justSignedUp === "true") {
      setShowMfaPrompt(true);
      sessionStorage.removeItem("justSignedUp");
    }
  }, []);
  const handleMfaSetup = async () => {
    const res = await fetch("https://localhost:4000/setup-mfa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(email),
    });
    const data = await res.json();
    setQrCodeUrl(data.qrCodeUrl);
    setMfaSecret(data.secret);
    setShowMfaPrompt(false);
    setShowMfaSetup(true);
  };
  const [userId, setUserId] = useState<number | null>(null);
  const [contentRecommendations, setContentRecommendations] = useState<Movie[]>(
    []
  );
  const [movies, setMovies] = useState<Movie[]>([]);
  const [collaborativeRecommendations, setCollaborativeRecommendations] =
    useState<Movie[]>([]);
  const [hybridRecommendations, setHybridRecommendations] = useState<Movie[]>(
    []
  );
  const [hiddenGemRecommendations, setHiddenGemRecommendations] = useState<
    Movie[]
  >([]);
  function getFileNameFromUrl(url: string) {
    return url.split("/").pop()?.split(".")[0] ?? "";
  }
  function normalizeTitle(title: string | undefined) {
    if (!title) return ""; // <-- return empty if no title
    return title.toLowerCase().replace(/[^a-z0-9]/gi, "");
  }
  function matchPoster(movieTitle: string, posterUrls: string[]): string {
    const normalizedMovieTitle = normalizeTitle(movieTitle);
    const matchingPoster = posterUrls.find((url) => {
      const posterName = getFileNameFromUrl(url);
      return normalizeTitle(posterName) === normalizedMovieTitle;
    });
    return matchingPoster || "img/no-image-placeholder.png"; // fallback if no poster
  }
  // Fetch movies and posters first
  useEffect(() => {
    async function loadData() {
      try {
        const moviesResponse = await axios.get(
          "https://localhost:4000/AllMovies"
        );
        const loadedMovies = moviesResponse.data;
        const postersResponse = await axios.get(
          "https://localhost:4000/poster"
        );
        const posterUrls: string[] = postersResponse.data;
        const moviesWithPosters = loadedMovies.map((movie: Movie) => {
          const matchingPoster = posterUrls.find((url) => {
            const posterName = getFileNameFromUrl(url);
            return normalizeTitle(posterName) === normalizeTitle(movie.title);
          });
          return {
            ...movie,
            posterUrl: matchingPoster || "img/no-image-placeholder.png",
          };
        });
        setMovies(moviesWithPosters);
        setPosters(posterUrls);
        if (email) {
          const userIdResponse = await axios.get(
            `https://localhost:4000/get-user-id-by-email?email=${email}`
          );
          const fetchedUserId = userIdResponse.data;
          setUserId(fetchedUserId);
        }
      } catch (err) {
        console.error("Failed to load movies, posters, or userId", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);
  // Only fetch recommendations AFTER we have posters and userId
  useEffect(() => {
    if (userId && posters.length > 0) {
      fetchContentRecommendations(userId);
      fetchCollaborativeRecommendations(userId);
      fetchHybridRecommendations(userId);
      fetchHiddenGemRecommendations();
    }
  }, [userId, posters]);
  async function fetchContentRecommendations(userId: number) {
    try {
      const response = await axios.get(
        `https://niche-movies-recommender-api-d6bycsbuauhmgya5.eastus-01.azurewebsites.net/recommend/content?user_id=${userId}&top_n=10`
      );

      console.log("Content Recommendations:", response.data);

      // Save the "basedOn" movie title separately
      setBasedOnMovie(response.data.basedOn);

      // Map over the actual recommendations
      const contentWithPosters = response.data.recommendations.map(
        (movie: any) => ({
          ...movie,
          posterUrl: matchPoster(movie.title, posters),
        })
      );

      setContentRecommendations(contentWithPosters);
    } catch (error) {
      console.error("Failed to fetch content recommendations", error);
    }
  }

  async function fetchCollaborativeRecommendations(userId: number) {
    try {
      const response = await axios.get(
        `https://niche-movies-recommender-api-d6bycsbuauhmgya5.eastus-01.azurewebsites.net/recommend/collaborative?user_id=${userId}&top_n=10`
      );
      console.log("Collaborative Recommendations:", response.data);
      const collaborativeWithPosters = response.data.map((movie: any) => ({
        ...movie,
        posterUrl: matchPoster(movie.title, posters),
      }));
      setCollaborativeRecommendations(collaborativeWithPosters);
    } catch (error) {
      console.error("Failed to fetch collaborative recommendations", error);
    }
  }
  async function fetchHybridRecommendations(userId: number) {
    try {
      const response = await axios.get(
        `https://niche-movies-recommender-api-d6bycsbuauhmgya5.eastus-01.azurewebsites.net/recommend/hybrid?user_id=${userId}&top_n=10`
      );
      console.log("Hybrid Recommendations:", response.data);
      const hybridWithPosters = response.data.map((movie: any) => ({
        ...movie,
        posterUrl: matchPoster(movie.title, posters),
      }));
      setHybridRecommendations(hybridWithPosters);
    } catch (error) {
      console.error("Failed to fetch hybrid recommendations", error);
    }
  }
  async function fetchHiddenGemRecommendations() {
    try {
      const response = await axios.get(
        `https://niche-movies-recommender-api-d6bycsbuauhmgya5.eastus-01.azurewebsites.net/recommend/hidden-gems`
      );
      console.log("Hidden Gems:", response.data);
      const hiddenGemsWithPosters = response.data.map((movie: any) => ({
        ...movie,
        posterUrl: matchPoster(movie.title, posters),
      }));
      setHiddenGemRecommendations(hiddenGemsWithPosters);
    } catch (error) {
      console.error("Failed to fetch hidden gem recommendations", error);
    }
  }

  return (
    <>
      <div className="pt-20 container mx-auto px-4 pb-10">
        <h1 className="text-3xl font-bold mb-8 mt-10">Recommended Movies</h1>
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-t-transparent border-gray-600 rounded-full animate-spin" />
            <span className="ml-4 text-gray-600 text-lg">
              Loading recommendations...
            </span>
          </div>
        ) : (
          <>
            {/* Content-Based Recommendations */}
            {contentRecommendations.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mb-4">
                  Because You Watched {basedOnMovie || "a movie"}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
                  {contentRecommendations.map((movie, index) => (
                    <div
                      key={index}
                      className="relative group"
                      onClick={() => setSelectedMovie(movie)}
                    >
                      <div className="aspect-[2/3] rounded-lg overflow-hidden">
                        <img
                          src={
                            movie.posterUrl || "img/no-image-placeholder.png"
                          }
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
                            {movie.releaseYear} • {movie.rating}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {/* Collaborative Recommendations */}
            {collaborativeRecommendations.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mb-4">
                  What Others Have Liked
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {collaborativeRecommendations.map((movie, index) => (
                    <div
                      key={index}
                      className="relative group"
                      onClick={() => setSelectedMovie(movie)}
                    >
                      <div className="aspect-[2/3] rounded-lg overflow-hidden">
                        <img
                          src={
                            movie.posterUrl || "img/no-image-placeholder.png"
                          }
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
                            {movie.releaseYear} • {movie.rating}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
        <br />
        {hybridRecommendations.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              More We Think You'd Love
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {hybridRecommendations.map((movie, index) => (
                <div
                  key={index}
                  className="relative group"
                  onClick={() => setSelectedMovie(movie)}
                >
                  <div className="aspect-[2/3] rounded-lg overflow-hidden">
                    <img
                      src={movie.posterUrl || "img/no-image-placeholder.png"}
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
                        {movie.releaseYear} • {movie.rating}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <br />
        {hiddenGemRecommendations.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Hidden Gems</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {hiddenGemRecommendations.map((movie, index) => (
                <div
                  key={index}
                  className="relative group"
                  onClick={() => setSelectedMovie(movie)}
                >
                  <div className="aspect-[2/3] rounded-lg overflow-hidden">
                    <img
                      src={movie.posterUrl || "img/no-image-placeholder.png"}
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
                        {movie.releaseYear} • {movie.rating}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>{" "}
      {selectedMovie && (
        <MovieDetails
          movie={{
            ...selectedMovie,
            posterUrl:
              selectedMovie.posterUrl || "img/no-image-placeholder.png",
            year: selectedMovie.releaseYear,
            genre: extractGenresFromPython(selectedMovie),
            cast:
              typeof selectedMovie.cast === "string"
                ? (selectedMovie.cast as string)
                    .split(",")
                    .map((name) => name.trim())
                : selectedMovie.cast || [],
          }}
          onClose={() => setSelectedMovie(null)}
          onSimilarMovieClick={(movie) =>
            setSelectedMovie({
              ...movie,
              posterUrl: matchPoster(movie.title, posters),
              releaseYear: movie.releaseYear,
              genre: extractGenresFromPython(movie),
              cast:
                typeof movie.cast === "string"
                  ? (movie.cast as string).split(",").map((name) => name.trim())
                  : movie.cast || [],
            })
          }
        />
      )}
      {showMfaPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-sm text-white text-center space-y-4">
            <h2 className="text-xl font-bold">🎉 Account Created!</h2>
            <p>Your account has been created successfully.</p>
            <p>
              Would you like to enable Multi-Factor Authentication (MFA) now?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-blue-600 px-4 py-2 rounded"
                onClick={handleMfaSetup}
              >
                Yes, enable MFA
              </button>
              <button
                className="bg-gray-600 px-4 py-2 rounded"
                onClick={() => setShowMfaPrompt(false)}
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
      {showMfaSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-sm text-white text-center space-y-4">
            <h2 className="text-xl font-bold">Set Up MFA</h2>
            <p>Scan the QR code below in your Google Authenticator app:</p>
            <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
            <p className="text-sm text-gray-400">
              Secret: <code>{mfaSecret}</code>
            </p>

            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
            />

            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-600 px-4 py-2 rounded"
                onClick={async () => {
                  const res = await fetch(
                    "https://localhost:4000/verify-mfa-setup",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        email,
                        code: mfaCode,
                      }),
                    }
                  );

                  const result = await res.json();
                  if (res.ok) {
                    alert("✅ MFA Enabled Successfully!");
                    setShowMfaSetup(false);
                  } else {
                    alert(result.message || "MFA setup failed.");
                  }
                }}
              >
                Confirm
              </button>
              <button
                className="bg-gray-600 px-4 py-2 rounded"
                onClick={() => setShowMfaSetup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MoviesPage;
