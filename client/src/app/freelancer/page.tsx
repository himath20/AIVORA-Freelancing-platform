"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { earningsChartData, projects } from "@/lib/data";
import { DollarSign, Briefcase, FileText, Star, Cpu, Sparkles } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import Link from "next/link";

export default function FreelancerDashboard() {
  const upcoming = [
    { title: "AI Chatbot Development", due: "Jun 25, 2025", daysLeft: 2, color: "bg-red-100 text-red-700" },
    { title: "Data Analysis Dashboard", due: "Jun 28, 2025", daysLeft: 5, color: "bg-amber-100 text-amber-700" },
    { title: "ML Model Training", due: "Jul 02, 2025", daysLeft: 9, color: "bg-violet-100 text-violet-700" },
  ];

  const activity = [
    { icon: "✅", title: "Proposal Accepted", desc: 'Your proposal for "AI Content Generator" was accepted.', time: "2h ago" },
    { icon: "💰", title: "Payment Received", desc: 'You received $1,500 for "Website AI Integration".', time: "4h ago" },
    { icon: "⭐", title: "New Review", desc: "You received a 5-star review from TechCorp Ltd.", time: "1d ago" },
  ];

  const popularProjects = projects.filter((p) => p.status === "open").slice(0, 3);

  return (
    <DashboardLayout variant="freelancer">
      {/* Welcome banner */}
      <div className="relative min-h-[154px] bg-gradient-to-r from-white via-violet-50 to-violet-100 border border-violet-200/80 rounded-2xl px-7 py-8 mb-7 overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-[48%] overflow-hidden pointer-events-none">
          <div className="absolute -right-12 -bottom-20 w-72 h-72 rounded-full border-[38px] border-violet-300/30" />
          <div className="absolute right-36 top-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#003135] to-[#14757d] rotate-12 shadow-xl shadow-violet-300/50 flex items-center justify-center">
            <Cpu className="w-7 h-7 text-white" />
          </div>
          <div className="absolute right-14 top-1/2 -translate-y-1/2 w-32 h-32 rounded-[42%_58%_56%_44%] bg-gradient-to-br from-[#14757d] to-[#003135] shadow-2xl shadow-violet-300/40 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white/90" />
          </div>
          <div className="absolute right-52 top-16 w-2 h-2 rounded-full bg-white shadow-[22px_18px_0_white,44px_-8px_0_rgba(255,255,255,.8)]" />
        </div>
        <div className="relative z-10 max-w-xl">
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#003135] mb-1.5">Welcome back, Alex! <span className="text-3xl">👋</span></h1>
          <p className="text-gray-600 text-base">Here&apos;s your latest activity and opportunities.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Earnings" value="$12,450" change="+12%" positive icon={<DollarSign className="w-5 h-5 text-violet-600" />} iconBg="bg-violet-100" />
        <StatCard label="Active Projects" value="4" change="+1 new" positive icon={<Briefcase className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-100" />
        <StatCard label="Proposals Sent" value="18" change="+20%" positive icon={<FileText className="w-5 h-5 text-violet-600" />} iconBg="bg-violet-100" />
        <StatCard label="Rating" value="4.9" change="+0.1" positive icon={<Star className="w-5 h-5 text-emerald-600" />} iconBg="bg-emerald-100" />
      </div>

      {/* Charts & Side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Earnings chart */}
        <div className="nexora-card p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Earnings Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Peak month: <span className="font-semibold text-violet-700">$7,250</span></p>
            </div>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={earningsChartData}>
              <defs>
                <linearGradient id="earnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#003135" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#003135" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), "Earnings"]} contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
              <Area type="monotone" dataKey="value" stroke="#003135" strokeWidth={2.5} fill="url(#earnings)" dot={{ fill: "#003135", strokeWidth: 2, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Profile complete + Deadlines */}
        <div className="lg:col-span-2 grid grid-cols-1 xl:grid-cols-[minmax(0,1.8fr)_minmax(150px,.75fr)] gap-5">
          {/* Upcoming deadlines */}
          <div className="nexora-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 text-sm">Upcoming Deadlines</h2>
              <Link href="/freelancer/tracking" className="text-xs text-violet-600 font-medium">View All →</Link>
            </div>
            <div className="space-y-3">
              {upcoming.map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400">Due: {item.due}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${item.color}`}>
                    {item.daysLeft} days left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile completion */}
          <div className="nexora-card p-4 bg-gradient-to-br from-white to-violet-50/40 flex flex-col justify-center">
            <div className="flex items-center justify-center mb-2">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="85 15" strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-900">85%</span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm text-center">Profile Complete</h3>
            <p className="text-[11px] leading-snug text-gray-500 text-center mt-1">Great! Your profile is almost complete.</p>
            <Link href="/freelancer/profile" className="nexora-btn-primary w-full mt-3 text-xs py-2 block text-center">
              Complete Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* Activity & Popular Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="nexora-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
            <Link href="/freelancer/proposals" className="text-sm text-violet-600 font-medium">View All →</Link>
          </div>
          <div className="space-y-4">
            {activity.map((a) => (
              <div key={a.title} className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{a.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-500">{a.desc}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="nexora-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">Popular Projects</h2>
            <Link href="/freelancer/browse" className="text-sm text-violet-600 font-medium">View All →</Link>
          </div>
          <div className="space-y-4">
            {popularProjects.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.clientLogo} alt={p.clientName} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                  <p className="text-xs text-gray-500">{p.requiredSkills.slice(0, 3).join(" • ")}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-lg">{formatCurrency(p.budget)}</span>
                  <p className="text-[11px] text-gray-400 mt-1">{p.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
