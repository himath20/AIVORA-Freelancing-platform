"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, msg: "Your proposal for 'AI Content Generator' was accepted.", time: "2h ago", read: false, type: "proposal" },
    { id: 2, msg: "Payment of $1,500 received for 'Website AI Integration'.", time: "4h ago", read: false, type: "payment" },
    { id: 3, msg: "You received a 5-star review from TechCorp Ltd.", time: "1d ago", read: true, type: "review" },
  ];

  return (
    <header className="sticky top-0 z-20 h-[66px] bg-white/95 backdrop-blur-md border-b border-gray-100 px-7 flex items-center gap-6">
      {/* Search */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500 w-4 h-4" />
        <input
          type="text"
          placeholder="Search projects, services, or skills..."
          className="nexora-input pl-11 py-2.5 text-sm bg-white border-transparent shadow-[0_0_0_1px_rgba(17,24,39,0.025)]"
        />
      </div>

      {/* Title section */}
      {title && (
        <div className="flex-1 text-center hidden lg:block">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      )}

      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-fade-in">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <span className="text-xs text-violet-600 font-medium cursor-pointer">Mark all read</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={cn("p-4 hover:bg-gray-50 transition-colors", !n.read && "bg-violet-50/50")}>
                    <p className="text-sm text-gray-700">{n.msg}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-100 text-center">
                <span className="text-sm text-violet-600 font-medium cursor-pointer">View all notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <button className="flex items-center gap-2 hover:bg-gray-100 rounded-xl px-2 py-1.5 transition-colors">
          <img src="https://i.pravatar.cc/150?img=1" alt="User" className="w-8 h-8 rounded-full" />
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </header>
  );
}
