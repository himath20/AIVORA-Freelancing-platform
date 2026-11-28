"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SearchBar } from "@/components/ui/SearchBar";
import { formatCurrency, formatDate } from "@/lib/utils";
import { apiRequest } from "@/lib/api";
import { Clock, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Project {
  project_id: number;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  status: string;
  posted_date: string;
  service_name: string;
  client_name: string;
  proposal_count: number;
  required_skills: string[];
}

interface ProjectsResponse {
  message: string;
  total: number;
  projects: Project[];
}

export default function BrowseProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to browse projects.");
          return;
        }

        const response = await apiRequest<ProjectsResponse>(
          "/api/projects/browse",
          { token }
        );

        setProjects(response.projects);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load projects."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = [
    "All",
    ...Array.from(
      new Set(projects.map((project) => project.service_name))
    ),
  ];

  const filtered = projects.filter(
    (project) =>
      (category === "All" || project.service_name === category) &&
      (
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase()) ||
        project.service_name.toLowerCase().includes(query.toLowerCase())
      )
  );

  return (
    <DashboardLayout variant="freelancer">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Browse Projects
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Find AI projects matching your skills
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {filtered.length} projects available
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchBar
          placeholder="Search projects..."
          value={query}
          onChange={setQuery}
          className="flex-1"
        />

        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                category === cat
                  ? "bg-violet-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Card className="text-center py-16">
          <p className="text-gray-500">Loading available projects...</p>
        </Card>
      ) : error ? (
        <Card className="text-center py-16">
          <p className="text-red-500">{error}</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-gray-400">
            No projects found. Try another search or category.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((project) => (
            <Card
              key={project.project_id}
              className="hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center text-violet-700 font-bold">
                      {project.client_name?.charAt(0) || "C"}
                    </div>

                    <span className="text-sm text-gray-500">
                      {project.client_name}
                    </span>

                    <StatusBadge status={project.status} />

                    <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                      {project.service_name}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    {project.title}
                  </h2>

                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.required_skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right flex-shrink-0 space-y-3 min-w-[140px]">
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(project.budget_min)} -{" "}
                      {formatCurrency(project.budget_max)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Project Budget
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 justify-end">
                    <Users className="w-3.5 h-3.5" />
                    {project.proposal_count} proposals
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    Due{" "}
                    {project.deadline
                      ? formatDate(project.deadline)
                      : "Not specified"}
                  </div>

                  <Link
                    href={`/freelancer/submit-proposal?projectId=${project.project_id}`}
                    className="nexora-btn-primary text-sm py-2 px-4 flex items-center gap-1.5 justify-center"
                  >
                    Propose
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}