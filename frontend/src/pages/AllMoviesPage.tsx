import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import MovieDetails from "../components/MovieDetails";

interface Movie {
	showId: string;
	title: string;
	releaseYear: number;
	rating: string;
	posterUrl?: string;
	description: string;
	cast: string[] | string;
	director: string | null;
	country: string | null;
	genre: string[] | string;
	genreParsed?: string[];
	[key: string]: any;
}

const genreMap: Record<string, string> = {
	Action: "Action",
	Adventure: "Adventure",
	Anime_Series_International_TV_Shows:
		"Anime Series / International TV Shows",
	British_TV_Shows_Docuseries_International_TV_Shows:
		"British TV Shows / Docuseries / International TV Shows",
	Children: "Children",
	Comedies: "Comedies",
	Comedies_Dramas_International_Movies:
		"Comedies / Dramas / International Movies",
	Comedies_International_Movies: "Comedies / International Movies",
	Comedies_Romantic_Movies_: "Comedies / Romantic Movies",
	Crime_TV_Shows_Docuseries: "Crime / TV Shows / Docuseries",
	Documentaries: "Documentaries",
	Documentaries_International_Movies: "Documentaries / International Movies",
	Docuseries: "Docuseries",
	Dramas: "Dramas",
	Dramas_International_Movies: "Dramas / International Movies",
	Dramas_Romantic_Movies: "Dramas / Romantic Movies",
	Family_Movies: "Family Movies",
	Fantasy: "Fantasy",
	Horror_Movies: "Horror Movies",
	International_Movies_Thrillers: "International Movies / Thrillers",
	International_TV_Shows_Romantic_TV_Dramas:
		"International TV Shows / Romantic TV Dramas",
	KidsTV: "Kids TV",
	Language_TV_Shows: "Language TV Shows",
	Musicals: "Musicals",
	Nature_TV: "Nature TV",
	Reality_TV: "Reality TV",
	Spirituality: "Spirituality",
	TV_Action: "TV Action",
	TV_Comedies: "TV Comedies",
	TV_Dramas: "TV Dramas",
	Talk_Shows_TV_Comedies: "Talk Shows / TV Comedies",
	Thrillers: "Thrillers",
};

const labelToGenreKey = Object.fromEntries(
	Object.entries(genreMap).map(([key, label]) => [label, key])
);

function extractGenresFromPython(movie: any): string[] {
	console.log(":jigsaw: Extracting genre for movie:", movie);
	const genreKeys = [
		"action",
		"adventure",
		"anime series international tv shows",
		"british tv shows docuseries international tv shows",
		"children",
		"comedies",
		"comedies dramas international movies",
		"comedies international movies",
		"comedies romantic movies",
		"crime tv shows docuseries",
		"documentaries",
		"documentaries international movies",
		"docuseries",
		"dramas",
		"dramas international movies",
		"dramas romantic movies",
		"family movies",
		"fantasy",
		"horror movies",
		"international movies thrillers",
		"international tv shows romantic tv shows tv dramas",
		"kids' tv",
		"language tv shows",
		"musicals",
		"nature tv",
		"reality tv",
		"spirituality",
		"tv action",
		"tv comedies",
		"tv dramas",
		"talk shows tv comedies",
		"thrillers",
	];
	// Normalize the movie keys
	const normalized = Object.fromEntries(
		Object.entries(movie).map(([k, v]) => [k.toLowerCase(), v])
	);
	const extracted = genreKeys.filter(
		(key) => normalized[key] === 1 || normalized[key] === true
	);
	console.log(":white_check_mark: Genres found:", extracted);
	return extracted.length > 0 ? extracted : ["Unknown Genre"];
}

function getFileNameFromUrl(url: string) {
	return url.split("/").pop()?.split(".")[0] ?? "";
}

function normalizeTitle(title: string | undefined) {
	if (!title) return "";
	return title.toLowerCase().replace(/[^a-z0-9]/gi, "");
}

function matchPoster(movieTitle: string, posterUrls: string[]): string {
	const normalizedMovieTitle = normalizeTitle(movieTitle);
	const matchingPoster = posterUrls.find((url) => {
		const posterName = getFileNameFromUrl(url);
		return normalizeTitle(posterName) === normalizedMovieTitle;
	});
	return matchingPoster || "img/no-image-placeholder.png";
}

function parseCast(cast: string[] | string | null | undefined): string[] {
	if (Array.isArray(cast)) return cast;
	if (typeof cast === "string") {
		return cast.split(",").map((name: string) => name.trim());
	}
	return [];
}

