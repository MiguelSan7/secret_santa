# 🎄 Secret Santa App - Configuración de Twilio

## ¿Qué cambió?

Ahora el sistema es **100% seguro**:
- ✅ Cada persona **solo puede ver su propio resultado** usando un código único
- ✅ Los códigos se envían automáticamente por **WhatsApp**
- ✅ Ya no hay manera de que alguien vea los resultados de otros

## 📋 Pasos para configurar Twilio

### 1. Crear cuenta en Twilio
1. Ve a https://www.twilio.com/try-twilio
2. Regístrate con tu email
3. Verifica tu teléfono

### 2. Obtener credenciales
1. En el Dashboard de Twilio (https://console.twilio.com), copia:
   - **Account SID**
   - **Auth Token**

### 3. Activar WhatsApp Sandbox
1. Ve a: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Sigue las instrucciones para unirte al sandbox
3. Envía el mensaje desde tu WhatsApp al número que te indiquen (ej: "join [palabra-clave]")
4. Copia el número del sandbox (algo como: `whatsapp:+14155238886`)

### 4. Configurar variables de entorno
Edita tu archivo `.env.local` y reemplaza:

```env
TWILIO_ACCOUNT_SID=tu_account_sid_real
TWILIO_AUTH_TOKEN=tu_auth_token_real
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

### 5. Actualizar la base de datos
Ve al SQL Editor en Supabase y ejecuta:

```sql
-- Agregar columnas nuevas
ALTER TABLE participants 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS access_code TEXT UNIQUE;
```

## 🚀 Cómo funciona ahora

### Para participantes:
1. Entran a `/` y registran su **nombre + teléfono**
2. Cuando el admin hace el sorteo, reciben un **código único por WhatsApp**
3. Entran a `/resultado` e ingresan su código
4. ¡Ven solo su resultado!

### Para el admin (tú):
1. Ve a `/admin`
2. Haz clic en **"Realizar Sorteo"** (genera códigos)
3. Haz clic en **"Enviar Mensajes WhatsApp"** (envía los códigos)
4. ¡Listo! Cada persona recibirá su código privado

## 💰 Costos de Twilio

- **Modo Sandbox (gratuito)**: 
  - Solo puedes enviar a números que se registren en el sandbox
  - Ideal para familias pequeñas
  
- **Modo Producción**: 
  - ~$0.005 USD por mensaje
  - Para 20 personas = ~$0.10 USD

## ⚠️ Importante

1. **Todos los participantes deben unirse al sandbox** antes de que envíes los mensajes
2. Los números deben incluir código de país (ej: `+52 123 456 7890`)
3. **Reinicia el servidor** después de cambiar las variables de entorno

## 🔒 Seguridad mejorada

- ❌ Ya **NO** existe `/quien` (donde ponían cualquier nombre)
- ✅ Solo existe `/resultado` (requiere código único)
- ✅ Cada código solo funciona para 1 persona
- ✅ Los códigos son aleatorios e imposibles de adivinar

## 🛠️ Comandos útiles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📱 Formato de teléfonos

Los números deben estar en formato internacional:
- México: `+52 123 456 7890`
- USA: `+1 234 567 8900`
- España: `+34 123 456 789`

## 🆘 Problemas comunes

**"Error al enviar mensajes"**
- Verifica que las credenciales de Twilio estén correctas
- Asegúrate de que todos los números estén unidos al sandbox

**"Código inválido"**
- El sorteo debe realizarse primero
- Verifica que el código no tenga espacios

**"Sin teléfono"**
- Todos deben registrarse con su número de teléfono
- Pueden volver a registrarse si olvidaron incluirlo
