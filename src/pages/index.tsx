"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);

    const { error } = await supabase.from("participants").insert({
      name: form.get("name"),
      wish1: form.get("wish1"),
      wish2: form.get("wish2"),
      wish3: form.get("wish3"),
      link1: form.get("link1"),
      link2: form.get("link2"),
      link3: form.get("link3"),
    });

    if (!error) setDone(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#1a1a2e] flex flex-col items-center px-4 py-6 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-pink-300 pixel my-4 sm:my-6 text-center">
        🎄 Intercambio Familiar 🎄
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#16213e] p-4 sm:p-6 rounded-xl max-w-md w-full shadow-xl border-2 border-pink-400"
      >
        <label className="block text-pink-200 text-sm mb-1 pixel">Tu nombre *</label>
        <input 
          name="name" 
          required 
          placeholder="Escribe tu nombre aquí" 
          className="input mb-4" 
        />

        <h2 className="text-pink-300 mt-2 mb-3 pixel text-lg">Tus deseos</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-pink-200 text-xs mb-1">Deseo 1</label>
            <input name="wish1" placeholder="Ej: Libro de cocina" className="input" />
          </div>
          <div>
            <label className="block text-pink-200 text-xs mb-1">Deseo 2</label>
            <input name="wish2" placeholder="Ej: Auriculares" className="input" />
          </div>
          <div>
            <label className="block text-pink-200 text-xs mb-1">Deseo 3</label>
            <input name="wish3" placeholder="Ej: Taza personalizada" className="input" />
          </div>
        </div>

        <h2 className="text-pink-300 mt-6 mb-3 pixel text-lg">Links opcionales 🔗</h2>
        <p className="text-pink-200 text-xs mb-3">Puedes pegar enlaces de productos</p>

        <div className="space-y-3">
          <div>
            <label className="block text-pink-200 text-xs mb-1">Link 1</label>
            <input name="link1" placeholder="https://..." className="input text-sm" />
          </div>
          <div>
            <label className="block text-pink-200 text-xs mb-1">Link 2</label>
            <input name="link2" placeholder="https://..." className="input text-sm" />
          </div>
          <div>
            <label className="block text-pink-200 text-xs mb-1">Link 3</label>
            <input name="link3" placeholder="https://..." className="input text-sm" />
          </div>
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-700 text-white p-4 pixel rounded-lg text-lg shadow-lg active:scale-95 transition-transform"
        >
          {loading ? "Guardando..." : "Registrar 🎅"}
        </button>

        {done && (
          <div className="mt-4 p-3 bg-green-900/50 border-2 border-green-400 rounded-lg">
            <p className="text-green-300 pixel text-center">
              🎉 ¡Registrado correctamente! 🎄
            </p>
          </div>
        )}
      </form>

      <Link href="/quien">
        <button className="mt-6 bg-[#16213e] hover:bg-[#0f3460] text-pink-300 border-2 border-pink-400 px-6 py-3 rounded-lg pixel shadow-lg active:scale-95 transition-transform">
          🎁 Ver quién me tocó
        </button>
      </Link>
    </main>
  );
}
