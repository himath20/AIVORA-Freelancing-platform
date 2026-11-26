"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import { aiServices } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Star, Edit, Eye } from "lucide-react";
import { AIService } from "@/types";

export default function AdminServicesPage() {
  const columns = [
    { key: "title", header: "Service", render: (r: AIService) => <span className="font-medium text-gray-900 max-w-[200px] block truncate">{r.title}</span> },
    { key: "freelancerName", header: "Freelancer", render: (r: AIService) => (
      <div className="flex items-center gap-2">
        <img src={r.freelancerAvatar} alt={r.freelancerName} className="w-7 h-7 rounded-full" />
        <span className="text-sm">{r.freelancerName}</span>
      </div>
    )},
    { key: "category", header: "Category", render: (r: AIService) => <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{r.category}</span> },
    { key: "price", header: "Price", render: (r: AIService) => <span className="font-bold">{formatCurrency(r.price)}</span> },
    { key: "rating", header: "Rating", render: (r: AIService) => <span className="flex items-center gap-1 text-sm"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{r.rating} ({r.reviews})</span> },
    { key: "status", header: "Status", render: (r: AIService) => <StatusBadge status={r.status} /> },
    { key: "actions", header: "", render: () => (
      <div className="flex gap-2">
        <button className="p-1.5 hover:bg-violet-100 rounded-lg text-violet-600"><Eye className="w-4 h-4" /></button>
        <button className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600"><Edit className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <DashboardLayout variant="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Services Management</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor and moderate all AI services on the platform</p>
      </div>
      <Card>
        <h2 className="font-semibold text-gray-900 mb-5">All Services ({aiServices.length})</h2>
        <DataTable columns={columns} data={aiServices as unknown as Record<string, unknown>[]} />
      </Card>
    </DashboardLayout>
  );
}
