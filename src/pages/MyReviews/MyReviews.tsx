import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useNavigate } from "react-router-dom";

interface Review {
  id: number;
  title: string;
  text: string;
  rating: string;
  movie: {
    title: string;
  };
}

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const res = await fetch(`https://api-cinexp.onrender.com/reviews/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Erro ao buscar críticas.");
        }

        const data = await res.json();
        setReviews(data);
      } catch (err: any) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && userId) {
      fetchMyReviews();
    } else {
      navigate("/login");
    }
  }, [token, userId, navigate]);

  const toggleMenu = (id: number) => {
  setOpenMenuId((prev) => (prev === id ? null : id));
};

const handleDelete = async (id: number) => {
  if (!confirm("Tem certeza que deseja excluir esta crítica?")) return;

  try {
    const res = await fetch(`https://api-cinexp.onrender.com/reviews/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Erro ao excluir crítica.");
    }

    // Remove a crítica da lista
    setReviews(reviews.filter((review) => review.id !== id));
  } catch (err: any) {
    setMessage(err.message);
  }
};


  if (loading) return <p className="text-center mt-8">Carregando...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
        <button
        onClick={() => navigate("/reviews/new")}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Adicionar Nova Crítica
      </button>
      <h1 className="text-2xl font-bold mb-4">Minhas Críticas</h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      {reviews.length === 0 ? (
        <p>Você ainda não fez nenhuma crítica.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
  <li key={review.id} className="border p-4 rounded shadow relative">
    {/* Botão de menu (três pontinhos) */}
    <div className="absolute top-2 right-2">
      <button onClick={() => toggleMenu(review.id)}>
        <svg
          className="w-6 h-6 text-gray-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>

      {openMenuId === review.id && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
          <button
            onClick={() => handleDelete(review.id)}
            className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
          >
            Apagar
          </button>
          <button
            onClick={() => navigate(`/reviews/${review.id}`)}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Editar
          </button>
        </div>
      )}
    </div>

    {/* Conteúdo da crítica */}
    <h2 className="text-xl font-semibold">{review.title}</h2>
    <p className="text-sm text-gray-600">Filme: {review.movie.title}</p>
    <p className="mt-2">{review.text}</p>
    <p className="mt-2 font-medium">Nota: {review.rating}</p>
  </li>
))}
        </ul>
      )}
    </div>
  );
}
