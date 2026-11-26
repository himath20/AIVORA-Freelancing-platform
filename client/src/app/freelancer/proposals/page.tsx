"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { proposals } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileText, Calendar } from "lucide-react";

export default function MyProposalsPage() {
  const myProposals = proposals.filter((p) => p.freelancerId === "f1" || p.freelancerId === "f2");

  const counts = {
    all: myProposals.length,
    pending: myProposals.filter((p) => p.status === "pending").length,
    accepted: myProposals.filter((p) => p.status === "accepted").length,
    rejected: myProposals.filter((p) => p.status === "rejected").length,
  };

  return (
    <DashboardLayout variant="freelancer">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Proposals</h1>
        <p className="text-gray-500 text-sm mt-1">Track all your submitted proposals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {Object.entries(counts).map(([key, val]) => (
          <Card key={key} className="text-center !p-5">
            <p className="text-3xl font-bold text-gray-900">{val}</p>
            <p className="text-sm text-gray-500 mt-1 capitalize">{key}</p>
          </Card>
        ))}
      </div>

      {/* Proposals list */}
      <div className="space-y-4">
        {myProposals.map((proposal) => (
          <Card key={proposal.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-violet-100 rounded-xl">
                    <FileText className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{proposal.projectTitle}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">Submitted {formatDate(proposal.submittedAt)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3 italic">
                  &ldquo;{proposal.coverLetter}&rdquo;
                </p>
              </div>
              <div className="text-right flex-shrink-0 space-y-3">
                <StatusBadge status={proposal.status} />
                <div>
                  <p className="text-xs text-gray-400">Your bid</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(proposal.bidAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Delivery</p>
                  <p className="text-sm font-medium text-gray-700">{proposal.deliveryDays} days</p>
                </div>
                {proposal.status === "pending" && (
                  <button className="text-xs text-red-500 hover:underline">Withdraw</button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
