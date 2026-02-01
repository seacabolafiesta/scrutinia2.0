# Plan de Desarrollo: Scrutinia 2.0 - Escrutinio en Tiempo Real

Este documento detalla la hoja de ruta completa para migrar Scrutinia a una arquitectura moderna (Next.js + Supabase en Vercel) y desarrollar el sistema de escrutinio electoral en tiempo real con cálculo D'Hondt.

---

## 🛠️ Stack Tecnológico

-   **Frontend:** Next.js 14+ (App Router), React, TypeScript.
-   **Estilos:** Tailwind CSS, Lucide React (Iconos).
-   **Backend / Base de Datos:** Supabase (PostgreSQL, Auth, Realtime).
-   **Infraestructura:** Vercel (Hosting, Edge Functions).
-   **Procesamiento de Actas:** N8N + IA (Externo, conecta con Supabase).

---

## 🗓️ Fases del Proyecto

### 🏗️ Fase 1: Cimientos y Migración (Frontend)
*Objetivo: Tener la web actual funcionando en Next.js con una arquitectura escalable.*

1.  **Inicialización del Proyecto** ✅
    -   [x] Crear proyecto Next.js: `npx create-next-app@latest scrutinia --typescript --tailwind --eslint`.
    -   [x] Configurar estructura de carpetas (`/components`, `/lib`, `/app`, `/public`).
    -   [x] Lucide React instalado, logos copiados.

2.  **Migración de Landing Page (`index.html`)** ✅
    -   [x] Descomponer `index.html` en componentes React:
        -   `Navbar.tsx`, `Hero.tsx`, `AsesorSection.tsx`, `ScrutiniaSection.tsx`, `Footer.tsx`, `WelcomePopup.tsx`.
    -   [x] Implementar navegación SPA (`<Link>` de Next.js).
    -   [x] Optimizar imágenes (`next/image`).
    -   [x] Metadata SEO configurada en español.

3.  **Migración de Campus Virtual (`campus.html`)** ✅
    -   [x] Crear ruta `/campus`.
    -   [x] Crear sistema de gestión de estado para el reproductor de Vimeo (useState React).
    -   [x] Componentizar la lista de módulos y el sidebar.
    -   [x] Drawer móvil funcional.
    -   [x] Datos de módulos en `lib/modules-data.ts` con TypeScript.

---

### 🔌 Fase 2: Integración de Datos (Supabase) ✅
*Objetivo: Conectar la web con la base de datos y preparar la sincronización en vivo.*

1.  **Configuración de Supabase en Next.js** ✅
    -   [x] Instalar cliente: `npm install @supabase/ssr @supabase/supabase-js`.
    -   [x] Configurar cliente para Server Components (`lib/supabase/server.ts`).
    -   [x] Configurar cliente para Client Components (`lib/supabase/client.ts`).
    -   [x] Tipos TypeScript creados manualmente (`lib/supabase/database.types.ts`).

2.  **Capa de Acceso a Datos (Data Layer)** ✅
    -   [x] Crear funciones de lectura en `lib/data/mesas.ts`:
        - `getMesas()`, `getMesasByProvincia()`, `getMesasByMunicipio()`.
    -   [x] Crear funciones de lectura en `lib/data/resultados.ts`:
        - `getResultadosByProvincia()`, `getAllResultados()`, `getActasVerificadas()`, `getParticipacionStats()`.

3.  **Sincronización en Tiempo Real (Realtime)** ✅
    -   [x] Hook `useRealtimeScrutiny` creado en `hooks/useRealtimeScrutiny.ts`.
    -   [x] Suscripción a cambios en tabla `resultados_publicos` con filtro por provincia.
    -   [x] Actualización automática de UI al recibir INSERT/UPDATE/DELETE.

---

### 🧮 Fase 3: Motor Electoral (Lógica D'Hondt) ✅
*Objetivo: Calcular el reparto de escaños dinámicamente según los votos recibidos.*

