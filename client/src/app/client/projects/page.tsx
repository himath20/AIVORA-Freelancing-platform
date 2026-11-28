"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Users, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Project {
  project_id: number;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  status: string;
  posted_date: string;
}

interface ProjectsResponse {
  message: string;
  total: number;
  projects: Project[];
}

interface ProposalCountResponse {
  message: string;
  proposals: unknown[];
}

export default function ClientProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [proposalCounts, setProposalCounts] = useState<Record<number, number>>({});
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const result = await apiRequest<ProjectsResponse>(
          "/api/projects",
          { token }
        );

        setProjects(result.projects);

        const counts: Record<number, number> = {};

        await Promise.all(
          result.projects.map(async (project) => {
            try {
              const proposalResult = await apiRequest<ProposalCountResponse>(
                `/api/proposals/${project.project_id}`,
                { token }
              );

              counts[project.project_id] = proposalResult.proposals.length;
            } catch {
              counts[project.project_id] = 0;
            }
          })
        );

        setProposalCounts(counts);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load projects."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [router]);

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter(
          (project) => project.status.toLowerCase() === filter
        );

  if (loading) {
    return (
      <DashboardLayout variant="client">
        <p className="py-10 text-center text-gray-500">
          Loading your projects...
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout variant="client">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Projects
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all your posted projects
          </p>
        </div>

        <Link
          href="/client/create-project"
          className="nexora-btn-primary flex items-center gap-2"
        >
          + Post New Project
        </Link>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 flex gap-2 overflow-x-auto">
        {["all", "open", "in_progress", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium capitalize transition-all ${
              filter === status
                ? "bg-violet-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-violet-300"
            }`}
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {filteredProjects.length === 0 ? (
          <Card>
            <div className="py-10 text-center">
              <h2 className="mb-2 text-lg font-semibold text-gray-800">
                No Projects Found
              </h2>
              <p className="text-sm text-gray-500">
                You have no projects in this category.
              </p>
            </div>
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <Card
              key={project.project_id}
              className="transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <StatusBadge status={project.status.toLowerCase()} />

                    <span className="text-xs text-gray-400">
                      Posted{" "}
                      {new Date(project.posted_date).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="mb-2 text-lg font-bold text-gray-900">
                    {project.title}
                  </h2>

                  <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                    {project.description}
                  </p>
                </div>

                <div className="min-w-[150px] flex-shrink-0 space-y-3 text-right">
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(Number(project.budget_min))} –{" "}
                    {formatCurrency(Number(project.budget_max))}
                  </p>

                  <div className="flex items-center justify-end gap-1.5 text-xs text-gray-500">
                    <Users className="h-3.5 w-3.5" />
                    {proposalCounts[project.project_id] ?? 0} proposals
                  </div>

                  <div className="flex items-center justify-end gap-1.5 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    Due{" "}
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString()
                      : "Not specified"}
                  </div>

                  <Link
                    href={`/client/proposals?projectId=${project.project_id}`}
                    className="nexora-btn-secondary inline-block px-3 py-1.5 text-xs"
                  >
                    View Proposals
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}