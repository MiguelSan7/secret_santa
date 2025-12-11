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
  name: string;
  assigned_to: AssignedPerson;
}

export default function Result() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkCode() {
    if (!code.trim()) {
      setError("Por favor ingresa tu código");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const { data, error: queryError } = await supabase
      .from("participants")
      .select("name, assigned_to(name, wish1, wish2, wish3, link1, link2, link3)")
      .eq("access_code", code.trim().toLowerCase())
      .single();

    setLoading(false);

    if (queryError || !data) {
      setError("Código inválido. Verifica tu mensaje de WhatsApp.");
      return;
    }

    // Supabase devuelve assigned_to como array, tomamos el primer elemento
    const assignedPerson = Array.isArray(data.assigned_to) ? data.assigned_to[0] : data.assigned_to;

    if (!assignedPerson) {
      setError("Aún no se ha realizado el sorteo.");
      return;
    }

    setResult({
      name: data.name,
      assigned_to: assignedPerson
    });
  }

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white px-4 py-6 sm:p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl pixel text-pink-300 text-center mb-6">
          🎁 Tu Amigo Secreto
        </h1>

        <div className="bg-[#16213e] p-4 sm:p-6 rounded-xl border-2 border-pink-400 shadow-xl">
          <label className="block text-pink-200 text-sm mb-2 pixel">
            Código de acceso *
          </label>
          <input
            className="input"
            placeholder="Ingresa el código que recibiste"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && checkCode()}
          />

          <button
            onClick={checkCode}
            disabled={loading}
            className="w-full mt-4 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-700 text-white p-4 rounded-lg pixel text-lg shadow-lg active:scale-95 transition-transform"
          >
            {loading ? "Verificando..." : "Ver mi resultado 🎅"}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border-2 border-red-400 rounded-lg">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-green-900/30 border-2 border-green-400 rounded-lg">
                <p className="text-green-300 text-center text-sm mb-2 pixel">
                  Hola {result.name} 👋
                </p>
                <p className="text-white text-center text-xl pixel">
                  🎁 Te tocó: <span className="text-pink-300">{result.assigned_to.name}</span>
                </p>
              </div>

              <div className="bg-[#0f3460] p-4 rounded-lg border border-pink-300">
                <h3 className="text-pink-300 pixel mb-3 text-center">
                  🎀 Sus deseos:
                </h3>

                <div className="space-y-2 text-sm">
                  {result.assigned_to.wish1 && (
                    <div className="bg-[#16213e] p-2 rounded">
                      <span className="text-pink-200">🌟 </span>
                      {result.assigned_to.wish1}
                      {result.assigned_to.link1 && (
                        <a
                          href={result.assigned_to.link1}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-400 hover:text-blue-300 underline text-xs"
                        >
                          Ver link 🔗
                        </a>
                      )}
                    </div>
                  )}

                  {result.assigned_to.wish2 && (
                    <div className="bg-[#16213e] p-2 rounded">
                      <span className="text-pink-200">🌟 </span>
                      {result.assigned_to.wish2}
                      {result.assigned_to.link2 && (
                        <a
                          href={result.assigned_to.link2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-400 hover:text-blue-300 underline text-xs"
                        >
                          Ver link 🔗
                        </a>
                      )}
                    </div>
                  )}

                  {result.assigned_to.wish3 && (
                    <div className="bg-[#16213e] p-2 rounded">
                      <span className="text-pink-200">🌟 </span>
                      {result.assigned_to.wish3}
                      {result.assigned_to.link3 && (
                        <a
                          href={result.assigned_to.link3}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-400 hover:text-blue-300 underline text-xs"
                        >
                          Ver link 🔗
                        </a>
                      )}
                    </div>
                  )}

                  {!result.assigned_to.wish1 &&
                    !result.assigned_to.wish2 &&
                    !result.assigned_to.wish3 && (
                      <p className="text-gray-400 text-center text-xs italic">
                        No dejó deseos específicos
                      </p>
                    )}
                </div>
              </div>

              <div className="bg-yellow-900/30 border border-yellow-400 p-3 rounded-lg">
                <p className="text-yellow-200 text-xs text-center">
                  ⚠️ No compartas tu código con nadie
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
