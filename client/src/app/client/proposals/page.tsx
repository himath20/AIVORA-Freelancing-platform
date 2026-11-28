"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Star, CheckCircle } from "lucide-react";

interface Project {
  project_id: number;
  title: string;
  status: string;
}

interface ProjectsResponse {
  projects: Project[];
}

interface Proposal {
  proposal_id: number;
  project_id: number;
  freelancer_id: number;
  full_name: string;
  email: string;
  cover_letter: string;
  bid_amount: number;
  estimated_days: number;
  status: string;
  submitted_at: string;
}

interface ProposalsResponse {
  message: string;
  proposals: Proposal[];
}

interface AcceptResponse {
  message: string;
}

export default function ClientProposalsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // LOAD CLIENT PROJECTS

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
        console.log("PROPOSALS PAGE PROJECTS:", result);

        const params = new URLSearchParams(window.location.search);
        const projectId = params.get("projectId");

        if (
          projectId &&
          result.projects.some(
            (project) => project.project_id === Number(projectId)
          )
        ) {
          setSelectedProjectId(projectId);
        } else if (result.projects.length > 0) {
          setSelectedProjectId(String(result.projects[0].project_id));
        }
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

  // LOAD PROPOSALS FOR SELECTED PROJECT

  useEffect(() => {
    const loadProposals = async () => {
      if (!selectedProjectId) {
        setProposals([]);
        return;
      }

      try {
        setLoadingProposals(true);
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const result = await apiRequest<ProposalsResponse>(
          `/api/proposals/${selectedProjectId}`,
          { token }
        );

        setProposals(result.proposals);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load proposals."
        );
        setProposals([]);
      } finally {
        setLoadingProposals(false);
      }
    };

    loadProposals();
  }, [selectedProjectId, router]);

  // ACCEPT PROPOSAL

  const handleAccept = async (proposalId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to accept this proposal? Other submitted proposals for this project will be rejected."
    );

    if (!confirmed) return;

    try {
      setAcceptingId(proposalId);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const result = await apiRequest<AcceptResponse>(
        `/api/assignments/accept/${proposalId}`,
        {
          method: "PUT",
          token,
        }
      );

      setSuccess(result.message);

      // Refresh proposals after acceptance
      const updated = await apiRequest<ProposalsResponse>(
        `/api/proposals/${selectedProjectId}`,
        { token }
      );

      setProposals(updated.proposals);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to accept proposal."
      );
    } finally {
      setAcceptingId(null);
    }
  };

  const selectedProject = projects.find(
    (project) => project.project_id === Number(selectedProjectId)
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          View Proposals
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Review and select the best freelancers for your projects.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* PROJECT SELECTION */}

      <Card className="mb-6">
        <label className="mb-2 block font-medium text-gray-700">
          Select Project
        </label>

        {projects.length === 0 ? (
          <p className="text-sm text-gray-500">
            You haven't posted any projects yet.
          </p>
        ) : (
          <select
            value={selectedProjectId}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);

              window.history.replaceState(
                null,
                "",
                `/client/proposals?projectId=${e.target.value}`
              );
            }}
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-violet-500"
          >
            {projects.map((project) => (
              <option
                key={project.project_id}
                value={project.project_id}
              >
                {project.title} ({project.status})
              </option>
            ))}
          </select>
        )}
      </Card>

      {selectedProject && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Proposals for: {selectedProject.title}
          </h2>
        </div>
      )}

      {/* PROPOSAL LIST */}

      {loadingProposals ? (
        <p className="py-10 text-center text-gray-500">
          Loading proposals...
        </p>
      ) : proposals.length === 0 ? (
        <Card>
          <div className="py-10 text-center">
            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              No Proposals Yet
            </h2>

            <p className="text-sm text-gray-500">
              Freelancers haven't submitted proposals for this project yet.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-5">
          {proposals.map((proposal) => {
            const isAccepted = proposal.status === "ACCEPTED";
            const isRejected = proposal.status === "REJECTED";

            return (
              <Card
                key={proposal.proposal_id}
                className={`transition-shadow hover:shadow-md ${
                  isAccepted ? "border-green-200 bg-green-50/30" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-lg font-bold text-violet-700">
                    {proposal.full_name?.charAt(0).toUpperCase() || "F"}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {proposal.full_name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {proposal.email}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Submitted:{" "}
                          {new Date(
                            proposal.submitted_at
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(Number(proposal.bid_amount))}
                        </p>

                        <p className="text-xs text-gray-400">
                          in {proposal.estimated_days} days
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-gray-50 p-4">
                      <h4 className="mb-2 text-sm font-semibold text-gray-700">
                        Cover Letter
                      </h4>

                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                        {proposal.cover_letter}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {isAccepted ? (
                        <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Freelancer Selected — Assignment Created
                        </div>
                      ) : isRejected ? (
                        <StatusBadge status="rejected" />
                      ) : (
                        <button
                          onClick={() =>
                            handleAccept(proposal.proposal_id)
                          }
                          disabled={
                            acceptingId !== null ||
                            selectedProject?.status !== "OPEN"
                          }
                          className="nexora-btn-primary flex items-center gap-1.5 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <CheckCircle className="h-4 w-4" />

                          {acceptingId === proposal.proposal_id
                            ? "Accepting..."
                            : "Accept Freelancer"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}