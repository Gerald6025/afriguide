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
    // Check for modern transactional providers first (Resend or custom SMTP)
    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    const smtpHost = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
    const smtpUser = process.env.SMTP_USER?.trim() || "geraldgchibanda6025@gmail.com";
    const rawPass = process.env.SMTP_PASS?.trim() || "gbzqhjytovkoqkdw";
    const smtpPass = rawPass ? rawPass.replace(/\s+/g, "") : null;
    const emailFrom = process.env.EMAIL_FROM || `Gerald Chibanda <${smtpUser}>`;

    let emailDelivered = false;
    let deliveryError: string | null = null;

    // Option A: If user provided a free Resend API key, use direct Resend HTTP API for top inbox placement
    if (resendApiKey) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || "AfriGuide <onboarding@resend.dev>",
            to: [cleanEmail],
            subject: `AfriGuide Verification Code: ${fourDigitCode}`,
            text: `Your AfriGuide verification code is: ${fourDigitCode}\n\nValid for 15 minutes. Enter this code to verify your AfriGuide account.`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 460px; margin: 0 auto; padding: 24px; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
                <h2 style="color: #1E3F32; margin-top: 0;">AfriGuide</h2>
                <p style="font-size: 15px; color: #374151;">Your account verification code is:</p>
                <div style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1E3F32; padding: 12px 0;">
                  ${fourDigitCode}
                </div>
                <p style="font-size: 13px; color: #6b7280;">Valid for 15 minutes. If you did not request this, please ignore this email.</p>
              </div>
            `,
          }),
        });
        const resendData = await resendRes.json();
        if (resendRes.ok && resendData.id) {
          emailDelivered = true;
        } else {
          deliveryError = resendData.message || "Resend API error";
          console.warn("Resend failed, falling back to SMTP:", deliveryError);
        }
      } catch (rErr) {
        console.warn("Resend fetch caught:", rErr);
      }
    }

    // Option B: High-deliverability SMTP (Gmail or Brevo/SendGrid)
    if (!emailDelivered && smtpUser && smtpPass) {
      const emailOptions = {
        from: emailFrom,
        replyTo: smtpUser,
        to: cleanEmail,
        subject: `Your AfriGuide verification code is ${fourDigitCode}`,
        text: `Hello,\n\nYour AfriGuide 4-digit verification code is: ${fourDigitCode}\n\nEnter this code on the verification screen to activate your account. This code is valid for 15 minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nGerald Chibanda\nAfriGuide Platform`,
        html: `
          <div style="font-family: Arial, sans-serif; font-size: 15px; color: #222222; line-height: 1.5; max-width: 500px; margin: 0 auto; padding: 20px;">
            <p style="font-size: 18px; font-weight: bold; color: #1E3F32; margin-bottom: 16px;">
              AfriGuide Verification Code
            </p>
            <p>Hello,</p>
            <p>Your 4-digit verification code for AfriGuide is:</p>
            <div style="margin: 20px 0; padding: 16px 24px; background-color: #f7f9f8; border-left: 4px solid #1E3F32; display: inline-block;">
              <span style="font-size: 30px; font-weight: bold; letter-spacing: 6px; color: #1E3F32; font-family: monospace;">
                ${fourDigitCode}
              </span>
            </div>
            <p style="color: #555555; font-size: 14px;">This code is valid for <strong>15 minutes</strong>.</p>
            <p style="color: #777777; font-size: 13px; margin-top: 24px;">
              If you didn't create an AfriGuide account, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 24px 0 16px 0;" />
            <p style="font-size: 12px; color: #888888; margin: 0;">
              AfriGuide • Zimbabwe
            </p>
          </div>
        `,
      };

      // Attempt 1: Port 465 (SSL)
      try {
        const transporter465 = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort === 587 ? 587 : 465,
          secure: smtpPort !== 587,
          auth: { user: smtpUser, pass: smtpPass },
          tls: { rejectUnauthorized: false },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
        });

        await transporter465.sendMail(emailOptions);
        emailDelivered = true;
      } catch (err465: unknown) {
        console.warn("SMTP primary port failed, attempting Port 587 fallback:", err465);
        // Attempt 2: Port 587 (TLS Fallback for cloud/serverless networks that block 465)
        try {
          const transporter587 = nodemailer.createTransport({
            host: smtpHost,
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
