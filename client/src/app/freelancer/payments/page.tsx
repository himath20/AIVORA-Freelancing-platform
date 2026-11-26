"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import { payments } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Payment } from "@/types";

export default function FreelancerPaymentsPage() {
  const myPayments = payments.filter((p) => p.toId === "f1");
  const total = myPayments.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const pending = myPayments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  const columns = [
    {
      key: "projectTitle", header: "Project",
      render: (row: Payment) => <span className="font-medium text-gray-900">{row.projectTitle}</span>
    },
    { key: "fromName", header: "From", render: (row: Payment) => <span className="text-gray-600">{row.fromName}</span> },
    {
      key: "amount", header: "Amount",
      render: (row: Payment) => <span className="font-bold text-gray-900">{formatCurrency(row.amount)}</span>
    },
    { key: "status", header: "Status", render: (row: Payment) => <StatusBadge status={row.status} /> },
    { key: "method", header: "Method", render: (row: Payment) => <span className="text-xs text-gray-500">{row.method}</span> },
    { key: "date", header: "Date", render: (row: Payment) => <span className="text-xs text-gray-500">{formatDate(row.date)}</span> },
  ];

  return (
    <DashboardLayout variant="freelancer">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 text-sm mt-1">Track your earnings and payment history</p>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        <Card className="flex items-center gap-4 !p-5">
          <div className="p-3 bg-green-100 rounded-xl"><DollarSign className="w-5 h-5 text-green-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Total Earned</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 !p-5">
          <div className="p-3 bg-yellow-100 rounded-xl"><Clock className="w-5 h-5 text-yellow-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(pending)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 !p-5">
          <div className="p-3 bg-violet-100 rounded-xl"><TrendingUp className="w-5 h-5 text-violet-600" /></div>
          <div>
            <p className="text-xs text-gray-500">This Month</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold text-gray-900 mb-5">Payment History</h2>
        <DataTable columns={columns} data={myPayments as unknown as Record<string, unknown>[]} emptyMessage="No payments yet." />
      </Card>
    </DashboardLayout>
  );
}
