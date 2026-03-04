export interface ResumeExtractionSettings {
  provider: "google" | "openrouter";
  googleApiKey: string;
  openrouterApiKey: string;
}

const STORAGE_KEY = "resumeExtractionSettings:v1";

const DEFAULT_SETTINGS: ResumeExtractionSettings = {
  provider: "google",
  googleApiKey: "",
  openrouterApiKey: "",
};

export function getResumeExtractionSettings(): ResumeExtractionSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<ResumeExtractionSettings>;

    return {
      provider:
        parsed.provider === "openrouter" || parsed.provider === "google"
          ? parsed.provider
          : "google",
      googleApiKey:
        typeof parsed.googleApiKey === "string" ? parsed.googleApiKey.trim() : "",
      openrouterApiKey:
        typeof parsed.openrouterApiKey === "string"
          ? parsed.openrouterApiKey.trim()
          : "",
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function setResumeExtractionSettings(
  next: ResumeExtractionSettings,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        provider: next.provider,
        googleApiKey: next.googleApiKey.trim(),
        openrouterApiKey: next.openrouterApiKey.trim(),
      }),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearResumeExtractionSettings(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
