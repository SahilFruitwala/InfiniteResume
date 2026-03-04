import React from "react";
import {
  formatExternalUrlForDisplay,
  sanitizeExternalUrl,
} from "@/app/utils/security";

interface SafeExternalLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  url: string | null | undefined;
  label?: string;
  display?: "formatted" | "raw";
}

export function SafeExternalLink({
  url,
  label,
  display = "formatted",
  ...anchorProps
}: SafeExternalLinkProps) {
  const safeUrl = sanitizeExternalUrl(url);
  if (!safeUrl) {
    return null;
  }

  const fallbackLabel =
    display === "formatted" ? formatExternalUrlForDisplay(safeUrl) : safeUrl;

  return (
    <a href={safeUrl} {...anchorProps}>
      {label ?? fallbackLabel}
    </a>
  );
}
