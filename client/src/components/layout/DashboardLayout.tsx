"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

type SidebarVariant = "freelancer" | "client" | "admin" | "manager";

interface DashboardLayoutProps {
  children: ReactNode;
  variant: SidebarVariant;
}

export function DashboardLayout({ children, variant }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar variant={variant} />
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-7 xl:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
