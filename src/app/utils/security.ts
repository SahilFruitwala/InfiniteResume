import DOMPurify from "isomorphic-dompurify";

const ALLOWED_RICH_TEXT_TAGS = ["ul", "li", "b", "strong", "i", "em", "u", "br", "p"];

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export function sanitizeRichText(input: string | null | undefined): string {
  return DOMPurify.sanitize(input ?? "", {
    ALLOWED_TAGS: ALLOWED_RICH_TEXT_TAGS,
    ALLOWED_ATTR: [],
    ALLOW_UNKNOWN_PROTOCOLS: false,
  });
}

export function sanitizeExternalUrl(rawUrl: string | null | undefined): string | null {
  const value = rawUrl?.trim();
  if (!value) {
    return null;
  }

  const hasScheme = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value);
  const candidate = hasScheme ? value : `https://${value}`;

  try {
    const parsed = new URL(candidate);
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function formatExternalUrlForDisplay(rawUrl: string | null | undefined): string {
  const safeUrl = sanitizeExternalUrl(rawUrl);
  if (!safeUrl) {
    return "";
  }

  return safeUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
