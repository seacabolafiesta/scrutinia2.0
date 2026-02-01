# Supabase - Scrutinia Database Schema

## 📋 Información del Proyecto

- **Project ID:** `jqfwnvtxakilaqwfyjcf`
- **URL:** `https://jqfwnvtxakilaqwfyjcf.supabase.co`
- **Schema Version:** `scrutinia_actas_v6`

---

## 📊 Estructura de Tablas

### 1. `partidos` - Tabla Maestra de Partidos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK, auto-generado |
| `siglas` | TEXT | Ej: PP, PSOE, VOX (UNIQUE) |
| `nombre_completo` | TEXT | Nombre oficial completo |
| `provincias` | TEXT[] | Array de provincias donde se presenta |
| `created_at` | TIMESTAMPTZ | Fecha de creación |

---

### 2. `mesas` - Mesas Electorales (Censo)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK, auto-generado |
| `provincia` | TEXT | Zaragoza, Huesca, Teruel |
| `municipio` | TEXT | Nombre del municipio |
| `distrito` | TEXT | Código de distrito censal |
| `seccion` | TEXT | Código de sección |
| `mesa` | TEXT | Letra de mesa (A, B, U, A-K...) |
| `codigo_unico` | TEXT | Generado: `ZAR-ZARAGOZA-05-043-A` |
| `id_colegio_csv` | TEXT | ID del CSV original |
| `nombre_colegio` | TEXT | Nombre del colegio electoral |
| `direccion` | TEXT | Dirección física |
| `apellido_desde` | TEXT | Rango de apellidos (desde) |
| `apellido_hasta` | TEXT | Rango de apellidos (hasta) |
| `censo_oficial` | INT | Número de electores censados |
| `created_at` | TIMESTAMPTZ | Fecha de creación |

**Índice único:** `(provincia, municipio, distrito, seccion, mesa)`

---

### 3. `actas` - Actas Electorales (JSON v6)

#### Metadata
| Campo | Tipo | JSON Path | Descripción |
|-------|------|-----------|-------------|
| `id` | UUID | - | PK, auto-generado |
| `mesa_id` | UUID | - | FK a `mesas` |
| `submission_id` | TEXT | `output.submission_id` | ID único de envío (UNIQUE) |
| `acta_key` | TEXT | `output.acta_key` | `PROVINCIA\|MUNICIPIO\|DISTRITO\|SECCION\|MESA` |
| `source_file_id` | TEXT | `output.source_file_id` | ID archivo Google Drive |
| `imagen_url` | TEXT | - | URL en Supabase Storage |
| `imagen_renamed` | TEXT | `output.drive.renamed_file` | Nombre de archivo renombrado |
| `extracted_text_raw` | TEXT | `output.extracted_text_raw` | OCR completo de la IA |
| `human_message` | TEXT | `output.human_message` | Mensaje para revisión humana |

#### Datetime
| Campo | Tipo | JSON Path | Descripción |
|-------|------|-----------|-------------|
| `fecha_acta` | DATE | `structured_data.datetime.*` | Fecha completa del acta |
| `hora_acta` | TIME | `structured_data.datetime.hora` | Hora de cierre |

#### Censo
| Campo | Tipo | JSON Path | Descripción |
|-------|------|-----------|-------------|
| `censo_electores_listas` | INT | `structured_data.censo.electores_listas` | Electores según listas |
| `censo_certificaciones_presentadas` | INT | `structured_data.censo.certificaciones_presentadas` | Certificaciones presentadas |
| `certificaciones_alta` | INT | `structured_data.censo.certificaciones_alta` | Altas por certificación |
| `certificaciones_error` | INT | `structured_data.censo.certificaciones_correccion` | Correcciones |
| `censo_total_electores` | INT | `structured_data.censo.total_electores` | Total electores |

#### Votantes
| Campo | Tipo | JSON Path | Descripción |
|-------|------|-----------|-------------|
| `votantes_censados_votaron` | INT | `structured_data.votantes.censados_votaron` | Electores que votaron |
| `votantes_interventores` | INT | `structured_data.votantes.interventores_no_censados` | Interventores |
| `total_votantes` | INT | `structured_data.votantes.total_votantes` | Total votantes |

#### Incidencias
| Campo | Tipo | JSON Path | Descripción |
|-------|------|-----------|-------------|
| `votos_nulos` | INT | `structured_data.incidencias.votos_nulos` | Votos nulos |
| `votos_blanco` | INT | `structured_data.incidencias.votos_blanco` | Votos en blanco |
| `votos_candidaturas` | INT | - | Suma calculada de votos a partidos |

#### Votos por Partido
| Campo | Tipo | JSON Path | Descripción |
|-------|------|-----------|-------------|
| `votes_by_party_id` | JSONB | `structured_data.votes_by_party_id` | `{"PP": 142, "PSOE": 133, ...}` |

