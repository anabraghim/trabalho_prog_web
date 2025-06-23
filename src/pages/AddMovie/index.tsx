import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const TMDB_API_KEY = "6e33721c4b55276254c11812cc8ccdf8";

function AddMovie() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [message, setMessage] = useState("");
  console.log(selectedMovie)

  const token = useSelector((state: RootState) => state.auth.token);

  const handleSearch = async () => {
    if (!query) return;
    setMessage("");
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setMessage("Erro ao buscar filmes.");
    }
  };

  const handleSelectMovie = async (movie: any) => {
    setSelectedMovie(movie);
    setResults([]);
    setQuery("");
    setMessage("Carregando detalhes...");

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&append_to_response=credits`
      );
      const data = await res.json();

      const directorObj = data.credits.crew.find((m: any) => m.job === "Director");
      const genres = data.genres.map((g: any) => g.name);
      const releaseYear = new Date(data.release_date).getFullYear();
      const details = {
        title: data.title,
        release_year: releaseYear || 0,
        image_url: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "",
        tmdb_id: data.id,
        director: directorObj?.name || "Diretor desconhecido",
        genres: genres,
      };

    //   console.log("Dados enviados para a API:", details);

      setMovieDetails(details);
      setMessage("");
    } catch {
      setMessage("Erro ao buscar detalhes do filme.");
    }
  };

  const handleSave = async () => {
    if (!movieDetails) return;
    if (!token) {
      setMessage("Você precisa estar logado para cadastrar um filme.");
      return;
    }

    try {
      const res = await fetch("https://api-cinexp.onrender.com/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movieDetails),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erro ao salvar filme.");
      }

      setMessage("Filme salvo com sucesso!");
      setSelectedMovie(null);
      setMovieDetails(null);
    } catch (err: any) {
      setMessage(err.message || "Erro desconhecido.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Filme</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Pesquisar filme..."
        className="w-full p-2 border rounded mb-2"
      />
      <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
        Buscar
      </button>

      <ul>
        {results.map((movie) => (
          <li
            key={movie.id}
            className="p-2 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => handleSelectMovie(movie)}
          >
            {movie.title} ({movie.release_date?.slice(0, 4)})
          </li>
        ))}
      </ul>

      {movieDetails && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold">{movieDetails.title}</h2>
          <img
            src={movieDetails.image_url}
            alt={movieDetails.title}
            className="mt-2 mb-4 w-40"
          />
          <p><strong>Ano:</strong> {movieDetails.release_year}</p>
          <p><strong>Diretor:</strong> {movieDetails.director}</p>
          <p><strong>Gêneros:</strong> {movieDetails.genres.join(", ")}</p>
          <button
            onClick={handleSave}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Salvar no sistema
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}

export default AddMovie;
