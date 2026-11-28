"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

interface Project {
  project_id: number;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  status: string;
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

interface SubmitResponse {
  message: string;
}

export default function SubmitProposalPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const result = await apiRequest<ProjectsResponse>(
          "/api/projects/browse",
          { token }
        );

        setProjects(result.projects);

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

  const selectedProject = projects.find(
    (project) => project.project_id === Number(selectedProjectId)
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!selectedProjectId) {
      setError("Please select a project.");
      return;
    }

    if (!coverLetter.trim() || !bidAmount || !estimatedDays) {
      setError("Please complete all proposal fields.");
      return;
    }

    if (Number(bidAmount) <= 0 || Number(estimatedDays) <= 0) {
      setError("Bid amount and delivery days must be positive.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      await apiRequest<SubmitResponse>(
        `/api/proposals/${selectedProjectId}`,
        {
          method: "POST",
          token,
          body: {
            cover_letter: coverLetter.trim(),
            bid_amount: Number(bidAmount),
            estimated_days: Number(estimatedDays),
          },
        }
      );

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit proposal."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading available projects...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow">
          <div className="mb-4 text-5xl text-green-500">✓</div>

          <h1 className="mb-3 text-2xl font-bold text-gray-900">
            Proposal Submitted!
          </h1>

          <p className="mb-6 text-gray-600">
            Your proposal for{" "}
            <strong>{selectedProject?.title}</strong> has been submitted
            successfully.
          </p>

          <button
            onClick={() => router.push("/freelancer/proposals")}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            View My Proposals
          </button>

          <button
            onClick={() => router.push("/freelancer/browse")}
            className="ml-3 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            Browse Projects
          </button>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <h1 className="mb-3 text-2xl font-bold text-gray-900">
            No Available Projects
          </h1>
          <p className="mb-5 text-gray-600">
            There are currently no open projects to submit proposals for.
          </p>
          <button
            onClick={() => router.push("/freelancer/browse")}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Back to Browse Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.push("/freelancer/browse")}
          className="mb-6 text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Browse Projects
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Submit Your Proposal
              </h1>

              <p className="mb-6 text-gray-600">
                Tell the client why you are the right person for this project.
              </p>

              {error && (
                <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Select Project
                  </label>

                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                    required
                  >
                    {projects.map((project) => (
                      <option
                        key={project.project_id}
                        value={project.project_id}
                      >
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Cover Letter
                  </label>

                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={7}
                    maxLength={5000}
                    placeholder="Introduce yourself, explain your experience, and describe how you would complete this project..."
                    className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                    required
                  />

                  <p className="mt-1 text-right text-xs text-gray-500">
                    {coverLetter.length}/5000 characters
                  </p>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Your Bid Amount
                  </label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your proposed amount"
                    className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Estimated Delivery (Days)
                  </label>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(e.target.value)}
                    placeholder="e.g. 14"
                    className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Proposal"}
                </button>
              </form>
            </div>
          </div>

          <div>
            {selectedProject && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  Project Summary
                </h2>

                <h3 className="mb-2 font-semibold text-gray-800">
                  {selectedProject.title}
                </h3>

                <p className="mb-4 text-sm text-gray-600">
                  {selectedProject.description}
                </p>

                <div className="space-y-3 border-t border-gray-100 pt-4 text-sm">
                  <p>
                    <span className="font-medium text-gray-700">Client:</span>{" "}
                    {selectedProject.client_name}
                  </p>

                  <p>
                    <span className="font-medium text-gray-700">Service:</span>{" "}
                    {selectedProject.service_name}
                  </p>

                  <p>
                    <span className="font-medium text-gray-700">Budget:</span>{" "}
                    {Number(selectedProject.budget_min).toLocaleString()} –{" "}
                    {Number(selectedProject.budget_max).toLocaleString()}
                  </p>

                  <p>
                    <span className="font-medium text-gray-700">
                      Proposals:
                    </span>{" "}
                    {selectedProject.proposal_count}
                  </p>

                  <p>
                    <span className="font-medium text-gray-700">Deadline:</span>{" "}
                    {selectedProject.deadline
                      ? new Date(selectedProject.deadline).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>

                {selectedProject.required_skills?.length > 0 && (
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <h3 className="mb-3 font-medium text-gray-700">
                      Required Skills
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {selectedProject.required_skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}