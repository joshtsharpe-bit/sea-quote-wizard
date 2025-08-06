export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      yacht_charter_submissions: {
        Row: {
          amenities: string[] | null
          appointment_date: string | null
          appointment_time: string | null
          budget_max: number | null
          budget_min: number | null
          consultation_requested: boolean | null
          contact_methods: string[] | null
          created_at: string
          destination_base_price: number | null
          destination_countries: string[] | null
          destination_image: string | null
          destination_name: string | null
          destination_region: string | null
          duration: number | null
          email: string | null
          end_date: string | null
          first_name: string | null
          guest_types: string[] | null
          guests: number | null
          has_chartered: boolean | null
          id: string
          is_bareboat_charter: boolean | null
          is_completed: boolean | null
          last_name: string | null
          phone: string | null
          preferred_date: string | null
          preferred_time: string | null
          reasons: string[] | null
          special_requests: string | null
          start_date: string | null
          submitted_at: string | null
          updated_at: string
          yacht_capacity: number | null
          yacht_id: string | null
          yacht_image: string | null
          yacht_name: string | null
          yacht_price_multiplier: number | null
          yacht_type: string | null
        }
        Insert: {
          amenities?: string[] | null
          appointment_date?: string | null
          appointment_time?: string | null
          budget_max?: number | null
          budget_min?: number | null
          consultation_requested?: boolean | null
          contact_methods?: string[] | null
          created_at?: string
          destination_base_price?: number | null
          destination_countries?: string[] | null
          destination_image?: string | null
          destination_name?: string | null
          destination_region?: string | null
          duration?: number | null
          email?: string | null
          end_date?: string | null
          first_name?: string | null
          guest_types?: string[] | null
          guests?: number | null
          has_chartered?: boolean | null
          id?: string
          is_bareboat_charter?: boolean | null
          is_completed?: boolean | null
          last_name?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          reasons?: string[] | null
          special_requests?: string | null
          start_date?: string | null
          submitted_at?: string | null
          updated_at?: string
          yacht_capacity?: number | null
          yacht_id?: string | null
          yacht_image?: string | null
          yacht_name?: string | null
          yacht_price_multiplier?: number | null
          yacht_type?: string | null
        }
        Update: {
          amenities?: string[] | null
          appointment_date?: string | null
          appointment_time?: string | null
          budget_max?: number | null
          budget_min?: number | null
          consultation_requested?: boolean | null
          contact_methods?: string[] | null
          created_at?: string
          destination_base_price?: number | null
          destination_countries?: string[] | null
          destination_image?: string | null
          destination_name?: string | null
          destination_region?: string | null
          duration?: number | null
          email?: string | null
          end_date?: string | null
          first_name?: string | null
          guest_types?: string[] | null
          guests?: number | null
          has_chartered?: boolean | null
          id?: string
          is_bareboat_charter?: boolean | null
          is_completed?: boolean | null
          last_name?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          reasons?: string[] | null
          special_requests?: string | null
          start_date?: string | null
          submitted_at?: string | null
          updated_at?: string
          yacht_capacity?: number | null
          yacht_id?: string | null
          yacht_image?: string | null
          yacht_name?: string | null
          yacht_price_multiplier?: number | null
          yacht_type?: string | null
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
