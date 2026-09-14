/**
 * Email dispatch helper for 6-digit OTP verification.
 * In development, logs prominently to server console: `[DEV OTP CODE]: 123456`.
 * If RESEND_API_KEY is configured in environment, dispatches an executive email via Resend.
 */
export async function sendOtpEmail(email: string, code: string): Promise<void> {
  // Always log clearly to console in development
  console.log("\n=======================================================");
  console.log(`[DEV OTP CODE]: ${code}`);
  console.log(`Target Recipient: ${email}`);
  console.log(`Validity: 15 minutes (Expires at: ${new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString()})`);
  console.log("=======================================================\n");

  // Optional: Dispatch email via Resend if API key is present
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const fromEmail = process.env.EMAIL_FROM || "Solar Engineering Academy <onboarding@resend.dev>";
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          subject: `${code} is your Solar Academy verification code`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background-color: #0b1120; color: #f8fafc; border-radius: 16px; padding: 32px; border: 1px solid #1e293b;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; padding: 8px 16px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 9999px;">
                  <span style="color: #fbbf24; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">Subway Schools · Solar Academy</span>
                </div>
              </div>
              <h2 style="font-size: 22px; font-weight: 800; text-align: center; margin-bottom: 8px; color: #ffffff;">Email Verification</h2>
              <p style="font-size: 14px; color: #94a3b8; text-align: center; margin-bottom: 28px; line-height: 1.6;">
                Use the 6-digit candidate verification code below to verify your institutional profile and activate your academic classroom credentials:
              </p>
              <div style="background-color: #020617; border: 1px solid #334155; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 28px;">
                <span style="font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #fbbf24; display: inline-block; padding-left: 12px;">
                  ${code}
                </span>
              </div>
              <p style="font-size: 12px; color: #64748b; text-align: center; margin-bottom: 0;">
                This code is confidential and expires in 15 minutes. If you did not create a Solar Academy profile, you can safely ignore this email.
              </p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        const errData = await response.text();
        console.warn("[Resend Warning]: Failed to dispatch email via Resend:", errData);
      }
    } catch (err) {
      console.warn("[Resend Warning]: Error dispatching email:", err);
    }
  }
}
