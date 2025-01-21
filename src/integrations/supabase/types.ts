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
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          opponent: string
          date: string
          location: string | null
          category_id: string
          season_id: string
          created_at: string
        }
        Insert: {
          id?: string
          opponent: string
          date: string
          location?: string | null
          category_id: string
          season_id: string
          created_at?: string
        }
        Update: {
          id?: string
          opponent?: string
          date?: string
          location?: string | null
          category_id?: string
          season_id?: string
          created_at?: string
        }
      }
      seasons: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      players: {
        Row: {
          id: string
          name: string
          number: number
          position: string
          category_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          number: number
          position: string
          category_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          number?: number
          position?: string
          category_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']