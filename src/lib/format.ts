// Formatting utilities used across client components

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function formatDate(input: string | Date | null | undefined): string {
  if (!input) return "Unknown";
  const date = typeof input === "string" ? new Date(input) : input;
  if (isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatMonthYear(input: string | Date | null | undefined): string {
  if (!input) return "Unknown";
  const date = typeof input === "string" ? new Date(input) : input;
  if (isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export function timeAgo(input: string | Date | null | undefined): string {
  if (!input) return "";
  const date = typeof input === "string" ? new Date(input) : input;
  if (isNaN(date.getTime())) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export function formatDateTime(input: string | Date | null | undefined): string {
  if (!input) return "Unknown";
  const date = typeof input === "string" ? new Date(input) : input;
  if (isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
