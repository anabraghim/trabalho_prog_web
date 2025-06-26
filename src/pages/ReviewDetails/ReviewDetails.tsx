import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const ratingToWord: Record<string, string> = {
  "1": "one",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five",
};

const wordToRating: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
};

export default function ReviewDetails() {
  const { id } = useParams();
  const [review, setReview] = useState<any>(null);
  const [message, setMessage] = useState("");
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [editableTitle, setEditableTitle] = useState("");
  const [editableText, setEditableText] = useState("");
  const [editableRating, setEditableRating] = useState("");
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(`https://api-cinexp.onrender.com/reviews/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Erro ao buscar crítica.");
        }

        const data = await res.json();
        setReview(data);
        setEditableTitle(data.title);
        setEditableText(data.text);
        setEditableRating(wordToRating[data.rating]);
      } catch (err: any) {
        setMessage(err.message);
      }
    };

    if (token) fetchReview();
  }, [id, token]);

  const isOwner = review?.user_id === currentUser?.id;

  if (!token) {
    setMessage("Você não está autenticado.");
    return null;
  }

  const handleSave = async () => {
    const convertedRating = ratingToWord[editableRating];
    if (!convertedRating) {
      setMessage("Nota inválida. Use um valor de 1 a 5.");
      return;
    }

    try {
      const res = await fetch(`https://api-cinexp.onrender.com/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editableTitle,
          text: editableText,
          rating: convertedRating,
          movie_id: review.movie.id,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erro ao salvar modificações.");
      }

      const updated = await res.json();
      setReview({ ...updated, movie: review.movie, user: review.user });

      setEditableTitle(updated.title);
      setEditableText(updated.text);
      setEditableRating(wordToRating[updated.rating]);
      setIsEdited(false);
      setMessage("Crítica atualizada com sucesso!");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  if (!review) return <p className="container spacing text-center mt-8">Carregando...</p>;

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-transparent"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.285-3.955a1 1 0 00-.364-1.118L2.098 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.951-.69l1.286-3.955z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="container spacing place-self-center">
      <div className="mt-10 bg-neutral-900 text-white p-6 rounded-xl shadow-lg space-y-6">
        {message && <p className="text-green-400 text-center">{message}</p>}
        
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="w-40 aspect-square overflow-hidden rounded-xl bg-neutral-800 shrink-0 flex">
            <img
              src={review.movie?.image_url}
              alt={review.movie?.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col w-full space-y-4">
            {/* <p className="font-semibold">Título:</p> */}
            {isOwner ? (
              <input
                value={editableTitle}
                placeholder="Digite o título da crítica"
                onChange={(e) => {
                  setEditableTitle(e.target.value);
                  setIsEdited(true);
                }}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white outline-none"
              />
            ) : (
              <h1 className="text-3xl font-bold">{review.title}</h1>
            )}
            <div className="flex items-center gap-2">
              <span className="font-medium">Nota:</span>
              {isOwner ? (
                <input
                  type="number"
                  value={editableRating}
                  min="1"
                  max="5"
                  onChange={(e) => {
                    setEditableRating(e.target.value);
                    setIsEdited(true);
                  }}
                  className="w-16 bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-center outline-none text-white"
                />
              ) : (
                renderStars(Number(wordToRating[review.rating]))
              )}
            </div>
            
              <p className="text-sm text-neutral-400">por @{review.user?.username}</p>
            

            {/* <p className="font-semibold">Texto:</p> */}
            {isOwner ? (
              <textarea
                value={editableText}
                placeholder="Digite sua crítica"
                onChange={(e) => {
                  setEditableText(e.target.value);
                  setIsEdited(true);
                }}
                className="h-80 w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white outline-none"
              />
            ) : (
              <p className="text-gray-200">{review.text}</p>
            )}


            {isOwner && isEdited && (
              <button
                onClick={handleSave}
                className="self-center bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Salvar modificações
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}