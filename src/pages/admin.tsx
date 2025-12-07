"use client";
import { useState } from "react";

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleDraw() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/draw");
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Sorteo realizado exitosamente!");
      } else {
        setError(data.error || "Error al realizar el sorteo");
      }
    } catch (err) {
      setError("Error de conexión");
    }

    setLoading(false);
  }

  async function handleReset() {
    if (!confirm("¿Estás seguro de borrar todas las asignaciones?")) {
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/reset", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.message} (${data.count} participantes)`);
      } else {
        setError(data.error || "Error al resetear");
      }
    } catch (err) {
      setError("Error de conexión");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white px-4 py-6 sm:p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl pixel text-pink-300 text-center mb-6">
          🎅 Panel de Admin
        </h1>

        <div className="bg-[#16213e] p-4 sm:p-6 rounded-xl border-2 border-pink-400 shadow-xl space-y-4">
          <button
            onClick={handleDraw}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-700 text-white p-4 rounded-lg pixel text-lg shadow-lg active:scale-95 transition-transform"
          >
            {loading ? "Procesando..." : "🎲 Realizar Sorteo"}
          </button>

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-700 text-white p-4 rounded-lg pixel text-lg shadow-lg active:scale-95 transition-transform"
          >
            {loading ? "Procesando..." : "🗑️ Resetear Asignaciones"}
          </button>

          {message && (
            <div className="p-3 bg-green-900/50 border-2 border-green-400 rounded-lg">
              <p className="text-green-300 text-sm text-center">{message}</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-900/50 border-2 border-red-400 rounded-lg">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-[#16213e] p-4 rounded-lg border border-pink-400">
          <h2 className="pixel text-sm text-pink-300 mb-2">ℹ️ Instrucciones:</h2>
          <ul className="text-sm space-y-2 text-gray-300">
            <li>• <strong>Realizar Sorteo:</strong> Asigna a cada persona quién le toca</li>
            <li>• <strong>Resetear:</strong> Borra todas las asignaciones para volver a sortear</li>
            <li>• Solo puedes sortear una vez (hasta que resetees)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
