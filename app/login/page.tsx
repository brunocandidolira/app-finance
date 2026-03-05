"use client";

import { useState } from "react";
import { login } from "../services/AuthServices";
import { useRouter } from "next/navigation";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Estado para mensagens de erro
  const [loading, setLoading] = useState(false); // Estado para o botão de carregar
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      
      if (data && data.token) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setError("E-mail ou senha inválidos.");
      }
    } catch (err) {
      setError("Falha na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <form className="form" onSubmit={handleLogin}>
        <h1>Login</h1>
        
        {/* Exibe o erro se existir */}
        {error && <p className="error-message">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <button 
          type="button" 
          className="btn-register" 
          onClick={() => router.push("/register")}
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
