import { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";

interface ParticipantId {
  id: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabaseAdmin = getSupabaseAdmin();

  // Obtener todos los participantes
  const { data: people } = await supabaseAdmin
    .from("participants")
    .select("id")
    .returns<ParticipantId[]>();

  if (!people || people.length === 0) {
    return res.status(400).json({ error: "No hay participantes" });
  }

  // Limpiar todas las asignaciones y códigos uno por uno
  for (const person of people) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin.from("participants") as any)
      .update({ 
        assigned_to: null,
        access_code: null 
      })
      .eq("id", person.id);
  }

  return res.json({ ok: true, message: "Asignaciones y códigos limpiados", count: people.length });
}