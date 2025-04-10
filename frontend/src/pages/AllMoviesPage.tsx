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
	cast: string[] | string;
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

const AllMoviesPage = () => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [posters, setPosters] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	useEffect(() => {
		const fetchMovies = async () => {
			setLoading(true);
			try {
				const res = await axios.get(
					"https://localhost:4000/AllMovies",
					{
						params: { page, limit: 50 },
					}
				);

				const newMovies = res.data;

				setMovies((prev) => [...prev, ...newMovies]);
				setHasMore(newMovies.length > 0);
			} catch (err) {
				console.error("Failed to fetch movies", err);
			} finally {
				setLoading(false);
			}
		};

		fetchMovies();
	}, [page]);

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
		async function loadAllMovies() {
			try {
				const [moviesRes, postersRes] = await Promise.all([
					axios.get("https://localhost:4000/AllMovies"),
					axios.get("https://localhost:4000/poster"),
				]);

				const posterUrls: string[] = postersRes.data;

				const moviesWithPosters = moviesRes.data.map(
					(movie: Movie) => ({
						...movie,
						posterUrl: matchPoster(movie.title, posterUrls),
					})
				);

				setPosters(posterUrls);
				setMovies(moviesWithPosters);
			} catch (error) {
				console.error("Failed to fetch movies or posters", error);
			} finally {
				setLoading(false);
			}
		}

		loadAllMovies();
	}, []);

	return (
		<div className="pt-20 container mx-auto px-4 pb-10">
			<h1 className="text-3xl font-bold mb-8 mt-10">All Movies</h1>

			{loading ? (
				<div className="col-span-full flex justify-center items-center py-20">
					<div className="w-12 h-12 border-4 border-t-transparent border-gray-600 rounded-full animate-spin" />
					<span className="ml-4 text-gray-600 text-lg">
						Loading movies...
					</span>
				</div>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
					{movies.map((movie, index) => (
						<div
							key={index}
							className="relative group"
							onClick={() => setSelectedMovie(movie)}
						>
							<div className="aspect-[2/3] rounded-lg overflow-hidden">
								<img
									src={
										movie.posterUrl ||
										"img/no-image-placeholder.png"
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
			)}

			{selectedMovie && (
				<MovieDetails
					movie={{
						showId: selectedMovie.showId,
						title: selectedMovie.title,
						posterUrl:
							selectedMovie.posterUrl ||
							"img/no-image-placeholder.png",
						year: selectedMovie.releaseYear,
						rating: selectedMovie.rating,
						description: selectedMovie.description,
						genre: extractGenresFromPython(selectedMovie),
						cast: Array.isArray(selectedMovie.cast)
							? selectedMovie.cast
							: typeof selectedMovie.cast === "string"
								? selectedMovie.cast
										.split(",")
										.map((name: string) => name.trim())
								: [],
					}}
					onClose={() => setSelectedMovie(null)}
				/>
			)}
		</div>
	);
};

export default AllMoviesPage;
