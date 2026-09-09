"use client";

import { useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, error, success, register } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(email, password);
  };

  const stars = Array.from({ length: 40 });
  const drops = Array.from({ length: 30 });

  return (
    <div className="auth-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;1,500&family=Space+Mono&display=swap');

        .auth-root {
          --deep: #170f2b;
          --mid: #2a1f49;
          --moon: #f4e6c8;
          --pink: #e6a2d6;
          --teal: #8fd8ca;
          --cream: #f6ecda;
          --ink: #120c22;
          --danger: #e88a8a;

          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: radial-gradient(120% 90% at 50% -10%, var(--mid) 0%, var(--deep) 65%, #0d0819 100%);
          font-family: 'Space Mono', monospace;
          color: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .sky { position: absolute; inset: 0; overflow: hidden; }

        .star {
          position: absolute;
          width: 2px; height: 2px;
          background: var(--moon);
          border-radius: 50%;
          animation: twinkle 3.5s ease-in-out infinite;
        }
        @keyframes twinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.9; } }

        .moon {
          position: absolute;
          top: 8%; left: 50%;
          transform: translateX(-50%);
          width: 56px; height: 56px;
          border-radius: 50%;
          background: var(--moon);
          box-shadow: 0 0 40px 6px rgba(244, 230, 200, 0.3);
        }

        .drop {
          position: absolute;
          top: -10%;
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, transparent, rgba(200, 210, 255, 0.3));
          animation: fall linear infinite;
        }
        @keyframes fall { to { transform: translateY(120vh); } }

        .card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 360px;
          background: rgba(246, 236, 218, 0.06);
          border: 1px solid rgba(246, 236, 218, 0.12);
          border-radius: 16px;
          backdrop-filter: blur(14px);
          padding: 36px 32px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.45);
        }

        .card-title {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 26px;
          font-weight: 500;
          margin: 0 0 6px;
        }

        .card-subtitle {
          font-size: 12px;
          color: rgba(246,236,218,0.55);
          margin: 0 0 28px;
        }

        .field { margin-bottom: 18px; }

        .field label {
          display: block;
          font-size: 11px;
          color: rgba(246,236,218,0.6);
          margin-bottom: 6px;
        }

        .field input {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(246,236,218,0.15);
          border-radius: 8px;
          color: var(--cream);
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .field input:focus {
          border-color: var(--teal);
        }

        .field input::placeholder {
          color: rgba(246,236,218,0.3);
        }

        .submit-btn {
          width: 100%;
          padding: 13px;
          margin-top: 6px;
          border: none;
          border-radius: 999px;
          background: var(--cream);
          color: var(--ink);
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .submit-btn:hover:not(:disabled) { transform: scale(1.02); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .message {
          margin-top: 16px;
          font-size: 12px;
          text-align: center;
        }

        .message.error { color: var(--danger); }
        .message.success { color: var(--teal); }

        @media (prefers-reduced-motion: reduce) {
          .star, .drop { animation: none !important; }
        }
      `}</style>

      <div className="sky">
        {stars.map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 55}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3.5}s`,
            }}
          />
        ))}
        <div className="moon" />
        {drops.map((_, i) => (
          <span
            key={i}
            className="drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${0.6 + Math.random() * 0.6}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      <div className="card">
        <h1 className="card-title">join the radio</h1>
        <p className="card-subtitle">create an account to save your favorite tracks</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "creating account..." : "create account"}
          </button>
        </form>

        {error && <p className="message error">{error}</p>}
        {success && <p className="message success">account created — you can log in now</p>}
      </div>
    </div>
  );
}
