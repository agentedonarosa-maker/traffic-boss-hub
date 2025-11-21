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
      ad_insights: {
        Row: {
          ad_id: string
          ad_name: string | null
          age_range: string | null
          campaign_id: string
          clicks: number | null
          conversion_value: number | null
          conversions: number | null
          country: string | null
          cpa: number | null
          cpc: number | null
          created_at: string
          ctr: number | null
          date: string
          day_of_week: number | null
          device_type: string | null
          gender: string | null
          hour_of_day: number | null
          id: string
          impressions: number | null
          placement: string | null
          publisher_platform: string | null
          region: string | null
          roas: number | null
          spend: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ad_id: string
          ad_name?: string | null
          age_range?: string | null
          campaign_id: string
          clicks?: number | null
          conversion_value?: number | null
          conversions?: number | null
          country?: string | null
          cpa?: number | null
          cpc?: number | null
          created_at?: string
          ctr?: number | null
          date: string
          day_of_week?: number | null
          device_type?: string | null
          gender?: string | null
          hour_of_day?: number | null
          id?: string
          impressions?: number | null
          placement?: string | null
          publisher_platform?: string | null
          region?: string | null
          roas?: number | null
          spend?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ad_id?: string
          ad_name?: string | null
          age_range?: string | null
          campaign_id?: string
          clicks?: number | null
          conversion_value?: number | null
          conversions?: number | null
          country?: string | null
          cpa?: number | null
          cpc?: number | null
          created_at?: string
          ctr?: number | null
          date?: string
          day_of_week?: number | null
          device_type?: string | null
          gender?: string | null
          hour_of_day?: number | null
          id?: string
          impressions?: number | null
          placement?: string | null
          publisher_platform?: string | null
          region?: string | null
          roas?: number | null
          spend?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_insights_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_metrics: {
        Row: {
          campaign_id: string
          clicks: number | null
          cpl: number | null
          created_at: string | null
          ctr: number | null
          date: string
          id: string
          impressions: number | null
          investment: number | null
          leads: number | null
          revenue: number | null
          roas: number | null
          sales: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          campaign_id: string
          clicks?: number | null
          cpl?: number | null
          created_at?: string | null
          ctr?: number | null
          date: string
          id?: string
          impressions?: number | null
          investment?: number | null
          leads?: number | null
          revenue?: number | null
          roas?: number | null
          sales?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          campaign_id?: string
          clicks?: number | null
          cpl?: number | null
          created_at?: string | null
          ctr?: number | null
          date?: string
          id?: string
          impressions?: number | null
          investment?: number | null
          leads?: number | null
          revenue?: number | null
          roas?: number | null
          sales?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: number | null
          client_id: string
          created_at: string | null
          end_date: string | null
          id: string
          name: string
          objective: string
          platform: string
          start_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          budget?: number | null
          client_id: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          name: string
          objective: string
          platform: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          budget?: number | null
          client_id?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          name?: string
          objective?: string
          platform?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_access: {
        Row: {
          access_token: string
          client_id: string
          created_at: string
          id: string
          is_active: boolean
          last_accessed_at: string | null
        }
        Insert: {
          access_token: string
          client_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_accessed_at?: string | null
        }
        Update: {
          access_token?: string
          client_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_accessed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_access_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_briefings: {
        Row: {
          additional_notes: string | null
          business_description: string
          business_segment: string
          client_id: string
          company_name: string
          created_at: string
          current_channels: string[] | null
          id: string
          main_competitors: string | null
          main_objective: string
          monthly_budget: number | null
          pain_points: string | null
          products_services: string
          secondary_objectives: string[] | null
          social_media_links: Json | null
          status: string | null
          success_metrics: string
          target_audience: string
          unique_selling_points: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          additional_notes?: string | null
          business_description: string
          business_segment: string
          client_id: string
          company_name: string
          created_at?: string
          current_channels?: string[] | null
          id?: string
          main_competitors?: string | null
          main_objective: string
          monthly_budget?: number | null
          pain_points?: string | null
          products_services: string
          secondary_objectives?: string[] | null
          social_media_links?: Json | null
          status?: string | null
          success_metrics: string
          target_audience: string
          unique_selling_points?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          additional_notes?: string | null
          business_description?: string
          business_segment?: string
          client_id?: string
          company_name?: string
          created_at?: string
          current_channels?: string[] | null
          id?: string
          main_competitors?: string | null
          main_objective?: string
          monthly_budget?: number | null
          pain_points?: string | null
          products_services?: string
          secondary_objectives?: string[] | null
          social_media_links?: Json | null
          status?: string | null
          success_metrics?: string
          target_audience?: string
          unique_selling_points?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      client_payments: {
        Row: {
          client_id: string
          contract_value: number
          created_at: string
          due_date: string
          id: string
          notes: string | null
          paid_date: string | null
          payment_code: string | null
          payment_frequency: string
          payment_method: string
          payment_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          contract_value: number
          created_at?: string
          due_date: string
          id?: string
          notes?: string | null
          paid_date?: string | null
          payment_code?: string | null
          payment_frequency: string
          payment_method: string
          payment_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          contract_value?: number
          created_at?: string
          due_date?: string
          id?: string
          notes?: string | null
          paid_date?: string | null
          payment_code?: string | null
          payment_frequency?: string
          payment_method?: string
          payment_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company: string | null
          contact: string | null
          created_at: string | null
          id: string
          monthly_budget: number | null
          name: string
          niche: string | null
          strategic_notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company?: string | null
          contact?: string | null
          created_at?: string | null
          id?: string
          monthly_budget?: number | null
          name: string
          niche?: string | null
          strategic_notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company?: string | null
          contact?: string | null
          created_at?: string | null
          id?: string
          monthly_budget?: number | null
          name?: string
          niche?: string | null
          strategic_notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      integrations: {
        Row: {
          client_id: string
          created_at: string
          credentials: Json
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          platform: string
          updated_at: string
          user_id: string
          vault_secret_name: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          credentials: Json
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          platform: string
          updated_at?: string
          user_id: string
          vault_secret_name?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          credentials?: Json
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          platform?: string
          updated_at?: string
          user_id?: string
          vault_secret_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_integrations_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integrations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          client_confirmation_status:
            | Database["public"]["Enums"]["meeting_confirmation_status"]
            | null
          client_confirmed_at: string | null
          client_id: string
          client_notes: string | null
          client_suggested_dates: Json | null
          created_at: string | null
          description: string | null
          feedback: string | null
          google_event_id: string | null
          google_meet_link: string | null
          id: string
          is_synced_with_google: boolean | null
          last_synced_at: string | null
          meeting_date: string
          title: string
          user_id: string
        }
        Insert: {
          client_confirmation_status?:
            | Database["public"]["Enums"]["meeting_confirmation_status"]
            | null
          client_confirmed_at?: string | null
          client_id: string
          client_notes?: string | null
          client_suggested_dates?: Json | null
          created_at?: string | null
          description?: string | null
          feedback?: string | null
          google_event_id?: string | null
          google_meet_link?: string | null
          id?: string
          is_synced_with_google?: boolean | null
          last_synced_at?: string | null
          meeting_date: string
          title: string
          user_id: string
        }
        Update: {
          client_confirmation_status?:
            | Database["public"]["Enums"]["meeting_confirmation_status"]
            | null
          client_confirmed_at?: string | null
          client_id?: string
          client_notes?: string | null
          client_suggested_dates?: Json | null
          created_at?: string | null
          description?: string | null
          feedback?: string | null
          google_event_id?: string | null
          google_meet_link?: string | null
          id?: string
          is_synced_with_google?: boolean | null
          last_synced_at?: string | null
          meeting_date?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          source: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          source?: string | null
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          source?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      strategic_plans: {
        Row: {
          briefing_id: string | null
          channel_strategy: Json | null
          client_id: string
          created_at: string
          funnel_stages: Json | null
          id: string
          kpis: Json | null
          opportunities: string[] | null
          personas: Json | null
          status: string | null
          strengths: string[] | null
          threats: string[] | null
          timeline: Json | null
          updated_at: string
          user_id: string
          weaknesses: string[] | null
        }
        Insert: {
          briefing_id?: string | null
          channel_strategy?: Json | null
          client_id: string
          created_at?: string
          funnel_stages?: Json | null
          id?: string
          kpis?: Json | null
          opportunities?: string[] | null
          personas?: Json | null
          status?: string | null
          strengths?: string[] | null
          threats?: string[] | null
          timeline?: Json | null
          updated_at?: string
          user_id: string
          weaknesses?: string[] | null
        }
        Update: {
          briefing_id?: string | null
          channel_strategy?: Json | null
          client_id?: string
          created_at?: string
          funnel_stages?: Json | null
          id?: string
          kpis?: Json | null
          opportunities?: string[] | null
          personas?: Json | null
          status?: string | null
          strengths?: string[] | null
          threats?: string[] | null
          timeline?: Json | null
          updated_at?: string
          user_id?: string
          weaknesses?: string[] | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          campaign_id: string | null
          client_id: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_google_tokens: {
        Row: {
          access_token: string | null
          calendar_id: string | null
          created_at: string | null
          id: string
          refresh_token: string
          token_expiry: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string | null
          id?: string
          refresh_token: string
          token_expiry?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string | null
          id?: string
          refresh_token?: string
          token_expiry?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          attempt_number: number | null
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          response_body: string | null
          response_code: number | null
          status: string
          webhook_id: string
        }
        Insert: {
          attempt_number?: number | null
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          payload: Json
          response_body?: string | null
          response_code?: number | null
          status: string
          webhook_id: string
        }
        Update: {
          attempt_number?: number | null
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json
          response_body?: string | null
          response_code?: number | null
          status?: string
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string | null
          events: string[]
          id: string
          is_active: boolean | null
          name: string
          retry_count: number | null
          secret: string
          timeout_ms: number | null
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          events: string[]
          id?: string
          is_active?: boolean | null
          name: string
          retry_count?: number | null
          secret: string
          timeout_ms?: number | null
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          events?: string[]
          id?: string
          is_active?: boolean | null
          name?: string
          retry_count?: number | null
          secret?: string
          timeout_ms?: number | null
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification_secure: {
        Args: {
          p_message: string
          p_title: string
          p_type?: string
          p_user_id: string
        }
        Returns: string
      }
      generate_client_token: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      promote_to_admin: { Args: { user_email: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "user"
      meeting_confirmation_status:
        | "pending"
        | "confirmed"
        | "declined"
        | "rescheduled"
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
      meeting_confirmation_status: [
        "pending",
        "confirmed",
        "declined",
        "rescheduled",
      ],
    },
  },
} as const
