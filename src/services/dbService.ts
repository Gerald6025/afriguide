import { createClient } from "@/lib/supabase/client";

export interface DbTour {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  price_per_person: number;
  max_group_size: number;
  location: string;
  image_url: string;
  guide_name: string;
  guide_avatar?: string;
  status: "active" | "draft" | "archived";
  created_at: string;
}

export interface DbBooking {
  id: string;
  tourist_name: string;
  tourist_email?: string;
  tour_id?: string;
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
  guide_avatar?: string;
  created_at: string;
}

export interface DbMessage {
  id: string;
  sender_name: string;
  sender_avatar?: string;
  receiver_name: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

/**
 * ── TOURS SERVICE ──
 */
export async function getToursFromDb(): Promise<DbTour[]> {
  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from("tours") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn("Could not fetch tours from Supabase:", error?.message);
      return [];
    }
    return data as DbTour[];
  } catch (err) {
    console.warn("getToursFromDb error:", err);
    return [];
  }
}

export async function createTourInDb(tour: Omit<DbTour, "id" | "created_at">): Promise<DbTour | null> {
  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from("tours") as any)
      .insert([tour])
      .select()
      .single();

    if (error || !data) {
      console.error("Failed to insert tour into Supabase:", error);
      return null;
    }
    return data as DbTour;
  } catch (err) {
    console.error("createTourInDb error:", err);
    return null;
  }
}

/**
 * ── BOOKINGS SERVICE ──
 */
export async function getBookingsFromDb(): Promise<DbBooking[]> {
  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from("bookings") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn("Could not fetch bookings from Supabase:", error?.message);
      return [];
    }
    return data as DbBooking[];
  } catch (err) {
    console.warn("getBookingsFromDb error:", err);
    return [];
  }
}

export async function createBookingInDb(booking: Omit<DbBooking, "id" | "created_at">): Promise<DbBooking | null> {
  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from("bookings") as any)
      .insert([booking])
      .select()
      .single();

    if (error || !data) {
      console.error("Failed to create booking in Supabase:", error);
      return null;
    }
    return data as DbBooking;
  } catch (err) {
    console.error("createBookingInDb error:", err);
    return null;
  }
}

export async function updateBookingStatusInDb(
  bookingId: string,
  newStatus: "Confirmed" | "Pending" | "Completed" | "Cancelled"
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await (supabase.from("bookings") as any)
      .update({ status: newStatus })
      .eq("id", bookingId);

    if (error) {
      console.error("Failed to update booking status in Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("updateBookingStatusInDb error:", err);
    return false;
  }
}

/**
 * ── MESSAGES SERVICE ──
 */
export async function getMessagesFromDb(): Promise<DbMessage[]> {
  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from("messages") as any)
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data) {
      console.warn("Could not fetch messages from Supabase:", error?.message);
      return [];
    }
    return data as DbMessage[];
  } catch (err) {
    console.warn("getMessagesFromDb error:", err);
    return [];
  }
}

export async function sendMessageToDb(message: {
  sender_name: string;
  sender_avatar?: string;
  receiver_name: string;
  content: string;
}): Promise<DbMessage | null> {
  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from("messages") as any)
      .insert([message])
      .select()
      .single();

    if (error || !data) {
      console.error("Failed to send message to Supabase:", error);
      return null;
    }
    return data as DbMessage;
  } catch (err) {
    console.error("sendMessageToDb error:", err);
    return null;
  }
}
