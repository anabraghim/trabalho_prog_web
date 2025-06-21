import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="max-w-4xl mx-auto flex flex-wrap gap-6">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/reviews" className="hover:underline">
          Todas as Críticas
        </Link>
        <Link to="/reviews/my" className="hover:underline">
          Minhas Críticas
        </Link>
        <Link to="/login" className="hover:underline">
          Login
        </Link>
        <Link to="/register" className="hover:underline">
          Cadastro
        </Link>
      </nav>
    </header>
  );
}
