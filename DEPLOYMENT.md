# Guía de Despliegue en Vercel - Scrutinia

## 📋 Pre-requisitos

1. Cuenta en Vercel (https://vercel.com)
2. Proyecto Supabase activo (ID: `jqfwnvtxakilaqwfyjcf`)
3. Repositorio Git (GitHub/GitLab/Bitbucket)

---

## 🚀 Pasos para Desplegar

### 1. Preparar el Repositorio

```bash
cd scrutinia-nextjs
git init
git add .
git commit -m "Initial commit: Scrutinia 2.0"
git branch -M main
git remote add origin <TU_REPOSITORIO_URL>
git push -u origin main
```

### 2. Conectar con Vercel

1. Ve a https://vercel.com/new
2. Importa tu repositorio de GitHub
3. Vercel detectará automáticamente que es un proyecto Next.js

### 3. Configurar Variables de Entorno en Vercel

En el panel de configuración del proyecto, añade estas variables:

**Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://jqfwnvtxakilaqwfyjcf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<TU_ANON_KEY_DE_SUPABASE>
```

**Dónde obtener la Anon Key:**
1. Ve a: https://supabase.com/dashboard/project/jqfwnvtxakilaqwfyjcf/settings/api
2. Copia el valor de "anon public"

### 4. Configuración de Build (Opcional)

Vercel usará automáticamente:
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 5. Desplegar

Haz clic en **Deploy**. El proceso tardará ~2-3 minutos.

---

## 🔧 Configuración Post-Despliegue

### Dominio Personalizado

1. En Vercel → Settings → Domains
2. Añade `scrutinia.com` y `www.scrutinia.com`
3. Configura los registros DNS en Cloudflare:
   - `A` record: `scrutinia.com` → IP de Vercel
   - `CNAME` record: `www` → `cname.vercel-dns.com`

### Habilitar Realtime en Supabase

1. Ve a: https://supabase.com/dashboard/project/jqfwnvtxakilaqwfyjcf/database/replication
2. Activa Realtime para las tablas:
   - `resultados_publicos`
   - `actas`

---

## ✅ Verificación

Después del despliegue, verifica:

- [ ] Landing page carga correctamente
- [ ] `/campus` muestra los vídeos de Vimeo
- [ ] `/escrutinio` se conecta a Supabase (sin errores en consola)
- [ ] Realtime funciona (prueba insertando un dato en `resultados_publicos`)

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas `git push` a la rama `main`, Vercel desplegará automáticamente los cambios.

**Comandos útiles:**
```bash
# Desarrollo local
npm run dev

# Build de producción (probar antes de desplegar)
npm run build
npm run start

# Linting
npm run lint
```
