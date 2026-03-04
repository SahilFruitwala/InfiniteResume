"use client";

export function smoothScrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({ behavior: "smooth" });
  window.history.pushState(null, "", `#${id}`);
}
