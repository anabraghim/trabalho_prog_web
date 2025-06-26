import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useNavigate, Link } from "react-router-dom";

interface Review {
  id: number;
  title: string;
  text: string;
  rating: string;
  movie: {
    title: string;
    image_url?: string;
  };
}

const ratingToNumber: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
};

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

      setReviews(reviews.filter((review) => review.id !== id));
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  if (loading) return <p className="text-center mt-8">Carregando...</p>;

  return (
    <div className="container spacing place-self-center">
      <button
        onClick={() => navigate("/reviews/new")}
        className="fixed right-10 bottom-10 mb-6 z-10 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-900 font-semibold"
      >
        + Adicionar Nova Crítica
      </button>
      <h1 className="text-3xl font-bold mb-4">Minhas Críticas</h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      {reviews.length === 0 ? (
        <p>Você ainda não fez nenhuma crítica.</p>
      ) : (
        <ul className="flex flex-col">
          {reviews.map((review) => (
            <li key={review.id} className="">
              <div className="h-[1px] w-full bg-neutral-900 my-6"></div>

              <div className="gap-5 flex relative">
                <Link
                  to={`/reviews/${review.id}`}
                  className="flex gap-5 w-full hover:bg-neutral-800 p-3 rounded-xl transition-colors"
                >
                  <div className="w-40 h-40 self-center aspect-square overflow-hidden rounded-2xl bg-neutral-800 shrink-0">
                    <img
                      src={review.movie?.image_url}
                      className="h-full w-full object-cover"
                      alt=""
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{review.title}</h2>
                    <p className="text-sm text-gray-600">Filme: {review.movie.title}</p>

                    <div className="mt-2 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < ratingToNumber[review.rating.toLowerCase()] ? "text-yellow-400" : "text-transparent"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.285-3.955a1 1 0 00-.364-1.118L2.098 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.951-.69l1.286-3.955z" />
                        </svg>
                      ))}
                    </div>

                  <p className="mt-2 line-clamp-3 text-ellipsis overflow-hidden">{review.text}</p>
                  </div>
                </Link>

                <button onClick={() => toggleMenu(review.id)} className="absolute top-2 right-2">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>

                {openMenuId === review.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-black border border-neutral-600 rounded shadow z-10">
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-700"
                    >
                      Apagar
                    </button>
                    <button
                      onClick={() => navigate(`/reviews/${review.id}`)}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-700"
                    >
                      Editar
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}