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
  

  const token = useSelector((state: RootState) => state.auth.token);

  const handleSearch = async () => {
    if (!query) return;
    setMessage("");
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`
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
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&append_to_response=credits&language=pt-BR`
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

      setMessage(`${selectedMovie.title} foi salvo com sucesso!`);
      setSelectedMovie(null);
      setMovieDetails(null);
    } catch (err: any) {
      setMessage(err.message || "Erro desconhecido.");
    }
  };

  return (
    <div className="container spacing place-self-center flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Filme</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Pesquisar filme..."
        className="w-full p-4 border-[1px] border-neutral-600 rounded-[10px] outline-0"
      />
      <button
        onClick={handleSearch}
        className="mt-10 bg-purple-600 text-white px-10 py-2 rounded mb-6 self-center font-bold"
      >
        Buscar
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleSelectMovie(movie)}
            className="bg-neutral-900 flex flex-col  text-white rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="h-72 w-full overflow-hidden rounded-2xl p-4">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover object-top rounded-2xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400 bg-neutral-700">
                  Sem imagem
                </div>
              )}
            </div>
            <div className="pb-4 px-4 flex flex-col items-center justify-center">
              <p className=" font-semibold text-lg text-center">{movie.title}</p>
            </div>
          </div>
        ))}
      </div>
  <div className="h-[1px] w-full bg-neutral-900 my-6"></div>

      {movieDetails && (
  <div className="mt-5 flex flex-col max-w-4xl place-self-center bg-neutral-900 items-center text-white p-6 rounded-xl shadow-lg space-y-6">
    
    <h2 className="text-2xl font-bold text-center">{movieDetails.title}</h2>
    <div className="flex flex-col max-w-2xs items-center rounded-2xl">
       <img
          src={movieDetails.image_url}
          alt={movieDetails.title}
          className="w-full aspect-square object-top object-cover rounded-2xl"
        />
        <div className="flex flex-col space-y-2 w-full items-center ">
          <div className="flex flex-col items-center gap-2 mt-4">
            <p className="text-sm text-gray-400">
          <span className="text-white font-medium">Ano:</span> {movieDetails.release_year}
        </p>
        <p className="text-sm text-gray-400">
          <span className="text-white font-medium">Diretor:</span> {movieDetails.director}
        </p>
        <p className="text-sm text-gray-400 flex flex-col items-center ">
          <span className="text-center text-gray-400"><span className="font-medium text-white">Gêneros: </span >{movieDetails.genres.join(", ")}</span>
        </p>
          </div>

        <button
          onClick={handleSave}
          className="self-center mt-4 bg-neutral-600 hover:bg-neutral-700 text-white px-6 py-3 rounded-lg font-semibold w-fit"
        >
          Salvar no sistema
        </button>
        </div>
    </div>
  </div>
)}

      {message && <p className="mt-4 text-center text-purple-600">{message}</p>}
    </div>
  );
}

export default AddMovie;
