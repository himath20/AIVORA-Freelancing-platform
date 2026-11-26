"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, User, Zap, Briefcase, Search,
  FileText, ClipboardList, FolderKanban, CreditCard,
  Star, Settings, HelpCircle, Rocket, ChevronDown,
  Users, BarChart3, Building2, TrendingUp,
  MessageSquare, ListChecks, Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarVariant = "freelancer" | "client" | "admin" | "manager";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const freelancerNav: NavItem[] = [
  { label: "Dashboard", href: "/freelancer", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "My Profile", href: "/freelancer/profile", icon: <User className="w-4 h-4" /> },
  { label: "AI Skills", href: "/freelancer/skills", icon: <Zap className="w-4 h-4" /> },
  { label: "My Services", href: "/freelancer/services", icon: <Briefcase className="w-4 h-4" /> },
  { label: "Browse Projects", href: "/freelancer/browse", icon: <Search className="w-4 h-4" /> },
  { label: "Submit Proposals", href: "/freelancer/submit-proposal", icon: <FileText className="w-4 h-4" /> },
  { label: "My Proposals", href: "/freelancer/proposals", icon: <ClipboardList className="w-4 h-4" />, badge: 3 },
  { label: "Assignments", href: "/freelancer/assignments", icon: <FolderKanban className="w-4 h-4" /> },
  { label: "Project Tracking", href: "/freelancer/tracking", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "Payments", href: "/freelancer/payments", icon: <CreditCard className="w-4 h-4" /> },
  { label: "Reviews", href: "/freelancer/reviews", icon: <Star className="w-4 h-4" /> },
];

