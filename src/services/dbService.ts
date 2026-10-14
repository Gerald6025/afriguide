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

/**
 * ── REALTIME MESSAGES SUBSCRIPTION ──
 */
export function subscribeToRealtimeMessages(
  onNewMessage: (message: DbMessage) => void
): () => void {
  try {
    const supabase = createClient();
    const channel = supabase
      .channel("realtime-messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          if (payload.new) {
            onNewMessage(payload.new as DbMessage);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn("subscribeToRealtimeMessages error:", err);
    return () => {};
  }
}

/**
 * ── SUPABASE STORAGE UPLOAD ──
 */
export async function uploadImageToSupabase(
  file: File,
  bucket = "afriguide-media"
): Promise<string> {
  try {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop() || "jpg";
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${cleanFileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.warn(`Supabase Storage upload to ${bucket} returned warning, using local preview:`, error.message);
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || "");
        reader.readAsDataURL(file);
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (publicUrlData?.publicUrl) {
      return publicUrlData.publicUrl;
    }

    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || "");
      reader.readAsDataURL(file);
    });
  } catch (err) {
    console.warn("uploadImageToSupabase exception:", err);
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || "");
      reader.readAsDataURL(file);
    });
  }
}

/**
 * ── RESIZE & COMPRESS IMAGE HELPER ──
 * Compresses camera/phone photos so they upload quickly and fit into localStorage
 */
export function compressImage(
  file: File,
  maxWidth = 300,
  maxHeight = 300,
  quality = 0.85
): Promise<File> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !file.type.startsWith("image/")) {
      return resolve(file);
    }

    const img = new (window as any).Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality
        );
      } else {
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

/**
 * ── PROFILE AVATAR PERSISTENCE ──
 * Persists the user's avatar to Supabase profiles table, user metadata, and localStorage
 */
export async function updateProfileAvatar(
  email: string,
  avatarUrl: string
): Promise<{ success: boolean; avatarUrl: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("afriguide_user_avatar", avatarUrl);
      if (cleanEmail) {
        localStorage.setItem(`afriguide_user_avatar_${cleanEmail}`, avatarUrl);
      }
    } catch (e) {
      console.warn("localStorage quota warning while saving avatar:", e);
    }
  }

  try {
    const supabase = createClient();
    // 1. Update Supabase Auth user metadata ONLY if it is an HTTP/HTTPS URL or static path.
    // CRITICAL: NEVER store base64 data URLs in Supabase Auth user metadata!
    // Base64 data URLs in auth metadata inflate the session JWT into a >30KB cookie,
    // which causes browsers to hit HTTP ERROR 431 (Request Header Fields Too Large).
    const isSafeUrl =
      avatarUrl &&
      !avatarUrl.startsWith("data:") &&
      (avatarUrl.startsWith("http://") ||
        avatarUrl.startsWith("https://") ||
        avatarUrl.startsWith("/"));

    if (isSafeUrl) {
      try {
        await supabase.auth.updateUser({
          data: { avatar_url: avatarUrl },
        });
      } catch (authErr) {
        console.warn("Notice updating auth user metadata:", authErr);
      }
    } else {
      // If auth user metadata previously stored a bloated base64 avatar, reset it to shrink the cookie
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.user_metadata?.avatar_url?.startsWith?.("data:")) {
          await supabase.auth.updateUser({
            data: { avatar_url: "/images/user_avatar.png" },
          });
        }
      } catch {
        // ignore background cleanup errors
      }
    }

    // 2. Upsert into public.profiles table (safe because Postgres table columns do not end up in browser cookies)
    if (cleanEmail) {
      await (supabase.from("profiles") as any).upsert(
        {
          email: cleanEmail,
          avatar_url: avatarUrl,
        },
        { onConflict: "email" }
      );
    }
  } catch (err) {
    console.warn("Supabase profile avatar sync notice:", err);
  }

  return { success: true, avatarUrl };
}

export async function getProfileAvatar(email: string): Promise<string | null> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return null;

  // 1. LocalStorage check
  if (typeof window !== "undefined") {
    const local = localStorage.getItem(`afriguide_user_avatar_${cleanEmail}`);
    if (local && local.trim()) return local;
  }

  // 2. Supabase DB check
  try {
    const supabase = createClient();
    const { data } = await (supabase.from("profiles") as any)
      .select("avatar_url")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (data?.avatar_url && data.avatar_url.trim()) {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`afriguide_user_avatar_${cleanEmail}`, data.avatar_url);
          localStorage.setItem("afriguide_user_avatar", data.avatar_url);
        } catch {
          // ignore
        }
      }
      return data.avatar_url;
    }
  } catch (err) {
    console.warn("getProfileAvatar notice:", err);
  }

  return null;
}



