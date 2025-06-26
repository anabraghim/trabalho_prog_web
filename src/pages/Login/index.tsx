import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../store/slices/authSlice";
import background from '../../assets/imgs/background.png'


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("https://api-cinexp.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.message || "Erro ao fazer login");
      }

      const data = await res.json();
      // console.log("data.user recebido:", data.user);

      // Salva no Redux e no localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(login({ user: data.user, token: data.token }));

      setMessage("Login realizado com sucesso!");
      navigate("/reviews");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    
    <div className="h-[100vh] flex bg-cover bg-no-repeat bg-center justify-center items-center " style={{ backgroundImage: `url(${background})` }}>
      <div className="bg-black opacity-80 flex flex-col items-center justify-center gap-1 p-10 m-5 md:m-5 w-8/10 rounded-3xl max-w-[500px]">
      <h1 className="text-center text-2xl sm:text-3xl font-bold mb-4 opacity-80">Bem-vindo(a) de volta!</h1>
      <form onSubmit={handleLogin} className="space-y-4 flex flex-col w-full">
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
          Entrar
        </button>
      </form>
      {message && <p className="mt-4 text-center text-purple-600">{message}</p>}
    <p className="text-center text-sm">
        Ainda não tem uma conta?{" "}
        <Link to="/register" className="text-purple-600 font-bold">
          Cadastre-se
        </Link>
      </p>
    </div>
    </div>
  );
}