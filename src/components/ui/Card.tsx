"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("nexora-card p-6", className)}>
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: ReactNode;
  iconBg?: string;
}

export function StatCard({ label, value, change, positive, icon, iconBg = "bg-violet-100" }: StatCardProps) {
  return (
    <div className="nexora-card p-5 flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={cn("p-3 rounded-xl", iconBg)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {change && (
          <p className={cn("text-xs font-medium mt-1", positive ? "text-green-600" : "text-red-500")}>
            {positive ? "↑" : "↓"} {change}
          </p>
        )}
      </div>
    </div>
  );
}
