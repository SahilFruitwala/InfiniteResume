/**
 * AES-GCM encryption / decryption for API keys stored in localStorage.
 *
 * The encryption key is derived from the Clerk userId + a fixed app salt
 * via PBKDF2 so that different users on the same browser cannot read each
 * other's keys.  The IV is stored alongside the ciphertext (first 12 bytes).
 */

const APP_SALT = "InfiniteResume::ApiKeyVault::v1";
const ITERATIONS = 100_000;

async function deriveKey(userId: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(userId),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(APP_SALT),
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** Encrypt plaintext → base64(iv + ciphertext) */
export async function encryptData(
  plainText: string,
  userId: string,
): Promise<string> {
  const key = await deriveKey(userId);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plainText);
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded,
  );

  // Concatenate iv + ciphertext into one ArrayBuffer
  const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipherBuffer), iv.length);

  return btoa(String.fromCharCode(...combined));
}

/** Decrypt base64(iv + ciphertext) → plaintext.  Returns null on failure. */
export async function decryptData(
  cipherText: string,
  userId: string,
): Promise<string | null> {
  try {
    const key = await deriveKey(userId);
    const raw = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0));
    const iv = raw.slice(0, 12);
    const data = raw.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data,
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
}
