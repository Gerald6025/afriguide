import { NextResponse } from "next/server";
import crypto from "crypto";

declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, { code: string; expiresAt: number }> | undefined;
}

if (!global.__otpStore) {
  global.__otpStore = new Map();
}
const otpStore = global.__otpStore;

function verifyOtpToken(tokenString: string, email: string, code: string): boolean {
  try {
    const secret = process.env.OTP_SECRET || "afriguide-otp-secret-key-2026";
    const decoded = Buffer.from(tokenString, "base64").toString("utf-8");
    const [tEmail, tCode, tExp, tHmac] = decoded.split(":");
    if (!tEmail || !tCode || !tExp || !tHmac) return false;

    // Check HMAC signature integrity
    const expectedHmac = crypto
      .createHmac("sha256", secret)
      .update(`${tEmail}:${tCode}:${tExp}`)
      .digest("hex");
    if (tHmac !== expectedHmac) return false;

    // Check expiration (15 minutes)
    if (Date.now() > Number(tExp)) return false;

    // Check email and 4-digit code match
    return tEmail.toLowerCase() === email.toLowerCase() && tCode === code;
  } catch {
    return false;
  }
}

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

    // 2. Check the stateless HMAC cookie (primary for Vercel multi-instance Serverless)
    const cookieHeader = request.headers.get("cookie") || "";
    const cookieMatch = cookieHeader.match(/afriguide_otp=([^;]+)/);
    const otpCookie = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;

    if (otpCookie) {
      const isCookieValid = verifyOtpToken(otpCookie, cleanEmail, cleanCode);
      if (isCookieValid) {
        otpStore.delete(cleanEmail);
        const res = NextResponse.json({ success: true, verified: true });
        // Clear the OTP cookie
        res.cookies.delete("afriguide_otp");
        return res;
      }
    }

    // 3. Fallback: Check the in-memory OTP store (for local dev instances)
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
