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
      products: {
        Row: {
          id: string
          name: string
          image: string
          quantity: number
          price: number
          customer_name: string
          phone_number: string
          shipping_type: 'air' | 'sea'
          shipping_duration: string
          currency: 'USD' | 'RMB' | 'MRU'
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          image: string
          quantity?: number
          price: number
          customer_name: string
          phone_number: string
          shipping_type: 'air' | 'sea'
          shipping_duration: string
          currency: 'USD' | 'RMB' | 'MRU'
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          image?: string
          quantity?: number
          price?: number
          customer_name?: string
          phone_number?: string
          shipping_type?: 'air' | 'sea'
          shipping_duration?: string
          currency?: 'USD' | 'RMB' | 'MRU'
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      contact_settings: {
        Row: {
          id: string
          email: string
          phone1: string
          phone2: string
          whatsapp1: string
          whatsapp2: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          phone1: string
          phone2: string
          whatsapp1: string
          whatsapp2: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone1?: string
          phone2?: string
          whatsapp1?: string
          whatsapp2?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}