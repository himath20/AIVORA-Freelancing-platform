"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { revenueChartData } from "@/lib/data";
import { payments } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar
} from "recharts";

export default function ManagerRevenuePage() {
  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const totalPayouts = totalRevenue * 0.9;
  const platformFee = totalRevenue * 0.1;

  const monthlyBreakdown = revenueChartData.map((d) => ({
    month: d.month,
    revenue: d.value,
    payouts: d.secondary ?? 0,
    fee: Math.round(d.value * 0.1),
  }));

  return (
    <DashboardLayout variant="manager">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Revenue Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Financial performance and revenue analysis</p>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        <Card className="!p-6 bg-gradient-to-br from-violet-600 to-violet-800 text-white border-0">
          <p className="text-violet-200 text-sm font-medium mb-1">Gross Revenue (YTD)</p>
          <p className="text-4xl font-extrabold">{formatCurrency(totalRevenue)}</p>
          <div className="flex items-center gap-1 mt-2 text-violet-200 text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-300" />
            <span className="text-green-300 font-medium">+18%</span> vs last period
          </div>
        </Card>
        <StatCard label="Total Payouts" value={formatCurrency(totalPayouts)} change="+16%" positive icon={<ArrowDownRight className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-100" />
        <StatCard label="Platform Fees" value={formatCurrency(platformFee)} change="+22%" positive icon={<DollarSign className="w-5 h-5 text-green-600" />} iconBg="bg-green-100" />
      </div>

      <div className="nexora-card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-5">Revenue vs Payouts Trend</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={monthlyBreakdown}>
            <defs>
              <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="payout2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip formatter={(v: number) => [formatCurrency(v)]} contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
            <Legend />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#7c3aed" strokeWidth={2.5} fill="url(#rev2)" />
            <Area type="monotone" dataKey="payouts" name="Payouts" stroke="#10b981" strokeWidth={2.5} fill="url(#payout2)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="nexora-card p-6">
        <h2 className="font-semibold text-gray-900 mb-5">Platform Fee Breakdown</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={monthlyBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip formatter={(v: number) => [formatCurrency(v), "Platform Fee"]} contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
            <Bar dataKey="fee" fill="#a78bfa" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}
