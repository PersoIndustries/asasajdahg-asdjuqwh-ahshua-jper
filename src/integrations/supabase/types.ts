export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      noticias: {
        Row: {
          autor: string
          categoria: string
          created_at: string
          destacada: boolean
          entradilla: string
          fecha: string
          id: string
          imagen_url: string | null
          minutos: number
          publicado: boolean
          resumen: string
          secciones: Json
          slug: string
          tags: string[]
          titulo: string
          updated_at: string
        }
        Insert: {
          autor?: string
          categoria?: string
          created_at?: string
          destacada?: boolean
          entradilla?: string
          fecha?: string
          id?: string
          imagen_url?: string | null
          minutos?: number
          publicado?: boolean
          resumen?: string
          secciones?: Json
          slug: string
          tags?: string[]
          titulo: string
          updated_at?: string
        }
        Update: {
          autor?: string
          categoria?: string
          created_at?: string
          destacada?: boolean
          entradilla?: string
          fecha?: string
          id?: string
          imagen_url?: string | null
          minutos?: number
          publicado?: boolean
          resumen?: string
          secciones?: Json
          slug?: string
          tags?: string[]
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      plaga_imagenes: {
        Row: {
          created_at: string
          id: string
          imagen_url: string
          orden: number
          plaga_id: string
          tag: string
        }
        Insert: {
          created_at?: string
          id?: string
          imagen_url: string
          orden?: number
          plaga_id: string
          tag?: string
        }
        Update: {
          created_at?: string
          id?: string
          imagen_url?: string
          orden?: number
          plaga_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "plaga_imagenes_plaga_id_fkey"
            columns: ["plaga_id"]
            isOneToOne: false
            referencedRelation: "plagas"
            referencedColumns: ["id"]
          },
        ]
      }
      plagas: {
        Row: {
          combate: string
          created_at: string
          descripcion: string
          id: string
          imagen_url: string | null
          nombre: string
          otros_datos: string
          prevencion: string
          slug: string
          updated_at: string
        }
        Insert: {
          combate?: string
          created_at?: string
          descripcion?: string
          id?: string
          imagen_url?: string | null
          nombre: string
          otros_datos?: string
          prevencion?: string
          slug: string
          updated_at?: string
        }
        Update: {
          combate?: string
          created_at?: string
          descripcion?: string
          id?: string
          imagen_url?: string | null
          nombre?: string
          otros_datos?: string
          prevencion?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      planta_calendario: {
        Row: {
          ciclo: string | null
          created_at: string
          id: string
          meses: string[]
          orden: number
          planta_id: string | null
          planta_nombre: string
          updated_at: string
        }
        Insert: {
          ciclo?: string | null
          created_at?: string
          id?: string
          meses?: string[]
          orden?: number
          planta_id?: string | null
          planta_nombre: string
          updated_at?: string
        }
        Update: {
          ciclo?: string | null
          created_at?: string
          id?: string
          meses?: string[]
          orden?: number
          planta_id?: string | null
          planta_nombre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "planta_calendario_planta_id_fkey"
            columns: ["planta_id"]
            isOneToOne: false
            referencedRelation: "plantas"
            referencedColumns: ["id"]
          },
        ]
      }
      planta_enfermedades: {
        Row: {
          combate: string
          created_at: string
          id: string
          imagen_url: string | null
          nombre: string
          orden: number
          planta_id: string
        }
        Insert: {
          combate?: string
          created_at?: string
          id?: string
          imagen_url?: string | null
          nombre: string
          orden?: number
          planta_id: string
        }
        Update: {
          combate?: string
          created_at?: string
          id?: string
          imagen_url?: string | null
          nombre?: string
          orden?: number
          planta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planta_enfermedades_planta_id_fkey"
            columns: ["planta_id"]
            isOneToOne: false
            referencedRelation: "plantas"
            referencedColumns: ["id"]
          },
        ]
      }
      planta_plagas: {
        Row: {
          created_at: string
          id: string
          orden: number
          plaga_id: string
          planta_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          orden?: number
          plaga_id: string
          planta_id: string
        }
        Update: {
          created_at?: string
          id?: string
          orden?: number
          plaga_id?: string
          planta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planta_plagas_plaga_id_fkey"
            columns: ["plaga_id"]
            isOneToOne: false
            referencedRelation: "plagas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planta_plagas_planta_id_fkey"
            columns: ["planta_id"]
            isOneToOne: false
            referencedRelation: "plantas"
            referencedColumns: ["id"]
          },
        ]
      }
      plantas: {
        Row: {
          calendario_key: string | null
          categoria: string
          como_se_come: string | null
          created_at: string
          curiosidades: string | null
          descripcion: string
          es_temporada: boolean
          guia_id: string | null
          id: string
          imagen_url: string | null
          nombre: string
          nombre_cientifico: string | null
          orden: number
          publicado: boolean
          slug: string
          temporada: string | null
          updated_at: string
        }
        Insert: {
          calendario_key?: string | null
          categoria?: string
          como_se_come?: string | null
          created_at?: string
          curiosidades?: string | null
          descripcion?: string
          es_temporada?: boolean
          guia_id?: string | null
          id?: string
          imagen_url?: string | null
          nombre: string
          nombre_cientifico?: string | null
          orden?: number
          publicado?: boolean
          slug: string
          temporada?: string | null
          updated_at?: string
        }
        Update: {
          calendario_key?: string | null
          categoria?: string
          como_se_come?: string | null
          created_at?: string
          curiosidades?: string | null
          descripcion?: string
          es_temporada?: boolean
          guia_id?: string | null
          id?: string
          imagen_url?: string | null
          nombre?: string
          nombre_cientifico?: string | null
          orden?: number
          publicado?: boolean
          slug?: string
          temporada?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          nombre: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          nombre?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nombre?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
