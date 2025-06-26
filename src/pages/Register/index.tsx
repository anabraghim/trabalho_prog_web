import { useState } from "react";
import { Link } from "react-router-dom";
import background from '../../assets/imgs/background.png'

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("https://api-cinexp.onrender.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, email, password }),
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.message || "Erro ao criar conta");
      }

      setMessage("Conta criada com sucesso! Faça login.");
      
    }catch (e) {
  const error = e as Error;
  setMessage(error.message);
}
  };

  return (
    <div className="h-[100vh] bg-cover bg-no-repeat bg-center flex justify-center items-center" style={{ backgroundImage: `url(${background})` }}>
    <div className="bg-black opacity-80 flex flex-col items-center justify-center gap-1 p-10 m-5 md:m-5 w-8/10 rounded-3xl max-w-[500px]">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 opacity-80">Criar Conta</h1>
      <form onSubmit={handleRegister} className="space-y-4 flex flex-col w-full">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 border-[1px] border-neutral-600 rounded-[10px] outline-0"
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-4 border-[1px] border-neutral-600 rounded-[10px] outline-0"
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 border-[1px] border-neutral-600 rounded-[10px] outline-0"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 border-[1px] border-neutral-600 rounded-[10px] outline-0"
          required
        />
        <button type="submit" className="bg-purple-600 text-white px-10 py-2 rounded mb-4 font-bold">
          Criar Conta
        </button>
      </form>
      {message && <p className="mt-4 text-center text-purple-600">{message}</p>}
      <p className="text-center text-sm">
        Já tem uma conta?{" "}
        <Link to="/login" className="text-purple-600 font-bold">
          Faça login
        </Link>
      </p>
    </div>
    </div>
  );
}