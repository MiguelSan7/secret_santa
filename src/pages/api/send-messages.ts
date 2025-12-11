import { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";

interface Participant {
  id: number;
  name: string;
  phone: string;
  access_code: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabaseAdmin = getSupabaseAdmin();

  // Obtener todos los participantes con código de acceso
  const { data: participants, error } = await supabaseAdmin
    .from("participants")
    .select("id, name, phone, access_code")
    .not("access_code", "is", null)
    .returns<Participant[]>();

  if (error || !participants || participants.length === 0) {
    return res.status(400).json({ error: "No hay participantes con códigos asignados" });
  }

  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // formato: whatsapp:+14155238886

  if (!twilioAccountSid || !twilioAuthToken || !twilioWhatsAppNumber) {
    return res.status(500).json({ 
      error: "Faltan credenciales de Twilio en variables de entorno" 
    });
  }

  const twilio = require("twilio")(twilioAccountSid, twilioAuthToken);

  const results = [];
  const errors = [];

  for (const participant of participants) {
    if (!participant.phone) {
      errors.push({ 
        name: participant.name, 
        phone: "N/A",
        error: "Sin teléfono registrado" 
      });
      continue;
    }

    try {
      const phoneNumber = participant.phone.trim();
      const whatsappNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      const message = `🎄 ¡Hola ${participant.name}! 🎅\n\nYa se realizó el sorteo del Amigo Secreto.\n\nTu código de acceso es: ${participant.access_code}\n\nEntra aquí para ver a quién te tocó:\n${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/resultado\n\n¡No compartas tu código con nadie! 🎁`;

      const messageResponse = await twilio.messages.create({
        from: twilioWhatsAppNumber,
        to: `whatsapp:${whatsappNumber}`,
        body: message,
      });

      results.push({ 
        name: participant.name, 
        phone: whatsappNumber,
        status: "enviado",
        sid: messageResponse.sid 
      });
    } catch (err: any) {
      console.error(`Error enviando a ${participant.name}:`, err);
      errors.push({ 
        name: participant.name,
        phone: participant.phone,
        error: err.message || "Error desconocido",
        code: err.code || "N/A",
        moreInfo: err.moreInfo || "N/A"
      });
    }
  }

  return res.json({
    success: results.length,
    failed: errors.length,
    results,
    errors,
  });
}
