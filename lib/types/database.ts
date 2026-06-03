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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alert_logs: {
        Row: {
          acknowledged: boolean
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string
          description: string | null
          id: string
          ingredient_a_id: string | null
          ingredient_b_id: string | null
          job_uid: string
          patient_id: string
          prescription_id: string | null
          product_a_id: string | null
          product_b_id: string | null
          service_uid: string
          severity: string
        }
        Insert: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string
          description?: string | null
          id?: string
          ingredient_a_id?: string | null
          ingredient_b_id?: string | null
          job_uid?: string
          patient_id: string
          prescription_id?: string | null
          product_a_id?: string | null
          product_b_id?: string | null
          service_uid?: string
          severity: string
        }
        Update: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string
          description?: string | null
          id?: string
          ingredient_a_id?: string | null
          ingredient_b_id?: string | null
          job_uid?: string
          patient_id?: string
          prescription_id?: string | null
          product_a_id?: string | null
          product_b_id?: string | null
          service_uid?: string
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_logs_ingredient_a_id_fkey"
            columns: ["ingredient_a_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_logs_ingredient_b_id_fkey"
            columns: ["ingredient_b_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_logs_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_logs_product_a_id_fkey"
            columns: ["product_a_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_logs_product_b_id_fkey"
            columns: ["product_b_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredient_interactions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          ingredient_a_id: string
          ingredient_b_id: string
          job_uid: string
          service_uid: string
          severity: string
          source: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          ingredient_a_id: string
          ingredient_b_id: string
          job_uid?: string
          service_uid?: string
          severity: string
          source?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          ingredient_a_id?: string
          ingredient_b_id?: string
          job_uid?: string
          service_uid?: string
          severity?: string
          source?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredient_interactions_ingredient_a_id_fkey"
            columns: ["ingredient_a_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingredient_interactions_ingredient_b_id_fkey"
            columns: ["ingredient_b_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          created_at: string
          id: string
          ingredient_code: string
          job_uid: string
          name_en: string | null
          name_ko: string
          service_uid: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_code: string
          job_uid?: string
          name_en?: string | null
          name_ko: string
          service_uid?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_code?: string
          job_uid?: string
          name_en?: string | null
          name_ko?: string
          service_uid?: string
          updated_at?: string
        }
        Relationships: []
      }
      medication_logs: {
        Row: {
          administered_at: string
          administered_by: string | null
          created_at: string
          id: string
          job_uid: string
          notes: string | null
          prescription_id: string
          product_id: string
          service_uid: string
          status: string
        }
        Insert: {
          administered_at?: string
          administered_by?: string | null
          created_at?: string
          id?: string
          job_uid?: string
          notes?: string | null
          prescription_id: string
          product_id: string
          service_uid?: string
          status?: string
        }
        Update: {
          administered_at?: string
          administered_by?: string | null
          created_at?: string
          id?: string
          job_uid?: string
          notes?: string | null
          prescription_id?: string
          product_id?: string
          service_uid?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_contraindications: {
        Row: {
          created_at: string
          id: string
          ingredient_id: string | null
          job_uid: string
          patient_id: string
          product_id: string | null
          reason: string | null
          service_uid: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id?: string | null
          job_uid?: string
          patient_id: string
          product_id?: string | null
          reason?: string | null
          service_uid?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string | null
          job_uid?: string
          patient_id?: string
          product_id?: string | null
          reason?: string | null
          service_uid?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_contraindications_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_contraindications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_contraindications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          allergies: string | null
          birth_date: string | null
          created_at: string
          gender: string | null
          id: string
          job_uid: string
          name: string
          notes: string | null
          patient_no: string
          service_uid: string
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          allergies?: string | null
          birth_date?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          job_uid?: string
          name: string
          notes?: string | null
          patient_no: string
          service_uid?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          allergies?: string | null
          birth_date?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          job_uid?: string
          name?: string
          notes?: string | null
          patient_no?: string
          service_uid?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      prescription_products: {
        Row: {
          created_at: string
          dosage: string | null
          duration_days: number | null
          frequency: string | null
          id: string
          job_uid: string
          prescription_id: string
          product_id: string
          service_uid: string
        }
        Insert: {
          created_at?: string
          dosage?: string | null
          duration_days?: number | null
          frequency?: string | null
          id?: string
          job_uid?: string
          prescription_id: string
          product_id: string
          service_uid?: string
        }
        Update: {
          created_at?: string
          dosage?: string | null
          duration_days?: number | null
          frequency?: string | null
          id?: string
          job_uid?: string
          prescription_id?: string
          product_id?: string
          service_uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescription_products_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescription_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          id: string
          job_uid: string
          notes: string | null
          patient_id: string
          prescribed_at: string
          prescribed_by: string | null
          service_uid: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_uid?: string
          notes?: string | null
          patient_id: string
          prescribed_at?: string
          prescribed_by?: string | null
          service_uid?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          job_uid?: string
          notes?: string | null
          patient_id?: string
          prescribed_at?: string
          prescribed_by?: string | null
          service_uid?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      product_ingredients: {
        Row: {
          amount_mg: number | null
          created_at: string
          id: string
          ingredient_id: string
          job_uid: string
          product_id: string
          service_uid: string
        }
        Insert: {
          amount_mg?: number | null
          created_at?: string
          id?: string
          ingredient_id: string
          job_uid?: string
          product_id: string
          service_uid?: string
        }
        Update: {
          amount_mg?: number | null
          created_at?: string
          id?: string
          ingredient_id?: string
          job_uid?: string
          product_id?: string
          service_uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_ingredients_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          dosage_form: string | null
          id: string
          job_uid: string
          manufacturer: string | null
          product_code: string
          product_name: string
          service_uid: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dosage_form?: string | null
          id?: string
          job_uid?: string
          manufacturer?: string | null
          product_code: string
          product_name: string
          service_uid?: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dosage_form?: string | null
          id?: string
          job_uid?: string
          manufacturer?: string | null
          product_code?: string
          product_name?: string
          service_uid?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reimbursement_restrictions: {
        Row: {
          created_at: string
          effective_from: string | null
          effective_to: string | null
          id: string
          job_uid: string
          product_id: string
          restriction: string
          service_uid: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          job_uid?: string
          product_id: string
          restriction: string
          service_uid?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          job_uid?: string
          product_id?: string
          restriction?: string
          service_uid?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reimbursement_restrictions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          id: string
          job_uid: string
          name: string | null
          role: string
          service_uid: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_uid?: string
          name?: string | null
          role?: string
          service_uid?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_uid?: string
          name?: string | null
          role?: string
          service_uid?: string
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
