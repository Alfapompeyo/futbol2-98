export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      match_lineups: {
        Row: {
          created_at: string
          formation: string
          id: string
          match_id: string
          positions: Json
        }
        Insert: {
          created_at?: string
          formation: string
          id?: string
          match_id: string
          positions?: Json
        }
        Update: {
          created_at?: string
          formation?: string
          id?: string
          match_id?: string
          positions?: Json
        }
        Relationships: [
          {
            foreignKeyName: "match_lineups_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      match_statistics: {
        Row: {
          assists: number | null
          comments: string | null
          created_at: string
          crosses: number | null
          goal_types: Json[] | null
          goals: number | null
          id: string
          match_id: string
          minutes_played: number | null
          player_id: string
          rating: number | null
          red_cards: number | null
          saves: number | null
          yellow_cards: number | null
        }
        Insert: {
          assists?: number | null
          comments?: string | null
          created_at?: string
          crosses?: number | null
          goal_types?: Json[] | null
          goals?: number | null
          id?: string
          match_id: string
          minutes_played?: number | null
          player_id: string
          rating?: number | null
          red_cards?: number | null
          saves?: number | null
          yellow_cards?: number | null
        }
        Update: {
          assists?: number | null
          comments?: string | null
          created_at?: string
          crosses?: number | null
          goal_types?: Json[] | null
          goals?: number | null
          id?: string
          match_id?: string
          minutes_played?: number | null
          player_id?: string
          rating?: number | null
          red_cards?: number | null
          saves?: number | null
          yellow_cards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "match_statistics_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_statistics_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          category_id: string
          created_at: string
          date: string
          id: string
          location: string | null
          opponent: string
        }
        Insert: {
          category_id: string
          created_at?: string
          date: string
          id?: string
          location?: string | null
          opponent: string
        }
        Update: {
          category_id?: string
          created_at?: string
          date?: string
          id?: string
          location?: string | null
          opponent?: string
        }
        Relationships: []
      }
      nextronic: {
        Row: {
          content: string | null
          created_at: string
          id: number
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      players: {
        Row: {
          age: number | null
          category_id: string
          created_at: string
          height: string | null
          id: string
          image_url: string | null
          name: string
          position: string | null
          weight: string | null
        }
        Insert: {
          age?: number | null
          category_id: string
          created_at?: string
          height?: string | null
          id?: string
          image_url?: string | null
          name: string
          position?: string | null
          weight?: string | null
        }
        Update: {
          age?: number | null
          category_id?: string
          created_at?: string
          height?: string | null
          id?: string
          image_url?: string | null
          name?: string
          position?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          apellido1: string | null
          apellido2: string | null
          created_at: string
          id: string
          nombre: string | null
          user_id: string | null
          usuario: string | null
        }
        Insert: {
          apellido1?: string | null
          apellido2?: string | null
          created_at?: string
          id?: string
          nombre?: string | null
          user_id?: string | null
          usuario?: string | null
        }
        Update: {
          apellido1?: string | null
          apellido2?: string | null
          created_at?: string
          id?: string
          nombre?: string | null
          user_id?: string | null
          usuario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_emails"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          apellido1: string
          apellido2: string
          areas: Database["public"]["Enums"]["staff_area"][] | null
          category_ids: string[] | null
          created_at: string
          email: string
          id: string
          is_admin: boolean | null
          nombre: string
          password: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          apellido1: string
          apellido2: string
          areas?: Database["public"]["Enums"]["staff_area"][] | null
          category_ids?: string[] | null
          created_at?: string
          email: string
          id?: string
          is_admin?: boolean | null
          nombre: string
          password: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          apellido1?: string
          apellido2?: string
          areas?: Database["public"]["Enums"]["staff_area"][] | null
          category_ids?: string[] | null
          created_at?: string
          email?: string
          id?: string
          is_admin?: boolean | null
          nombre?: string
          password?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      user_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          password: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      staff_area: "MEDICA" | "FISICA" | "FUTBOL"
      user_role:
        | "administrador"
        | "jefe_tecnico"
        | "entrenador"
        | "kinesiologo"
        | "medico"
        | "psicologo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
