import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// In-memory server store for 4-digit verification codes (email -> { code, expiresAt })
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

    // 2. Store code for 15 minutes
    otpStore.set(cleanEmail, {
      code: fourDigitCode,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    // 3. Attempt delivery via SMTP (Gmail, custom SMTP, etc.)
    let emailDelivered = false;
    let deliveryError: string | null = null;
    const smtpUser = process.env.SMTP_USER?.trim();
    const rawPass = process.env.SMTP_PASS?.trim();
    const smtpPass = rawPass ? rawPass.replace(/\s+/g, "") : null;
    const smtpHost = process.env.SMTP_HOST || (smtpUser?.includes("@gmail.com") ? "smtp.gmail.com" : null);

    if (smtpUser && smtpPass) {
      try {
        const isGmail = smtpUser.includes("@gmail.com") || smtpHost === "smtp.gmail.com";
        const transporter = isGmail
          ? nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: smtpUser,
                pass: smtpPass,
              },
            })
          : nodemailer.createTransport({
              host: smtpHost || "smtp.gmail.com",
              port: Number(process.env.SMTP_PORT) || 465,
              secure: (Number(process.env.SMTP_PORT) || 465) === 465,
              auth: {
                user: smtpUser,
                pass: smtpPass,
              },
            });

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || `"AfriGuide" <${smtpUser}>`,
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
        });

        emailDelivered = true;
      } catch (mailError: unknown) {
        deliveryError = mailError instanceof Error ? mailError.message : "SMTP delivery failed";
        console.error("SMTP send error:", deliveryError);
      }
    }

    return NextResponse.json({
      success: true,
      emailDelivered,
      code: fourDigitCode,
      message: emailDelivered
        ? `A 4-digit code has been sent to ${cleanEmail}`
        : `Your 4-digit verification code is: ${fourDigitCode}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process verification";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
