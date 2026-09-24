import nodemailer from "nodemailer";
import { Resend } from "resend";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "102.212.246.122",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // Required for port 587 STARTTLS
  auth: {
    user: process.env.SMTP_USER || "admission@subwayschools.com", // Exact singular match
    pass: process.env.SMTP_PASS || "@Asanga123",
  },
  tls: {
    rejectUnauthorized: false, // Prevents certificate hostname mismatch drops
  },
  pool: true,
  maxConnections: 3,
  maxMessages: 50,
});

/**
 * Send 6-digit OTP verification email via official SMTP (Subway Schools)
 * with graceful fallback to Resend SDK.
 * Styles the email with Subway Schools executive dark energy palette.
 * Always logs `[OTP DISPATCH -> email]: code` to the server terminal.
 */
export async function sendVerificationOtpEmail(
  email: string,
  code: string,
  name?: string
): Promise<{ success: boolean; data?: any; error?: any }> {
  // Always log to terminal so local testing and offline execution are never blocked
  console.log(`[OTP DISPATCH -> ${email}]: ${code}`);

  const from = process.env.EMAIL_FROM || "Subway Schools <admission@subwayschools.com>";
  const greeting = name ? `Hello ${name},` : "Hello,";
  const subject = `${code} is your Subway Schools verification code`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${code} - Subway Schools Verification Code</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
      <div style="max-width: 560px; margin: 40px auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
        <!-- Brand Header -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #334155;">
          <div style="display: inline-block; padding: 6px 14px; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 9999px; margin-bottom: 12px;">
            <span style="color: #38bdf8; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">Solar Engineering Academy</span>
          </div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 0.05em; color: #ffffff; text-transform: uppercase;">
            SUBWAY SCHOOLS
          </h1>
        </div>

        <!-- Content Body -->
        <div style="padding: 36px 32px;">
          <p style="font-size: 16px; color: #e2e8f0; margin-top: 0; margin-bottom: 16px;">
            ${greeting}
          </p>
          <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 28px;">
            Thank you for registering your engineering candidate profile. Please use the following 6-digit confirmation PIN to complete your verification and activate your classroom credentials:
          </p>

          <!-- 6-digit OTP Box -->
          <div style="background-color: #0f172a; border: 1px solid #38bdf8; border-radius: 12px; padding: 22px 16px; text-align: center; margin-bottom: 28px; box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.4);">
            <span style="font-family: 'Courier New', Courier, monospace, monospace; font-size: 38px; font-weight: 800; letter-spacing: 14px; color: #38bdf8; display: inline-block; padding-left: 14px;">
              ${code}
            </span>
          </div>

          <!-- Expiration Notice -->
          <div style="background-color: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 13px; color: #fbbf24; font-weight: 500;">
              ⏳ <strong>Notice:</strong> This verification code is single-use and will expire in 15 minutes.
            </p>
          </div>

          <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">
            If you did not request this registration, you can safely ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #0f172a; padding: 20px 24px; text-align: center; border-top: 1px solid #334155;">
          <p style="margin: 0; font-size: 12px; color: #64748b;">
            © 2026 Subway Energy Limited & Subway Schools. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Prioritize SMTP (Subway Schools Official Mail via direct cPanel IP)
  try {
    const info = await transporter.sendMail({
      from,
      to: email,
      subject,
      html,
    });
    console.log(`[SMTP Success]: Verification OTP dispatched to ${email}: ${info.messageId}`);
    return { success: true, data: info };
  } catch (smtpErr) {
    console.error("[SMTP Error]: Failed sending via SMTP:", smtpErr);
    // Fall through to Resend fallback if configured
  }

  // 2. Fallback to Resend SDK if RESEND_API_KEY is available
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend = new Resend(apiKey);
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_EMAIL_FROM || "Subway Schools <onboarding@resend.dev>",
        to: [email],
        subject,
        html,
      });

      if (error) {
        console.error("[Resend Fallback Error]:", error);
        return { success: false, error };
      }

      console.log(`[Resend Success]: Verification OTP dispatched to ${email}`);
      return { success: true, data };
    } catch (resendErr) {
      console.error("[Resend Fallback Exception]:", resendErr);
      return { success: false, error: resendErr };
    }
  }

  console.warn("[Mail Warning]: Neither SMTP nor Resend API key is operational.");
  return { success: false, error: "No operational email service configured" };
}

// Backwards compatibility alias
export const sendOtpEmail = sendVerificationOtpEmail;

