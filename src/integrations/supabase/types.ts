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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          ayah_context: string | null
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          ayah_context?: string | null
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          ayah_context?: string | null
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ayah_interactions: {
        Row: {
          ayah_number: number
          created_at: string
          id: string
          interaction_type: string
          surah_number: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ayah_number: number
          created_at?: string
          id?: string
          interaction_type: string
          surah_number: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ayah_number?: number
          created_at?: string
          id?: string
          interaction_type?: string
          surah_number?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          ayah_number: number | null
          bookmark_type: string
          created_at: string
          id: string
          surah_number: number
          user_id: string
        }
        Insert: {
          ayah_number?: number | null
          bookmark_type: string
          created_at?: string
          id?: string
          surah_number: number
          user_id: string
        }
        Update: {
          ayah_number?: number | null
          bookmark_type?: string
          created_at?: string
          id?: string
          surah_number?: number
          user_id?: string
        }
        Relationships: []
      }
      dua_bookmarks: {
        Row: {
          category: string | null
          created_at: string
          dua_arabic: string | null
          dua_english: string | null
          dua_title: string
          dua_transliteration: string | null
          id: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          dua_arabic?: string | null
          dua_english?: string | null
          dua_title: string
          dua_transliteration?: string | null
          id?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          dua_arabic?: string | null
          dua_english?: string | null
          dua_title?: string
          dua_transliteration?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      hadith_bookmarks: {
        Row: {
          book_name: string | null
          book_slug: string
          chapter_arabic: string | null
          chapter_english: string | null
          created_at: string
          hadith_arabic: string | null
          hadith_english: string | null
          hadith_number: number
          id: string
          narrator: string | null
          user_id: string
        }
        Insert: {
          book_name?: string | null
          book_slug: string
          chapter_arabic?: string | null
          chapter_english?: string | null
          created_at?: string
          hadith_arabic?: string | null
          hadith_english?: string | null
          hadith_number: number
          id?: string
          narrator?: string | null
          user_id: string
        }
        Update: {
          book_name?: string | null
          book_slug?: string
          chapter_arabic?: string | null
          chapter_english?: string | null
          created_at?: string
          hadith_arabic?: string | null
          hadith_english?: string | null
          hadith_number?: number
          id?: string
          narrator?: string | null
          user_id?: string
        }
        Relationships: []
      }
      last_viewed_surah: {
        Row: {
          id: string
          surah_number: number
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          surah_number: number
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          surah_number?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reading_progress: {
        Row: {
          ayah_number: number
          created_at: string | null
          id: string
          progress_type: string | null
          surah_number: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ayah_number: number
          created_at?: string | null
          id?: string
          progress_type?: string | null
          surah_number: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ayah_number?: number
          created_at?: string | null
          id?: string
          progress_type?: string | null
          surah_number?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          font_type: string | null
          id: string
          language: string | null
          prayer_time_region: string | null
          reading_tracking_mode: string | null
          tafsir_enabled: boolean | null
          tafsir_source: string | null
          tajweed_enabled: boolean | null
          theme_color: string | null
          theme_mode: string | null
          translation_enabled: boolean | null
          translation_source: string | null
          updated_at: string | null
          user_id: string
          word_by_word_display: string | null
        }
        Insert: {
          created_at?: string | null
          font_type?: string | null
          id?: string
          language?: string | null
          prayer_time_region?: string | null
          reading_tracking_mode?: string | null
          tafsir_enabled?: boolean | null
          tafsir_source?: string | null
          tajweed_enabled?: boolean | null
          theme_color?: string | null
          theme_mode?: string | null
          translation_enabled?: boolean | null
          translation_source?: string | null
          updated_at?: string | null
          user_id: string
          word_by_word_display?: string | null
        }
        Update: {
          created_at?: string | null
          font_type?: string | null
          id?: string
          language?: string | null
          prayer_time_region?: string | null
          reading_tracking_mode?: string | null
          tafsir_enabled?: boolean | null
          tafsir_source?: string | null
          tajweed_enabled?: boolean | null
          theme_color?: string | null
          theme_mode?: string | null
          translation_enabled?: boolean | null
          translation_source?: string | null
          updated_at?: string | null
          user_id?: string
          word_by_word_display?: string | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string | null
          days_opened_this_year: number | null
          id: string
          last_opened_date: string | null
          surahs_read: number | null
          times_opened_this_month: number | null
          times_opened_this_year: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          days_opened_this_year?: number | null
          id?: string
          last_opened_date?: string | null
          surahs_read?: number | null
          times_opened_this_month?: number | null
          times_opened_this_year?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          days_opened_this_year?: number | null
          id?: string
          last_opened_date?: string | null
          surahs_read?: number | null
          times_opened_this_month?: number | null
          times_opened_this_year?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_zakat_data: {
        Row: {
          business_assets: number | null
          cash_bank: number | null
          created_at: string | null
          crypto: number | null
          currency: string | null
          gold_grams: number | null
          gold_price_per_gram: number | null
          id: string
          investments: number | null
          liabilities: number | null
          nisab_basis: string | null
          receivables: number | null
          silver_grams: number | null
          silver_price_per_gram: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_assets?: number | null
          cash_bank?: number | null
          created_at?: string | null
          crypto?: number | null
          currency?: string | null
          gold_grams?: number | null
          gold_price_per_gram?: number | null
          id?: string
          investments?: number | null
          liabilities?: number | null
          nisab_basis?: string | null
          receivables?: number | null
          silver_grams?: number | null
          silver_price_per_gram?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_assets?: number | null
          cash_bank?: number | null
          created_at?: string | null
          crypto?: number | null
          currency?: string | null
          gold_grams?: number | null
          gold_price_per_gram?: number | null
          id?: string
          investments?: number | null
          liabilities?: number | null
          nisab_basis?: string | null
          receivables?: number | null
          silver_grams?: number | null
          silver_price_per_gram?: number | null
          updated_at?: string | null
          user_id?: string
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
