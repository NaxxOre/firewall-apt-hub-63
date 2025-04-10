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
      categories: {
        Row: {
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      code_snippets: {
        Row: {
          author_id: string
          category_id: string | null
          code: string
          content: string
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          title: string
        }
        Insert: {
          author_id: string
          category_id?: string | null
          code: string
          content: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          title: string
        }
        Update: {
          author_id?: string
          category_id?: string | null
          code?: string
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_snippets_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_snippets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      ctf_components: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_public: boolean | null
          title: string
          type: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          title: string
          type: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ctf_components_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          code_snippet: string | null
          content: string
          created_at: string
          external_link: string | null
          external_links: string[] | null
          id: string
          image_url: string | null
          image_urls: string[] | null
          is_public: boolean | null
          parent_id: string | null
          title: string
        }
        Insert: {
          author_id: string
          code_snippet?: string | null
          content: string
          created_at?: string
          external_link?: string | null
          external_links?: string[] | null
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          is_public?: boolean | null
          parent_id?: string | null
          title: string
        }
        Update: {
          author_id?: string
          code_snippet?: string | null
          content?: string
          created_at?: string
          external_link?: string | null
          external_links?: string[] | null
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          is_public?: boolean | null
          parent_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          is_admin: boolean | null
          is_approved: boolean | null
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          is_admin?: boolean | null
          is_approved?: boolean | null
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_admin?: boolean | null
          is_approved?: boolean | null
          username?: string
        }
        Relationships: []
      }
      testing_tools: {
        Row: {
          author_id: string
          category_id: string | null
          code: string
          content: string
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          title: string
        }
        Insert: {
          author_id: string
          category_id?: string | null
          code: string
          content: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          title: string
        }
        Update: {
          author_id?: string
          category_id?: string | null
          code?: string
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "testing_tools_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testing_tools_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      write_ups: {
        Row: {
          author_id: string
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          link: string
          title: string
          url: string
        }
        Insert: {
          author_id: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          link: string
          title: string
          url: string
        }
        Update: {
          author_id?: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          link?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "write_ups_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "write_ups_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      youtube_channels: {
        Row: {
          author_id: string
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          thumbnail_url: string | null
          url: string
        }
        Insert: {
          author_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          thumbnail_url?: string | null
          url: string
        }
        Update: {
          author_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          thumbnail_url?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "youtube_channels_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