1.  **Configuración Electoral (Aragón 2026)** ✅
    -   [x] Crear archivo de configuración `lib/elections-config.ts`:
        -   **Zaragoza:** 35 escaños.
        -   **Huesca:** 18 escaños.
        -   **Teruel:** 14 escaños.
        -   **Barrera:** 3% (filtro previo al reparto).

2.  **Algoritmo de Reparto** ✅
    -   [x] Desarrollar función pura `calculateDHondt(votesMap, totalSeats)` en `lib/dhondt.ts`.
        -   Entrada: Objeto con `{ "Partido": votos }`.
        -   Salida: Objeto con `{ "Partido": escaños }` + pasos del cálculo.
    -   [x] Implementar lógica de agregación en `lib/aggregation.ts`:
        - `aggregateVotosByProvincia()`, `aggregateVotosByMunicipio()`.
        - Normalización de nombres de partidos.
    -   [x] Función integradora `calculateResultadosProvincia()` en `lib/electoral-calculator.ts`.

3.  **Validación de Datos** ✅
    -   [x] Cálculo de porcentajes con votos válidos (excluye blancos/nulos).
    -   [x] Función `calculateParticipacion()` para estadísticas completas.
    -   [x] Tests unitarios creados en `lib/__tests__/dhondt.test.ts`.

---

### 📊 Fase 4: Dashboard de Escrutinio (UI/UX) ✅
*Objetivo: Visualizar los resultados de forma clara, profesional e interactiva.*

1.  **Interfaz Principal (`/escrutinio`)** ✅
    -   [x] Página `/escrutinio` creada con layout completo.
    -   [x] **Header de Estado:** Componente `HeaderEstado.tsx` con % Escrutado, Participación, Hora.
    -   [x] **Selector Geográfico:** Componente `SelectorGeografico.tsx` con filtro por Provincia.
    -   [x] Integración con Realtime (hook `useRealtimeScrutiny`).

2.  **Visualizaciones** ✅
    -   [x] **Hemiciclo:** Componente `Hemiciclo.tsx` con representación visual de escaños en arco.
    -   [x] **Tabla de Resultados:** Componente `TablaResultados.tsx` con votos, %, escaños ordenados.
    -   [x] **Pactómetro:** Componente `Pactometro.tsx` interactivo para calcular coaliciones.
    -   [x] Sistema de colores por partido en `lib/partido-colors.ts`.

3.  **Ficha de Transparencia (Nivel Mesa)** ⏳
    -   [ ] Pendiente para siguiente iteración:
        -   Visor de actas individuales.
        -   Foto del Acta original (desde Supabase Storage).
        -   Datos transcritos por la IA.
        -   Estado de validación (Verificado/Incidencia).

---

### 🚀 Fase 5: Despliegue y Optimización
*Objetivo: Poner la web en producción con máximo rendimiento.*

1.  **Despliegue en Vercel** ⏳
    -   [x] Guía completa creada en `DEPLOYMENT.md`.
    -   [ ] **Acción del Usuario:** Crear repositorio Git y conectar con Vercel.
    -   [ ] **Acción del Usuario:** Configurar variables de entorno en Vercel:
        - `NEXT_PUBLIC_SUPABASE_URL`
        - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    -   [ ] Configurar dominio `scrutinia.com` en Vercel.

2.  **Optimización** ⏳
    -   [ ] Implementar **ISR (Incremental Static Regeneration)** en `/escrutinio`.
    -   [ ] Configurar caché de Edge para imágenes.
    -   [ ] Auditoría Lighthouse (SEO, Accesibilidad, Performance).

---

## ✅ Estado del Proyecto

**Fases Completadas:**
- ✅ Fase 1: Frontend migrado a Next.js
- ✅ Fase 2: Supabase integrado con Realtime
- ✅ Fase 3: Motor Electoral (D'Hondt) implementado
- ✅ Fase 4: Dashboard de Escrutinio funcional

**Pendiente:**
- ⏳ Fase 5: Despliegue en Vercel (requiere acción del usuario)

**URLs Locales:**
- Landing: http://localhost:3000
- Campus: http://localhost:3000/campus
- Escrutinio: http://localhost:3000/escrutinio
