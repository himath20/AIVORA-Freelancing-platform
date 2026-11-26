"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import { projects } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Users, Eye } from "lucide-react";
import { Project } from "@/types";

export default function AdminProjectsPage() {
  const columns = [
    { key: "title", header: "Project", render: (r: Project) => <span className="font-medium text-gray-900 max-w-[200px] block truncate">{r.title}</span> },
    { key: "clientName", header: "Client", render: (r: Project) => (
      <div className="flex items-center gap-2">
        <img src={r.clientLogo} alt={r.clientName} className="w-7 h-7 rounded-lg" />
        <span className="text-sm">{r.clientName}</span>
      </div>
    )},
    { key: "category", header: "Category", render: (r: Project) => <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{r.category}</span> },
    { key: "budget", header: "Budget", render: (r: Project) => <span className="font-bold">{formatCurrency(r.budget)}</span> },
    { key: "proposals", header: "Proposals", render: (r: Project) => <span className="flex items-center gap-1 text-sm"><Users className="w-3.5 h-3.5 text-gray-400" />{r.proposals}</span> },
    { key: "status", header: "Status", render: (r: Project) => <StatusBadge status={r.status} /> },
    { key: "deadline", header: "Deadline", render: (r: Project) => <span className="text-xs text-gray-500">{r.deadline}</span> },
    { key: "actions", header: "", render: () => (
      <button className="p-1.5 hover:bg-violet-100 rounded-lg text-violet-600"><Eye className="w-4 h-4" /></button>
    )},
  ];

  return (
    <DashboardLayout variant="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Project Monitoring</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor all projects across the platform</p>
      </div>
      <Card>
        <h2 className="font-semibold text-gray-900 mb-5">All Projects ({projects.length})</h2>
        <DataTable columns={columns} data={projects as unknown as Record<string, unknown>[]} />
      </Card>
    </DashboardLayout>
  );
}
