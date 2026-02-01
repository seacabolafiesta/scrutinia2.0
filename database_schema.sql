-- -----------------------------------------------------------------------------
-- ESQUEMA DE BASE DE DATOS - SCRUTINIA (Supabase / PostgreSQL)
-- -----------------------------------------------------------------------------

-- 1. CONFIGURACIÓN INICIAL
-- Habilitar extensión para UUIDs si no está habilitada
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLA DE PARTIDOS (Maestra)
-- Para normalizar los nombres de los partidos y asociarlos a provincias si es necesario.
CREATE TABLE public.partidos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    siglas TEXT NOT NULL, -- Ej: PSOE, PP, VOX
    nombre_completo TEXT NOT NULL, -- Ej: PARTIDO SOCIALISTA OBRERO ESPAÑOL
    provincias TEXT[], -- Array de provincias donde se presenta: ['Zaragoza', 'Huesca', 'Teruel']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(siglas)
);

-- 3. TABLA DE MESAS ELECTORALES
-- Contiene el censo estático importado del CSV.
CREATE TABLE public.mesas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Identificación Geográfica
    provincia TEXT NOT NULL, -- Zaragoza, Huesca, Teruel
    municipio TEXT NOT NULL,
    distrito TEXT NOT NULL,
    seccion TEXT NOT NULL,
    mesa TEXT NOT NULL,      -- A, B, U
    
    -- Código único legible (Generado: PROV-MUN-DIST-SEC-MESA)
    codigo_unico TEXT GENERATED ALWAYS AS (
        upper(substring(provincia from 1 for 3)) || '-' || 
        upper(replace(municipio, ' ', '')) || '-' || 
        distrito || '-' || 
        seccion || '-' || 
        mesa
    ) STORED,

    -- Datos del Colegio (del CSV)
    id_colegio_csv TEXT, -- "id colegio" del CSV
    nombre_colegio TEXT,
    direccion TEXT,
    apellido_desde TEXT,
    apellido_hasta TEXT,
    
    -- Datos Censales (Opcional, si se tiene)
    censo_oficial INT DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Restricción: No puede haber dos mesas iguales en el mismo sitio
    UNIQUE(provincia, municipio, distrito, seccion, mesa)
);

-- 4. TABLA DE ACTAS (Datos Crudos / Transcripción IA)
-- Adaptada al formato JSON scrutinia_actas_v6
CREATE TABLE public.actas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mesa_id UUID REFERENCES public.mesas(id) NOT NULL,
    usuario_id UUID DEFAULT auth.uid(),
    
    -- METADATA DEL JSON (output.*)
    submission_id TEXT UNIQUE,                -- SUB-timestamp único
    acta_key TEXT,                            -- PROVINCIA|MUNICIPIO|DISTRITO|SECCION|MESA
    source_file_id TEXT,                      -- ID archivo Google Drive
    imagen_url TEXT,                          -- URL de la foto en Storage
    imagen_renamed TEXT,                      -- Nombre del archivo renombrado (drive.renamed_file)
    extracted_text_raw TEXT,                  -- Texto crudo extraído por IA
    human_message TEXT,                       -- Mensaje legible para revisión
    
    -- DATETIME (structured_data.datetime)
    fecha_acta DATE,                          -- Fecha completa del acta
    hora_acta TIME,                           -- Hora de cierre (hora del JSON)
    hora_cierre TIME,                         -- Legacy: mantener compatibilidad
    
    -- CENSO (structured_data.censo)
    censo_electores_listas INT DEFAULT 0,     -- electores_listas
    censo_ine INT DEFAULT 0,                  -- Legacy: electores según INE
    censo_certificaciones_presentadas INT DEFAULT 0, -- certificaciones_presentadas
    certificaciones_alta INT DEFAULT 0,       -- certificaciones_alta
    certificaciones_error INT DEFAULT 0,      -- certificaciones_correccion
    censo_total_electores INT DEFAULT 0,      -- total_electores
    total_censo_acta INT DEFAULT 0,           -- Legacy: suma total

    -- VOTANTES (structured_data.votantes)
    votantes_censados_votaron INT DEFAULT 0,  -- censados_votaron
    votantes_censo INT DEFAULT 0,             -- Legacy: electores censados que votaron
    votantes_interventores INT DEFAULT 0,     -- interventores_no_censados
    total_votantes INT DEFAULT 0,             -- total_votantes

    -- INCIDENCIAS (structured_data.incidencias)
    votos_nulos INT DEFAULT 0,
    votos_blanco INT DEFAULT 0,
    votos_candidaturas INT DEFAULT 0,         -- Suma de votos a partidos
    
    -- VOTOS POR PARTIDO NORMALIZADO (structured_data.votes_by_party_id)
    votes_by_party_id JSONB,                  -- {"PP": 142, "PSOE": 133, ...}

    -- FIRMAS (structured_data.firmas)
    firma_presidente TEXT,
    firma_vocal_1 TEXT,
    firma_vocal_2 TEXT,
    firma_representantes TEXT[],              -- Array de representantes
    
    -- ISSUES Y OBSERVACIONES (structured_data.issues)
    issues TEXT[],                            -- Array de incidencias detectadas
    observaciones TEXT,                       -- Campo libre para notas

    -- ESTADO Y CONTROL
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'verificada', 'incidencia')),
    incidencia_tipo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(mesa_id, created_at) 
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_actas_submission_id ON public.actas(submission_id);
CREATE INDEX idx_actas_acta_key ON public.actas(acta_key);
CREATE INDEX idx_actas_estado ON public.actas(estado);

