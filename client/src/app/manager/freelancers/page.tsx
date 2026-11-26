"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import { freelancers } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Users, Star, CheckCircle, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FreelancerProfile } from "@/types";

export default function ManagerFreelancersPage() {
  const earningsByFreelancer = freelancers.map((f) => ({ name: f.name.split(" ")[0], earnings: f.totalEarnings }));
  const avgRating = (freelancers.reduce((s, f) => s + f.rating, 0) / freelancers.length).toFixed(1);

  const columns = [
    { key: "name", header: "Freelancer", render: (r: FreelancerProfile) => (
      <div className="flex items-center gap-3">
        <img src={r.avatar} alt={r.name} className="w-8 h-8 rounded-full" />
        <div>
          <p className="font-medium text-sm">{r.name}</p>
          <p className="text-xs text-gray-400">{r.title.slice(0, 30)}...</p>
        </div>
      </div>
    )},
    { key: "location", header: "Location", render: (r: FreelancerProfile) => <span className="text-xs">{r.location}</span> },
    { key: "rating", header: "Rating", render: (r: FreelancerProfile) => <span className="flex items-center gap-1 font-medium"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{r.rating}</span> },
    { key: "completedProjects", header: "Projects" },
    { key: "totalEarnings", header: "Earnings", render: (r: FreelancerProfile) => <span className="font-bold">{formatCurrency(r.totalEarnings)}</span> },
    { key: "hourlyRate", header: "Rate", render: (r: FreelancerProfile) => <span>${r.hourlyRate}/hr</span> },
    { key: "availability", header: "Status", render: (r: FreelancerProfile) => <StatusBadge status={r.availability} /> },
  ];

  return (
    <DashboardLayout variant="manager">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Freelancer Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Insights on platform freelancer performance</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Freelancers" value={String(freelancers.length)} icon={<Users className="w-5 h-5 text-violet-600" />} iconBg="bg-violet-100" />
        <StatCard label="Avg Rating" value={avgRating} icon={<Star className="w-5 h-5 text-yellow-500" />} iconBg="bg-yellow-100" />
        <StatCard label="Verified" value={String(freelancers.filter((f) => f.verified).length)} icon={<CheckCircle className="w-5 h-5 text-green-600" />} iconBg="bg-green-100" />
        <StatCard label="Total Paid Out" value={formatCurrency(freelancers.reduce((s, f) => s + f.totalEarnings, 0))} icon={<TrendingUp className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-100" />
      </div>

      <div className="nexora-card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-5">Earnings by Freelancer</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={earningsByFreelancer}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip formatter={(v: number) => [formatCurrency(v), "Earnings"]} contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
            <Bar dataKey="earnings" fill="#7c3aed" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Card>
        <h2 className="font-semibold text-gray-900 mb-5">Freelancer Performance</h2>
        <DataTable columns={columns} data={freelancers as unknown as Record<string, unknown>[]} />
      </Card>
    </DashboardLayout>
  );
}
