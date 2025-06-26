import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-black text-white border-b border-neutral-700 w-full z-50 ">
      <div className=" mx-auto px-4 py-4 flex items-center justify-between container place-self-center spacing ">
        <Link
          to="/"
          className="text-xl font-bold text-purple-200 hover:text-purple-300"
          onClick={closeMenu}
        >
          Cine<span className="text-purple-600 hover:text-purple-700">XP</span> 
        </Link>

        {/* Botão do menu (mobile) */}
        <button
          className="sm:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Abrir menu"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Navegação principal (desktop) */}
        <nav className="hidden sm:flex gap-6 font-semibold">
          <Link to="/" className="hover:text-purple-500 transition-colors">Home</Link>
          <Link to="/reviews" className="hover:text-purple-500 transition-colors">Todas as Críticas</Link>
          <Link to="/reviews/my" className="hover:text-purple-500 transition-colors">Minhas Críticas</Link>
          <Link to="/login" className="hover:text-purple-500 transition-colors">Login</Link>
          <Link to="/register" className="hover:text-purple-500 transition-colors">Cadastro</Link>
        </nav>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="sm:hidden bg-neutral-900 border-t border-neutral-700">
          <nav className="flex flex-col gap-4 px-6 py-4 font-semibold">
            <Link to="/" onClick={closeMenu} className="hover:text-purple-500">Home</Link>
            <Link to="/reviews" onClick={closeMenu} className="hover:text-purple-500">Todas as Críticas</Link>
            <Link to="/reviews/my" onClick={closeMenu} className="hover:text-purple-500">Minhas Críticas</Link>
            <Link to="/login" onClick={closeMenu} className="hover:text-purple-500">Login</Link>
            <Link to="/register" onClick={closeMenu} className="hover:text-purple-500">Cadastro</Link>
          </nav>
        </div>
      )}
    </header>
  );
}