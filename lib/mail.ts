/**
 * Google Apps Script HTTPS Relay Transport
 * Dispatches all emails via the GMAIL_RELAY_URL Web App endpoint.
 */
export const transporter = null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const relayUrl = process.env.GMAIL_RELAY_URL;
  if (!relayUrl) {
    throw new Error('GMAIL_RELAY_URL environment variable is missing');
  }

  const response = await fetch(relayUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, html }),
  });

  const data = await response.json();
  console.log('[GMAIL RELAY DISPATCH SUCCESS]:', data);
  return data;
}

/**
 * Branded HTML email template for Subway Schools candidate verification codes.
 */
export function getOtpEmailTemplate({
  otp,
  candidateName,
}: {
  otp: string;
  candidateName?: string;
}): string {
  const greeting = candidateName ? `Welcome to Subway Schools, ${candidateName}!` : "Welcome to Subway Schools!";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subway Schools Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050a14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #050a14; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #0b1528; border: 1px solid #1e293b; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 35px 30px 20px; background: linear-gradient(180deg, #0f1c36 0%, #0b1528 100%); border-bottom: 1px solid #1e293b;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1.5px; color: #ffffff; text-transform: uppercase;">
                SUBWAY SCHOOLS
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8; letter-spacing: 0.5px;">
                Building Africa's Next Generation of Energy Professionals
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 30px 24px; text-align: center;">
              <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #f8fafc;">
                ${greeting}
              </h2>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Thank you for taking the first step toward professional solar and stationary energy storage certification. Use the verification code below to confirm your candidate profile:
              </p>

              <!-- OTP Code Display Card -->
              <div style="background-color: #070d18; border: 1px solid #fbbf24; border-radius: 10px; padding: 18px 24px; margin: 0 auto 24px; display: inline-block;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #fbbf24; font-family: 'Courier New', Courier, monospace;">
                  ${otp}
                </span>
              </div>

              <p style="margin: 0 0 16px; font-size: 13px; color: #94a3b8;">
                This code will expire in <strong>10 minutes</strong>. If you did not register for an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #070d18; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                © 2026 Subway Schools. All rights reserved.
              </p>
              <p style="margin: 6px 0 0; font-size: 11px; color: #475569;">
                Need help? Contact support or message your admissions instructor.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Builds the executive dark styled Subway Schools OTP verification email template.
 */
export function getOtpEmailHtml(code: string, name?: string): { subject: string; html: string } {
  const subject = `${code} is your Subway Schools verification code`;
  const html = getOtpEmailTemplate({ otp: code, candidateName: name });
  return { subject, html };
}

/**
 * Send 6-digit OTP verification email via Google Apps Script relay.
 * Always logs `[OTP DISPATCH -> email]: code` to the server terminal.
 */
export async function sendVerificationOtpEmail(
  email: string,
  code: string,
  name?: string
): Promise<{ success: boolean; data?: any; error?: any }> {
  console.log(`[OTP DISPATCH -> ${email}]: ${code}`);

  const { subject, html } = getOtpEmailHtml(code, name);

  try {
    const info = await sendEmail({
      to: email,
      subject,
      html,
    });
    return { success: true, data: info };
  } catch (error) {
    console.error(`[OTP DISPATCH ERROR -> ${email}]:`, error);
    return { success: false, error };
  }
}

// Backwards compatibility alias
export const sendOtpEmail = sendVerificationOtpEmail;

export interface EnrollmentReceiptParams {
  toEmail: string;
  studentName?: string;
  courseTitle: string;
  courseSlug: string;
  amount: number;
  txRef: string;
  paymentDate?: string | Date;
}

/**
 * Send official course enrollment & payment receipt email via Google Apps Script relay.
 */
export async function sendEnrollmentReceiptEmail({
  toEmail,
  studentName,
  courseTitle,
  courseSlug,
  amount,
  txRef,
  paymentDate = new Date(),
}: EnrollmentReceiptParams): Promise<{ success: boolean; data?: any; error?: any }> {
  console.log(`[RECEIPT DISPATCH -> ${toEmail}]: ${courseTitle} (₦${Number(amount).toLocaleString()}) - Ref: ${txRef}`);

  const greeting = studentName ? `Hello ${studentName},` : "Hello Student,";
  const subject = `Payment Confirmed: Enrollment Receipt for ${courseTitle}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://subwayschools.com";
  const classroomUrl = `${appUrl}/learn/${courseSlug}`;

  const formattedDate = paymentDate instanceof Date 
    ? paymentDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }) 
    : String(paymentDate);

  const rawPhone = process.env.NEXT_PUBLIC_INSTRUCTOR_WHATSAPP || "2347012715632";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  const whatsappMsg = `Hi, I paid for ${courseTitle}. I'd like to get access to the videos.\n\nStudent: ${studentName || toEmail}\nRef: ${txRef}`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Receipt - ${courseTitle}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
      <div style="max-width: 600px; margin: 40px auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
        <!-- Brand Header -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #334155;">
          <div style="display: inline-block; padding: 6px 14px; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 9999px; margin-bottom: 12px;">
            <span style="color: #38bdf8; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">Official Tuition & Enrollment Receipt</span>
          </div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 0.05em; color: #ffffff; text-transform: uppercase;">
            SUBWAY SCHOOLS
          </h1>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">
            Solar Engineering & Renewable Energy Academy
          </p>
        </div>

        <!-- Content Body -->
        <div style="padding: 36px 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #10b981; font-size: 24px; font-weight: bold;">
              ✓
            </div>
            <h2 style="margin: 12px 0 4px 0; font-size: 20px; font-weight: 800; color: #ffffff;">
              Payment Confirmed
            </h2>
            <p style="margin: 0; font-size: 14px; color: #94a3b8;">
              Your classroom enrollment has been activated successfully.
            </p>
          </div>

          <p style="font-size: 15px; color: #e2e8f0; margin-top: 0; margin-bottom: 20px;">
            ${greeting}
          </p>
          <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">
            We have received your tuition fee for <strong>${courseTitle}</strong>. Below is your official transaction summary and classroom access credentials:
          </p>

          <!-- Receipt Details Card -->
          <div style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Course Program:</td>
                <td style="padding: 8px 0; color: #f8fafc; font-weight: 600; text-align: right;">${courseTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Amount Paid:</td>
                <td style="padding: 8px 0; color: #38bdf8; font-family: monospace; font-size: 16px; font-weight: 800; text-align: right;">₦${Number(amount).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Transaction Ref:</td>
                <td style="padding: 8px 0; color: #e2e8f0; font-family: monospace; font-size: 12px; text-align: right;">${txRef}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Date & Time:</td>
                <td style="padding: 8px 0; color: #e2e8f0; font-size: 13px; text-align: right;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Status:</td>
                <td style="padding: 8px 0; color: #10b981; font-weight: 700; text-align: right;">ACTIVE / PAID</td>
              </tr>
            </table>
          </div>

          <!-- Primary CTA: Go to Classroom -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${classroomUrl}" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4); text-align: center;">
              Go to Classroom & Start Learning →
            </a>
          </div>

          <!-- Secondary WhatsApp Instructor CTA -->
          <div style="background-color: rgba(37, 211, 102, 0.08); border: 1px solid rgba(37, 211, 102, 0.3); border-radius: 10px; padding: 16px 20px; text-align: center; margin-bottom: 24px;">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #86efac; font-weight: 500;">
              💬 Need direct assistance from the instructor or video access support?
            </p>
            <a href="${whatsappUrl}" style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 13px;">
              Contact Instructor on WhatsApp
            </a>
          </div>

          <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 0; text-align: center;">
            Keep this receipt for your records. If you experience any login or technical issues, reach out to our admissions team at <a href="mailto:admission@subwayschools.com" style="color: #38bdf8; text-decoration: none;">admission@subwayschools.com</a>.
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

  try {
    const info = await sendEmail({
      to: toEmail,
      subject,
      html,
    });
    return { success: true, data: info };
  } catch (error) {
    console.error(`[RECEIPT DISPATCH ERROR -> ${toEmail}]:`, error);
    return { success: false, error };
  }
}
