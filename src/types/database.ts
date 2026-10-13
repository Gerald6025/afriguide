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
          phone: string | null;
          role: "traveler" | "guide" | "admin";
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: "traveler" | "guide" | "admin";
          bio?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: "traveler" | "guide" | "admin";
          bio?: string | null;
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
          guide_id?: string;
          title: string;
          category?: string;
          description: string | null;
          duration?: string;
          duration_hours?: number;
          price_usd?: number;
          price_per_person?: number;
          max_group_size: number;
          location: string;
          image_url: string;
          guide_name?: string;
          guide_avatar?: string;
          status?: "active" | "draft" | "archived";
          created_at: string;
        };
        Insert: {
          id?: string;
          guide_id?: string;
          title: string;
          category?: string;
          description?: string | null;
          duration?: string;
          duration_hours?: number;
          price_usd?: number;
          price_per_person?: number;
          max_group_size?: number;
          location: string;
          image_url: string;
          guide_name?: string;
          guide_avatar?: string;
          status?: "active" | "draft" | "archived";
          created_at?: string;
        };
        Update: {
          id?: string;
          guide_id?: string;
          title?: string;
          category?: string;
          description?: string | null;
          duration?: string;
          duration_hours?: number;
          price_usd?: number;
          price_per_person?: number;
          max_group_size?: number;
          location?: string;
          image_url?: string;
          guide_name?: string;
          guide_avatar?: string;
          status?: "active" | "draft" | "archived";
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          tourist_name: string;
          tourist_email?: string | null;
          tour_id?: string | null;
          tour_title: string;
          location: string;
          tour_image_url: string;
          date: string;
          time_slot: string;
          party_size: number;
          price_per_person: number;
          total_price: number;
          status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
          guide_name: string;
          guide_avatar?: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tourist_name: string;
          tourist_email?: string | null;
          tour_id?: string | null;
          tour_title: string;
          location: string;
          tour_image_url: string;
          date: string;
          time_slot?: string;
          party_size?: number;
          price_per_person: number;
          total_price: number;
          status?: "Confirmed" | "Pending" | "Completed" | "Cancelled";
          guide_name: string;
          guide_avatar?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tourist_name?: string;
          tourist_email?: string | null;
          tour_id?: string | null;
          tour_title?: string;
          location?: string;
          tour_image_url?: string;
          date?: string;
          time_slot?: string;
          party_size?: number;
          price_per_person?: number;
          total_price?: number;
          status?: "Confirmed" | "Pending" | "Completed" | "Cancelled";
          guide_name?: string;
          guide_avatar?: string | null;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_name: string;
          sender_avatar?: string | null;
          receiver_name: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_name: string;
          sender_avatar?: string | null;
          receiver_name: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_name?: string;
          sender_avatar?: string | null;
          receiver_name?: string;
          content?: string;
          is_read?: boolean;
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
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
