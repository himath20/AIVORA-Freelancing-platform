"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

import {
  Briefcase,
  DollarSign,
  Users,
  FileText,
  Clock,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// =====================================
// CLIENT DASHBOARD API RESPONSE
// =====================================

interface ClientDashboardResponse {
  message: string;

  statistics: {
    activeProjects: number;
    totalProjects: number;
    freelancersHired: number;
    totalSpent: number;
    pendingPayments: number;
  };

  projects: {
    project_id: number;
    title: string;
    status: string;
    budget_min: number;
    budget_max: number;
    proposal_count: number;
  }[];

  spending: {
    year: number;
    month: number;
    total: number;
  }[];
}

// =====================================
// CLIENT DASHBOARD
// =====================================

export default function ClientDashboard() {
  const [dashboard, setDashboard] =
    useState<ClientDashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================
  // FETCH CLIENT DASHBOARD DATA
  // =====================================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your dashboard.");
          return;
        }

        const response =
          await apiRequest<ClientDashboardResponse>(
            "/api/dashboard/client",
            { token }
          );

        setDashboard(response);
      } catch (err) {
        console.error("Client dashboard error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // =====================================
  // LOADING STATE
  // =====================================

  if (loading) {
    return (
      <DashboardLayout variant="client">
        <div className="p-10 text-center text-gray-500">
          Loading your dashboard...
        </div>
      </DashboardLayout>
    );
  }

  // =====================================
  // ERROR STATE
  // =====================================

  if (error) {
    return (
      <DashboardLayout variant="client">
        <div className="nexora-card p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboard) {
    return null;
  }

  const { statistics, projects, spending } = dashboard;

  // =====================================
  // CHART DATA
  // =====================================

  const spendingChartData = spending.map((item) => ({
    month: new Date(
      item.year,
      item.month - 1
    ).toLocaleString("en", { month: "short" }),

    total: Number(item.total),
  }));

  // =====================================
  // DASHBOARD UI
  // =====================================

  return (
    <DashboardLayout variant="client">

      {/* Welcome Banner */}

      <div className="relative bg-gradient-to-r from-[#003135] via-[#00454a] to-[#14757d] rounded-2xl p-6 mb-8">

        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome to Your Dashboard 🏢
        </h1>

        <p className="text-violet-200 text-sm">
          Manage your AI projects and find top talent
        </p>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">

        <StatCard
          label="Active Projects"
          value={String(statistics.activeProjects)}
          icon={
            <Briefcase className="w-5 h-5 text-blue-600" />
          }
          iconBg="bg-blue-100"
        />

        <StatCard
          label="Total Spent"
          value={formatCurrency(Number(statistics.totalSpent))}
          icon={
            <DollarSign className="w-5 h-5 text-green-600" />
          }
          iconBg="bg-green-100"
        />

        <StatCard
          label="Pending Payments"
          value={formatCurrency(Number(statistics.pendingPayments))}
          icon={
            <Clock className="w-5 h-5 text-amber-600" />
          }
          iconBg="bg-amber-100"
        />

        <StatCard
          label="Total Projects"
          value={String(statistics.totalProjects)}
          icon={
            <FileText className="w-5 h-5 text-violet-600" />
          }
          iconBg="bg-violet-100"
        />

        <StatCard
          label="Freelancers Hired"
          value={String(statistics.freelancersHired)}
          icon={
            <Users className="w-5 h-5 text-orange-600" />
          }
          iconBg="bg-orange-100"
        />

      </div>

      {/* Spending Overview and Projects */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Spending Chart */}

        <div className="nexora-card p-6 lg:col-span-2">

          <h2 className="font-semibold text-gray-900 mb-5">
            Spending Overview
          </h2>

          {spendingChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>

              <BarChart data={spendingChartData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 12,
                    fill: "#9ca3af",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 12,
                    fill: "#9ca3af",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(Number(value)),
                    "Spending",
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                />

                <Bar
                  dataKey="total"
                  fill="#003135"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 py-16 text-center">
              No spending data available yet.
            </p>
          )}

        </div>

        {/* My Projects */}

        <div className="nexora-card p-6">

          <div className="flex items-center justify-between mb-4">

            <h2 className="font-semibold text-gray-900 text-sm">
              My Projects
            </h2>

            <Link
              href="/client/projects"
              className="text-xs text-violet-600 font-medium"
            >
              View All →
            </Link>

          </div>

          <div className="space-y-3">

            {projects.length > 0 ? (
              projects.map((project) => (

                <div
                  key={project.project_id}
                  className="flex items-center gap-3"
                >

                  <div className="flex-1 min-w-0">

                    <p className="text-xs font-medium text-gray-900 truncate">
                      {project.title}
                    </p>

                    <p className="text-xs text-gray-400">
                      {project.proposal_count} proposals
                    </p>

                    <p className="text-xs text-gray-400">
                      Budget: {formatCurrency(Number(project.budget_min))}
                      {" - "}
                      {formatCurrency(Number(project.budget_max))}
                    </p>

                  </div>

                  <StatusBadge
                    status={project.status.toLowerCase()}
                  />

                </div>

              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">
                You haven't posted any projects yet.
              </p>
            )}

          </div>

          <Link
            href="/client/create-project"
            className="nexora-btn-primary w-full text-sm py-2.5 text-center block mt-5"
          >
            + Post New Project
          </Link>

        </div>

      </div>

    </DashboardLayout>
  );
}