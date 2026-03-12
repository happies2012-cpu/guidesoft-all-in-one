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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          resource_id: string | null
          resource_type: string
          tenant_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          resource_id?: string | null
          resource_type: string
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          resource_id?: string | null
          resource_type?: string
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      cloud_files: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          is_deleted: boolean | null
          is_folder: boolean | null
          mime_type: string | null
          name: string
          parent_id: string | null
          path: string
          size_bytes: number | null
          storage_url: string
          tenant_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_folder?: boolean | null
          mime_type?: string | null
          name: string
          parent_id?: string | null
          path: string
          size_bytes?: number | null
          storage_url: string
          tenant_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_folder?: boolean | null
          mime_type?: string | null
          name?: string
          parent_id?: string | null
          path?: string
          size_bytes?: number | null
          storage_url?: string
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cloud_files_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cloud_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cloud_files_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number | null
          moderation_status: Database["public"]["Enums"]["moderation_status"] | null
          parent_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          moderation_status?: Database["public"]["Enums"]["moderation_status"] | null
          parent_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          moderation_status?: Database["public"]["Enums"]["moderation_status"] | null
          parent_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          description: string | null
          avatar_url: string | null
          banner_url: string | null
          subscribers_count: number | null
          is_verified: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          description?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          subscribers_count?: number | null
          is_verified?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          slug?: string
          description?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          subscribers_count?: number | null
          is_verified?: boolean | null
          created_at?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          name: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      live_streams: {
        Row: {
          id: string
          user_id: string
          title: string
          host: string | null
          description: string | null
          status: string | null
          viewers_count: number | null
          thumbnail_url: string | null
          stream_url: string | null
          started_at: string | null
          ended_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          host?: string | null
          description?: string | null
          status?: string | null
          viewers_count?: number | null
          thumbnail_url?: string | null
          stream_url?: string | null
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          host?: string | null
          description?: string | null
          status?: string | null
          viewers_count?: number | null
          thumbnail_url?: string | null
          stream_url?: string | null
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean | null
          media_url: string | null
          message_type: string | null
          sender_id: string
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          media_url?: string | null
          message_type?: string | null
          sender_id: string
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          media_url?: string | null
          message_type?: string | null
          sender_id?: string
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          id: string
          author_id: string | null
          title: string
          slug: string
          content: string
          excerpt: string | null
          image_url: string | null
          category: string | null
          is_published: boolean | null
          published_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          author_id?: string | null
          title: string
          slug: string
          content: string
          excerpt?: string | null
          image_url?: string | null
          category?: string | null
          is_published?: boolean | null
          published_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          author_id?: string | null
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          image_url?: string | null
          category?: string | null
          is_published?: boolean | null
          published_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          message: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_registrations: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payment_method: string | null
          payment_proof_url: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          updated_at: string
          upi_id: string
          user_id: string
          utr_number: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string | null
          payment_proof_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
          upi_id?: string
          user_id: string
          utr_number?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string | null
          payment_proof_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
          upi_id?: string
          user_id?: string
          utr_number?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string
          id: string
          is_pinned: boolean | null
          likes_count: number | null
          media_urls: string[] | null
          moderation_status: Database["public"]["Enums"]["moderation_status"] | null
          post_type: string | null
          shares_count: number | null
          tenant_id: string | null
          updated_at: string
          user_id: string
          visibility: string | null
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          likes_count?: number | null
          media_urls?: string[] | null
          moderation_status?: Database["public"]["Enums"]["moderation_status"] | null
          post_type?: string | null
          shares_count?: number | null
          tenant_id?: string | null
          updated_at?: string
          user_id: string
          visibility?: string | null
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          likes_count?: number | null
          media_urls?: string[] | null
          moderation_status?: Database["public"]["Enums"]["moderation_status"] | null
          post_type?: string | null
          shares_count?: number | null
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          resource_type: string
          resource_id: string
          reason: string
          status: string
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          resource_type: string
          resource_id: string
          reason: string
          status?: string
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          resource_type?: string
          resource_id?: string
          reason?: string
          status?: string
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_public: boolean | null
          is_verified: boolean | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_public?: boolean | null
          is_verified?: boolean | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          caption: string | null
          created_at: string
          expires_at: string
          id: string
          media_type: string | null
          media_url: string
          user_id: string
          views_count: number | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          media_type?: string | null
          media_url: string
          user_id: string
          views_count?: number | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          media_type?: string | null
          media_url?: string
          user_id?: string
          views_count?: number | null
        }
        Relationships: []
      }
      tenant_members: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          description: string | null
          id: string
          industry_preset: string | null
          logo_url: string | null
          name: string
          owner_id: string
          settings: Json | null
          slug: string
          status: Database["public"]["Enums"]["tenant_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          industry_preset?: string | null
          logo_url?: string | null
          name: string
          owner_id: string
          settings?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["tenant_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          industry_preset?: string | null
          logo_url?: string | null
          name?: string
          owner_id?: string
          settings?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["tenant_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string | null
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string | null
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          subscriber_id: string
          channel_id: string
          created_at: string
        }
        Insert: {
          id?: string
          subscriber_id: string
          channel_id: string
          created_at?: string
        }
        Update: {
          id?: string
          subscriber_id?: string
          channel_id?: string
          created_at?: string
        }
        Relationships: []
      }
      workspaces: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          settings: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          settings?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          settings?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      communities: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          avatar_url: string | null
          banner_url: string | null
          is_private: boolean | null
          members_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          is_private?: boolean | null
          members_count?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          is_private?: boolean | null
          members_count?: number | null
          created_at?: string
        }
        Relationships: []
      }
      community_members: {
        Row: {
          id: string
          community_id: string
          user_id: string
          role: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          community_id: string
          user_id: string
          role?: string | null
          joined_at?: string
        }
        Update: {
          id?: string
          community_id?: string
          user_id?: string
          role?: string | null
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          }
        ]
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role?: string | null
          joined_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          role?: string | null
          joined_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_completed_payment: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "platform_super_admin"
        | "platform_ops_admin"
        | "tenant_owner"
        | "executive_sponsor"
        | "compliance_officer"
        | "security_officer"
        | "finance_ops"
        | "hr_ops"
        | "product_director"
        | "engineering_director"
        | "marketing_director"
        | "sales_director"
        | "support_director"
        | "program_manager"
        | "project_manager"
        | "product_manager"
        | "team_lead"
        | "ux_lead"
        | "ui_designer"
        | "motion_designer"
        | "backend_engineer"
        | "frontend_engineer"
        | "mobile_engineer"
        | "qa_lead"
        | "qa_engineer"
        | "devops_sre"
        | "data_engineering_lead"
        | "data_analyst"
        | "community_manager"
        | "moderator"
        | "partner_vendor_manager"
        | "ads_monetization_manager"
        | "brand_manager"
        | "seo_specialist"
        | "growth_marketer"
        | "sales_rep"
        | "customer_success_manager"
        | "support_agent"
        | "ai_program_director"
        | "mlops_ai_engineer"
        | "guest"
        | "user"
      moderation_status: "pending" | "approved" | "flagged" | "hidden" | "deleted"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      tenant_status: "pending_payment" | "active" | "suspended" | "deleted"
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
      app_role: [
        "platform_super_admin",
        "platform_ops_admin",
        "tenant_owner",
        "executive_sponsor",
        "compliance_officer",
        "security_officer",
        "finance_ops",
        "hr_ops",
        "product_director",
        "engineering_director",
        "marketing_director",
        "sales_director",
        "support_director",
        "program_manager",
        "project_manager",
        "product_manager",
        "team_lead",
        "ux_lead",
        "ui_designer",
        "motion_designer",
        "backend_engineer",
        "frontend_engineer",
        "mobile_engineer",
        "qa_lead",
        "qa_engineer",
        "devops_sre",
        "data_engineering_lead",
        "data_analyst",
        "community_manager",
        "moderator",
        "partner_vendor_manager",
        "ads_monetization_manager",
        "brand_manager",
        "seo_specialist",
        "growth_marketer",
        "sales_rep",
        "customer_success_manager",
        "support_agent",
        "ai_program_director",
        "mlops_ai_engineer",
        "guest",
        "user",
      ],
      payment_status: ["pending", "completed", "failed", "refunded"],
      tenant_status: ["pending_payment", "active", "suspended", "deleted"],
    },
  },
} as const
