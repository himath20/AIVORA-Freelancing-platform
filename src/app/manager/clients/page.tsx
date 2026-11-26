"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { clients } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Building2, DollarSign, FolderKanban, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ClientProfile } from "@/types";

export default function ManagerClientsPage() {
  const spendingByClient = clients.map((c) => ({ name: c.organizationName.split(" ")[0], spent: c.totalSpent }));

  const columns = [
    { key: "organizationName", header: "Organization", render: (r: ClientProfile) => (
      <div className="flex items-center gap-3">
        <img src={r.logo} alt={r.organizationName} className="w-8 h-8 rounded-lg" />
        <div>
          <p className="font-medium text-sm">{r.organizationName}</p>
          <p className="text-xs text-gray-400">{r.industry}</p>
        </div>
      </div>
    )},
    { key: "location", header: "Location", render: (r: ClientProfile) => <span className="text-xs">{r.location}</span> },
    { key: "projectsPosted", header: "Projects" },
    { key: "totalSpent", header: "Total Spent", render: (r: ClientProfile) => <span className="font-bold">{formatCurrency(r.totalSpent)}</span> },
    { key: "memberSince", header: "Since", render: (r: ClientProfile) => <span className="text-xs">{r.memberSince}</span> },
    { key: "verified", header: "Verified", render: (r: ClientProfile) => r.verified ? <CheckCircle className="w-4 h-4 text-green-600" /> : <span className="text-xs text-gray-400">No</span> },
  ];

  return (
    <DashboardLayout variant="manager">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Client Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Insights on client activity and spending</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Clients" value={String(clients.length)} icon={<Building2 className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-100" />
        <StatCard label="Total Spent" value={formatCurrency(clients.reduce((s, c) => s + c.totalSpent, 0))} icon={<DollarSign className="w-5 h-5 text-green-600" />} iconBg="bg-green-100" />
        <StatCard label="Total Projects" value={String(clients.reduce((s, c) => s + c.projectsPosted, 0))} icon={<FolderKanban className="w-5 h-5 text-violet-600" />} iconBg="bg-violet-100" />
        <StatCard label="Verified" value={String(clients.filter((c) => c.verified).length)} icon={<CheckCircle className="w-5 h-5 text-green-600" />} iconBg="bg-green-100" />
      </div>

      <div className="nexora-card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-5">Spending by Client</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={spendingByClient}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip formatter={(v: number) => [formatCurrency(v), "Spent"]} contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
            <Bar dataKey="spent" fill="#6d28d9" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Card>
        <h2 className="font-semibold text-gray-900 mb-5">Client Details</h2>
        <DataTable columns={columns} data={clients as unknown as Record<string, unknown>[]} />
      </Card>
    </DashboardLayout>
  );
}
