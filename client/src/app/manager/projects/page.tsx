"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import { projects } from "@/lib/data";
import { projectsChartData } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { FolderKanban, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Project } from "@/types";

export default function ManagerProjectsPage() {
  const columns = [
    { key: "title", header: "Project", render: (r: Project) => <span className="font-medium text-gray-900 max-w-[200px] block truncate">{r.title}</span> },
    { key: "clientName", header: "Client" },
    { key: "category", header: "Category", render: (r: Project) => <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{r.category}</span> },
    { key: "budget", header: "Budget", render: (r: Project) => <span className="font-bold">{formatCurrency(r.budget)}</span> },
    { key: "proposals", header: "Proposals" },
    { key: "status", header: "Status", render: (r: Project) => <StatusBadge status={r.status} /> },
    { key: "deadline", header: "Deadline", render: (r: Project) => <span className="text-xs text-gray-500">{r.deadline}</span> },
  ];

  return (
    <DashboardLayout variant="manager">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Project Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Strategic overview of all platform projects</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        <StatCard label="Total" value={String(projects.length)} icon={<FolderKanban className="w-5 h-5 text-violet-600" />} iconBg="bg-violet-100" />
        <StatCard label="Open" value={String(projects.filter((p) => p.status === "open").length)} icon={<Clock className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-100" />
        <StatCard label="In Progress" value={String(projects.filter((p) => p.status === "in_progress").length)} icon={<AlertTriangle className="w-5 h-5 text-orange-600" />} iconBg="bg-orange-100" />
        <StatCard label="Completed" value={String(projects.filter((p) => p.status === "completed").length)} icon={<CheckCircle className="w-5 h-5 text-green-600" />} iconBg="bg-green-100" />
      </div>

      <div className="nexora-card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-5">Monthly Project Volume</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={projectsChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
            <Bar dataKey="value" fill="#7c3aed" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Card>
        <h2 className="font-semibold text-gray-900 mb-5">All Projects</h2>
        <DataTable columns={columns} data={projects as unknown as Record<string, unknown>[]} />
      </Card>
    </DashboardLayout>
  );
}
