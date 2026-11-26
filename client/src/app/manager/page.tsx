"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/Card";
import { freelancers, clients, projects, payments, aiServices } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { revenueChartData, projectsChartData } from "@/lib/data";
import { Users, Building2, FolderKanban, DollarSign, TrendingUp, Zap } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";

export default function ManagerAnalyticsPage() {
  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const categoryData = [
    { name: "GenAI", value: 35 },
    { name: "Data Science", value: 25 },
    { name: "Computer Vision", value: 18 },
    { name: "NLP", value: 12 },
    { name: "MLOps", value: 10 },
  ];
  const COLORS = ["#003135", "#004d54", "#14757d", "#479fa6", "#7fbfc4"];

  return (
    <DashboardLayout variant="manager">
      <div className="relative bg-gradient-to-r from-[#003135] to-[#004d54] rounded-2xl p-6 mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Analytics Dashboard</h1>
        <p className="text-violet-200 text-sm">Platform performance & strategic insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} change="+18%" positive icon={<DollarSign className="w-5 h-5 text-green-600" />} iconBg="bg-green-100" />
        <StatCard label="Total Projects" value={String(projects.length)} change="+22%" positive icon={<FolderKanban className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-100" />
        <StatCard label="Freelancers" value={String(freelancers.length)} change="+5%" positive icon={<Users className="w-5 h-5 text-violet-600" />} iconBg="bg-violet-100" />
        <StatCard label="Clients" value={String(clients.length)} change="+3%" positive icon={<Building2 className="w-5 h-5 text-orange-600" />} iconBg="bg-orange-100" />
        <StatCard label="AI Services" value={String(aiServices.length)} change="+12%" positive icon={<Zap className="w-5 h-5 text-violet-600" />} iconBg="bg-violet-100" />
        <StatCard label="Conversion" value="68%" change="+4%" positive icon={<TrendingUp className="w-5 h-5 text-green-600" />} iconBg="bg-green-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue trend */}
        <div className="nexora-card p-6 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-5">Revenue vs Payouts</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#003135" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#003135" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pay" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v: number) => [formatCurrency(v)]} contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
              <Legend />
              <Area type="monotone" dataKey="value" name="Gross Revenue" stroke="#003135" strokeWidth={2.5} fill="url(#rev)" />
              <Area type="monotone" dataKey="secondary" name="Payouts" stroke="#10b981" strokeWidth={2.5} fill="url(#pay)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="nexora-card p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Projects by Category</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {categoryData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects over time */}
      <div className="nexora-card p-6">
        <h2 className="font-semibold text-gray-900 mb-5">New Projects Per Month</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={projectsChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
            <Bar dataKey="value" name="Projects" fill="#003135" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}
