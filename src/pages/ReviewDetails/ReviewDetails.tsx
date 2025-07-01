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
  const [newComment, setNewComment] = useState("");

  const token = useSelector((state: RootState) => state.auth.token);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [editableTitle, setEditableTitle] = useState("");
  const [editableText, setEditableText] = useState("");
  const [editableRating, setEditableRating] = useState("");
  const [isEdited, setIsEdited] = useState(false);

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
useEffect(() => {
  if (token) fetchReview();
}, [id, token]);

  const isOwner = review?.user_id === currentUser?.id;

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

  const handleCommentSubmit = async () => {
  if (!newComment) {
    setMessage("O comentário não pode estar vazio.");
    return;
  }

  try {
    const res = await fetch("https://api-cinexp.onrender.com/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: newComment,
        reviewId: Number(id),
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Erro ao enviar comentário.");
    }

    await res.json(); // não precisa armazenar o retorno
    await fetchReview(); // 🔁 busca a review atualizada
    setNewComment("");   // 🧹 limpa o campo
    setMessage("Comentário adicionado com sucesso!");
  } catch (err: any) {
    setMessage(err.message);
  }
};


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

  if (!token) {
    return <p className="text-center mt-8 text-red-500">Você não está autenticado.</p>;
  }

  if (!review) {
    return <p className="container spacing text-center mt-8">Carregando...</p>;
  }

  return (
    <div className="container spacing place-self-center">
      <div className="mt-10 bg-neutral-900 text-white p-6 rounded-xl shadow-lg space-y-6">
        {message && <p className="text-purple-400 text-center">{message}</p>}

        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="w-full sm:w-40 aspect-square overflow-hidden rounded-xl bg-neutral-800 shrink-0 flex">
            <img
              src={review.movie?.image_url}
              alt={review.movie?.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col w-full space-y-4">
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

      <div className="mt-8 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Comentários</h2>

        <div className="mb-6 flex flex-col gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva um comentário..."
            className="w-full bg-neutral-900 rounded-lg p-3 text-white outline-none"
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-semibold self-center "
          >
            Comentar
          </button>
        </div>

        {review.comments?.length === 0 ? (
          <p className="text-gray-400">Ainda não há comentários.</p>
        ) : (
          <div className="space-y-4">
            {review.comments?.map((comment: any) => (
              <div
                key={comment.id}
                className="bg-black p-4 rounded-lg border border-neutral-700"
              >
                <p className="text-sm text-neutral-300">{comment.text}</p>
                <p className="text-xs text-neutral-500 mt-2">— @{comment.user?.username}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}