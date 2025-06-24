import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-black  text-white p-6 w-full border-b-[1px] border-neutral-700">
      <nav className="max-w-4xl mx-auto flex flex-wrap gap-6 font-bold">
        <Link to="/" className="hover:text-purple-600">
          Home
        </Link>
        <Link to="/reviews" className="hover:text-purple-600">
          Todas as Críticas
        </Link>
        <Link to="/reviews/my" className="hover:text-purple-600">
          Minhas Críticas
        </Link>
        <Link to="/login" className="hover:text-purple-600">
          Login
        </Link>
        <Link to="/register" className="hover:text-purple-600">
          Cadastro
        </Link>
      </nav>
    </header>
  );
}