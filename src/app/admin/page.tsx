"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { freelancers, clients, projects, payments, complaints } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Users, Building2, FolderKanban, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
import { projectsChartData } from "@/lib/data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const openComplaints = complaints.filter((c) => c.status === "open" || c.status === "investigating").length;

  const recentProjects = projects.slice(0, 5);

  return (
    <DashboardLayout variant="admin">
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm">Platform overview & management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
        <StatCard label="Freelancers" value={String(freelancers.length)} icon={<Users className="w-5 h-5 text-violet-600" />} iconBg="bg-violet-100" />
        <StatCard label="Clients" value={String(clients.length)} icon={<Building2 className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-100" />
        <StatCard label="Projects" value={String(projects.length)} icon={<FolderKanban className="w-5 h-5 text-green-600" />} iconBg="bg-green-100" />
        <StatCard label="Revenue" value={formatCurrency(totalRevenue)} icon={<DollarSign className="w-5 h-5 text-green-600" />} iconBg="bg-green-100" />
        <StatCard label="Open Issues" value={String(openComplaints)} icon={<AlertTriangle className="w-5 h-5 text-orange-600" />} iconBg="bg-orange-100" />
        <StatCard label="Growth" value="+18%" positive change="this month" icon={<TrendingUp className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="nexora-card p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Projects Over Time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={projectsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
              <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: "#7c3aed" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="nexora-card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Projects</h2>
          <div className="space-y-3">
            {recentProjects.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.clientLogo} alt={p.clientName} className="w-8 h-8 rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                  <p className="text-xs text-gray-400">{p.clientName}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={p.status} />
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(p.budget)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Manage Freelancers", href: "/admin/freelancers", icon: "👤", color: "bg-violet-50 border-violet-100" },
          { label: "Manage Clients", href: "/admin/clients", icon: "🏢", color: "bg-blue-50 border-blue-100" },
          { label: "View Complaints", href: "/admin/complaints", icon: "⚠️", color: "bg-orange-50 border-orange-100" },
          { label: "Payment Records", href: "/admin/payments", icon: "💳", color: "bg-green-50 border-green-100" },
        ].map((item) => (
          <a key={item.label} href={item.href} className={`nexora-card border ${item.color} p-5 text-center hover:shadow-md transition-shadow cursor-pointer`}>
            <span className="text-3xl block mb-2">{item.icon}</span>
            <p className="text-sm font-semibold text-gray-700">{item.label}</p>
          </a>
        ))}
      </div>
    </DashboardLayout>
  );
}