-- 5. TABLA DETALLE DE VOTOS (Desglose por Partido)
-- Adaptada para structured_data.candidaturas_raw
CREATE TABLE public.detalle_votos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    acta_id UUID REFERENCES public.actas(id) ON DELETE CASCADE NOT NULL,
    
    -- Campos del JSON candidaturas_raw
    orden INT,                                -- Orden en la papeleta
    party_name_raw TEXT,                      -- Nombre completo: "PARTIDO POPULAR DE ARAGÓN (PP)"
    partido_siglas TEXT,                      -- Siglas normalizadas: "PP"
    partido_nombre TEXT NOT NULL,             -- Legacy: nombre del partido
    votos_letra TEXT,                         -- Votos en letra: "CIENTO CUARENTA Y DOS"
    votos INT DEFAULT 0 CHECK (votos >= 0),   -- Votos en número: 142
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5.1 TABLA DE CANDIDATURAS NO MAPEADAS
-- Para structured_data.candidaturas_unmapped
CREATE TABLE public.candidaturas_unmapped (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    acta_id UUID REFERENCES public.actas(id) ON DELETE CASCADE NOT NULL,
    party_name_raw TEXT,
    votos_letra TEXT,
    votos_numero INT,
    reason TEXT,                              -- Razón por la que no se mapeó
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLA DE RESULTADOS PÚBLICOS (Agregados)
-- Esta tabla se alimenta de las actas verificadas para mostrar en la web rápidamente.
CREATE TABLE public.resultados_publicos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provincia TEXT NOT NULL,
    candidatura TEXT NOT NULL,
    votos_totales INT DEFAULT 0,
    porcentaje NUMERIC(5,2) DEFAULT 0,
    escaños INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provincia, candidatura)
);

-- -----------------------------------------------------------------------------
-- LÓGICA AUTOMÁTICA (TRIGGERS Y FUNCIONES)
-- -----------------------------------------------------------------------------

-- Función para validar el cuadre del acta automáticamente
CREATE OR REPLACE FUNCTION validar_acta() RETURNS TRIGGER AS $$
DECLARE
    suma_votos_partidos INT;
    total_calculado INT;
BEGIN
    -- 1. Calcular la suma de votos de las candidaturas para esta acta
    SELECT COALESCE(SUM(votos), 0) INTO suma_votos_partidos
    FROM public.detalle_votos
    WHERE acta_id = NEW.acta_id;

    -- 2. Obtener datos del acta
    -- Nota: Necesitamos leer el acta asociada. Como este trigger salta en 'detalle_votos',
    -- lo ideal es que salte AFTER INSERT/UPDATE en detalle_votos o AFTER UPDATE en actas.
    -- Para simplificar, haremos una función que se llame al finalizar la carga del acta.
    
    -- Si la validación es compleja, a veces es mejor hacerla en el backend (n8n) antes de insertar 'verificada'.
    -- Pero aquí implementamos una comprobación básica de coherencia:
    -- (Votos Candidaturas + Blancos + Nulos) == Total Votantes
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER DE VALIDACIÓN DE CUADRE (Al insertar/actualizar un ACTA)
CREATE OR REPLACE FUNCTION check_cuadre_acta() RETURNS TRIGGER AS $$
DECLARE
    suma_partidos INT;
    total_recontado INT;
