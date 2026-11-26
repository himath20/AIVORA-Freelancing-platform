import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateStr);
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    open: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
    disputed: "bg-orange-100 text-orange-700",
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    withdrawn: "bg-gray-100 text-gray-600",
    active: "bg-blue-100 text-blue-700",
    paused: "bg-orange-100 text-orange-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-purple-100 text-purple-700",
    investigating: "bg-orange-100 text-orange-700",
    resolved: "bg-green-100 text-green-700",
    dismissed: "bg-gray-100 text-gray-600",
    available: "bg-green-100 text-green-700",
    busy: "bg-orange-100 text-orange-700",
    unavailable: "bg-red-100 text-red-700",
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}
