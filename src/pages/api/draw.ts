import { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";

interface Participant {
  id: number;
  name: string;
  wish1: string | null;
  wish2: string | null;
  wish3: string | null;
  link1: string | null;
  link2: string | null;
  link3: string | null;
  assigned_to: number | null;
}

interface Update {
  id: number;
  assigned_to: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabaseAdmin = getSupabaseAdmin();

  const { data: people } = await supabaseAdmin
    .from("participants")
    .select("*")
    .returns<Participant[]>();

  if (!people || people.length === 0) {
    return res.status(400).json({ error: "No hay participantes" });
  }

  // 🔍 DEBUG: Ver qué valores tiene assigned_to
  console.log("Participantes:", people.map(p => ({ id: p.id, name: p.name, assigned_to: p.assigned_to })));

  // ✅ VALIDACIÓN MEJORADA
  const alreadyAssigned = people.some((p) => p.assigned_to !== null && p.assigned_to !== undefined);
  
  console.log("¿Ya asignado?", alreadyAssigned);
  
  if (alreadyAssigned) {
    return res.status(400).json({ 
      error: "El sorteo ya fue realizado. Si quieres volver a sortear, primero limpia las asignaciones." 
    });
  }

  // Clonar arreglo
  const available: Participant[] = [...people];
  const updates: Update[] = [];

  for (const p of people) {
    const choices = available.filter((x) => x.id !== p.id);

    if (choices.length === 0) {
      return res.status(400).json({ error: "No se puede asignar correctamente." });
    }

    const chosen = choices[Math.floor(Math.random() * choices.length)];

    updates.push({
      id: p.id,
      assigned_to: chosen.id,
    });

    available.splice(
      available.findIndex((x) => x.id === chosen.id),
      1
    );
  }

  for (const u of updates) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin.from("participants") as any)
      .update({ assigned_to: u.assigned_to })
      .eq("id", u.id);
  }

  return res.json({ ok: true });
}
