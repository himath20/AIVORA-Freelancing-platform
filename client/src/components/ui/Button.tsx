"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "nexora-btn-primary",
    secondary: "nexora-btn-secondary",
    ghost: "nexora-btn-ghost",
    danger: "bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm active:scale-95",
  };
  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(variants[variant], size !== "md" ? sizes[size] : "", "flex items-center gap-2", className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
