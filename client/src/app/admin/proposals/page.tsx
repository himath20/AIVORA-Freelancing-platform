"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import { proposals } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";
import { Proposal } from "@/types";

export default function AdminProposalsPage() {
  const columns = [
    { key: "projectTitle", header: "Project", render: (r: Proposal) => <span className="font-medium text-gray-900 max-w-[200px] block truncate">{r.projectTitle}</span> },
    { key: "freelancerName", header: "Freelancer", render: (r: Proposal) => (
      <div className="flex items-center gap-2">
        <img src={r.freelancerAvatar} alt={r.freelancerName} className="w-7 h-7 rounded-full" />
        <span className="text-sm">{r.freelancerName}</span>
      </div>
    )},
    { key: "bidAmount", header: "Bid", render: (r: Proposal) => <span className="font-bold">{formatCurrency(r.bidAmount)}</span> },
    { key: "deliveryDays", header: "Days", render: (r: Proposal) => <span className="text-sm">{r.deliveryDays}d</span> },
    { key: "status", header: "Status", render: (r: Proposal) => <StatusBadge status={r.status} /> },
    { key: "submittedAt", header: "Submitted", render: (r: Proposal) => <span className="text-xs text-gray-500">{formatDate(r.submittedAt)}</span> },
    { key: "actions", header: "", render: () => (
      <button className="p-1.5 hover:bg-violet-100 rounded-lg text-violet-600"><Eye className="w-4 h-4" /></button>
    )},
  ];

  return (
    <DashboardLayout variant="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Proposal Monitoring</h1>
        <p className="text-gray-500 text-sm mt-1">Oversee all proposals submitted on the platform</p>
      </div>
      <Card>
        <h2 className="font-semibold text-gray-900 mb-5">All Proposals ({proposals.length})</h2>
        <DataTable columns={columns} data={proposals as unknown as Record<string, unknown>[]} />
      </Card>
    </DashboardLayout>
  );
}
