"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { projects, assignments, payments } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Briefcase, DollarSign, Users, FileText, ArrowRight } from "lucide-react";
import { revenueChartData } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

export default function ClientDashboard() {
  const myProjects = projects.filter((p) => p.clientId === "c1");
  const totalSpent = payments.filter((p) => p.fromId === "c1").reduce((s, p) => s + (p.status === "completed" ? p.amount : 0), 0);

  const activity = [
    { icon: "📋", text: "New proposal received for 'AI Analytics Dashboard'", time: "30m ago" },
    { icon: "✅", text: "Alex Johnson accepted assignment for 'E-commerce Chatbot'", time: "2h ago" },
    { icon: "💳", text: "Payment of $950 processed successfully", time: "1d ago" },
  ];

  return (
    <DashboardLayout variant="client">
      <div className="relative bg-gradient-to-r from-[#003135] via-[#00454a] to-[#14757d] rounded-2xl p-6 mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Welcome, TechCorp Ltd. 🏢</h1>
        <p className="text-violet-200 text-sm">Manage your AI projects and find top talent</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Active Projects" value={String(myProjects.filter((p) => p.status === "open" || p.status === "in_progress").length)} change="+1 this month" positive icon={<Briefcase className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-100" />
        <StatCard label="Total Spent" value={formatCurrency(totalSpent)} change="+18%" positive icon={<DollarSign className="w-5 h-5 text-green-600" />} iconBg="bg-green-100" />
        <StatCard label="Total Projects" value={String(myProjects.length)} icon={<FileText className="w-5 h-5 text-violet-600" />} iconBg="bg-violet-100" />
        <StatCard label="Freelancers Hired" value="8" change="+2" positive icon={<Users className="w-5 h-5 text-orange-600" />} iconBg="bg-orange-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="nexora-card p-6 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-5">Spending Overview</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), "Spending"]} contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
              <Bar dataKey="secondary" fill="#003135" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* My projects quick view */}
        <div className="nexora-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-sm">My Projects</h2>
            <Link href="/client/projects" className="text-xs text-violet-600 font-medium">View All →</Link>
          </div>
          <div className="space-y-3">
            {myProjects.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{p.title}</p>
                  <p className="text-xs text-gray-400">{p.proposals} proposals • {formatCurrency(p.budget)}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
          <Link href="/client/create-project" className="nexora-btn-primary w-full text-sm py-2.5 text-center block mt-5">
            + Post New Project
          </Link>
        </div>
      </div>

      {/* Activity */}
      <div className="nexora-card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {activity.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-lg">{a.icon}</span>
              <p className="text-sm text-gray-700 flex-1">{a.text}</p>
              <span className="text-xs text-gray-400 flex-shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
