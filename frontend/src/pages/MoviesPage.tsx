import { useState } from "react";
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

	// Placeholder data - will be replaced with backend data
	const movies: Movie[] = [
		{
			id: "1",
			title: "Sample Movie 1",
			posterUrl:
				"https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80",
			year: 2024,
			rating: "PG-13",
		},
		// Add more sample movies here
	];

	return (
		<div className="min-h-screen pt-20 pb-12">
			<div className="container mx-auto px-4">
				<h1 className="text-3xl font-bold mb-8">Movies</h1>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
					{movies.map((movie) => (
						<div
							key={movie.id}
							className="relative group cursor-pointer"
							onClick={() => setSelectedMovie(movie)}
						>
							<div className="aspect-[2/3] rounded-lg overflow-hidden">
								<img
									src={movie.posterUrl}
									alt={movie.title}
									className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
								/>
							</div>
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
								<div>
									<h3 className="text-lg font-semibold">
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

			{selectedMovie && (
				<MovieDetails
					movie={selectedMovie}
					onClose={() => setSelectedMovie(null)}
				/>
			)}
		</div>
	);
};

export default MoviesPage;
