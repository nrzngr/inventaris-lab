export interface Database {
  public: {
    Tables: {
      categories: {
        Row: any
        Insert: any
        Update: any
      }
      user_profiles: {
        Row: any
        Insert: any
        Update: any
      }
      equipment: {
        Row: any
        Insert: any
        Update: any
      }
      borrowing_transactions: {
        Row: any
        Insert: any
        Update: any
      }
      maintenance_records: {
        Row: any
        Insert: any
        Update: any
      }
      audit_log: {
        Row: any
        Insert: any
        Update: any
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          type: 'due_date_reminder' | 'approval_required' | 'system_maintenance' | 'equipment_alert' | 'safety_compliance'
          title: string
          message: string
          is_read: boolean
          priority: 'low' | 'medium' | 'high' | 'urgent'
          data: any | null
          created_at: string
          read_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'read_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'lab_staff' | 'lecturer' | 'student'
          department: string
          nim?: string | null
          nip?: string | null
          phone?: string | null
          student_level?: string | null
          lecturer_rank?: string | null
          email_verified?: boolean
          email_verified_at?: string | null
          last_login_at?: string | null
          login_count?: number
          locked_until?: string | null
          failed_login_attempts?: number
          custom_password?: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      password_reset_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          expires_at: string
          used_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['password_reset_tokens']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['password_reset_tokens']['Insert']>
      }
      email_verification_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          expires_at: string
          used_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['email_verification_tokens']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['email_verification_tokens']['Insert']>
      }
      failed_login_attempts: {
        Row: {
          id: string
          email: string
          ip_address: string
          user_agent: string | null
          attempted_at: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['failed_login_attempts']['Row'], 'id' | 'attempted_at' | 'created_at'>
        Update: Partial<Database['public']['Tables']['failed_login_attempts']['Insert']>
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          details: any | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>
      }
    }
    Views: {
      equipment_status_view: {
        Row: {
          id: string
          name: string
          description: string | null
          category_id: string | null
          serial_number: string
          purchase_date: string | null
          purchase_price: string | null
          condition: 'excellent' | 'good' | 'fair' | 'poor'
          status: 'available' | 'borrowed' | 'maintenance' | 'lost'
          location: string
          image_url: string | null
          created_at: string
          updated_at: string
          category_name: string | null
          current_borrower: string | null
          borrow_date: string | null
          expected_return_date: string | null
          current_status: 'available' | 'borrowed' | 'overdue' | 'maintenance' | 'lost'
        }
      }
      user_borrowing_history: {
        Row: {
          full_name: string
          department: string
          role: 'admin' | 'lab_staff' | 'lecturer' | 'student'
          equipment_name: string
          serial_number: string
          borrow_date: string
          expected_return_date: string
          actual_return_date: string | null
          status: 'active' | 'returned' | 'overdue'
          notes: string | null
        }
      }
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_lab_staff: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      has_staff_role: {
        Args: {
          user_id: string
        }
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