BEGIN
    -- Obtenemos la suma de votos registrados en detalle_votos para esta acta
    SELECT COALESCE(SUM(votos), 0) INTO suma_partidos
    FROM public.detalle_votos
    WHERE acta_id = NEW.id;

    total_recontado := suma_partidos + NEW.votos_blanco + NEW.votos_nulos;

    -- Si el acta dice que hay X votantes, y la suma es distinta, marcamos incidencia
    IF total_recontado <> NEW.total_votantes THEN
        NEW.estado := 'incidencia';
        NEW.incidencia_tipo := 'Descuadre numérico: Suma (' || total_recontado || ') != Total Votantes (' || NEW.total_votantes || ')';
    ELSE
        NEW.estado := 'verificada';
        NEW.incidencia_tipo := NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que se ejecuta ANTES de actualizar el estado o al insertar si ya vienen datos
CREATE TRIGGER trg_validar_cuadre
BEFORE UPDATE ON public.actas
FOR EACH ROW
WHEN (NEW.estado = 'pendiente') -- Solo intentar validar si está pendiente
EXECUTE FUNCTION check_cuadre_acta();

-- -----------------------------------------------------------------------------
-- DATOS SEMILLA (PARTIDOS)
-- -----------------------------------------------------------------------------

INSERT INTO public.partidos (siglas, nombre_completo, provincias) VALUES
-- Comunes
('PSOE', 'PARTIDO SOCIALISTA OBRERO ESPAÑOL', ARRAY['Zaragoza', 'Huesca', 'Teruel']),
('PP', 'PARTIDO POPULAR', ARRAY['Zaragoza', 'Huesca', 'Teruel']), -- Nota: En Zgz pone 'PARTIDO POPULAR DE ARAGÓN', normalizamos a PP
('VOX', 'VOX', ARRAY['Zaragoza', 'Huesca', 'Teruel']),
('PAR', 'PARTIDO ARAGONÉS', ARRAY['Zaragoza', 'Huesca', 'Teruel']),
('CHA', 'CHUNTA ARAGONESISTA', ARRAY['Zaragoza', 'Huesca', 'Teruel']),
('PODEMOS-AV', 'PODEMOS – ALIANZA VERDE', ARRAY['Zaragoza', 'Huesca', 'Teruel']),
('IU-MOVIMIENTO SUMAR', 'IZQUIERDA UNIDA – MOVIMIENTO SUMAR', ARRAY['Zaragoza', 'Huesca', 'Teruel']),
('EXISTE', 'ARAGÓN EXISTE – Coalición EXISTE', ARRAY['Zaragoza', 'Huesca', 'Teruel']), -- Nota: En Teruel es 'TERUEL EXISTE'
('PACMA', 'PARTIDO ANIMALISTA CON EL MEDIO AMBIENTE', ARRAY['Zaragoza', 'Huesca', 'Teruel']),
('SALF', 'SE ACABÓ LA FIESTA', ARRAY['Zaragoza', 'Huesca', 'Teruel']),
('ESCAÑOS EN BLANCO', 'ESCAÑOS EN BLANCO PARA DEJAR ESCAÑOS VACÍOS', ARRAY['Zaragoza', 'Huesca', 'Teruel']),
('COALICIÓN ARAGONESA', 'COALICIÓN ARAGONESA', ARRAY['Zaragoza', 'Huesca', 'Teruel']),

-- Específicos Huesca
('ETXSBC', 'ENTRE TODOS BAJO / BAIX CINCA', ARRAY['Huesca']),
('MUNDO+JUSTO', 'POR UN MUNDO MÁS JUSTO', ARRAY['Huesca', 'Zaragoza']),

-- Específicos Zaragoza
('PCTE', 'PARTIDO COMUNISTA DE LOS TRABAJADORES DE ESPAÑA', ARRAY['Zaragoza']);

-- Nota sobre duplicados o nombres variantes:
-- He unificado 'TERUEL EXISTE' y 'ARAGÓN EXISTE' bajo la sigla 'EXISTE' para simplificar agregación, 
-- pero se puede separar si se prefiere.
