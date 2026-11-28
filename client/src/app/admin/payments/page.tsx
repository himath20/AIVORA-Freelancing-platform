"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { apiRequest } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Search,
} from "lucide-react";

interface Payment {
  payment_id: number;
  assignment_id: number;
  amount: number;
  platform_fee: number;
  payment_method: string;
  payment_type: string;
  status: string;
  payment_date: string;
  project_title: string;
  client_name: string;
  freelancer_name: string;
}

interface PaymentResponse {
  message: string;
  total: number;
  payments: Payment[];
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in again.");
        return;
      }

      const data = await apiRequest<PaymentResponse>(
        "/api/admin/payments",
        { token }
      );

      setPayments(data.payments || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load payments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const completed = payments.filter(
    (p) => p.status.toUpperCase() === "COMPLETED"
  );

  const pending = payments.filter(
    (p) => p.status.toUpperCase() === "PENDING"
  );

  const failed = payments.filter(
    (p) => p.status.toUpperCase() === "FAILED"
  );

  const totalRevenue = completed.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  const pendingAmount = pending.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  const filteredPayments = payments.filter((payment) =>
    [
      payment.payment_id,
      payment.project_title,
      payment.client_name,
      payment.freelancer_name,
      payment.status,
      payment.payment_method,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      case "REFUNDED":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout variant="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Payment Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor platform transactions and payment records.
            </p>
          </div>

          <button
            onClick={fetchPayments}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Payments</p>
              <DollarSign className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mt-3">{payments.length}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Completed Revenue</p>
              <CheckCircle className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mt-3">
              {formatCurrency(totalRevenue)}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Pending Amount</p>
              <Clock className="text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold mt-3">
              {formatCurrency(pendingAmount)}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Failed Payments</p>
              <AlertTriangle className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mt-3">{failed.length}</h2>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              All Transactions
            </h2>

            <div className="relative w-full sm:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search payments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-center py-10 text-gray-500">
              Loading payments...
            </p>
          ) : filteredPayments.length === 0 ? (
            <p className="text-center py-10 text-gray-500">
              No payment records found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-3">Payment ID</th>
                    <th className="p-3">Project</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Freelancer</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.payment_id} className="hover:bg-gray-50">
                      <td className="p-3 font-mono">
                        #{payment.payment_id}
                      </td>
                      <td className="p-3 font-medium text-gray-900">
                        {payment.project_title}
                      </td>
                      <td className="p-3">{payment.client_name}</td>
                      <td className="p-3">{payment.freelancer_name}</td>
                      <td className="p-3 font-semibold">
                        {formatCurrency(Number(payment.amount))}
                      </td>
                      <td className="p-3">
                        {payment.payment_method}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500">
                        {formatDate(payment.payment_date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}