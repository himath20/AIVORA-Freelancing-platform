"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiRequest } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Eye,
  Search,
  RefreshCw,
  X,
  Loader2,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface Proposal {
  proposal_id: number;
  project_id: number;
  freelancer_id: number;
  cover_letter?: string;
  bid_amount: number;
  estimated_days: number;
  status: string;
  submitted_at: string;
  project_title: string;
  project_description?: string;
  freelancer_name: string;
  freelancer_email: string;
  freelancer_phone?: string;
}

const STATUSES = [
  "SUBMITTED",
  "SHORTLISTED",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
];

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const data = await apiRequest<{ proposals: Proposal[] }>(
        "/api/admin/proposals",
        { token }
      );

      setProposals(data.proposals || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load proposals."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const viewDetails = async (proposalId: number) => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const data = await apiRequest<{ proposal: Proposal }>(
        `/api/admin/proposals/${proposalId}`,
        { token }
      );

      setSelectedProposal(data.proposal);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load proposal details."
      );
    }
  };

  const updateStatus = async (proposalId: number, status: string) => {
    const currentProposal = proposals.find(
      (proposal) => proposal.proposal_id === proposalId
    );

    if (!currentProposal || currentProposal.status === status) {
      return;
    }

    if (!window.confirm(
      `Change proposal status from ${currentProposal.status} to ${status}?`
    )) {
      return;
    }

    try {
      setUpdatingId(proposalId);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      await apiRequest(
        `/api/admin/proposals/${proposalId}/status`,
        {
          method: "PUT",
          body: { status },
          token,
        }
      );

      setProposals((previous) =>
        previous.map((proposal) =>
          proposal.proposal_id === proposalId
            ? { ...proposal, status }
            : proposal
        )
      );

      if (selectedProposal?.proposal_id === proposalId) {
        setSelectedProposal((previous) =>
          previous ? { ...previous, status } : null
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update proposal status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProposals = proposals.filter((proposal) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      proposal.project_title?.toLowerCase().includes(searchText) ||
      proposal.freelancer_name?.toLowerCase().includes(searchText) ||
      proposal.freelancer_email?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" || proposal.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const acceptedCount = proposals.filter(
    (p) => p.status === "ACCEPTED"
  ).length;

  const submittedCount = proposals.filter(
    (p) => p.status === "SUBMITTED"
  ).length;

  const shortlistedCount = proposals.filter(
    (p) => p.status === "SHORTLISTED"
  ).length;

  return (
    <DashboardLayout variant="admin">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Proposal Monitoring
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Oversee all proposals submitted on the platform.
          </p>
        </div>

        <button
          onClick={fetchProposals}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Proposals</p>
              <h3 className="text-2xl font-bold mt-1">{proposals.length}</h3>
            </div>
            <FileText className="w-8 h-8 text-violet-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Submitted</p>
              <h3 className="text-2xl font-bold mt-1">{submittedCount}</h3>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Shortlisted</p>
              <h3 className="text-2xl font-bold mt-1">{shortlistedCount}</h3>
            </div>
            <CheckCircle className="w-8 h-8 text-amber-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Accepted</p>
              <h3 className="text-2xl font-bold mt-1">{acceptedCount}</h3>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <h2 className="font-semibold text-gray-900">
            All Proposals ({filteredProposals.length})
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search project or freelancer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="ALL">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading proposals...
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            No proposals found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
                  <th className="py-3 px-3">Project</th>
                  <th className="py-3 px-3">Freelancer</th>
                  <th className="py-3 px-3">Bid</th>
                  <th className="py-3 px-3">Days</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Submitted</th>
                  <th className="py-3 px-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProposals.map((proposal) => (
                  <tr
                    key={proposal.proposal_id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="py-4 px-3">
                      <span className="font-medium text-gray-900 block max-w-[180px] truncate">
                        {proposal.project_title}
                      </span>
                      <span className="text-xs text-gray-400">
                        ID: {proposal.proposal_id}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <div className="text-sm font-medium text-gray-800">
                        {proposal.freelancer_name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {proposal.freelancer_email}
                      </div>
                    </td>

                    <td className="py-4 px-3 font-bold text-gray-900">
                      {formatCurrency(Number(proposal.bid_amount))}
                    </td>

                    <td className="py-4 px-3 text-sm">
                      {proposal.estimated_days}d
                    </td>

                    <td className="py-4 px-3">
                      <StatusBadge status={proposal.status} />
                    </td>

                    <td className="py-4 px-3 text-xs text-gray-500">
                      {formatDate(proposal.submitted_at)}
                    </td>

                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewDetails(proposal.proposal_id)}
                          title="View details"
                          className="p-2 hover:bg-violet-100 rounded-lg text-violet-600"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <select
                          value={proposal.status}
                          disabled={updatingId === proposal.proposal_id}
                          onChange={(e) =>
                            updateStatus(proposal.proposal_id, e.target.value)
                          }
                          className="max-w-[125px] text-xs border border-gray-200 rounded-md p-1.5 bg-white disabled:opacity-50"
                          title="Update proposal status"
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

      {selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Proposal Details
                </h2>
                <p className="text-xs text-gray-500">
                  Proposal #{selectedProposal.proposal_id}
                </p>
              </div>

              <button
                onClick={() => setSelectedProposal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <p className="text-xs text-gray-500 mb-1">Project</p>
                <h3 className="font-semibold text-gray-900">
                  {selectedProposal.project_title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
                  {selectedProposal.project_description || "No description available."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Freelancer</p>
                  <p className="font-medium text-gray-900">
                    {selectedProposal.freelancer_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 break-all">
                    {selectedProposal.freelancer_email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">
                    {selectedProposal.freelancer_phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Bid Amount</p>
                  <p className="font-bold text-gray-900">
                    {formatCurrency(Number(selectedProposal.bid_amount))}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Estimated Delivery</p>
                  <p className="font-medium text-gray-900">
                    {selectedProposal.estimated_days} days
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Submitted</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(selectedProposal.submitted_at)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Cover Letter</p>
                <div className="rounded-lg bg-gray-50 border border-gray-100 p-4 text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedProposal.cover_letter}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Current Status</p>
                <StatusBadge status={selectedProposal.status} />
              </div>
            </div>

            <div className="p-5 border-t flex justify-end">
              <button
                onClick={() => setSelectedProposal(null)}
                className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
