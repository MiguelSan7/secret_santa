"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface AssignedPerson {
  name: string;
  wish1: string | null;
  wish2: string | null;
  wish3: string | null;
  link1: string | null;
  link2: string | null;
  link3: string | null;
}

interface QueryResult {
  assigned_to: AssignedPerson | null;
}

export default function Who() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function check() {
    if (!name.trim()) {
      setError("Por favor escribe tu nombre");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const { data, error: queryError } = await supabase
      .from("participants")
      .select("*, assigned_to(name, wish1, wish2, wish3, link1, link2, link3)")
      .eq("name", name.trim())
      .single();

    setLoading(false);

    if (queryError || !data) {
      setError("No se encontró tu nombre. Verifica que esté escrito exactamente como lo registraste.");
      return;
    }

    if (!data.assigned_to) {
      setError("Aún no se ha realizado el sorteo. Espera a que el admin lo haga.");
      return;
    }

    setResult(data as QueryResult);
  }

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white px-4 py-6 sm:p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl pixel text-pink-300 text-center mb-6">
          🎁 ¿Quién te tocó?
        </h1>

        <div className="bg-[#16213e] p-4 sm:p-6 rounded-xl border-2 border-pink-400 shadow-xl">
          <label className="block text-pink-200 text-sm mb-2 pixel">
            Tu nombre *
          </label>
          <input
            className="input"
            placeholder="Escribe tu nombre exacto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && check()}
          />

          <button
            onClick={check}
            disabled={loading}
            className="w-full mt-4 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-700 text-white p-4 rounded-lg pixel text-lg shadow-lg active:scale-95 transition-transform"
          >
            {loading ? "Buscando..." : "Consultar 🎅"}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border-2 border-red-400 rounded-lg">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}
        </div>

        {result?.assigned_to && (
          <div className="mt-6 bg-[#16213e] p-4 sm:p-6 rounded-xl border-2 border-green-400 shadow-xl">
            <p className="pixel text-lg sm:text-xl text-pink-300 text-center mb-4">
              🎉 Te tocó: {result.assigned_to.name} 🎉
            </p>

            <div className="bg-[#0f3460] p-4 rounded-lg mb-4">
              <h3 className="pixel text-sm text-pink-300 mb-3">Sus deseos:</h3>
              <ul className="space-y-2 text-white">
                {result.assigned_to.wish1 && (
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2">🎁</span>
                    <span>{result.assigned_to.wish1}</span>
                  </li>
                )}
                {result.assigned_to.wish2 && (
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2">🎁</span>
                    <span>{result.assigned_to.wish2}</span>
                  </li>
                )}
                {result.assigned_to.wish3 && (
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2">🎁</span>
                    <span>{result.assigned_to.wish3}</span>
                  </li>
                )}
                {!result.assigned_to.wish1 &&
                  !result.assigned_to.wish2 &&
                  !result.assigned_to.wish3 && (
                    <li className="text-gray-400 italic">
                      No especificó deseos
                    </li>
                  )}
              </ul>
            </div>

            {(result.assigned_to.link1 ||
              result.assigned_to.link2 ||
              result.assigned_to.link3) && (
              <div className="bg-[#0f3460] p-4 rounded-lg">
                <h3 className="pixel text-sm text-pink-300 mb-3">Links:</h3>
                <ul className="space-y-2">
                  {result.assigned_to.link1 && (
                    <li>
                      <a
                        href={result.assigned_to.link1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 underline hover:text-blue-200 break-all"
                      >
                        🔗 Link 1
                      </a>
                    </li>
                  )}
                  {result.assigned_to.link2 && (
                    <li>
                      <a
                        href={result.assigned_to.link2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 underline hover:text-blue-200 break-all"
                      >
                        🔗 Link 2
                      </a>
                    </li>
                  )}
                  {result.assigned_to.link3 && (
                    <li>
                      <a
                        href={result.assigned_to.link3}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 underline hover:text-blue-200 break-all"
                      >
                        🔗 Link 3
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
 