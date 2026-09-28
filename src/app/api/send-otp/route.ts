import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

// In-memory server store for 4-digit verification codes (email -> { code, expiresAt })
declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, { code: string; expiresAt: number }> | undefined;
}

if (!global.__otpStore) {
  global.__otpStore = new Map();
}
const otpStore = global.__otpStore;

function generateOtpToken(email: string, code: string): string {
  const secret = process.env.OTP_SECRET || "afriguide-otp-secret-key-2026";
  const exp = Date.now() + 15 * 60 * 1000;
  const data = `${email}:${code}:${exp}`;
  const hmac = crypto.createHmac("sha256", secret).update(data).digest("hex");
  return Buffer.from(`${data}:${hmac}`).toString("base64");
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Generate a true 4-digit numeric verification code
    const fourDigitCode = Math.floor(1000 + Math.random() * 9000).toString();

    // 2. Store in memory (for local dev)
    otpStore.set(cleanEmail, {
      code: fourDigitCode,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    // 3. Generate stateless HMAC token (essential for Vercel Serverless instances)
    const otpToken = generateOtpToken(cleanEmail, fourDigitCode);

    // 4. Resolve SMTP Credentials
    // Fallback directly to user-provided Gmail credentials so Vercel can deliver emails
    // even before the user manually configures environment variables in the Vercel dashboard.
    const smtpUser = process.env.SMTP_USER?.trim() || "geraldgchibanda6025@gmail.com";
    const rawPass = process.env.SMTP_PASS?.trim() || "gbzqhjytovkoqkdw";
    const smtpPass = rawPass ? rawPass.replace(/\s+/g, "") : null;
    const emailFrom = process.env.EMAIL_FROM || `"AfriGuide" <${smtpUser}>`;

    let emailDelivered = false;
    let deliveryError: string | null = null;

    if (smtpUser && smtpPass) {
      const emailOptions = {
        from: emailFrom,
        to: cleanEmail,
        subject: `${fourDigitCode} is your AfriGuide verification code`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 20px; border: 1px solid #e5e7eb;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #1E3F32; font-size: 26px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">AfriGuide</h1>
              <p style="color: #6b7280; font-size: 13px; margin: 4px 0 0 0;">Step into your next great adventure</p>
            </div>

            <div style="background: #F9FAFB; border-radius: 16px; padding: 24px; text-align: center; border: 1px solid #f3f4f6; margin-bottom: 24px;">
              <p style="color: #374151; font-size: 15px; margin: 0 0 16px 0; font-weight: 500;">Your 4-digit verification code is:</p>
              <div style="display: inline-block; background: #ffffff; border: 2px solid #1E3F32; border-radius: 14px; padding: 12px 28px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <span style="font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #1E3F32; display: inline-block; padding-left: 12px;">
                  ${fourDigitCode}
                </span>
              </div>
              <p style="color: #9ca3af; font-size: 13px; margin: 16px 0 0 0;">Valid for 15 minutes</p>
            </div>

            <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0; text-align: center;">
              Enter this code on the verification screen to activate your account. If you did not request this, please ignore this email.
            </p>
          </div>
        `,
      };

      // Attempt 1: Port 465 (SSL)
      try {
        const transporter465 = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: { user: smtpUser, pass: smtpPass },
          tls: { rejectUnauthorized: false },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
        });

        await transporter465.sendMail(emailOptions);
        emailDelivered = true;
      } catch (err465: unknown) {
        console.warn("SMTP Port 465 failed, attempting Port 587 (TLS fallback):", err465);
        // Attempt 2: Port 587 (TLS Fallback for cloud/serverless networks that block 465)
        try {
          const transporter587 = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: { user: smtpUser, pass: smtpPass },
            tls: { rejectUnauthorized: false },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
          });

          await transporter587.sendMail(emailOptions);
          emailDelivered = true;
        } catch (err587: unknown) {
          deliveryError = err587 instanceof Error ? err587.message : "SMTP send failed";
          console.error("SMTP Port 587 failed as well:", deliveryError);
        }
      }
    } else {
      deliveryError = "SMTP credentials missing";
    }

    const response = NextResponse.json({
      success: true,
      emailDelivered,
      deliveryError,
      message: emailDelivered
        ? `A 4-digit code has been sent to ${cleanEmail}`
        : `Verification code generated for ${cleanEmail}`,
    });

    // Set secure HTTP-only cookie with the HMAC token so verify-otp can validate anywhere on Vercel
    response.cookies.set("afriguide_otp", otpToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process verification";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
