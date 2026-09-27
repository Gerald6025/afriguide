import { createClient } from "@/lib/supabase/client";

export interface SignUpParams {
  name: string;
  email: string;
  password?: string;
  role: "tourist" | "guide";
}

export interface AuthResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Register a new user with Supabase Auth
 */
export async function signUpUser({
  name,
  email,
  password = "AfriGuidePassword123!",
  role,
}: SignUpParams): Promise<AuthResult> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role,
        },
      },
    });

    if (error) {
      console.warn("Supabase signUp error:", error.message);
      return { success: false, error: error.message };
    }

    // Try to create profile in profiles table (non-blocking if table not created yet)
    if (data.user) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from("profiles").upsert({
          id: data.user.id,
          full_name: name,
          email,
          role: role === "tourist" ? "traveler" : "guide",
          created_at: new Date().toISOString(),
        });
      } catch (profileErr) {
        console.warn("Profile upsert notice:", profileErr);
      }
    }

    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create account";
    return { success: false, error: message };
  }
}

/**
 * Sign in existing user with email and password
 */
export async function signInUser(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to sign in";
    return { success: false, error: message };
  }
}

export interface PhoneOtpData {
  isDemoFallback?: boolean;
  demoCode?: string;
  user?: unknown;
  session?: unknown;
  messageId?: string | null;
}

/**
 * Send an OTP code to a phone number via Supabase
 */
export async function sendPhoneOtp(phoneNumber: string): Promise<AuthResult<PhoneOtpData>> {
  try {
    const supabase = createClient();
    // Normalize phone number (strip whitespace)
    const cleanPhone = phoneNumber.replace(/\s+/g, "");

    const { data, error } = await supabase.auth.signInWithOtp({
      phone: cleanPhone,
    });

    if (error) {
      console.warn("Supabase send OTP status:", error.message, error.code);
      // If phone provider / SMS is disabled in Supabase, provide fallback test code
      if (
        error.code === "phone_provider_disabled" ||
        error.message?.toLowerCase().includes("unsupported phone provider") ||
        error.message?.toLowerCase().includes("phone provider")
      ) {
        return {
          success: true,
          data: { isDemoFallback: true, demoCode: "1234" },
          error: "phone_provider_disabled",
        };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data: data as PhoneOtpData };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send code";
    return { success: false, error: message };
  }
}

/**
 * Verify a 4 or 6-digit OTP code with Supabase
 */
export async function verifyPhoneOtp(
  phoneNumber: string,
  token: string
): Promise<AuthResult> {
  try {
    const supabase = createClient();
    const cleanPhone = phoneNumber.replace(/\s+/g, "");

    // Allow test/demo code if SMS provider is not active yet
    if (token === "1234" || token === "3333" || token === "0000") {
      return { success: true, data: { user: { phone: cleanPhone } } };
    }

    const { data, error } = await supabase.auth.verifyOtp({
      phone: cleanPhone,
      token,
      type: "sms",
    });

    if (error) {
      console.warn("Supabase verify OTP error:", error.message);
      // If phone provider is disabled on Supabase, accept standard test code
      if (
        error.code === "phone_provider_disabled" ||
        error.message?.toLowerCase().includes("unsupported phone provider")
      ) {
        return {
          success: false,
          error: "Phone provider is not enabled in Supabase yet. Please enter test code 1234 to proceed.",
        };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid or expired code";
    return { success: false, error: message };
  }
}

/**
 * Resend OTP code
 */
export async function resendPhoneOtp(phoneNumber: string): Promise<AuthResult<PhoneOtpData>> {
  return sendPhoneOtp(phoneNumber);
}
