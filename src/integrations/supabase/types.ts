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
      api_keys: {
        Row: {
          created_at: string
          id: string
          key_name: string
          key_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_name: string
          key_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          key_name?: string
          key_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string | null
          date: string | null
          excerpt: string
          id: string
          image: string
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string
          category: string
          content: string
          created_at?: string | null
          date?: string | null
          excerpt: string
          id?: string
          image: string
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string | null
          date?: string | null
          excerpt?: string
          id?: string
          image?: string
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      commercial_proposals: {
        Row: {
          accepted: boolean | null
          accepted_at: string | null
          accepted_by: string | null
          accepted_privacy: boolean | null
          accepted_terms: boolean | null
          acceptor_ip: string | null
          additional_notes: string | null
          client_email: string | null
          client_name: string
          created_at: string
          deliverables: Json
          id: string
          introduction: string | null
          issue_date: string
          payment_terms: string | null
          pricing: Json
          proposal_number: string
          scope: string
          status: string
          timeline: Json | null
          title: string
          total_price: number | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          accepted?: boolean | null
          accepted_at?: string | null
          accepted_by?: string | null
          accepted_privacy?: boolean | null
          accepted_terms?: boolean | null
          acceptor_ip?: string | null
          additional_notes?: string | null
          client_email?: string | null
          client_name: string
          created_at?: string
          deliverables?: Json
          id?: string
          introduction?: string | null
          issue_date?: string
          payment_terms?: string | null
          pricing?: Json
          proposal_number: string
          scope: string
          status?: string
          timeline?: Json | null
          title: string
          total_price?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          accepted?: boolean | null
          accepted_at?: string | null
          accepted_by?: string | null
          accepted_privacy?: boolean | null
          accepted_terms?: boolean | null
          acceptor_ip?: string | null
          additional_notes?: string | null
          client_email?: string | null
          client_name?: string
          created_at?: string
          deliverables?: Json
          id?: string
          introduction?: string | null
          issue_date?: string
          payment_terms?: string | null
          pricing?: Json
          proposal_number?: string
          scope?: string
          status?: string
          timeline?: Json | null
          title?: string
          total_price?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          category: string
          challenge: string
          client: string
          created_at: string | null
          date: string
          features: Json | null
          gallery: Json
          id: string
          image: string
          results: Json
          slug: string
          solution: string
          tags: Json
          testimonial: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          challenge: string
          client: string
          created_at?: string | null
          date: string
          features?: Json | null
          gallery: Json
          id?: string
          image: string
          results: Json
          slug: string
          solution: string
          tags: Json
          testimonial?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          challenge?: string
          client?: string
          created_at?: string | null
          date?: string
          features?: Json | null
          gallery?: Json
          id?: string
          image?: string
          results?: Json
          slug?: string
          solution?: string
          tags?: Json
          testimonial?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_files: {
        Row: {
          content: string
          created_at: string
          file_path: string
          id: string
          language: string
          project_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          file_path: string
          id?: string
          language: string
          project_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          file_path?: string
          id?: string
          language?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_integrations: {
        Row: {
          config: Json
          created_at: string
          id: string
          integration_type: string
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          integration_type: string
          project_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          integration_type?: string
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_integrations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          project_id: string
          sender: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          project_id: string
          sender: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          sender?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          css: string | null
          description: string | null
          framework: string | null
          github_repo: string | null
          html: string | null
          id: string
          javascript: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          css?: string | null
          description?: string | null
          framework?: string | null
          github_repo?: string | null
          html?: string | null
          id?: string
          javascript?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          css?: string | null
          description?: string | null
          framework?: string | null
          github_repo?: string | null
          html?: string | null
          id?: string
          javascript?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_github_connections: {
        Row: {
          access_token: string | null
          connected_repo: string | null
          created_at: string
          github_token: string | null
          github_username: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          connected_repo?: string | null
          created_at?: string
          github_token?: string | null
          github_username?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          connected_repo?: string | null
          created_at?: string
          github_token?: string | null
          github_username?: string | null
          id?: string
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
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
