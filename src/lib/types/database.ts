// AUTHORITATIVE Supabase types — generated from the live project schema.
// Regenerate after any schema change with:
//   supabase gen types typescript --linked > src/lib/types/database.ts
// (or via the Supabase MCP `generate_typescript_types` tool)

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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      assessment_questions: {
        Row: {
          correct_index: number
          created_at: string
          id: string
          options: Json
          ordinal: number
          prompt: string
          rationale: string
          set_id: string
          tags: string[]
        }
        Insert: {
          correct_index: number
          created_at?: string
          id?: string
          options?: Json
          ordinal?: number
          prompt: string
          rationale?: string
          set_id: string
          tags?: string[]
        }
        Update: {
          correct_index?: number
          created_at?: string
          id?: string
          options?: Json
          ordinal?: number
          prompt?: string
          rationale?: string
          set_id?: string
          tags?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "assessment_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_sets: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          level: string
          published: boolean
          raw_text: string | null
          scope: string
          source: string
          subject_id: string | null
          subject_title: string | null
          subtopic_id: string | null
          subtopic_title: string | null
          title: string
          topic_id: string | null
          topic_title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          level?: string
          published?: boolean
          raw_text?: string | null
          scope: string
          source: string
          subject_id?: string | null
          subject_title?: string | null
          subtopic_id?: string | null
          subtopic_title?: string | null
          title: string
          topic_id?: string | null
          topic_title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          level?: string
          published?: boolean
          raw_text?: string | null
          scope?: string
          source?: string
          subject_id?: string | null
          subject_title?: string | null
          subtopic_id?: string | null
          subtopic_title?: string | null
          title?: string
          topic_id?: string | null
          topic_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      calculator_drill_progress: {
        Row: {
          attempted_count: number
          correct_count: number
          created_at: string
          drill_id: string
          last_answer: string
          last_attempted_at: string | null
          level: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempted_count?: number
          correct_count?: number
          created_at?: string
          drill_id: string
          last_answer?: string
          last_attempted_at?: string | null
          level?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempted_count?: number
          correct_count?: number
          created_at?: string
          drill_id?: string
          last_answer?: string
          last_attempted_at?: string | null
          level?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      custom_flashcards: {
        Row: {
          answer: string
          created_at: string
          id: string
          level: string
          memory_hook: string
          module: string
          prompt: string
          subject: string
          tags: string[]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          level?: string
          memory_hook?: string
          module?: string
          prompt: string
          subject: string
          tags?: string[]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          level?: string
          memory_hook?: string
          module?: string
          prompt?: string
          subject?: string
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcard_progress: {
        Row: {
          bookmarked: boolean
          card_id: string
          confidence: number | null
          created_at: string
          known: boolean
          last_reviewed_at: string | null
          level: string
          review_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bookmarked?: boolean
          card_id: string
          confidence?: number | null
          created_at?: string
          known?: boolean
          last_reviewed_at?: string | null
          level?: string
          review_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bookmarked?: boolean
          card_id?: string
          confidence?: number | null
          created_at?: string
          known?: boolean
          last_reviewed_at?: string | null
          level?: string
          review_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          exam_date: string | null
          id: string
          is_admin: boolean
          onboarding_completed: boolean
          preferred_pacing: string | null
          preferred_rest_days: string[] | null
          preferred_session_minutes: number | null
          target_study_hours: number | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          exam_date?: string | null
          id: string
          is_admin?: boolean
          onboarding_completed?: boolean
          preferred_pacing?: string | null
          preferred_rest_days?: string[] | null
          preferred_session_minutes?: number | null
          target_study_hours?: number | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          exam_date?: string | null
          id?: string
          is_admin?: boolean
          onboarding_completed?: boolean
          preferred_pacing?: string | null
          preferred_rest_days?: string[] | null
          preferred_session_minutes?: number | null
          target_study_hours?: number | null
          username?: string | null
        }
        Relationships: []
      }
      revision_library_notes: {
        Row: {
          concept: string
          created_at: string
          formulas: Json
          id: string
          level: string
          module: string
          quick_recall: string
          sort_order: number
          subject: string
          tags: Json
          terms: Json
          trap: string
          updated_at: string
        }
        Insert: {
          concept: string
          created_at?: string
          formulas?: Json
          id: string
          level?: string
          module: string
          quick_recall?: string
          sort_order: number
          subject: string
          tags?: Json
          terms?: Json
          trap?: string
          updated_at?: string
        }
        Update: {
          concept?: string
          created_at?: string
          formulas?: Json
          id?: string
          level?: string
          module?: string
          quick_recall?: string
          sort_order?: number
          subject?: string
          tags?: Json
          terms?: Json
          trap?: string
          updated_at?: string
        }
        Relationships: []
      }
      revision_note_progress: {
        Row: {
          bookmarked: boolean
          created_at: string
          last_reviewed_at: string | null
          level: string
          note_id: string
          review_count: number
          reviewed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          bookmarked?: boolean
          created_at?: string
          last_reviewed_at?: string | null
          level?: string
          note_id: string
          review_count?: number
          reviewed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          bookmarked?: boolean
          created_at?: string
          last_reviewed_at?: string | null
          level?: string
          note_id?: string
          review_count?: number
          reviewed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_assessments: {
        Row: {
          ai_mastery: number
          confidence_at_attempt: number | null
          created_at: string
          error_categories: Json
          explanation_summary: string
          id: string
          level: string
          mode: string
          question_count: number
          recommended_action: string
          score_percentage: number
          subtopic_id: string
          user_id: string
        }
        Insert: {
          ai_mastery?: number
          confidence_at_attempt?: number | null
          created_at?: string
          error_categories?: Json
          explanation_summary?: string
          id?: string
          level?: string
          mode: string
          question_count?: number
          recommended_action?: string
          score_percentage?: number
          subtopic_id: string
          user_id: string
        }
        Update: {
          ai_mastery?: number
          confidence_at_attempt?: number | null
          created_at?: string
          error_categories?: Json
          explanation_summary?: string
          id?: string
          level?: string
          mode?: string
          question_count?: number
          recommended_action?: string
          score_percentage?: number
          subtopic_id?: string
          user_id?: string
        }
        Relationships: []
      }
      study_mocks: {
        Row: {
          created_at: string
          felt_difficulty: string
          id: string
          level: string
          notes: string
          section_scores: Json
          taken_at: string
          time_taken_minutes: number
          total_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          felt_difficulty?: string
          id?: string
          level?: string
          notes?: string
          section_scores?: Json
          taken_at?: string
          time_taken_minutes?: number
          total_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          felt_difficulty?: string
          id?: string
          level?: string
          notes?: string
          section_scores?: Json
          taken_at?: string
          time_taken_minutes?: number
          total_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_notes: {
        Row: {
          body: string
          created_at: string
          id: string
          level: string
          pinned: boolean
          review_due_at: string
          review_interval_days: number
          tags: string[]
          title: string
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          level?: string
          pinned?: boolean
          review_due_at?: string
          review_interval_days?: number
          tags?: string[]
          title: string
          topic: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          level?: string
          pinned?: boolean
          review_due_at?: string
          review_interval_days?: number
          tags?: string[]
          title?: string
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_progress: {
        Row: {
          ai_mastery: number | null
          completion_percentage: number | null
          created_at: string
          difficulty: string | null
          first_completed_at: string | null
          last_studied_at: string | null
          level: string
          minutes_spent: number
          notes: string
          revision_count: number
          revision_due_at: string | null
          self_confidence: number | null
          status: string
          subtopic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_mastery?: number | null
          completion_percentage?: number | null
          created_at?: string
          difficulty?: string | null
          first_completed_at?: string | null
          last_studied_at?: string | null
          level?: string
          minutes_spent?: number
          notes?: string
          revision_count?: number
          revision_due_at?: string | null
          self_confidence?: number | null
          status?: string
          subtopic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_mastery?: number | null
          completion_percentage?: number | null
          created_at?: string
          difficulty?: string | null
          first_completed_at?: string | null
          last_studied_at?: string | null
          level?: string
          minutes_spent?: number
          notes?: string
          revision_count?: number
          revision_due_at?: string | null
          self_confidence?: number | null
          status?: string
          subtopic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_question_attempts: {
        Row: {
          answered_correctly: boolean
          assessment_set_id: string | null
          correct_index: number
          created_at: string
          id: string
          level: string
          options: Json
          prompt: string
          rationale: string
          scope: string | null
          selected_index: number
          source: string | null
          subtopic: string
          subtopic_id: string
          topic: string
          user_id: string
        }
        Insert: {
          answered_correctly?: boolean
          assessment_set_id?: string | null
          correct_index: number
          created_at?: string
          id?: string
          level?: string
          options?: Json
          prompt: string
          rationale?: string
          scope?: string | null
          selected_index: number
          source?: string | null
          subtopic: string
          subtopic_id: string
          topic: string
          user_id: string
        }
        Update: {
          answered_correctly?: boolean
          assessment_set_id?: string | null
          correct_index?: number
          created_at?: string
          id?: string
          level?: string
          options?: Json
          prompt?: string
          rationale?: string
          scope?: string | null
          selected_index?: number
          source?: string | null
          subtopic?: string
          subtopic_id?: string
          topic?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_question_attempts_assessment_set_id_fkey"
            columns: ["assessment_set_id"]
            isOneToOne: false
            referencedRelation: "assessment_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          levels_access: Json
          plan: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          levels_access?: Json
          plan?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          levels_access?: Json
          plan?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_levels: {
        Row: {
          created_at: string
          exam_date: string | null
          id: string
          is_active: boolean
          level: string
          pacing: string
          preferred_session_minutes: number | null
          rest_days: Json
          start_date: string | null
          target_study_hours_week: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exam_date?: string | null
          id?: string
          is_active?: boolean
          level: string
          pacing?: string
          preferred_session_minutes?: number | null
          rest_days?: Json
          start_date?: string | null
          target_study_hours_week?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exam_date?: string | null
          id?: string
          is_active?: boolean
          level?: string
          pacing?: string
          preferred_session_minutes?: number | null
          rest_days?: Json
          start_date?: string | null
          target_study_hours_week?: number | null
          updated_at?: string
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

export const Constants = {
  public: {
    Enums: {},
  },
} as const
