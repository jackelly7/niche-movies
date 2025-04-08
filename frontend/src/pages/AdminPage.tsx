import React, { useState } from "react";
import { PlusCircle, Pencil, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";
import Select from "react-select";

interface Movie {
	id: string;
	title: string;
	releaseYear: number;
	rating: string;
	description: string;
	duration: string;
	cast: string;
}

const AdminPage = () => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [page, setPage] = useState(1);
	const pageSize = 10;
	const [total, setTotal] = useState(0);

	const pageOptions = Array.from(
		{ length: Math.ceil(total / pageSize) },
		(_, i) => ({
			value: i + 1,
			label: `Page ${i + 1}`,
		})
	);

	useEffect(() => {
		async function fetchMovies() {
			try {
				const response = await axios.get(
					"https://localhost:4000/AdminAllMovies",
					{
						params: {
							page,
							pageSize,
						},
					}
				);
				setMovies(response.data.data);
				setTotal(response.data.total);
			} catch (error) {
				console.error("Error fetching movies:", error);
			}
		}
		fetchMovies();
	}, [page, total]);

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

    try {
      if (editingMovie) {
        // Send updated movie to backend
        await axios.put(
          `https://localhost:4000/UpdateMovie/${editingMovie.id}`,
          formData
        );
      } else {
        // Send new movie to backend
        const newMovie = {
          ...formData,
        };

        await axios.post("https://localhost:4000/AddMovie", newMovie);
      }

      // After save, re-fetch the updated movie list
      const response = await axios.get("https://localhost:4000/AllMovies");
      setMovies(response.data);

			handleCloseModal();
		} catch (err) {
			console.error("Error saving movie:", err);
		}
	};

  const handleDelete = async (movieId: string) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      try {
        await axios.delete(`https://localhost:4000/DeleteMovie/${movieId}`);

        // Update frontend list after successful deletion
        setMovies((prev) => prev.filter((m) => m.id !== movieId));
      } catch (err) {
        console.error("Error deleting movie:", err);
        alert("There was a problem deleting the movie.");
      }
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
								<th className="px-6 py-4 text-left">
									Movie Title
								</th>
								<th className="px-6 py-4 text-left">Year</th>
								<th className="px-6 py-4 text-center">
									Rating
								</th>
								<th className="px-6 py-4 text-center">
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
									<td className="px-6 py-4">{movie.title}</td>
									<td className="px-6 py-4">
										{movie.releaseYear}
									</td>
									<td className="px-6 py-4 text-center">
										{movie.rating}
									</td>
									<td className="px-6 py-4">
										<div className="flex justify-center gap-2">
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
					<div
						className="mt-6 flex flex-col items-center gap-4"
						style={{ marginBottom: "20px" }}
					>
						<div className="flex items-center gap-2">
							<label htmlFor="page-select" className="text-sm">
								Jump to page:
							</label>
							<Select
								options={pageOptions}
								value={pageOptions.find(
									(opt) => opt.value === page
								)}
								onChange={(selected) =>
									setPage(selected?.value || 1)
								}
								className="w-40 text-black"
							/>
						</div>

						<div className="flex items-center gap-4">
							<button
								onClick={() =>
									setPage((prev) => Math.max(prev - 1, 1))
								}
								disabled={page === 1}
								className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50"
							>
								Previous
							</button>
							<span className="text-sm text-gray-300">
								Page {page} of {Math.ceil(total / pageSize)}
							</span>
							<button
								onClick={() =>
									setPage((prev) =>
										prev < Math.ceil(total / pageSize)
											? prev + 1
											: prev
									)
								}
								disabled={page >= Math.ceil(total / pageSize)}
								className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50"
							>
								Next
							</button>
						</div>
					</div>
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
										value={formData.releaseYear || ""}
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
