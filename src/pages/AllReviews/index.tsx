import { useEffect, useState } from "react";
import type { Review } from "../../types/Review";
import { Link } from "react-router-dom";


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

  const ratingToNumber: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
};

  useEffect(() => {
    fetchReviews();
  }, [query]); 

    return (
    <div className="container place-self-center spacing">
        <h1 className="text-3xl font-bold mb-4">Todas as Críticas</h1>
        <input
        type="text"
        placeholder="Pesquisar crítica"
        className="bg-neutral-800 py-3 px-6 mb-4 w-full rounded-full outline-0"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        />

        {loading ? (
        <p>Carregando críticas...</p>
        ) : (
        <ul className="flex flex-col">
    {reviews.map((review) => (
    <li key={review.id} className="">
  <div className="h-[1px] w-full bg-neutral-900 my-6"></div>
  <Link
    to={`/reviews/${review.id}`}
    className="gap-5 flex cursor-pointer hover:bg-neutral-900 p-3 rounded-xl transition-colors"
  >
    <div className="self-center w-40 h-40 aspect-square overflow-hidden rounded-2xl bg-neutral-800 shrink-0">
      <img
        src={review.movie?.image_url}
        className="h-full w-full object-cover"
        alt=""
      />
    </div>
    <div>
      <h2 className="text-xl font-semibold">{review.title}</h2>
      <p className="text-sm text-neutral-500">{review.movie.title}</p>
      <p className="text-sm text-neutral-400">por @{review.user?.username}</p>


      <div className="mt-2 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < ratingToNumber[review.rating.toLowerCase()]
                ? "text-yellow-400"
                : "text-transparent"
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
</li>

    ))}
</ul>
        )}
    </div>
    );
}