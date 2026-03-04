export interface ResumeExtractionSettings {
  provider: "google" | "openrouter";
  googleApiKey: string;
  openrouterApiKey: string;
}

const PROVIDER_STORAGE_KEY = "resumeExtractionProvider:v1";

const DEFAULT_SETTINGS: ResumeExtractionSettings = {
  provider: "google",
  googleApiKey: "",
  openrouterApiKey: "",
};

let inMemorySettings: ResumeExtractionSettings = { ...DEFAULT_SETTINGS };

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

export function setResumeExtractionSettings(
  next: ResumeExtractionSettings,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    inMemorySettings = {
      provider: next.provider,
      googleApiKey: next.googleApiKey.trim(),
      openrouterApiKey: next.openrouterApiKey.trim(),
    };
    window.localStorage.setItem(PROVIDER_STORAGE_KEY, next.provider);
    return true;
  } catch {
    inMemorySettings = {
      provider: next.provider,
      googleApiKey: next.googleApiKey.trim(),
      openrouterApiKey: next.openrouterApiKey.trim(),
    };
    return true;
  }
}

export function clearResumeExtractionSettings(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    inMemorySettings = { ...DEFAULT_SETTINGS };
    window.localStorage.removeItem(PROVIDER_STORAGE_KEY);
    return true;
  } catch {
    inMemorySettings = { ...DEFAULT_SETTINGS };
    return true;
  }
}