#### Firmas
| Campo | Tipo | JSON Path | Descripción |
|-------|------|-----------|-------------|
| `firma_presidente` | TEXT | `structured_data.firmas.presidente` | Nombre del presidente |
| `firma_vocal_1` | TEXT | `structured_data.firmas.vocal_1` | Nombre vocal 1 |
| `firma_vocal_2` | TEXT | `structured_data.firmas.vocal_2` | Nombre vocal 2 |
| `firma_representantes` | TEXT[] | `structured_data.firmas.representantes` | Array de representantes |

#### Issues y Estado
| Campo | Tipo | JSON Path | Descripción |
|-------|------|-----------|-------------|
| `issues` | TEXT[] | `structured_data.issues` | Array de incidencias IA |
| `observaciones` | TEXT | - | Notas adicionales |
| `estado` | TEXT | - | `pendiente`, `verificada`, `incidencia` |
| `incidencia_tipo` | TEXT | - | Descripción del error |

---

### 4. `detalle_votos` - Desglose por Partido

| Campo | Tipo | JSON Path | Descripción |
|-------|------|-----------|-------------|
| `id` | UUID | - | PK |
| `acta_id` | UUID | - | FK a `actas` |
| `orden` | INT | `candidaturas_raw[].orden` | Posición en papeleta |
| `party_name_raw` | TEXT | `candidaturas_raw[].party_name_raw` | Nombre completo con siglas |
| `partido_siglas` | TEXT | - | Siglas normalizadas (PP, PSOE...) |
| `partido_nombre` | TEXT | - | Nombre limpio |
| `votos_letra` | TEXT | `candidaturas_raw[].votos_letra` | "CIENTO CUARENTA Y DOS" |
| `votos` | INT | `candidaturas_raw[].votos_numero` | 142 |

---

### 5. `candidaturas_unmapped` - Partidos No Mapeados

| Campo | Tipo | JSON Path | Descripción |
|-------|------|-----------|-------------|
| `id` | UUID | - | PK |
| `acta_id` | UUID | - | FK a `actas` |
| `party_name_raw` | TEXT | `candidaturas_unmapped[].party_name_raw` | Nombre original |
| `votos_letra` | TEXT | `candidaturas_unmapped[].votos_letra` | Votos en texto |
| `votos_numero` | INT | `candidaturas_unmapped[].votos_numero` | Votos en número |
| `reason` | TEXT | `candidaturas_unmapped[].reason` | Razón del fallo |

---

### 6. `resultados_publicos` - Agregados para Dashboard

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK |
| `provincia` | TEXT | Zaragoza, Huesca, Teruel |
| `candidatura` | TEXT | Siglas del partido |
| `votos_totales` | INT | Suma de votos |
| `porcentaje` | NUMERIC(5,2) | % sobre votos válidos |
| `escaños` | INT | Escaños asignados (D'Hondt) |
| `updated_at` | TIMESTAMPTZ | Última actualización |

---

## 🔄 Mapeo JSON → Base de Datos

```
output.submission_id          → actas.submission_id
output.acta_key               → actas.acta_key
output.source_file_id         → actas.source_file_id
output.drive.renamed_file     → actas.imagen_renamed
output.extracted_text_raw     → actas.extracted_text_raw
output.human_message          → actas.human_message

structured_data.scope.*       → Buscar/crear en tabla `mesas`
structured_data.datetime.*    → actas.fecha_acta, actas.hora_acta
structured_data.censo.*       → actas.censo_*
structured_data.votantes.*    → actas.votantes_*, actas.total_votantes
structured_data.incidencias.* → actas.votos_nulos, actas.votos_blanco
structured_data.votes_by_party_id → actas.votes_by_party_id (JSONB)
structured_data.candidaturas_raw[] → tabla `detalle_votos`
structured_data.candidaturas_unmapped[] → tabla `candidaturas_unmapped`
structured_data.firmas.*      → actas.firma_*
structured_data.issues[]      → actas.issues
```

---

## 📝 Migraciones Aplicadas

### `adapt_schema_to_scrutinia_json_v6` (2026-02-01)
- Añadidos campos de metadata a `actas`
- Añadidos campos de censo y votantes expandidos
- Añadido campo `votes_by_party_id` JSONB
- Añadidos campos de firmas
- Añadido array `issues`
- Creada tabla `candidaturas_unmapped`
- Añadidos índices de búsqueda
- Constraint UNIQUE en `submission_id`

---

## 🔐 Políticas RLS (Row Level Security)

**Estado actual:** RLS deshabilitado en todas las tablas.

**Recomendación para producción:**
```sql
-- Habilitar RLS
ALTER TABLE public.actas ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública
CREATE POLICY "Lectura pública de actas verificadas"
ON public.actas FOR SELECT
USING (estado = 'verificada');

-- Política de inserción para usuarios autenticados
CREATE POLICY "Inserción para autenticados"
ON public.actas FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
```

---

## 🔗 Realtime

**Tablas con Realtime habilitado:**
- `resultados_publicos` - Para actualización en vivo del dashboard
- `actas` - Para notificaciones de nuevas actas

**Configurar en:** Dashboard → Database → Replication
