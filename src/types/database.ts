export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          email: string | null;
          role: "traveler" | "guide" | "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          role?: "traveler" | "guide" | "admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          role?: "traveler" | "guide" | "admin";
          created_at?: string;
        };
      };
      guides: {
        Row: {
          id: string;
          name: string;
          bio: string;
          country: string;
          location: string;
          avatar_url: string;
          cover_image_url: string | null;
          rating: number;
          reviews_count: number;
          years_experience: number;
          languages: string[];
          specialties: string[];
          verified: boolean;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          bio: string;
          country: string;
          location: string;
          avatar_url: string;
          cover_image_url?: string | null;
          rating?: number;
          reviews_count?: number;
          years_experience?: number;
          languages?: string[];
          specialties?: string[];
          verified?: boolean;
          phone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          bio?: string;
          country?: string;
          location?: string;
          avatar_url?: string;
          cover_image_url?: string | null;
          rating?: number;
          reviews_count?: number;
          years_experience?: number;
          languages?: string[];
          specialties?: string[];
          verified?: boolean;
          phone?: string | null;
          created_at?: string;
        };
      };
      tours: {
        Row: {
          id: string;
          guide_id: string;
          title: string;
          description: string;
          duration_hours: number;
          price_usd: number;
          max_group_size: number;
          location: string;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          guide_id: string;
          title: string;
          description: string;
          duration_hours: number;
          price_usd: number;
          max_group_size?: number;
          location: string;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          guide_id?: string;
          title?: string;
          description?: string;
          duration_hours?: number;
          price_usd?: number;
          max_group_size?: number;
          location?: string;
          image_url?: string;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          guide_id: string;
          user_name: string;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          guide_id: string;
          user_name: string;
          rating: number;
          comment: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          guide_id?: string;
          user_name?: string;
          rating?: number;
          comment?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Guide = Database["public"]["Tables"]["guides"]["Row"];
export type Tour = Database["public"]["Tables"]["tours"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
