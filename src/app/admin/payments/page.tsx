"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import { payments } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DollarSign, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import { Payment } from "@/types";

export default function AdminPaymentsPage() {
  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const failed = payments.filter((p) => p.status === "failed").length;

  const columns = [
    { key: "id", header: "ID", render: (r: Payment) => <span className="text-xs font-mono text-gray-500">#{r.id}</span> },
    { key: "projectTitle", header: "Project", render: (r: Payment) => <span className="font-medium text-gray-900 max-w-[180px] block truncate">{r.projectTitle}</span> },
    { key: "fromName", header: "From", render: (r: Payment) => <span className="text-sm">{r.fromName}</span> },
    { key: "toName", header: "To", render: (r: Payment) => <span className="text-sm">{r.toName}</span> },
    { key: "amount", header: "Amount", render: (r: Payment) => <span className="font-bold text-gray-900">{formatCurrency(r.amount)}</span> },
    { key: "status", header: "Status", render: (r: Payment) => <StatusBadge status={r.status} /> },
    { key: "method", header: "Method", render: (r: Payment) => <span className="text-xs text-gray-500">{r.method}</span> },
    { key: "date", header: "Date", render: (r: Payment) => <span className="text-xs text-gray-500">{formatDate(r.date)}</span> },
  ];

  return (
    <DashboardLayout variant="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor all financial transactions on the platform</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        <Card className="flex items-center gap-4 !p-5">
          <div className="p-3 bg-green-100 rounded-xl"><DollarSign className="w-5 h-5 text-green-600" /></div>
          <div><p className="text-xs text-gray-500">Total Revenue</p><p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p></div>
        </Card>
        <Card className="flex items-center gap-4 !p-5">
          <div className="p-3 bg-yellow-100 rounded-xl"><TrendingUp className="w-5 h-5 text-yellow-600" /></div>
          <div><p className="text-xs text-gray-500">Pending</p><p className="text-2xl font-bold text-gray-900">{formatCurrency(pending)}</p></div>
        </Card>
        <Card className="flex items-center gap-4 !p-5">
          <div className="p-3 bg-blue-100 rounded-xl"><CheckCircle className="w-5 h-5 text-blue-600" /></div>
          <div><p className="text-xs text-gray-500">Completed</p><p className="text-2xl font-bold text-gray-900">{payments.filter((p) => p.status === "completed").length}</p></div>
        </Card>
        <Card className="flex items-center gap-4 !p-5">
          <div className="p-3 bg-red-100 rounded-xl"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
          <div><p className="text-xs text-gray-500">Failed</p><p className="text-2xl font-bold text-gray-900">{failed}</p></div>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold text-gray-900 mb-5">All Transactions</h2>
        <DataTable columns={columns} data={payments as unknown as Record<string, unknown>[]} />
      </Card>
    </DashboardLayout>
  );
}
