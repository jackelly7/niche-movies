import React, { useState } from "react";
import { PlusCircle, Pencil, Trash2, X } from "lucide-react";

interface Movie {
	id: string;
	title: string;
	posterUrl: string;
	year: number;
	rating: string;
	description: string;
	duration: string;
	cast: string;
	genre: string;
}

const AdminPage = () => {
	const [movies, setMovies] = useState<Movie[]>([
		// Sample data - will be replaced with backend data
		{
			id: "1",
			title: "Sample Movie 1",
			posterUrl:
				"https://images.unsplash.com/photo-1485846234645-a62644f84728",
			year: 2024,
			rating: "PG-13",
			description: "A sample movie description",
			duration: "2h 15m",
			cast: "Actor 1, Actor 2",
			genre: "Drama, Thriller",
		},
	]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
	const [formData, setFormData] = useState<Partial<Movie>>({});

	const handleOpenModal = (movie?: Movie) => {
		if (movie) {
			setEditingMovie(movie);
			setFormData(movie);
		} else {
			setEditingMovie(null);
			setFormData({});
		}
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingMovie(null);
		setFormData({});
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically make an API call to your backend
		if (editingMovie) {
			// Update existing movie
			setMovies((prev) =>
				prev.map((m) =>
					m.id === editingMovie.id ? { ...m, ...formData } : m
				)
			);
		} else {
			// Add new movie
			const newMovie = {
				...formData,
				id: Date.now().toString(), // Temporary ID - backend will provide real one
			} as Movie;
			setMovies((prev) => [...prev, newMovie]);
		}
		handleCloseModal();
	};

	const handleDelete = async (movieId: string) => {
		if (confirm("Are you sure you want to delete this movie?")) {
			// Here you would typically make an API call to your backend
			setMovies((prev) => prev.filter((m) => m.id !== movieId));
		}
	};

	return (
		<div className="min-h-screen pt-20 pb-12" style={{ marginTop: "20px" }}>
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">Movie Management</h1>
					<button
						onClick={() => handleOpenModal()}
						className="niche-blue-bkg flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
					>
						<PlusCircle className="w-5 h-5" />
						Add Movie
					</button>
				</div>

				<div className="bg-gray-800 rounded-lg overflow-hidden">
					<table className="w-full">
						<thead>
							<tr className="bg-gray-700">
								<th className="px-6 py-3 text-left">Movie</th>
								<th className="px-6 py-3 text-left">Year</th>
								<th className="px-6 py-3 text-left">Rating</th>
								<th className="px-6 py-3 text-left">Genre</th>
								<th className="px-6 py-3 text-right">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{movies.map((movie) => (
								<tr
									key={movie.id}
									className="border-t border-gray-700"
								>
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="w-12 h-16 rounded overflow-hidden">
												<img
													src={movie.posterUrl}
													alt={movie.title}
													className="w-full h-full object-cover"
												/>
											</div>
											<span className="font-medium">
												{movie.title}
											</span>
										</div>
									</td>
									<td className="px-6 py-4">{movie.year}</td>
									<td className="px-6 py-4">
										{movie.rating}
									</td>
									<td className="px-6 py-4">{movie.genre}</td>
									<td className="px-6 py-4">
										<div className="flex justify-end gap-2">
											<button
												onClick={() =>
													handleOpenModal(movie)
												}
												className="p-2 hover:bg-gray-700 rounded-md transition-colors"
											>
												<Pencil className="w-5 h-5" />
											</button>
											<button
												onClick={() =>
													handleDelete(movie.id)
												}
												className="p-2 hover:bg-gray-700 rounded-md transition-colors text-red-500"
											>
												<Trash2 className="w-5 h-5" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Add/Edit Movie Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
					<div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center p-6 border-b border-gray-700">
							<h2 className="text-2xl font-bold">
								{editingMovie ? "Edit Movie" : "Add New Movie"}
							</h2>
							<button
								onClick={handleCloseModal}
								className="p-2 hover:bg-gray-700 rounded-full transition-colors"
							>
								<X className="w-6 h-6" />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="p-6 space-y-4">
							<div>
								<label
									htmlFor="title"
									className="block text-sm font-medium mb-1"
								>
									Title
								</label>
								<input
									type="text"
									id="title"
									name="title"
									value={formData.title || ""}
									onChange={handleInputChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="posterUrl"
									className="block text-sm font-medium mb-1"
								>
									Poster URL
								</label>
								<input
									type="url"
									id="posterUrl"
									name="posterUrl"
									value={formData.posterUrl || ""}
									onChange={handleInputChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
									required
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="year"
										className="block text-sm font-medium mb-1"
									>
										Year
									</label>
									<input
										type="number"
										id="year"
										name="year"
										value={formData.year || ""}
										onChange={handleInputChange}
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
										required
									/>
								</div>

								<div>
									<label
										htmlFor="rating"
										className="block text-sm font-medium mb-1"
									>
										Rating
									</label>
									<input
										type="text"
										id="rating"
										name="rating"
										value={formData.rating || ""}
										onChange={handleInputChange}
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
										required
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="description"
									className="block text-sm font-medium mb-1"
								>
									Description
								</label>
								<textarea
									id="description"
									name="description"
									value={formData.description || ""}
									onChange={handleInputChange}
									rows={4}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="duration"
									className="block text-sm font-medium mb-1"
								>
									Duration
								</label>
								<input
									type="text"
									id="duration"
									name="duration"
									value={formData.duration || ""}
									onChange={handleInputChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="cast"
									className="block text-sm font-medium mb-1"
								>
									Cast
								</label>
								<input
									type="text"
									id="cast"
									name="cast"
									value={formData.cast || ""}
									onChange={handleInputChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="genre"
									className="block text-sm font-medium mb-1"
								>
									Genre
								</label>
								<input
									type="text"
									id="genre"
									name="genre"
									value={formData.genre || ""}
									onChange={handleInputChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
									required
								/>
							</div>

							<div className="flex justify-end gap-4 mt-6">
								<button
									type="button"
									onClick={handleCloseModal}
									className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
								>
									{editingMovie
										? "Save Changes"
										: "Add Movie"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminPage;