const clientNav: NavItem[] = [
  { label: "Dashboard", href: "/client", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Organization Profile", href: "/client/profile", icon: <Building2 className="w-4 h-4" /> },
  { label: "Create Project", href: "/client/create-project", icon: <FileText className="w-4 h-4" /> },
  { label: "Project Requirements", href: "/client/requirements", icon: <ListChecks className="w-4 h-4" /> },
  { label: "Manage Projects", href: "/client/projects", icon: <FolderKanban className="w-4 h-4" /> },
  { label: "View Proposals", href: "/client/proposals", icon: <ClipboardList className="w-4 h-4" /> },
  { label: "Assignments", href: "/client/assignments", icon: <Briefcase className="w-4 h-4" /> },
  { label: "Payments", href: "/client/payments", icon: <CreditCard className="w-4 h-4" /> },
  { label: "Reviews", href: "/client/reviews", icon: <Star className="w-4 h-4" /> },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Freelancers", href: "/admin/freelancers", icon: <Users className="w-4 h-4" /> },
  { label: "Clients", href: "/admin/clients", icon: <Building2 className="w-4 h-4" /> },
  { label: "AI Skills", href: "/admin/skills", icon: <Zap className="w-4 h-4" /> },
  { label: "AI Services", href: "/admin/services", icon: <Briefcase className="w-4 h-4" /> },
  { label: "Projects", href: "/admin/projects", icon: <FolderKanban className="w-4 h-4" /> },
  { label: "Proposals", href: "/admin/proposals", icon: <ClipboardList className="w-4 h-4" /> },
  { label: "Payments", href: "/admin/payments", icon: <CreditCard className="w-4 h-4" /> },
  { label: "Complaints", href: "/admin/complaints", icon: <MessageSquare className="w-4 h-4" />, badge: 2 },
];

const managerNav: NavItem[] = [
  { label: "Analytics", href: "/manager", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "Project Reports", href: "/manager/projects", icon: <FolderKanban className="w-4 h-4" /> },
  { label: "Freelancer Reports", href: "/manager/freelancers", icon: <Users className="w-4 h-4" /> },
  { label: "Client Reports", href: "/manager/clients", icon: <Building2 className="w-4 h-4" /> },
  { label: "Revenue Reports", href: "/manager/revenue", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Payment Reports", href: "/manager/payments", icon: <CreditCard className="w-4 h-4" /> },
  { label: "AI Service Reports", href: "/manager/services", icon: <Zap className="w-4 h-4" /> },
];

const navMap: Record<SidebarVariant, NavItem[]> = {
  freelancer: freelancerNav,
  client: clientNav,
  admin: adminNav,
  manager: managerNav,
};

const userMap: Record<SidebarVariant, { name: string; role: string; avatar: string }> = {
  freelancer: { name: "Alex Johnson", role: "Freelancer", avatar: "https://i.pravatar.cc/150?img=1" },
  client: { name: "TechCorp Ltd.", role: "Client", avatar: "https://i.pravatar.cc/150?img=20" },
  admin: { name: "Sarah Chen", role: "Administrator", avatar: "https://i.pravatar.cc/150?img=30" },
  manager: { name: "Robert Mills", role: "Manager", avatar: "https://i.pravatar.cc/150?img=33" },
};

const portals: { label: string; href: string; key: SidebarVariant | "landing" }[] = [
  { label: "Freelancer Portal", href: "/freelancer", key: "freelancer" },
  { label: "Client Portal", href: "/client", key: "client" },
  { label: "Admin Portal", href: "/admin", key: "admin" },
  { label: "Manager Portal", href: "/manager", key: "manager" },
  { label: "Public Site", href: "/landing", key: "landing" },
];

interface SidebarProps {
  variant: SidebarVariant;
}

export function Sidebar({ variant }: SidebarProps) {
  const pathname = usePathname();
  const nav = navMap[variant];
  const user = userMap[variant];
  const [switcherOpen, setSwitcherOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#17182f] text-slate-300 flex flex-col z-30 shadow-[4px_0_18px_rgba(23,24,47,0.08)]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/landing" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-violet-900/40">
            <span className="text-white font-extrabold text-sm">N</span>
          </div>
          <div>
            <span className="font-bold text-white text-lg tracking-tight">NEXORA</span>
            <p className="text-[9px] text-slate-400 leading-none -mt-0.5">Where AI Talent Meets Opportunity</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {nav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-md shadow-violet-900/30"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {item.icon}
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "text-xs font-bold px-1.5 py-0.5 rounded-full",
                    isActive ? "bg-white/20 text-white" : "bg-violet-600 text-white"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-2 border-t border-white/10 space-y-0.5">
        <Link href="/landing" className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
          <Home className="w-4 h-4" /> Public Marketplace
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
          <Settings className="w-4 h-4" /> Settings
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
          <HelpCircle className="w-4 h-4" /> Help & Support
        </Link>
      </div>

      {/* Upgrade banner (freelancer only) */}
      {variant === "freelancer" && (
        <div className="mx-3 mb-3 p-3.5 bg-gradient-to-br from-violet-900/60 to-indigo-900/60 border border-violet-500/20 rounded-xl text-white">
          <div className="flex items-center gap-2 mb-1.5">
            <Rocket className="w-4 h-4 text-violet-300" />
            <span className="font-semibold text-sm">Upgrade to Pro</span>
          </div>
          <p className="text-[11px] text-slate-300 mb-2.5 leading-snug">Get more opportunities and higher visibility.</p>
          <button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs py-1.5 rounded-lg transition-colors">
            Go Pro →
          </button>
        </div>
      )}

      {/* User & Portal Switcher */}
      <div className="px-3 pb-4 relative">
        {switcherOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#1e2038] border border-white/10 rounded-xl shadow-2xl p-1.5 z-50">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 px-2.5 py-1 font-semibold">Switch Portal (Demo)</p>
            {portals.map((p) => (
              <Link
                key={p.key}
                href={p.href}
                onClick={() => setSwitcherOpen(false)}
                className={cn(
                  "block px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  p.key === variant ? "bg-violet-600 text-white" : "text-slate-300 hover:bg-white/10"
                )}
              >
                {p.label}
              </Link>
            ))}
          </div>
        )}
        <button
          onClick={() => setSwitcherOpen(!switcherOpen)}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors text-left"
        >
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/40" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", switcherOpen && "rotate-180")} />
        </button>
      </div>
    </aside>
  );
}
