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

function extractGenres(movie: any): string[] {
	const genreMap: { [key: string]: string } = {
		action: "Action",
		adventure: "Adventure",
		anime_Series_International_TV_Shows:
			"Anime / Series / International TV Shows",
		children: "Children",
		comedies: "Comedies",
		dramas_International_Movies: "Dramas / International Movies",
		comedies_Dramas_International_Movies:
			"Comedies / Dramas / International Movies",
		comedies_International_Movies: "Comedies / International Movies",
		comedies_Romantic_Movies_: "Romantic Comedies",
		crime_TV_Shows_Docuseries: "Crime / TV Shows / Docuseries",
		documentaries: "Documentaries",
		documentaries_International_Movies:
			"Documentaries / International Movies",
		docuseries: "Docuseries",
		dramas: "Dramas",
		dramas_Romantic_Movies: "Romantic Dramas",
		family_Movies: "Family Movies",
		fantasy: "Fantasy",
		horror_Movies: "Horror Movies",
		international_Movies_Thrillers: "International Movie Thrillers",
		international_TV_Shows_Romantic_TV_Dramas:
			"International TV Shows / Romantic TV Dramas",
		kidsTV: "Kids TV",
		language_TV_Shows: "Language TV Shows",
		musicals: "Musicals",
		nature_TV: "Nature TV",
		reality_TV: "Reality TV",
		spirituality: "Spirituality",
		tV_Action: "TV Action",
		tV_Comedies: "TV Comedies",
		tV_Dramas: "TV Dramas",
		talk_Shows_TV_Comedies: "Talk Shows / TV Comedies",
		thrillers: "Thrillers",
	};

	const extracted = Object.keys(genreMap)
		.filter((key) => movie[key] === true)
		.map((key) => genreMap[key]);

	return extracted.length > 0 ? extracted : ["Unknown Genre"];
}

const MoviesPage = () => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [posters, setPosters] = useState<string[]>([]);
	const [loading, setLoading] = useState(true); // Optional: loading spinner
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
	const [showMfaPrompt, setShowMfaPrompt] = useState(false);
	const [showMfaSetup, setShowMfaSetup] = useState(false);
	const [qrCodeUrl, setQrCodeUrl] = useState("");
	const [mfaCode, setMfaCode] = useState("");
	const [mfaSecret, setMfaSecret] = useState("");
	const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");

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
							posterName.toLowerCase() ===
								movie.title.toLowerCase()
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

	return (
		<>
			<div className="pt-20 container mx-auto px-4 pb-10">
				<h1 className="text-3xl font-bold mb-8 mt-10">Movies</h1>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
					{loading ? (
						<div className="col-span-full flex justify-center items-center py-20">
							<div className="w-12 h-12 border-4 border-t-transparent border-gray-600 rounded-full animate-spin" />
							<span className="ml-4 text-gray-600 text-lg">
								Loading movies...
							</span>
						</div>
					) : (
						movies.map((movie, index) => {
							const isLoggedIn =
								localStorage.getItem("isLoggedIn") === "true";

							return (
								<div
									key={index}
									className={`relative group ${isLoggedIn ? "cursor-pointer" : "cursor-default"}`}
									onClick={() => {
										if (isLoggedIn) {
											setSelectedMovie(movie);
										}
									}}
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
												{movie.releaseYear} •{" "}
												{movie.rating}
											</p>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>

			{/* HERE IS THE MODAL */}
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
						genre: extractGenres(selectedMovie),
						cast:
							typeof selectedMovie.cast === "string"
								? (selectedMovie.cast as string)
										.split(",")
										.map((name) => name.trim())
								: selectedMovie.cast || [],
					}}
					onClose={() => setSelectedMovie(null)}
				/>
			)}

			{showMfaPrompt && (
				<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
					<div className="bg-gray-800 p-6 rounded-lg max-w-sm text-white text-center space-y-4">
						<h2 className="text-xl font-bold">
							🎉 Account Created!
						</h2>
						<p>Your account has been created successfully.</p>
						<p>
							Would you like to enable Multi-Factor Authentication
							(MFA) now?
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

			{/* MFA Setup Modal */}

			{showMfaSetup && (
				<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
					<div className="bg-gray-800 p-6 rounded-lg max-w-sm text-white text-center space-y-4">
						<h2 className="text-xl font-bold">Set Up MFA</h2>
						<p>
							Scan the QR code below in your Google Authenticator
							app:
						</p>
						<img
							src={qrCodeUrl}
							alt="QR Code"
							className="mx-auto"
						/>
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
												"Content-Type":
													"application/json",
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
										alert(
											result.message ||
												"MFA setup failed."
										);
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
