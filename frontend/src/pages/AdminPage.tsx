import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, X } from "lucide-react";
import axios from "axios";
import Select from "react-select";

interface Movie {
  showId: string;
  title: string;
  type: string;
  releaseYear: number;
  rating: string;
  description: string;
  duration: string;
  cast: string;
  action: boolean;
  adventure: boolean;
  anime_Series_International_TV_Shows: boolean;
  british_TV_Shows_Docuseries_International_TV_Shows: boolean;
  children: boolean;
  comedies: boolean;
  comedies_Dramas_International_Movies: boolean;
  comedies_International_Movies: boolean;
  comedies_Romantic_Movies_: boolean;
  crime_TV_Shows_Docuseries: boolean;
  documentaries: boolean;
  documentaries_International_Movies: boolean;
  docuseries: boolean;
  dramas: boolean;
  dramas_International_Movies: boolean;
  dramas_Romantic_Movies: boolean;
  family_Movies: boolean;
  fantasy: boolean;
  horror_Movies: boolean;
  international_Movies_Thrillers: boolean;
  international_TV_Shows_Romantic_TV_Dramas: boolean;
  kidsTV: boolean;
  language_TV_Shows: boolean;
  musicals: boolean;
  nature_TV: boolean;
  reality_TV: boolean;
  spirituality: boolean;
  tv_Action: boolean;
  tv_Comedies: boolean;
  tv_Dramas: boolean;
  talk_Shows_TV_Comedies: boolean;
  thrillers: boolean;
}

const AdminPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const pageOptions = Array.from(
    { length: Math.ceil(total / pageSize) },
    (_, i) => ({ value: i + 1, label: `Page ${i + 1}` })
  );

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await axios.get(
          "https://localhost:4000/AdminAllMovies",
          { params: { page, pageSize } }
        );
        setMovies(response.data.data);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies();
  }, [page, pageSize]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState<Partial<Movie>>({});

  const handleOpenModal = (movie?: Movie) => {
    if (movie) {
      setEditingMovie(movie);
      setFormData(movie);
    } else {
      setEditingMovie(null);
      setFormData({
        title: "",
        type: "",
        releaseYear: new Date().getFullYear(),
        rating: "",
        description: "",
        duration: "",
        cast: "",
        action: false,
        adventure: false,
        anime_Series_International_TV_Shows: false,
        british_TV_Shows_Docuseries_International_TV_Shows: false,
        children: false,
        comedies: false,
        comedies_Dramas_International_Movies: false,
        comedies_International_Movies: false,
        comedies_Romantic_Movies_: false,
        crime_TV_Shows_Docuseries: false,
        documentaries: false,
        documentaries_International_Movies: false,
        docuseries: false,
        dramas: false,
        dramas_International_Movies: false,
        dramas_Romantic_Movies: false,
        family_Movies: false,
        fantasy: false,
        horror_Movies: false,
        international_Movies_Thrillers: false,
        international_TV_Shows_Romantic_TV_Dramas: false,
        kidsTV: false,
        language_TV_Shows: false,
        musicals: false,
        nature_TV: false,
        reality_TV: false,
        spirituality: false,
        tv_Action: false,
        tv_Comedies: false,
        tv_Dramas: false,
        talk_Shows_TV_Comedies: false,
        thrillers: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMovie(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "releaseYear" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMovie) {
        await axios.put(`https://localhost:4000/UpdateMovie/${editingMovie.showId}`, formData);
      } else {
        const { showId, ...newMovie } = formData;
        await axios.post("https://localhost:4000/AddMovie", newMovie);
      }

      const response = await axios.get("https://localhost:4000/AdminAllMovies", {
        params: { page, pageSize },
      });
      setMovies(response.data.data);
      setTotal(response.data.total);
      handleCloseModal();
    } catch (err) {
      console.error("Error saving movie:", err);
    }
  };

  const handleDelete = async (movieId: string) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      try {
        await axios.delete(`https://localhost:4000/DeleteMovie/${movieId}`);
        setMovies((prev) => prev.filter((m) => m.showId !== movieId));
      } catch (err) {
        console.error("Error deleting movie:", err);
        alert("There was a problem deleting the movie.");
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Movie Management</h1>
          <button
            onClick={() => handleOpenModal()}
            className="niche-blue-bkg flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
          >
            <PlusCircle className="w-5 h-5" /> Add Movie
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-x-auto">
          <table className="min-w-[600px] w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-4 text-left">Movie Title</th>
                <th className="px-6 py-4 text-left">Year</th>
                <th className="px-6 py-4 text-center">Rating</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.showId} className="border-t border-gray-700">
                  <td className="px-6 py-4">{movie.title}</td>
                  <td className="px-6 py-4">{movie.releaseYear}</td>
                  <td className="px-6 py-4 text-center">{movie.rating}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleOpenModal(movie)} className="p-2 hover:bg-gray-700 rounded-md transition-colors">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(movie.showId)}
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

        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="page-select" className="text-sm">Jump to page:</label>
            <Select
              options={pageOptions}
              value={pageOptions.find((opt) => opt.value === page)}
              onChange={(selected) => setPage(selected?.value || 1)}
              className="w-40 text-black"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-300">
              Page {page} of {Math.ceil(total / pageSize)}
            </span>
            <button
              onClick={() => setPage((prev) =>
                prev < Math.ceil(total / pageSize) ? prev + 1 : prev
              )}
              disabled={page >= Math.ceil(total / pageSize)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="page-size-select" className="text-sm text-gray-300">Movies per page:</label>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="bg-gray-700 text-white rounded-md px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
