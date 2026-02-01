# Scrutinia - Sistema de Escrutinio Electoral Aragón 2026

Sistema de escrutinio ciudadano paralelo para las elecciones autonómicas de Aragón 2026.

## 🗳️ Descripción

Scrutinia es una plataforma que permite el seguimiento en tiempo real de los resultados electorales mediante:
- **Transcripción automática de actas** con IA
- **Dashboard de resultados** con hemiciclo interactivo
- **Cálculo de escaños** con algoritmo D'Hondt
- **Pactómetro** para simulación de coaliciones

## 🏗️ Estructura del Proyecto

```
Scrutinia/
├── scrutinia-nextjs/      # Aplicación Next.js (Frontend + API)
│   ├── src/
│   │   ├── app/           # Rutas de la aplicación
│   │   ├── components/    # Componentes React
│   │   ├── lib/           # Lógica de negocio
│   │   └── hooks/         # Custom hooks (Realtime)
│   └── ...
├── public/                # Archivos estáticos legacy
├── database_schema.sql    # Schema de Supabase
├── SUPABASE.MD           # Documentación de la base de datos
└── PROJECT_PLAN.md       # Plan del proyecto
```

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 16, React 19, TypeScript
- **Estilos:** Tailwind CSS v4
- **Base de datos:** Supabase (PostgreSQL)
- **Realtime:** Supabase Realtime
- **Iconos:** Lucide React

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/scrutinia.git
cd scrutinia

# Instalar dependencias
cd scrutinia-nextjs
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Iniciar servidor de desarrollo
npm run dev
```

## ⚙️ Variables de Entorno

Crea un archivo `.env.local` en `scrutinia-nextjs/`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## 📊 Base de Datos

El schema de Supabase incluye las siguientes tablas:
- `partidos` - Tabla maestra de partidos políticos
- `mesas` - Mesas electorales del censo
- `actas` - Actas escrutadas (formato JSON v6)
- `detalle_votos` - Desglose de votos por partido
- `candidaturas_unmapped` - Partidos no mapeados
- `resultados_publicos` - Agregados para dashboard

Ver [SUPABASE.MD](./SUPABASE.MD) para documentación detallada.

## 🗺️ Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page |
| `/campus` | Campus virtual de formación |
| `/escrutinio` | Dashboard de resultados |

## 📈 Funcionalidades

### Dashboard de Escrutinio
- Hemiciclo interactivo con distribución de escaños
- Tabla de resultados por partido
- Filtros por provincia y municipio
- Actualización en tiempo real

### Algoritmo D'Hondt
- Cálculo automático de escaños
- Barrera electoral del 3%
- Soporte para las 3 provincias de Aragón

### Pactómetro
- Simulación de coaliciones
- Indicador de mayoría absoluta (34 escaños)

## 🤝 SALF - Sistema Aragonés de Libertad y Futuro

Este proyecto da representación significativa a SALF en las simulaciones.

## 📝 Licencia

MIT License

---

Desarrollado para las elecciones autonómicas de Aragón 2026.
