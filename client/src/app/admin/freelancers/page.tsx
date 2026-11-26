"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SearchBar } from "@/components/ui/SearchBar";
import { DataTable } from "@/components/ui/DataTable";
import { freelancers } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, Star, MapPin, Eye, Ban } from "lucide-react";
import { FreelancerProfile } from "@/types";

export default function AdminFreelancersPage() {
  const [query, setQuery] = useState("");
  const filtered = freelancers.filter(
    (f) => f.name.toLowerCase().includes(query.toLowerCase()) || f.title.toLowerCase().includes(query.toLowerCase())
  );

  const columns = [
    {
      key: "name", header: "Freelancer",
      render: (row: FreelancerProfile) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt={row.name} className="w-9 h-9 rounded-full" />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-medium text-gray-900 text-sm">{row.name}</p>
              {row.verified && <CheckCircle className="w-3.5 h-3.5 text-violet-600" />}
            </div>
            <p className="text-xs text-gray-400 truncate max-w-[180px]">{row.title}</p>
          </div>
        </div>
      )
    },
    { key: "location", header: "Location", render: (r: FreelancerProfile) => <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{r.location}</span> },
    { key: "rating", header: "Rating", render: (r: FreelancerProfile) => <span className="flex items-center gap-1 text-sm font-medium"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{r.rating}</span> },
    { key: "completedProjects", header: "Projects", render: (r: FreelancerProfile) => <span className="text-sm text-gray-700">{r.completedProjects}</span> },
    { key: "totalEarnings", header: "Earnings", render: (r: FreelancerProfile) => <span className="font-semibold text-gray-900">{formatCurrency(r.totalEarnings)}</span> },
    { key: "availability", header: "Status", render: (r: FreelancerProfile) => <StatusBadge status={r.availability} /> },
    {
      key: "actions", header: "",
      render: (r: FreelancerProfile) => (
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-violet-100 rounded-lg transition-colors text-violet-600"><Eye className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-500"><Ban className="w-4 h-4" /></button>
        </div>
      )
    },
  ];

  return (
    <DashboardLayout variant="admin">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Freelancer Management</h1>
          <p className="text-gray-500 text-sm mt-1">View, verify, and manage all freelancers on the platform</p>
        </div>
        <div className="text-sm text-gray-500">{filtered.length} freelancers total</div>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total", value: freelancers.length, color: "text-gray-900" },
          { label: "Available", value: freelancers.filter((f) => f.availability === "available").length, color: "text-green-600" },
          { label: "Verified", value: freelancers.filter((f) => f.verified).length, color: "text-violet-600" },
          { label: "Avg. Rating", value: (freelancers.reduce((s, f) => s + f.rating, 0) / freelancers.length).toFixed(1), color: "text-yellow-600" },
        ].map((s) => (
          <Card key={s.label} className="text-center !p-5">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900">All Freelancers</h2>
          <SearchBar placeholder="Search freelancers..." value={query} onChange={setQuery} className="w-72" />
        </div>
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} />
      </Card>
    </DashboardLayout>
  );
}
