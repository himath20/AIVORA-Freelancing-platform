"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { proposals, freelancers } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Star, CheckCircle, X } from "lucide-react";

export default function ClientProposalsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [accepted, setAccepted] = useState<string[]>([]);

  const clientProposals = proposals.filter((p) => p.projectId === "p1" || p.projectId === "p4" || p.projectId === "p3");
  const freelancerMap = Object.fromEntries(freelancers.map((f) => [f.id, f]));

  return (
    <DashboardLayout variant="client">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">View Proposals</h1>
        <p className="text-gray-500 text-sm mt-1">Review and select the best freelancers for your projects</p>
      </div>

      <div className="space-y-5">
        {clientProposals.map((proposal) => {
          const isAccepted = accepted.includes(proposal.id);
          const freelancer = freelancerMap[proposal.freelancerId];
          return (
            <Card key={proposal.id} className={`hover:shadow-md transition-shadow ${isAccepted ? "border-green-200 bg-green-50/30" : ""}`}>
              <div className="flex items-start gap-4">
                <img src={proposal.freelancerAvatar} alt={proposal.freelancerName} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{proposal.freelancerName}</h3>
                        {freelancer?.verified && <CheckCircle className="w-4 h-4 text-violet-600" />}
                        {isAccepted && <StatusBadge status="accepted" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">For: <strong>{proposal.projectTitle}</strong></p>
                      {freelancer && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-medium">{freelancer.rating}</span>
                          <span className="text-xs text-gray-400">• {freelancer.completedProjects} projects completed</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(proposal.bidAmount)}</p>
                      <p className="text-xs text-gray-400">in {proposal.deliveryDays} days</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mt-3 bg-gray-50 p-3 rounded-xl">
                    {proposal.coverLetter}
                  </p>

                  {freelancer && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {freelancer.skills.slice(0, 4).map((s) => (
                        <span key={s} className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-lg">{s}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 mt-4">
                    {!isAccepted ? (
                      <>
                        <button
                          onClick={() => setAccepted([...accepted, proposal.id])}
                          className="nexora-btn-primary text-sm py-2 px-4 flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" /> Accept Freelancer
                        </button>
                        <button
                          onClick={() => setSelected(proposal.id)}
                          className="nexora-btn-secondary text-sm py-2 px-4"
                        >
                          View Full Profile
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                        <CheckCircle className="w-4 h-4" /> Freelancer Selected — Assignment in progress
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
