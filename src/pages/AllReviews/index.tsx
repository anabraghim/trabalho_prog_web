import { useEffect, useState } from "react";
import type { Review } from "../../types/Review";

export default function AllReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    const fetchReviews = async () => {
    setLoading(true);
    try {
        const url = query
        ? `https://api-cinexp.onrender.com/reviews/search?query=${encodeURIComponent(query)}`
        : `https://api-cinexp.onrender.com/reviews`;

        const res = await fetch(url);
        const data = await res.json();
        setReviews(data);
    } catch (error) {
        console.error("Erro ao buscar críticas:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [query]); // chama toda vez que o query muda

    return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Todas as Críticas</h1>

        <input
        type="text"
        placeholder="Buscar críticas..."
        className="border p-2 mb-4 w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        />

        {loading ? (
        <p>Carregando críticas...</p>
        ) : (
        <ul className="space-y-4">
    {reviews.map((review) => (
    <li key={review.id} className="p-4 border rounded">
        <h2 className="text-xl font-semibold">{review.title}</h2>
        <p><strong>Filme:</strong> {review.movie?.title}</p>
        <p><strong>Nota:</strong> {review.rating}</p>
        <p>{review.text}</p>
        <p>{new Date(review.created_at).toLocaleDateString()}</p>
        <p>img: {review.movie?.image_url}</p>
    </li>
    ))}
</ul>
        )}
    </div>
    );
}
