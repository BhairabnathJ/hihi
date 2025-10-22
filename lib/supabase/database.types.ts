export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          subdomain: string | null
          subscription_plan: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subdomain?: string | null
          subscription_plan?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subdomain?: string | null
          subscription_plan?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          organization_id: string | null
          email: string
          full_name: string | null
          role: string | null
          avatar_url: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id?: string | null
          email: string
          full_name?: string | null
          role?: string | null
          avatar_url?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          email?: string
          full_name?: string | null
          role?: string | null
          avatar_url?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          status: string | null
          priority: string | null
          start_date: string | null
          end_date: string | null
          budget: number | null
          owner_id: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          description?: string | null
          status?: string | null
          priority?: string | null
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          owner_id?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          description?: string | null
          status?: string | null
          priority?: string | null
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          owner_id?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          parent_task_id: string | null
          name: string
          description: string | null
          status: string | null
          priority: string | null
          assignee_id: string | null
          due_date: string | null
          start_date: string | null
          estimated_hours: number | null
          actual_hours: number | null
          tags: string[]
          custom_fields: Json
          position: number | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          project_id: string
          parent_task_id?: string | null
          name: string
          description?: string | null
          status?: string | null
          priority?: string | null
          assignee_id?: string | null
          due_date?: string | null
          start_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          tags?: string[]
          custom_fields?: Json
          position?: number | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          parent_task_id?: string | null
          name?: string
          description?: string | null
          status?: string | null
          priority?: string | null
          assignee_id?: string | null
          due_date?: string | null
          start_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          tags?: string[]
          custom_fields?: Json
          position?: number | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      contacts: {
        Row: {
          id: string
          organization_id: string
          type: string | null
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          organization_name: string | null
          address: Json
          custom_fields: Json
          tags: string[]
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          type?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          organization_name?: string | null
          address?: Json
          custom_fields?: Json
          tags?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          type?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          organization_name?: string | null
          address?: Json
          custom_fields?: Json
          tags?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      time_entries: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          project_id: string | null
          start_time: string | null
          end_time: string | null
          duration_seconds: number | null
          is_billable: boolean | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          project_id?: string | null
          start_time?: string | null
          end_time?: string | null
          duration_seconds?: number | null
          is_billable?: boolean | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string | null
          project_id?: string | null
          start_time?: string | null
          end_time?: string | null
          duration_seconds?: number | null
          is_billable?: boolean | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}
