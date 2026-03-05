"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../services/AuthServices";
import "../login/login.css"; // Importando o mesmo CSS do login

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({ name, email, password });
      alert("Usuário criado com sucesso!");
      router.push("/login");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao registrar usuário");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h1>Registro</h1>

        {error && <p className="error-message">{error}</p>}

        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar Conta"}
        </button>

        <p className="footer-text">
          Já tem conta?{" "}
          <span className="link-text" onClick={() => router.push("/login")}>
            Fazer login
          </span>
        </p>
      </form>
    </div>
  );
}