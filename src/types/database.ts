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
      participants: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string | null
          city: string | null
          age_range: string | null
          main_activity: string | null
          activity_years: string | null
          whatsapp: string | null
          email: string | null
          contact_consent: boolean
          opportunity_score: number
          opportunity_level: 'low' | 'medium' | 'high'
          digital_maturity: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string | null
          city?: string | null
          age_range?: string | null
          main_activity?: string | null
          activity_years?: number | null
          whatsapp?: string | null
          email?: string | null
          contact_consent?: boolean
          opportunity_score?: number
          opportunity_level?: 'low' | 'medium' | 'high'
          digital_maturity?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string | null
          city?: string | null
          age_range?: string | null
          main_activity?: string | null
          activity_years?: number | null
          whatsapp?: string | null
          email?: string | null
          contact_consent?: boolean
          opportunity_score?: number
          opportunity_level?: 'low' | 'medium' | 'high'
          digital_maturity?: number
        }
      }
      digital_tools: {
        Row: {
          id: string
          participant_id: string
          tool_name: string
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          tool_name: string
          created_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          tool_name?: string
          created_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          participant_id: string
          challenge_name: string
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          challenge_name: string
          created_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          challenge_name?: string
          created_at?: string
        }
      }
      digital_needs: {
        Row: {
          id: string
          participant_id: string
          need_name: string
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          need_name: string
          created_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          need_name?: string
          created_at?: string
        }
      }
      acquisition_methods: {
        Row: {
          id: string
          participant_id: string
          method_name: string
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          method_name: string
          created_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          method_name?: string
          created_at?: string
        }
      }
      investment_intention: {
        Row: {
          id: string
          participant_id: string
          willing_to_invest: 'yes' | 'maybe' | 'need_info' | 'no'
          budget_range: string | null
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          willing_to_invest: 'yes' | 'maybe' | 'need_info' | 'no'
          budget_range?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          willing_to_invest?: 'yes' | 'maybe' | 'need_info' | 'no'
          budget_range?: string | null
          created_at?: string
        }
      }
    }
  }
}