const AllMoviesPage = () => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [posters, setPosters] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [selectedGenre, setSelectedGenre] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const genreKey = labelToGenreKey[selectedGenre] ?? "";

	useEffect(() => {
		const fetchMovies = async () => {
			setLoading(true);
			try {
				const res = await axios.get(
					"https://localhost:4000/AllMovies",
					{
						params: {
							page,
							limit: 50,
							genre: genreKey,
							query: searchQuery || undefined,
						},
					}
				);

				const newMovies = res.data.map((movie: Movie) => ({
					...movie,
					posterUrl: matchPoster(movie.title, posters),
					genreParsed: extractGenresFromPython(movie),
				}));

				setMovies((prev) =>
					page === 1 ? newMovies : [...prev, ...newMovies]
				);
				setHasMore(newMovies.length > 0);
			} catch (err) {
				console.error("Failed to fetch movies", err);
			} finally {
				setLoading(false);
			}
		};

		// Fetch movies only when posters are loaded
		if (posters.length > 0) {
			fetchMovies();
		}
	}, [page, posters, selectedGenre, searchQuery]);

	useEffect(() => {
		setMovies([]);
		setPage(1);
		setHasMore(true);
	}, [selectedGenre, searchQuery]);

	useEffect(() => {
		const handleScroll = () => {
			const nearBottom =
				window.innerHeight + window.scrollY >=
				document.body.offsetHeight - 500;

			if (nearBottom && !loading && hasMore) {
				setPage((prev) => prev + 1);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [loading, hasMore]);

	useEffect(() => {
		const fetchPosters = async () => {
			try {
				const postersRes = await axios.get(
					"https://localhost:4000/poster"
				);
				setPosters(postersRes.data);
			} catch (err) {
				console.error("Failed to fetch posters", err);
			}
		};
		fetchPosters();
	}, []);

	useEffect(() => {
		if (posters.length === 0) return;
		setMovies((prev) =>
			prev.map((movie) => ({
				...movie,
				posterUrl:
					posters.length > 0
						? matchPoster(movie.title, posters)
						: undefined,
			}))
		);
	}, [posters]);

	const genreOptions = Object.values(genreMap).sort();

	const filteredMovies = useMemo(() => {
		return movies.filter((movie) => {
			if (searchQuery.trim() !== "") {
				const lower = searchQuery.toLowerCase();

				const cast =
					typeof movie.cast === "string"
						? movie.cast
						: Array.isArray(movie.cast)
							? movie.cast.join(" ")
							: "";

				const titleMatch = (movie.title ?? "")
					.toLowerCase()
					.includes(lower);
				const castMatch = cast.toLowerCase().includes(lower);
				const directorMatch = (movie.director ?? "")
					.toLowerCase()
					.includes(lower);
				const countryMatch = (movie.country ?? "")
					.toLowerCase()
					.includes(lower);

				return titleMatch || castMatch || directorMatch || countryMatch;
			}

			return true;
		});
	}, [movies, selectedGenre, searchQuery]);

	return (
		<div className="pt-20 container mx-auto px-4 pb-10">
			<h1 className="text-3xl font-bold mb-8 mt-10">All Movies</h1>

			<div className="flex flex-col sm:flex-row gap-4 mb-6">
				<select
					className="w-full sm:w-60 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
					value={selectedGenre}
					onChange={(e) => setSelectedGenre(e.target.value)}
				>
					<option value="">All Genres</option>
					{genreOptions.map((genre) => (
						<option key={genre} value={genre}>
							{genre}
						</option>
					))}
				</select>
				<input
					type="text"
					placeholder="Search by title, director, cast, or country"
					className="flex-grow px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				{(selectedGenre || searchQuery) && (
					<button
						className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
						onClick={() => {
							setSelectedGenre("");
							setSearchQuery("");
						}}
					>
						Clear Filters
					</button>
				)}
			</div>

			{loading && movies.length === 0 ? (
				<div className="col-span-full flex justify-center items-center py-20">
					<div className="w-12 h-12 border-4 border-t-transparent border-gray-600 rounded-full animate-spin" />
					<span className="ml-4 text-gray-600 text-lg">
						Loading movies...
					</span>
				</div>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
					{filteredMovies.map((movie, index) => (
						<MovieCard
							key={index}
							movie={movie}
							onSelect={() => setSelectedMovie(movie)}
						/>
					))}
				</div>
			)}
			{selectedMovie && (
				<MovieDetails
					movie={{
						...selectedMovie,
						posterUrl:
							selectedMovie.posterUrl ||
							"img/no-image-placeholder.png",
						year: selectedMovie.releaseYear,
						genre:
							selectedMovie.genreParsed ??
							(Array.isArray(selectedMovie.genre)
								? selectedMovie.genre
								: [selectedMovie.genre ?? "Unknown Genre"]),
						cast: parseCast(selectedMovie.cast),
					}}
					onClose={() => setSelectedMovie(null)}
					onSimilarMovieClick={(movie) =>
						setSelectedMovie({
							...movie,
							posterUrl: matchPoster(movie.title, posters),
							releaseYear: movie.releaseYear,
							genre: extractGenresFromPython(movie),
							director: movie.director,
							country: movie.country,
							cast:
								typeof movie.cast === "string"
									? (movie.cast as string)
											.split(",")
											.map((name) => name.trim())
									: movie.cast || [],
						})
					}
				/>
			)}
		</div>
	);
};

const MovieCard = ({
	movie,
	onSelect,
}: {
	movie: Movie;
	onSelect: () => void;
}) => {
	const { ref, inView } = useInView({ triggerOnce: true });

	return (
		<div
			ref={ref}
			className="relative group cursor-pointer"
			onClick={onSelect}
		>
			<div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-900">
				{inView && (
					<img
						src={movie.posterUrl || "img/no-image-placeholder.png"}
						alt={movie.title}
						loading="lazy"
						className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
					/>
				)}
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
	);
};

export default AllMoviesPage;
