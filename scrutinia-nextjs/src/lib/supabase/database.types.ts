export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      partidos: {
        Row: {
          id: string
          siglas: string
          nombre_completo: string
          provincias: string[] | null
          created_at: string | null
        }
        Insert: {
          id?: string
          siglas: string
          nombre_completo: string
          provincias?: string[] | null
          created_at?: string | null
        }
        Update: {
          id?: string
          siglas?: string
          nombre_completo?: string
          provincias?: string[] | null
          created_at?: string | null
        }
      }
      mesas: {
        Row: {
          id: string
          provincia: string
          municipio: string
          distrito: string
          seccion: string
          mesa: string
          codigo_unico: string | null
          id_colegio_csv: string | null
          nombre_colegio: string | null
          direccion: string | null
          apellido_desde: string | null
          apellido_hasta: string | null
          censo_oficial: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          provincia: string
          municipio: string
          distrito: string
          seccion: string
          mesa: string
          id_colegio_csv?: string | null
          nombre_colegio?: string | null
          direccion?: string | null
          apellido_desde?: string | null
          apellido_hasta?: string | null
          censo_oficial?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          provincia?: string
          municipio?: string
          distrito?: string
          seccion?: string
          mesa?: string
          id_colegio_csv?: string | null
          nombre_colegio?: string | null
          direccion?: string | null
          apellido_desde?: string | null
          apellido_hasta?: string | null
          censo_oficial?: number | null
          created_at?: string | null
        }
      }
      actas: {
        Row: {
          id: string
          mesa_id: string
          usuario_id: string | null
          // Metadata del JSON
          submission_id: string | null
          acta_key: string | null
          source_file_id: string | null
          imagen_url: string | null
          imagen_renamed: string | null
          extracted_text_raw: string | null
          human_message: string | null
          // Datetime
          fecha_acta: string | null
          hora_acta: string | null
          hora_cierre: string | null
          // Censo
          censo_electores_listas: number | null
          censo_ine: number | null
          censo_certificaciones_presentadas: number | null
          certificaciones_alta: number | null
          certificaciones_error: number | null
          censo_total_electores: number | null
          total_censo_acta: number | null
          // Votantes
          votantes_censados_votaron: number | null
          votantes_censo: number | null
          votantes_interventores: number | null
          total_votantes: number | null
          // Incidencias
          votos_nulos: number | null
          votos_blanco: number | null
          votos_candidaturas: number | null
          // Votos por partido
          votes_by_party_id: Record<string, number> | null
          // Firmas
          firma_presidente: string | null
          firma_vocal_1: string | null
          firma_vocal_2: string | null
          firma_representantes: string[] | null
          // Issues
          issues: string[] | null
          observaciones: string | null
          // Estado
          estado: string | null
          incidencia_tipo: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          mesa_id: string
          usuario_id?: string | null
          submission_id?: string | null
          acta_key?: string | null
          source_file_id?: string | null
          imagen_url?: string | null
          imagen_renamed?: string | null
          extracted_text_raw?: string | null
          human_message?: string | null
          fecha_acta?: string | null
          hora_acta?: string | null
          hora_cierre?: string | null
          censo_electores_listas?: number | null
          censo_ine?: number | null
          censo_certificaciones_presentadas?: number | null
          certificaciones_alta?: number | null
          certificaciones_error?: number | null
          censo_total_electores?: number | null
          total_censo_acta?: number | null
          votantes_censados_votaron?: number | null
          votantes_censo?: number | null
          votantes_interventores?: number | null
          total_votantes?: number | null
          votos_nulos?: number | null
          votos_blanco?: number | null
          votos_candidaturas?: number | null
          votes_by_party_id?: Record<string, number> | null
          firma_presidente?: string | null
          firma_vocal_1?: string | null
          firma_vocal_2?: string | null
          firma_representantes?: string[] | null
          issues?: string[] | null
          observaciones?: string | null
          estado?: string | null
          incidencia_tipo?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          mesa_id?: string
          usuario_id?: string | null
          submission_id?: string | null
          acta_key?: string | null
          source_file_id?: string | null
          imagen_url?: string | null
          imagen_renamed?: string | null
          extracted_text_raw?: string | null
          human_message?: string | null
          fecha_acta?: string | null
          hora_acta?: string | null
          hora_cierre?: string | null
          censo_electores_listas?: number | null
          censo_ine?: number | null
          censo_certificaciones_presentadas?: number | null
          certificaciones_alta?: number | null
          certificaciones_error?: number | null
          censo_total_electores?: number | null
          total_censo_acta?: number | null
          votantes_censados_votaron?: number | null
          votantes_censo?: number | null
          votantes_interventores?: number | null
          total_votantes?: number | null
          votos_nulos?: number | null
          votos_blanco?: number | null
          votos_candidaturas?: number | null
          votes_by_party_id?: Record<string, number> | null
          firma_presidente?: string | null
          firma_vocal_1?: string | null
          firma_vocal_2?: string | null
          firma_representantes?: string[] | null
          issues?: string[] | null
          observaciones?: string | null
          estado?: string | null
          incidencia_tipo?: string | null
          created_at?: string | null
        }
      }
      detalle_votos: {
        Row: {
          id: string
          acta_id: string
          orden: number | null
          party_name_raw: string | null
          partido_siglas: string | null
          partido_nombre: string
          votos_letra: string | null
          votos: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          acta_id: string
          orden?: number | null
          party_name_raw?: string | null
          partido_siglas?: string | null
          partido_nombre: string
          votos_letra?: string | null
          votos?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          acta_id?: string
          orden?: number | null
          party_name_raw?: string | null
          partido_siglas?: string | null
          partido_nombre?: string
          votos_letra?: string | null
          votos?: number | null
          created_at?: string | null
        }
      }
      candidaturas_unmapped: {
        Row: {
          id: string
          acta_id: string
          party_name_raw: string | null
          votos_letra: string | null
          votos_numero: number | null
          reason: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          acta_id: string
          party_name_raw?: string | null
          votos_letra?: string | null
          votos_numero?: number | null
          reason?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          acta_id?: string
          party_name_raw?: string | null
          votos_letra?: string | null
          votos_numero?: number | null
          reason?: string | null
          created_at?: string | null
        }
      }
      resultados_publicos: {
        Row: {
          id: string
          provincia: string
          candidatura: string
          votos_totales: number | null
          porcentaje: number | null
          escaños: number | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          provincia: string
          candidatura: string
          votos_totales?: number | null
          porcentaje?: number | null
          escaños?: number | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          provincia?: string
          candidatura?: string
          votos_totales?: number | null
          porcentaje?: number | null
          escaños?: number | null
          updated_at?: string | null
        }
      }
    }
  }
}
