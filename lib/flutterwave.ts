/**
 * Flutterwave v3 API Integration Helpers
 */

export function getFlutterwaveSecretKey(): string {
  const rawKey = process.env.FLW_SECRET_KEY || process.env.FLW_CLIENT_SECRET || "";
  return rawKey.replace(/^["']|["']$/g, "").trim();
}

export function getFlutterwavePublicKey(): string {
  const rawKey = process.env.FLW_PUBLIC_KEY || process.env.FLW_CLIENT_ID || "";
  return rawKey.replace(/^["']|["']$/g, "").trim();
}

export function getFlutterwaveHeaders() {
  const secretKey = getFlutterwaveSecretKey();
  return {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };
}
