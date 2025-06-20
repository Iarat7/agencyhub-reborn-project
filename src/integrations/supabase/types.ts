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
      clients: {
        Row: {
          company: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          monthly_value: number | null
          name: string
          observations: string | null
          phone: string | null
          project_cost: number | null
          segment: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          monthly_value?: number | null
          name: string
          observations?: string | null
          phone?: string | null
          project_cost?: number | null
          segment?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          monthly_value?: number | null
          name?: string
          observations?: string | null
          phone?: string | null
          project_cost?: number | null
          segment?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          client_id: string | null
          cost: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string
          id: string
          start_date: string
          status: string | null
          title: string
          updated_at: string | null
          value: number
        }
        Insert: {
          client_id?: string | null
          cost?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date: string
          id?: string
          start_date: string
          status?: string | null
          title: string
          updated_at?: string | null
          value: number
        }
        Update: {
          client_id?: string | null
          cost?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string
          id?: string
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          attendees: string[] | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string
          event_type: string | null
          id: string
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          attendees?: string[] | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date: string
          event_type?: string | null
          id?: string
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          attendees?: string[] | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string
          event_type?: string | null
          id?: string
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_entries: {
        Row: {
          amount: number
          category: string
          client_id: string | null
          contract_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          paid_date: string | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          client_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          paid_date?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          client_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          paid_date?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_entries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_entries_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          client_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          expected_close_date: string | null
          id: string
          probability: number | null
          stage: string | null
          title: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          probability?: number | null
          stage?: string | null
          title: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          probability?: number | null
          stage?: string | null
          title?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      strategies: {
        Row: {
          ai_generated: boolean | null
          budget: number | null
          challenges: string | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          deadline: string | null
          id: string
          objectives: string | null
          status: string | null
          target_audience: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          budget?: number | null
          challenges?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          id?: string
          objectives?: string | null
          status?: string | null
          target_audience?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          budget?: number | null
          challenges?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          id?: string
          objectives?: string | null
          status?: string | null
          target_audience?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "strategies_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          user_id: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          user_id?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          user_id?: string | null
          value?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
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
      create_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
