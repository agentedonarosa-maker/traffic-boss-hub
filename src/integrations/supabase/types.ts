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
          client_id: string | null
          created_at: string
          credentials: Json
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          platform: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          credentials: Json
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          platform: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          credentials?: Json
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          platform?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
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
          client_id: string
          created_at: string | null
          description: string | null
          feedback: string | null
          id: string
          meeting_date: string
          title: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          description?: string | null
          feedback?: string | null
          id?: string
          meeting_date: string
          title: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          description?: string | null
          feedback?: string | null
          id?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_client_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
