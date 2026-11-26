"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SearchBar } from "@/components/ui/SearchBar";
import { DataTable } from "@/components/ui/DataTable";
import { clients } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, Globe, Eye, Ban } from "lucide-react";
import { ClientProfile } from "@/types";

export default function AdminClientsPage() {
  const [query, setQuery] = useState("");
  const filtered = clients.filter((c) => c.organizationName.toLowerCase().includes(query.toLowerCase()));

  const columns = [
    {
      key: "organizationName", header: "Organization",
      render: (r: ClientProfile) => (
        <div className="flex items-center gap-3">
          <img src={r.logo} alt={r.organizationName} className="w-9 h-9 rounded-lg" />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-medium text-gray-900 text-sm">{r.organizationName}</p>
              {r.verified && <CheckCircle className="w-3.5 h-3.5 text-violet-600" />}
            </div>
            <p className="text-xs text-gray-400">{r.industry}</p>
          </div>
        </div>
      )
    },
    { key: "location", header: "Location", render: (r: ClientProfile) => <span className="text-xs text-gray-500">{r.location}</span> },
    { key: "projectsPosted", header: "Projects", render: (r: ClientProfile) => <span className="text-sm text-gray-700">{r.projectsPosted}</span> },
    { key: "totalSpent", header: "Total Spent", render: (r: ClientProfile) => <span className="font-semibold text-gray-900">{formatCurrency(r.totalSpent)}</span> },
    { key: "memberSince", header: "Since", render: (r: ClientProfile) => <span className="text-xs text-gray-500">{r.memberSince}</span> },
    {
      key: "actions", header: "",
      render: () => (
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-violet-100 rounded-lg text-violet-600"><Eye className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-red-100 rounded-lg text-red-500"><Ban className="w-4 h-4" /></button>
        </div>
      )
    },
  ];

  return (
    <DashboardLayout variant="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage all client organizations</p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900">All Clients ({filtered.length})</h2>
          <SearchBar placeholder="Search clients..." value={query} onChange={setQuery} className="w-72" />
        </div>
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} />
      </Card>
    </DashboardLayout>
  );
}
