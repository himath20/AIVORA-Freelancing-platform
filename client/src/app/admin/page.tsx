"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { apiRequest } from "@/lib/api";

import {
  Users,
  Building2,
  FolderKanban,
  DollarSign,
  AlertTriangle,
  CreditCard,
  FileText,
  Briefcase,
  Wrench,
  Award,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AdminStatistics {
  totalFreelancers: number;
  totalClients: number;
  totalProjects: number;
  totalRevenue: number;
  openComplaints: number;
}

interface AdminProject {
  project_id: number;
  title: string;
  status: string;
  budget_min: number | null;
  budget_max: number | null;
  clientName: string | null;
}

interface ChartItem {
  year: number;
  month: number;
  totalProjects: number;
}

interface AdminDashboardResponse {
  message: string;
  statistics: AdminStatistics;
  projects: AdminProject[];
  projectsChart: ChartItem[];
}

const managementLinks = [
  {
    label: "Manage Freelancers",
    href: "/admin/freelancers",
    icon: <Users className="w-7 h-7 text-violet-600" />,
    color: "bg-violet-50 border-violet-100",
  },
  {
    label: "Manage Clients",
    href: "/admin/clients",
    icon: <Building2 className="w-7 h-7 text-blue-600" />,
    color: "bg-blue-50 border-blue-100",
  },
  {
    label: "Manage Projects",
    href: "/admin/projects",
    icon: <FolderKanban className="w-7 h-7 text-green-600" />,
    color: "bg-green-50 border-green-100",
  },
  {
    label: "Manage Proposals",
    href: "/admin/proposals",
    icon: <FileText className="w-7 h-7 text-indigo-600" />,
    color: "bg-indigo-50 border-indigo-100",
  },
  {
    label: "Manage Services",
    href: "/admin/services",
    icon: <Briefcase className="w-7 h-7 text-cyan-600" />,
    color: "bg-cyan-50 border-cyan-100",
  },
  {
    label: "Manage Skills",
    href: "/admin/skills",
    icon: <Award className="w-7 h-7 text-pink-600" />,
    color: "bg-pink-50 border-pink-100",
  },
  {
    label: "View Complaints",
    href: "/admin/complaints",
    icon: <AlertTriangle className="w-7 h-7 text-orange-600" />,
    color: "bg-orange-50 border-orange-100",
  },
  {
    label: "Payment Records",
    href: "/admin/payments",
    icon: <CreditCard className="w-7 h-7 text-emerald-600" />,
    color: "bg-emerald-50 border-emerald-100",
  },
];

export default function AdminDashboard() {
  const [statistics, setStatistics] =
    useState<AdminStatistics | null>(null);

  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [chartData, setChartData] = useState<
    { month: string; value: number }[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in as an administrator.");
          return;
        }

        const response =
          await apiRequest<AdminDashboardResponse>(
            "/api/dashboard/admin",
            { token }
          );

        setStatistics(response.statistics);
        setProjects(response.projects || []);

        setChartData(
          (response.projectsChart || []).map((item) => ({
            month: new Date(
              item.year,
              item.month - 1
            ).toLocaleDateString("en-US", {
              month: "short",
            }),
            value: Number(item.totalProjects),
          }))
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  return (
    <DashboardLayout variant="admin">
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Admin Dashboard
        </h1>

        <p className="text-gray-400 text-sm">
          Platform overview & management
        </p>
      </div>

      {loading && (
        <div className="nexora-card p-6 mb-8 text-center text-gray-500">
          Loading dashboard statistics...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-8">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
        <StatCard
          label="Freelancers"
          value={String(statistics?.totalFreelancers ?? 0)}
          icon={<Users className="w-5 h-5 text-violet-600" />}
          iconBg="bg-violet-100"
        />

        <StatCard
          label="Clients"
          value={String(statistics?.totalClients ?? 0)}
          icon={<Building2 className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-100"
        />

        <StatCard
          label="Projects"
          value={String(statistics?.totalProjects ?? 0)}
          icon={<FolderKanban className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-100"
        />

        <StatCard
          label="Revenue"
          value={formatCurrency(
            Number(statistics?.totalRevenue ?? 0)
          )}
          icon={<DollarSign className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-100"
        />

        <StatCard
          label="Open Issues"
          value={String(statistics?.openComplaints ?? 0)}
          icon={<AlertTriangle className="w-5 h-5 text-orange-600" />}
          iconBg="bg-orange-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="nexora-card p-6">
          <h2 className="font-semibold text-gray-900 mb-5">
            Projects Over Time
          </h2>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
              />

              <Line
                type="monotone"
                dataKey="value"
                name="Projects"
                stroke="#003135"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#003135" }}
              />
            </LineChart>
          </ResponsiveContainer>

          {!loading && chartData.length === 0 && (
            <p className="text-center text-sm text-gray-400">
              No project activity available yet.
            </p>
          )}
        </div>

        <div className="nexora-card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Recent Projects
          </h2>

          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.project_id}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <FolderKanban className="w-5 h-5 text-violet-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {project.title}
                  </p>

                  <p className="text-xs text-gray-400">
                    {project.clientName || "Unknown Client"}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <StatusBadge status={project.status} />

                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(
                      Number(
                        project.budget_max ??
                        project.budget_min ??
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
            ))}

            {!loading && projects.length === 0 && (
              <p className="text-sm text-gray-400">
                No projects available yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">
          Platform Management
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Manage all major areas of your platform.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {managementLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`nexora-card border ${item.color} p-5 text-center hover:shadow-md transition-shadow`}
          >
            <div className="flex justify-center mb-3">
              {item.icon}
            </div>

            <p className="text-sm font-semibold text-gray-700">
              {item.label}
            </p>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}