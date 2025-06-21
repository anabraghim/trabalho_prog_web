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
  "one": "1",
  "two": "2",
  "three": "3",
  "four": "4",
  "five": "5",
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

  const isOwner = review?.user?.id === currentUser?.id;

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

  if (!review) return <p>Carregando...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-4">
      {message && <p className="text-green-600">{message}</p>}

      <h1 className="text-2xl font-bold">
        {isOwner ? (
          <input
            value={editableTitle}
            onChange={(e) => {
              setEditableTitle(e.target.value);
              setIsEdited(true);
            }}
            className="w-full border rounded p-2"
          />
        ) : (
          review.title
        )}
      </h1>

      <p className="text-gray-600">Filme: {review.movie.title}</p>

      {isOwner ? (
        <textarea
          value={editableText}
          onChange={(e) => {
            setEditableText(e.target.value);
            setIsEdited(true);
          }}
          className="w-full border rounded p-2"
          rows={5}
        />
      ) : (
        <p>{review.text}</p>
      )}

      <p className="font-medium">
        Nota:{" "}
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
            className="border p-1 rounded w-16"
          />
        ) : (
          wordToRating[review.rating]
        )}
      </p>

      {isOwner && isEdited && (
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Salvar modificações
        </button>
      )}
    </div>
  );
}
