"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import { payments } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DollarSign, TrendingUp, Clock } from "lucide-react";
import { Payment } from "@/types";

export default function ClientPaymentsPage() {
  const myPayments = payments.filter((p) => p.fromId === "c1" || p.fromId === "c2" || p.fromId === "c3");
  const totalSpent = myPayments.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const pending = myPayments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  const columns = [
    { key: "projectTitle", header: "Project", render: (r: Payment) => <span className="font-medium text-gray-900">{r.projectTitle}</span> },
    { key: "toName", header: "Freelancer", render: (r: Payment) => <span className="text-gray-600">{r.toName}</span> },
    { key: "amount", header: "Amount", render: (r: Payment) => <span className="font-bold text-gray-900">{formatCurrency(r.amount)}</span> },
    { key: "status", header: "Status", render: (r: Payment) => <StatusBadge status={r.status} /> },
    { key: "method", header: "Method", render: (r: Payment) => <span className="text-xs text-gray-500">{r.method}</span> },
    { key: "date", header: "Date", render: (r: Payment) => <span className="text-xs text-gray-500">{formatDate(r.date)}</span> },
    {
      key: "action", header: "",
      render: (r: Payment) => r.status === "pending" ? (
        <button className="nexora-btn-primary text-xs py-1.5 px-3">Pay Now</button>
      ) : null
    },
  ];

  return (
    <DashboardLayout variant="client">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all project payments</p>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        <Card className="flex items-center gap-4 !p-5">
          <div className="p-3 bg-green-100 rounded-xl"><DollarSign className="w-5 h-5 text-green-600" /></div>
          <div><p className="text-xs text-gray-500">Total Spent</p><p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p></div>
        </Card>
        <Card className="flex items-center gap-4 !p-5">
          <div className="p-3 bg-yellow-100 rounded-xl"><Clock className="w-5 h-5 text-yellow-600" /></div>
          <div><p className="text-xs text-gray-500">Pending</p><p className="text-2xl font-bold text-gray-900">{formatCurrency(pending)}</p></div>
        </Card>
        <Card className="flex items-center gap-4 !p-5">
          <div className="p-3 bg-violet-100 rounded-xl"><TrendingUp className="w-5 h-5 text-violet-600" /></div>
          <div><p className="text-xs text-gray-500">Transactions</p><p className="text-2xl font-bold text-gray-900">{myPayments.length}</p></div>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold text-gray-900 mb-5">Payment History</h2>
        <DataTable columns={columns} data={myPayments as unknown as Record<string, unknown>[]} />
      </Card>
    </DashboardLayout>
  );
}
