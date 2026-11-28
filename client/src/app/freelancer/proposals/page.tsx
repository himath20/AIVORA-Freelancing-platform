"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { apiRequest } from "@/lib/api";
import { FileText, Calendar } from "lucide-react";

interface FreelancerProposal {
  proposal_id: number;
  project_id: number;
  cover_letter: string;
  bid_amount: number;
  estimated_days: number;
  status: string;
  submitted_at: string;
  project_title: string;
}

interface ProposalsResponse {
  message: string;
  total: number;
  proposals: FreelancerProposal[];
}

export default function MyProposalsPage() {
  const [myProposals, setMyProposals] = useState<FreelancerProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your proposals.");
          return;
        }

        const response = await apiRequest<ProposalsResponse>(
          "/api/proposals/freelancer",
          { token }
        );

        setMyProposals(response.proposals);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load proposals."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const counts = {
    all: myProposals.length,
    pending: myProposals.filter(
      (p) => p.status === "SUBMITTED" || p.status === "SHORTLISTED"
    ).length,
    accepted: myProposals.filter(
      (p) => p.status === "ACCEPTED"
    ).length,
    rejected: myProposals.filter(
      (p) => p.status === "REJECTED"
    ).length,
  };

  return (
    <DashboardLayout variant="freelancer">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Proposals</h1>
        <p className="text-gray-500 text-sm mt-1">
          Track all your submitted proposals
        </p>
      </div>

      {loading ? (
        <Card className="text-center py-16">
          <p className="text-gray-500">Loading your proposals...</p>
        </Card>
      ) : error ? (
        <Card className="text-center py-16">
          <p className="text-red-500">{error}</p>
        </Card>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            {Object.entries(counts).map(([key, val]) => (
              <Card key={key} className="text-center !p-5">
                <p className="text-3xl font-bold text-gray-900">{val}</p>
                <p className="text-sm text-gray-500 mt-1 capitalize">
                  {key}
                </p>
              </Card>
            ))}
          </div>

          {/* Proposals list */}
          {myProposals.length === 0 ? (
            <Card className="text-center py-16">
              <p className="text-gray-400">
                You haven't submitted any proposals yet.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {myProposals.map((proposal) => (
                <Card
                  key={proposal.proposal_id}
                  className="hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-violet-100 rounded-xl">
                          <FileText className="w-4 h-4 text-violet-600" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {proposal.project_title}
                          </h3>

                          <div className="flex items-center gap-2 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              Submitted {formatDate(proposal.submitted_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3 italic">
                        &ldquo;{proposal.cover_letter}&rdquo;
                      </p>
                    </div>

                    <div className="text-left md:text-right flex-shrink-0 space-y-3">
                      <StatusBadge status={proposal.status} />

                      <div>
                        <p className="text-xs text-gray-400">Your bid</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(proposal.bid_amount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Delivery</p>
                        <p className="text-sm font-medium text-gray-700">
                          {proposal.estimated_days} days
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}