import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store";

let debounceTimeout: NodeJS.Timeout;

export default function AddReview() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState("");
  const [search, setSearch] = useState("");
  const [movieId, setMovieId] = useState("");
  const [movieSuggestions, setMovieSuggestions] = useState<{ id: number; title: string }[]>([]);
  const [message, setMessage] = useState("");

  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

  const ratingMap: { [key: string]: string } = {
    "1": "one",
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const convertedRating = ratingMap[rating];
    if (!convertedRating) {
      setMessage("Nota inválida. Digite um número de 1 a 5.");
      return;
    }

    if (!movieId) {
      setMessage("Por favor, selecione um filme da lista.");
      return;
    }

    try {
      const res = await fetch("https://api-cinexp.onrender.com/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          text,
          rating: convertedRating,
          movie_id: parseInt(movieId),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erro ao criar crítica:");
      }

      setMessage("Crítica criada com sucesso!");
      navigate("/reviews");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handleMovieSearch = (value: string) => {
    setSearch(value);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    if (value.length < 2) {
      setMovieSuggestions([]);
      return;
    }

    debounceTimeout = setTimeout(async () => {
      try {
        const res = await fetch(`https://api-cinexp.onrender.com/movies/search?title=${encodeURIComponent(value)}`);
        const data = await res.json();
        setMovieSuggestions(data);
      } catch (err) {
        console.error("Erro ao buscar filmes:", err);
      }
    }, 300); 
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Nova Crítica</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título da Crítica"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Texto da Crítica"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Nota (1 a 5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-2 border rounded"
          min="1"
          max="5"
          required
        />
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar Filme"
            value={search}
            onChange={(e) => handleMovieSearch(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          {movieSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full border bg-white rounded mt-1 max-h-48 overflow-y-auto">
              {movieSuggestions.map((movie) => (
                <li
                  key={movie.id}
                  onClick={() => {
                    setSearch(movie.title);
                    setMovieId(movie.id.toString());
                    setMovieSuggestions([]);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {movie.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Enviar Crítica
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
}
