import React, { useState } from "react";
import { X, Play, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import axios from "axios";

interface Movie {
	releaseYear: number;
	showId: string;
	title: string;
	posterUrl: string;
	year: number;
	rating: string;
	description: string;
	genre: string[];
	cast: string[];
}

interface MovieDetailsProps {
	movie: Movie;
	onClose: () => void;
}

interface MovieDetailsProps {
	movie: Movie;
	onClose: () => void;
	onSimilarMovieClick: (movie: Movie) => void; 
}

const MovieDetails: React.FC<MovieDetailsProps> = ({
	movie,
	onClose,
	onSimilarMovieClick,
}) => {
	const [userRating, setUserRating] = useState<number | null>(null);
	const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
	const userId = localStorage.getItem("userId");

	const handleRate = async (rating: number) => {
		const parsedUserId = parseInt(userId!);
		const showId = movie.showId;

		console.log("⭐ handleRate called");
		console.log("userId from localStorage:", userId);
		console.log("parsedUserId:", parsedUserId);
		console.log("movie object:", movie);
		console.log("movie.showId:", showId);
		console.log("rating selected:", rating);

		setUserRating(rating);

		const payload = {
			UserId: parsedUserId,
			ShowId: showId,
			Rating: rating,
		};

		console.log("📦 Payload being sent:", payload);

		try {
			const response = await fetch("https://localhost:4000/rate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const result = await response.json();
			console.log("✅ Server response:", result);

			if (!response.ok) {
				console.error(
					"❌ Server returned an error status:",
					response.status
				);
			}
		} catch (err) {
			console.error("💥 Fetch error in handleRate:", err);
		}
	};

	// Inside your component
	useEffect(() => {
		const fetchRating = async () => {
			if (!userId) return;

			try {
				const response = await fetch(
					`https://localhost:4000/GetRating?userId=${userId}&showId=${movie.showId}`
				);
				if (response.ok) {
					const data = await response.json();
					setUserRating(data.rating);
				}
			} catch (err) {
				console.error("Failed to fetch existing rating:", err);
			}
		};

		fetchRating();
	}, [movie.showId]);

	useEffect(() => {
		async function fetchSimilarMovies() {
			try {
				const response = await axios.get(
					`https://niche-movies-machine-learning-api-ashtcnfzdjh7b9bm.eastus-01.azurewebsites.net/recommend/movie-to-movie?movie_title=${encodeURIComponent(movie.title)}&top_n=5`
				);
				setSimilarMovies(response.data);
			} catch (error) {
				console.error("Failed to fetch similar movies", error);
			}
		}

		if (movie?.title) {
			fetchSimilarMovies();
		}
	}, [movie]);

	const [posters, setPosters] = useState<string[]>([]);

	useEffect(() => {
		async function loadPosters() {
			try {
				const postersResponse = await axios.get(
					"https://localhost:4000/poster"
				);
				setPosters(postersResponse.data);
			} catch (error) {
				console.error("Failed to load posters", error);
			}
		}

		loadPosters();
	}, []);

	function normalizeTitle(title: string | undefined) {
		if (!title) return "";
		return title.toLowerCase().replace(/[^a-z0-9]/gi, "");
	}

	function getFileNameFromUrl(url: string) {
		return url.split("/").pop()?.split(".")[0] ?? "";
	}

	function matchPoster(movieTitle: string, posterUrls: string[]): string {
		const normalizedMovieTitle = normalizeTitle(movieTitle);

		const matchingPoster = posterUrls.find((url) => {
			const posterName = getFileNameFromUrl(url);
			return normalizeTitle(posterName) === normalizedMovieTitle;
		});

		return matchingPoster || "img/no-image-placeholder.png";
	}

	return (
		<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
			<div className="page-bkg rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto modal-scroll">
				<motion.div
					className="flex flex-col md:flex-row gap-6"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3 }}
				>
					{/* Close Button */}
					<button
						onClick={onClose}
						className="absolute top-4 right-4 p-2 bg-gray-900/80 rounded-full hover:bg-gray-800 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>

					{/* Poster */}
					<div className="flex-shrink-0">
						<img
							src={movie.posterUrl}
							alt={movie.title}
							className="w-auto max-h-[60vh] object-contain rounded-lg mx-auto"
						/>
					</div>

					{/* Movie Info */}
					<div className="flex flex-col justify-center text-white">
						<h2 className="text-3xl font-bold mb-2">
							{movie.title}
						</h2>
						<div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
							<span>{movie.year}</span>
							<span>{movie.rating}</span>
							<span>2h 15m</span>
						</div>

						<div className="flex gap-4 mb-6">
							<button className="niche-blue-bkg flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors">
								<Play className="w-5 h-5" />
								Play
							</button>
							<button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-md font-semibold transition-colors">
								<Plus className="w-5 h-5" />
								My List
							</button>
						</div>

						{/* Rating Stars */}
						<div className="flex items-center gap-2 mt-4">
							<span className="text-white">Your Rating:</span>
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									onClick={() => handleRate(star)}
									className={
										star <= (userRating || 0)
											? "text-yellow-400"
											: "text-gray-500"
									}
								>
									★
								</button>
							))}
						</div>

						{/* Description */}
						<p className="text-gray-300 mb-6 mt-4">
							{movie.description}
						</p>

						{/* Genre and Cast */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="text-lg font-semibold mb-1">
									Genre
								</h3>
								<p className="text-gray-400">
									{movie.genre?.join(", ") || "Unknown Genre"}
								</p>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-1">
									Cast
								</h3>
								<p className="text-gray-400">
									{movie.cast?.join(", ") || "Unknown Cast"}
								</p>
							</div>
						</div>
					</div>
				</motion.div>

				{/* More Like This (AFTER motion.div, inside the same white background box) */}
				{similarMovies.length > 0 && (
					<div className="mt-10">
						<h3 className="text-2xl font-semibold mb-4 text-white">
							More Like This
						</h3>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
							{similarMovies.map((simMovie, index) => (
								<div
									key={index}
									className="relative group cursor-pointer"
									onClick={() =>
										onSimilarMovieClick(simMovie)
									}
								>
									<div className="aspect-[2/3] rounded-lg overflow-hidden">
										<img
											src={
												matchPoster(
													simMovie.title,
													posters
												) ||
												"img/no-image-placeholder.png"
											}
											alt={simMovie.title}
											className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
										/>
										{/* Hover overlay */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
											<div>
												<h3 className="text-lg font-semibold text-white">
													{simMovie.title}
												</h3>
												<p className="text-sm text-gray-300">
													{simMovie.releaseYear} •{" "}
													{simMovie.rating}
												</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>{" "}
			{/* End of white background */}
		</div>
	);
};

export default MovieDetails;
