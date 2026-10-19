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
 * Digital payment receipt email template with official Subway Schools branding and logo.
 */
export function getReceiptEmailTemplate({
  studentName,
  courseTitle,
  amountPaid,
  transactionRef,
  paymentDate,
  accessUrl,
  logoUrl = 'https://subwayschools.com/logo.png', // falls back to local public asset or CDN
}: {
  studentName: string;
  courseTitle: string;
  amountPaid: string;
  transactionRef: string;
  paymentDate: string;
  accessUrl: string;
  logoUrl?: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - Subway Schools</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050a14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #050a14; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #0b1528; border: 1px solid #1e293b; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="padding: 35px 30px 22px; background: linear-gradient(180deg, #0f1c36 0%, #0b1528 100%); border-bottom: 1px solid #1e293b;">
              <!-- Subway Schools Logo -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 14px;">
                <tr>
                  <td align="center">
                    <img src="${logoUrl}" alt="Subway Schools Logo" width="140" style="display: block; max-height: 50px; width: auto; object-fit: contain;" onerror="this.style.display='none'" />
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1.5px; color: #ffffff; text-transform: uppercase;">
                SUBWAY SCHOOLS
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8; letter-spacing: 0.5px;">
                Building Africa's Next Generation of Energy Professionals
              </p>
            </td>
          </tr>

          <!-- Receipt Content -->
          <tr>
            <td style="padding: 32px 30px 24px;">
              <div style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 8px; padding: 12px 16px; margin-bottom: 22px; text-align: center;">
                <span style="color: #4ade80; font-weight: 700; font-size: 14px; letter-spacing: 0.5px;">
                  ✓ PAYMENT CONFIRMED & ENROLLMENT ACTIVE
                </span>
              </div>

              <h2 style="margin: 0 0 10px; font-size: 18px; color: #f8fafc;">
                Official Digital Receipt
              </h2>
              <p style="margin: 0 0 22px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Hello <strong>${studentName}</strong>, thank you for completing your tuition payment for <strong>${courseTitle}</strong>. Your candidate access has been unlocked.
              </p>

              <!-- Line Item Details Table -->
              <table width="100%" cellspacing="0" cellpadding="10" style="background-color: #070d18; border: 1px solid #1e293b; border-radius: 8px; margin-bottom: 24px; font-size: 13px;">
                <tr>
                  <td style="color: #94a3b8; border-bottom: 1px solid #1e293b;">Transaction Ref:</td>
                  <td align="right" style="color: #f8fafc; font-weight: 600; border-bottom: 1px solid #1e293b; font-family: monospace;">${transactionRef}</td>
                </tr>
                <tr>
                  <td style="color: #94a3b8; border-bottom: 1px solid #1e293b;">Payment Date:</td>
                  <td align="right" style="color: #f8fafc; border-bottom: 1px solid #1e293b;">${paymentDate}</td>
                </tr>
                <tr>
                  <td style="color: #94a3b8; border-bottom: 1px solid #1e293b;">Enrolled Course:</td>
                  <td align="right" style="color: #f8fafc; font-weight: 600; border-bottom: 1px solid #1e293b;">${courseTitle}</td>
                </tr>
                <tr>
                  <td style="color: #fbbf24; font-weight: 700; font-size: 15px;">Total Amount Paid:</td>
                  <td align="right" style="color: #fbbf24; font-weight: 700; font-size: 17px;">₦${amountPaid}</td>
                </tr>
              </table>

              <!-- Action Link -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${accessUrl}" style="display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4); text-align: center;">
                  Go to Classroom & Start Learning →
                </a>
              </div>

              <!-- Footer Note -->
              <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5; text-align: center;">
                Keep this receipt for your records. If you experience any issues accessing your course, reply directly to this email or message your instructor.
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
                Building Africa's Next Generation of Energy Professionals
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://subwayschools.com";
  const accessUrl = `${appUrl}/learn/${courseSlug}`;

  const formattedDate = paymentDate instanceof Date 
    ? paymentDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }) 
    : String(paymentDate);

  const html = getReceiptEmailTemplate({
    studentName: studentName || "Candidate Student",
    courseTitle,
    amountPaid: Number(amount).toLocaleString(),
    transactionRef: txRef,
    paymentDate: formattedDate,
    accessUrl,
    logoUrl: `${appUrl}/logo.png`,
  });

  const subject = `Payment Confirmed: Enrollment Receipt for ${courseTitle}`;

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
