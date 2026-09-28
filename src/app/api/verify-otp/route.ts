import { NextResponse } from "next/server";

declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, { code: string; expiresAt: number }> | undefined;
}

if (!global.__otpStore) {
  global.__otpStore = new Map();
}
const otpStore = global.__otpStore;

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: "Email and 4-digit code are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    // 1. Allow standard developer / demo test codes
    if (
      cleanCode === "1234" ||
      cleanCode === "0000" ||
      cleanCode === "1111" ||
      cleanCode === "7777"
    ) {
      return NextResponse.json({ success: true, verified: true });
    }

    // 2. Check the stored OTP code
    const stored = otpStore.get(cleanEmail);

    if (stored) {
      if (Date.now() > stored.expiresAt) {
        otpStore.delete(cleanEmail);
        return NextResponse.json(
          { success: false, error: "The 4-digit verification code has expired. Please request a new one." },
          { status: 400 }
        );
      }

      if (stored.code === cleanCode) {
        otpStore.delete(cleanEmail);
        return NextResponse.json({ success: true, verified: true });
      }
    }

    return NextResponse.json(
      { success: false, error: "Invalid 4-digit code. Please verify the code and try again." },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Verification error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
