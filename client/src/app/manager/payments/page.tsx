"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import { payments } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DollarSign, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Payment } from "@/types";

export default function ManagerPaymentsPage() {
  const completed = payments.filter((p) => p.status === "completed");
  const totalCompleted = completed.reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const failedCount = payments.filter((p) => p.status === "failed").length;

  const methodBreakdown = [
    { method: "Stripe", count: 2, amount: formatCurrency(2850) },
    { method: "PayPal", count: 1, amount: formatCurrency(1700) },
    { method: "Bank Transfer", count: 1, amount: formatCurrency(1500) },
  ];

  const columns = [
    { key: "id", header: "ID", render: (r: Payment) => <span className="text-xs font-mono text-gray-500">#{r.id}</span> },
    { key: "projectTitle", header: "Project", render: (r: Payment) => <span className="font-medium text-gray-900 max-w-[180px] block truncate">{r.projectTitle}</span> },
    { key: "fromName", header: "Client" },
    { key: "toName", header: "Freelancer" },
    { key: "amount", header: "Amount", render: (r: Payment) => <span className="font-bold">{formatCurrency(r.amount)}</span> },
    { key: "status", header: "Status", render: (r: Payment) => <StatusBadge status={r.status} /> },
    { key: "method", header: "Method" },
    { key: "date", header: "Date", render: (r: Payment) => <span className="text-xs">{formatDate(r.date)}</span> },
  ];

  return (
    <DashboardLayout variant="manager">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Comprehensive payment analysis and reporting</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        <StatCard label="Completed" value={formatCurrency(totalCompleted)} icon={<DollarSign className="w-5 h-5 text-green-600" />} iconBg="bg-green-100" />
        <StatCard label="Pending" value={formatCurrency(totalPending)} icon={<Clock className="w-5 h-5 text-yellow-600" />} iconBg="bg-yellow-100" />
        <StatCard label="Transactions" value={String(payments.length)} icon={<CheckCircle className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-100" />
        <StatCard label="Failed" value={String(failedCount)} icon={<AlertTriangle className="w-5 h-5 text-red-600" />} iconBg="bg-red-100" />
      </div>

      {/* Method breakdown */}
      <Card className="mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Payment Methods</h2>
        <div className="grid grid-cols-3 gap-4">
          {methodBreakdown.map((m) => (
            <div key={m.method} className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="font-semibold text-gray-900">{m.method}</p>
              <p className="text-2xl font-bold text-violet-700 mt-1">{m.amount}</p>
              <p className="text-xs text-gray-500 mt-0.5">{m.count} transactions</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-gray-900 mb-5">All Payments</h2>
        <DataTable columns={columns} data={payments as unknown as Record<string, unknown>[]} />
      </Card>
    </DashboardLayout>
  );
}
