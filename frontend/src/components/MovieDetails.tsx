import React from "react";
import { X, Play, Plus, ThumbsUp } from "lucide-react";

interface Movie {
	id: string;
	title: string;
	posterUrl: string;
	year: number;
	rating: string;
}

interface MovieDetailsProps {
	movie: Movie;
	onClose: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose }) => {
	return (
		<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
			<div className="page-bkg rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="relative">
					<img
						src={movie.posterUrl}
						alt={movie.title}
						className="w-full h-[40vh] object-cover rounded-t-lg"
					/>
					<button
						onClick={onClose}
						className="absolute top-4 right-4 p-2 bg-gray-900/80 rounded-full hover:bg-gray-800 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				<div className="p-6">
					<h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
					<div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
						<span>{movie.year}</span>
						<span>{movie.rating}</span>
						<span>2h 15m</span>
					</div>

					<div className="flex gap-4 mb-8">
						<button className="niche-blue-bkg flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors">
							<Play className="w-5 h-5" />
							Play
						</button>
						<button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-md font-semibold transition-colors">
							<Plus className="w-5 h-5" />
							My List
						</button>
						<button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-md font-semibold transition-colors">
							<ThumbsUp className="w-5 h-5" />
							Rate
						</button>
					</div>

					<p className="text-gray-300 mb-6">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Sed do eiusmod tempor incididunt ut labore et dolore
						magna aliqua. Ut enim ad minim veniam, quis nostrud
						exercitation ullamco laboris nisi ut aliquip ex ea
						commodo consequat.
					</p>

					<div className="grid grid-cols-2 gap-8">
						<div>
							<h3 className="text-lg font-semibold mb-2">Cast</h3>
							<p className="text-gray-400">
								Actor Name, Actor Name, Actor Name, Actor Name
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2">
								Genre
							</h3>
							<p className="text-gray-400">
								Drama, Thriller, Mystery
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MovieDetails;
