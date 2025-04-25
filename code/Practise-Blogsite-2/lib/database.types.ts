export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: number
          slug: string
          title: string
          content: string
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          slug: string
          title: string
          content: string
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          slug?: string
          title?: string
          content?: string
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
