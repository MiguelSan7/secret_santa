# 🎄 Sistema de Amigo Secreto Mejorado

## ✨ Cambios Implementados

### Problema Resuelto
- **Antes:** Cualquiera podía escribir el nombre de otra persona y ver su asignación
- **Ahora:** Cada persona recibe un código único por WhatsApp y solo puede ver su propio resultado

### Nuevas Características

1. **Registro con teléfono:** Los participantes ahora deben registrar su número de WhatsApp
2. **Códigos únicos:** Al realizar el sorteo se generan códigos de acceso de 8 caracteres
3. **Envío automático:** Sistema para enviar códigos por WhatsApp usando Twilio
4. **Página segura:** Nueva página `/resultado` donde se ingresa el código único

## 📋 Pasos para Configurar

### 1. Actualizar la Base de Datos en Supabase

Ve al **SQL Editor** de Supabase y ejecuta:

\`\`\`sql
-- Agregar columnas nuevas
ALTER TABLE participants 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS access_code TEXT UNIQUE;

-- Opcional: Generar códigos para registros existentes
UPDATE participants 
SET access_code = substring(md5(random()::text) from 1 for 8)
WHERE access_code IS NULL;
\`\`\`

### 2. Configurar Twilio (para WhatsApp)

#### Opción A: WhatsApp con Twilio (Recomendado)

1. Crea una cuenta en [Twilio](https://www.twilio.com/try-twilio)
2. Ve a **Console Dashboard** y copia:
   - Account SID
   - Auth Token
3. Configura el **WhatsApp Sandbox**:
   - Ve a **Messaging** > **Try it out** > **Send a WhatsApp message**
   - Sigue las instrucciones para conectar tu WhatsApp
   - Copia el número de Twilio (ej: `whatsapp:+14155238886`)

4. Agrega las credenciales a `.env.local`:
\`\`\`env
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

#### Opción B: SMS (alternativa más simple)

Si prefieres SMS en lugar de WhatsApp, modifica `/api/send-messages.ts`:
- Cambia `to: \`whatsapp:\${participant.phone}\`` por `to: participant.phone`
- Asegúrate que los números tengan formato internacional (+52...)

### 3. Reiniciar el Servidor

\`\`\`bash
npm run dev
\`\`\`

## 🎯 Flujo de Uso

### Para los Participantes:

1. Entran a la página principal
2. Registran su **nombre** y **teléfono de WhatsApp**
3. Agregan sus deseos (opcional)
4. Esperan a que se realice el sorteo

### Para el Admin:

1. Ve a `/admin`
2. Presiona **"🎲 Realizar Sorteo"** (genera códigos únicos)
3. Presiona **"📱 Enviar Mensajes WhatsApp"** (envía códigos)
4. Los participantes reciben su código por WhatsApp

### Para Ver Resultados:

1. Los participantes reciben un mensaje como:
   ```
   🎄 ¡Hola María! 🎅
   
   Ya se realizó el sorteo del Amigo Secreto.
   
   Tu código de acceso es: a3b5c7d9
   
   Entra aquí para ver a quién te tocó:
   http://localhost:3000/resultado
   
   ¡No compartas tu código con nadie! 🎁
   ```

2. Entran a `/resultado`
3. Ingresan su código único
4. Ven solo su propia asignación

## 🔒 Seguridad

- ✅ Cada código es único y aleatorio (8 caracteres hexadecimales)
- ✅ Solo quien tiene el código puede ver su asignación
- ✅ No hay forma de adivinar otros códigos
- ✅ Los códigos se generan con `crypto.randomBytes()`

## 📱 Números de Teléfono

Los participantes deben registrar su número en formato internacional:
- México: `+52 123 456 7890`
- USA: `+1 234 567 8900`
- España: `+34 612 345 678`

## 🧪 Prueba sin Twilio

Si quieres probar el sistema sin configurar Twilio:

1. Realiza el sorteo desde `/admin`
2. Los códigos se generarán en la base de datos
3. Consulta manualmente los códigos en Supabase (tabla `participants`, columna `access_code`)
4. Prueba ingresando un código en `/resultado`

## 🗑️ Página Antigua

La página `/quien` ya no se usa, pero la dejamos por si quieres eliminarla:
\`\`\`bash
rm src/pages/quien.tsx
\`\`\`

## 💡 Mejoras Futuras

- [ ] Panel admin para ver todos los códigos
- [ ] Reenvío de código si alguien lo pierde
- [ ] Integración directa con WhatsApp Business API
- [ ] Notificaciones por email como alternativa
- [ ] Confirmación de lectura de mensajes

## 🆘 Solución de Problemas

### Error: "supabaseKey is required"
- Verifica que `.env.local` tenga `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Reinicia el servidor de desarrollo

### No llegan los mensajes de WhatsApp
- Verifica que las credenciales de Twilio estén correctas
- Asegúrate de haber conectado tu WhatsApp al Sandbox de Twilio
- Los números deben tener formato internacional (+52...)
- Revisa los logs en la consola de Twilio

### El código no funciona
- Verifica que el sorteo se haya realizado correctamente
- Revisa en Supabase que el campo `access_code` no esté vacío
- El código es sensible a mayúsculas (usa minúsculas)
