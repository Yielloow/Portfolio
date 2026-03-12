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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      partners: {
        Row: {
          created_at: string | null
          id: string
          logo: string | null
          name: string
          sort_order: number | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo?: string | null
          name: string
          sort_order?: number | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo?: string | null
          name?: string
          sort_order?: number | null
          url?: string | null
        }
        Relationships: []
      }
      profile: {
        Row: {
          cv_en: string | null
          cv_fr: string | null
          description: string | null
          description_en: string | null
          email: string | null
          first_name: string
          github: string | null
          id: string
          last_name: string
          linkedin: string | null
          location: string | null
          location_en: string | null
          partners_enabled: boolean | null
          photo: string | null
          skills_enabled: boolean | null
          tagline: string | null
          tagline_en: string | null
          testimonials_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          cv_en?: string | null
          cv_fr?: string | null
          description?: string | null
          description_en?: string | null
          email?: string | null
          first_name?: string
          github?: string | null
          id?: string
          last_name?: string
          linkedin?: string | null
          location?: string | null
          location_en?: string | null
          partners_enabled?: boolean | null
          photo?: string | null
          skills_enabled?: boolean | null
          tagline?: string | null
          tagline_en?: string | null
          testimonials_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          cv_en?: string | null
          cv_fr?: string | null
          description?: string | null
          description_en?: string | null
          email?: string | null
          first_name?: string
          github?: string | null
          id?: string
          last_name?: string
          linkedin?: string | null
          location?: string | null
          location_en?: string | null
          partners_enabled?: boolean | null
          photo?: string | null
          skills_enabled?: boolean | null
          tagline?: string | null
          tagline_en?: string | null
          testimonials_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string
          description_en: string | null
          domain: string
          domain_en: string | null
          hours: number | null
          id: string
          images: string[] | null
          link: string | null
          skills: string[] | null
          sort_order: number | null
          title: string
          title_en: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string
          description_en?: string | null
          domain?: string
          domain_en?: string | null
          hours?: number | null
          id?: string
          images?: string[] | null
          link?: string | null
          skills?: string[] | null
          sort_order?: number | null
          title: string
          title_en?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          description_en?: string | null
          domain?: string
          domain_en?: string | null
          hours?: number | null
          id?: string
          images?: string[] | null
          link?: string | null
          skills?: string[] | null
          sort_order?: number | null
          title?: string
          title_en?: string | null
        }
        Relationships: []
      }
      skill_hours: {
        Row: {
          hours: number | null
          id: string
          skill: string
        }
        Insert: {
          hours?: number | null
          id?: string
          skill: string
        }
        Update: {
          hours?: number | null
          id?: string
          skill?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved: boolean | null
          created_at: string | null
          id: string
          message: string
          name: string
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          id?: string
          message: string
          name: string
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      timeline: {
        Row: {
          created_at: string | null
          description: string | null
          description_en: string | null
          end_date: string
          id: string
          organization: string
          organization_en: string | null
          sort_order: number | null
          start_date: string
          title: string
          title_en: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          description_en?: string | null
          end_date?: string
          id?: string
          organization?: string
          organization_en?: string | null
          sort_order?: number | null
          start_date?: string
          title: string
          title_en?: string | null
          type?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          description_en?: string | null
          end_date?: string
          id?: string
          organization?: string
          organization_en?: string | null
          sort_order?: number | null
          start_date?: string
          title?: string
          title_en?: string | null
          type?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
