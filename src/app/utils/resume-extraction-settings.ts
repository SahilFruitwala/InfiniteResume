import { encryptData, decryptData } from "./crypto-keys";

export interface ResumeExtractionSettings {
  provider: "google" | "openrouter";
  googleApiKey: string;
  openrouterApiKey: string;
}

const PROVIDER_STORAGE_KEY = "resumeExtractionProvider:v1";
const KEYS_STORAGE_KEY = "resumeExtractionKeys:v1";

const DEFAULT_SETTINGS: ResumeExtractionSettings = {
  provider: "google",
  googleApiKey: "",
  openrouterApiKey: "",
};

// In-memory cache so we don't have to decrypt on every read within the same
// page session.  Populated on first successful load or save.
let inMemorySettings: ResumeExtractionSettings = { ...DEFAULT_SETTINGS };

/**
 * Synchronous getter — returns the current **in-memory** settings.
 *
 * Call `loadResumeExtractionSettings(userId)` at least once (e.g. in a
 * top-level useEffect) to hydrate from localStorage.  After that, this
 * function returns the latest values instantly.
 */
export function getResumeExtractionSettings(): ResumeExtractionSettings {
  if (typeof window === "undefined") {
    return inMemorySettings;
  }

  try {
    const rawProvider = window.localStorage.getItem(PROVIDER_STORAGE_KEY);
    const provider: ResumeExtractionSettings["provider"] =
      rawProvider === "openrouter" || rawProvider === "google"
        ? rawProvider
        : "google";

    return {
      ...inMemorySettings,
      provider,
    };
  } catch {
    return inMemorySettings;
  }
}

/**
 * Async loader – reads **and decrypts** keys from localStorage.
 *
 * Should be called once on mount (e.g. inside a `useEffect`) so that
 * the in-memory cache is populated for the rest of the session.
 */
export async function loadResumeExtractionSettings(
  userId?: string,
): Promise<ResumeExtractionSettings> {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };

  const rawProvider = window.localStorage.getItem(PROVIDER_STORAGE_KEY);
  const provider: ResumeExtractionSettings["provider"] =
    rawProvider === "openrouter" || rawProvider === "google"
      ? rawProvider
      : "google";

  let googleApiKey = "";
  let openrouterApiKey = "";

  if (userId) {
    try {
      const blob = window.localStorage.getItem(KEYS_STORAGE_KEY);
      if (blob) {
        const json = await decryptData(blob, userId);
        if (json) {
          const parsed = JSON.parse(json);
          googleApiKey = parsed.googleApiKey ?? "";
          openrouterApiKey = parsed.openrouterApiKey ?? "";
        }
      }
    } catch {
      // Decryption failed — treat as empty
    }
  }

  const settings: ResumeExtractionSettings = {
    provider,
    googleApiKey,
    openrouterApiKey,
  };

  inMemorySettings = settings;
  return settings;
}

/**
 * Save settings — encrypts API keys and writes to localStorage.
 */
export async function setResumeExtractionSettings(
  next: ResumeExtractionSettings,
  userId?: string,
): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const trimmed: ResumeExtractionSettings = {
      provider: next.provider,
      googleApiKey: next.googleApiKey.trim(),
      openrouterApiKey: next.openrouterApiKey.trim(),
    };

    window.localStorage.setItem(PROVIDER_STORAGE_KEY, trimmed.provider);

    if (userId) {
      const payload = JSON.stringify({
        googleApiKey: trimmed.googleApiKey,
        openrouterApiKey: trimmed.openrouterApiKey,
      });
      const encrypted = await encryptData(payload, userId);
      window.localStorage.setItem(KEYS_STORAGE_KEY, encrypted);
    }

    inMemorySettings = trimmed;
    return true;
  } catch {
    // Even if encryption fails, keep the values in memory for this session
    inMemorySettings = {
      provider: next.provider,
      googleApiKey: next.googleApiKey.trim(),
      openrouterApiKey: next.openrouterApiKey.trim(),
    };
    return true;
  }
}

export function clearResumeExtractionSettings(): boolean {
  if (typeof window === "undefined") return false;

  try {
    inMemorySettings = { ...DEFAULT_SETTINGS };
    window.localStorage.removeItem(PROVIDER_STORAGE_KEY);
    window.localStorage.removeItem(KEYS_STORAGE_KEY);
    return true;
  } catch {
    inMemorySettings = { ...DEFAULT_SETTINGS };
    return true;
  }
}
