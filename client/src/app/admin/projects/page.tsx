"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { apiRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Eye,
  X,
  RefreshCw,
  Calendar,
  Building2,
  Mail,
  Briefcase,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

type ProjectStatus =
  | "OPEN"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

interface Project {
  project_id: number;
  client_id: number;
  service_id: number | null;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  status: ProjectStatus;
  posted_date: string;
  completed_date: string | null;
  org_name: string;
  contact_person: string;
  client_email: string;
  client_phone?: string;
  service_name: string | null;
}

interface ProjectsResponse {
  projects: Project[];
}

interface ProjectResponse {
  project: Project;
}

const STATUSES: ProjectStatus[] = [
  "OPEN",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "DISPUTED"
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "OPEN":
      return "bg-blue-100 text-blue-700";
    case "ASSIGNED":
      return "bg-violet-100 text-violet-700";
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-700";
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-gray-100 text-gray-600";
    case "DISPUTED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const formatDate = (value: string | null) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString();
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error("Your login session has expired. Please log in again.");
      }

      const data = await apiRequest<ProjectsResponse>(
        "/api/admin/projects",
        { token }
      );

      setProjects(data.projects || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProjects = useMemo(() => {
    const search = query.toLowerCase();

    return projects.filter((project) => {
      const matchesSearch = [
        project.title,
        project.org_name,
        project.contact_person,
        project.service_name || "",
        project.status
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);

      const matchesStatus =
        statusFilter === "ALL" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, query, statusFilter]);

  const openCount = projects.filter(
    (project) => project.status === "OPEN"
  ).length;

  const inProgressCount = projects.filter(
    (project) => project.status === "IN_PROGRESS"
  ).length;

  const completedCount = projects.filter(
    (project) => project.status === "COMPLETED"
  ).length;

  const viewDetails = async (projectId: number) => {
    try {
      setDetailsLoading(true);
      setSelectedProject(null);

      if (!token) {
        throw new Error("Your login session has expired. Please log in again.");
      }

      const data = await apiRequest<ProjectResponse>(
        `/api/admin/projects/${projectId}`,
        { token }
      );

      setSelectedProject(data.project);
    } catch (err) {
      setNotice(
        err instanceof Error
          ? err.message
          : "Unable to load project details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const updateStatus = async (
    project: Project,
    newStatus: ProjectStatus
  ) => {
    if (project.status === newStatus) return;

    const confirmed = window.confirm(
      `Change project "${project.title}" status from ${project.status} to ${newStatus}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(project.project_id);
      setNotice("");

      if (!token) {
        throw new Error("Your login session has expired. Please log in again.");
      }

      await apiRequest(
        `/api/admin/projects/${project.project_id}/status`,
        {
          method: "PUT",
          token,
          body: { status: newStatus }
        }
      );

      await loadProjects();

      if (selectedProject?.project_id === project.project_id) {
        const details = await apiRequest<ProjectResponse>(
          `/api/admin/projects/${project.project_id}`,
          { token }
        );

        setSelectedProject(details.project);
      }

      setNotice(
        `Project "${project.title}" status updated to ${newStatus}.`
      );
    } catch (err) {
      setNotice(
        err instanceof Error
          ? err.message
          : "Unable to update project status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardLayout variant="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Project Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor and manage all projects across the platform.
        </p>
      </div>

      {notice && (
        <div className="mb-5 p-3 rounded-lg bg-violet-50 text-violet-700 text-sm flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice("")}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {projects.length}
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-gray-500">Open Projects</p>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {openCount}
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            <p className="text-sm text-gray-500">In Progress</p>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {inProgressCount}
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <p className="text-sm text-gray-500">Completed</p>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {completedCount}
          </p>
        </Card>
      </div>

      {/* Project Table */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-semibold text-gray-900">
              All Projects ({filteredProjects.length})
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Live records from the platform database
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full sm:w-64 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-200"
            >
              <option value="ALL">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              onClick={loadProjects}
              disabled={loading}
              title="Refresh projects"
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500 text-sm">
            Loading projects...
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button
              onClick={loadProjects}
              className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm"
            >
              Try Again
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">
            No projects found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400">
                  <th className="py-3 px-3 font-medium">Project</th>
                  <th className="py-3 px-3 font-medium">Client</th>
                  <th className="py-3 px-3 font-medium">Service</th>
                  <th className="py-3 px-3 font-medium">Budget</th>
                  <th className="py-3 px-3 font-medium">Deadline</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 px-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProjects.map((project) => (
                  <tr
                    key={project.project_id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="py-4 px-3">
                      <p className="text-sm font-medium text-gray-900 max-w-[200px] truncate">
                        {project.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        ID: {project.project_id}
                      </p>
                    </td>

                    <td className="py-4 px-3">
                      <p className="text-sm text-gray-700">
                        {project.org_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {project.contact_person}
                      </p>
                    </td>

                    <td className="py-4 px-3 text-sm text-gray-600">
                      {project.service_name || "—"}
                    </td>

                    <td className="py-4 px-3 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {formatCurrency(Number(project.budget_min))}
                      {" - "}
                      {formatCurrency(Number(project.budget_max))}
                    </td>

                    <td className="py-4 px-3 text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(project.deadline)}
                    </td>

                    <td className="py-4 px-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusStyle(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewDetails(project.project_id)}
                          title="View details"
                          className="p-2 rounded-lg text-violet-600 hover:bg-violet-100"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <select
                          value={project.status}
                          disabled={updatingId === project.project_id}
                          onChange={(event) =>
                            updateStatus(
                              project,
                              event.target.value as ProjectStatus
                            )
                          }
                          title="Update project status"
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none disabled:opacity-50"
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Loading Details */}
      {detailsLoading && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6">
            Loading project details...
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Project Details
              </h2>

              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {selectedProject.title}
              </h3>

              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusStyle(selectedProject.status)}`}
              >
                {selectedProject.status}
              </span>

              <div className="mt-6">
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedProject.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-400">Client Organization</p>
                    <p className="text-sm text-gray-800">
                      {selectedProject.org_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-400">Client Email</p>
                    <p className="text-sm text-gray-800">
                      {selectedProject.client_email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-400">Service</p>
                    <p className="text-sm text-gray-800">
                      {selectedProject.service_name || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-400">Contact Person</p>
                    <p className="text-sm text-gray-800">
                      {selectedProject.contact_person}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-400">Posted Date</p>
                    <p className="text-sm text-gray-800">
                      {formatDate(selectedProject.posted_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-400">Deadline</p>
                    <p className="text-sm text-gray-800">
                      {formatDate(selectedProject.deadline)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-400">Completed Date</p>
                    <p className="text-sm text-gray-800">
                      {formatDate(selectedProject.completed_date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Project Budget</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(Number(selectedProject.budget_min))}
                  {" - "}
                  {formatCurrency(Number(selectedProject.budget_max))}
                </p>
              </div>

              <div className="mt-6">
                <label className="block text-xs text-gray-400 mb-2">
                  Update Project Status
                </label>

                <select
                  value={selectedProject.status}
                  disabled={updatingId === selectedProject.project_id}
                  onChange={(event) =>
                    updateStatus(
                      selectedProject,
                      event.target.value as ProjectStatus
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-200 disabled:opacity-50"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}