import React from "react";
import { X, Play, Plus, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

interface Movie {
  id: string;
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

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/1 flex items-center justify-center z-50 p-4">
      <div className="page-bkg rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            className="page-bkg rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto relative p-6 flex flex-col md:flex-row gap-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close button */}
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
              <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span>{movie.year}</span>
                <span>{movie.rating}</span>
                <span>2h 15m</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mb-6">
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

              {/* Description */}
              <p className="text-gray-300 mb-6">{movie.description}</p>

              {/* Genre + Cast */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Genre</h3>
                  <p className="text-gray-400">
                    {movie.genre?.join(", ") || "Unknown Genre"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Cast</h3>
                  <p className="text-gray-400">
                    {movie.cast?.join(", ") || "Unknown Cast"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
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

          {/* DESCRIPTION */}
          <p className="text-gray-300 mb-6">{movie.description}</p>

          {/* GENRE + CAST */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Genre</h3>
              <p className="text-gray-400">
                {movie.genre?.join(", ") || "Unknown Genre"}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Cast</h3>
              <p className="text-gray-400">
                {movie.cast?.join(", ") || "Unknown Cast"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
