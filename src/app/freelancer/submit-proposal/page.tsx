"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { projects } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, FileText, DollarSign } from "lucide-react";

export default function SubmitProposalPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedProject, setSelectedProject] = useState(projects[0].id);
  const selectedP = projects.find((p) => p.id === selectedProject) ?? projects[0];

  if (submitted) {
    return (
      <DashboardLayout variant="freelancer">
        <div className="max-w-2xl mx-auto text-center pt-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Proposal Submitted!</h2>
          <p className="text-gray-500 mb-8">Your proposal has been sent to <strong>{selectedP.clientName}</strong>. You'll be notified when they respond.</p>
          <button onClick={() => setSubmitted(false)} className="nexora-btn-secondary">Submit Another</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout variant="freelancer">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Submit a Proposal</h1>
          <p className="text-gray-500 text-sm mt-1">Write a compelling proposal to win the project</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-600" /> Select Project
              </h2>
              <select
                className="nexora-input"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                {projects.filter((p) => p.status === "open").map((p) => (
                  <option key={p.id} value={p.id}>{p.title} – {formatCurrency(p.budget)}</option>
                ))}
              </select>
            </Card>

            <Card>
              <h2 className="font-semibold text-gray-900 mb-5">Cover Letter</h2>
              <div className="space-y-4">
                <div>
                  <label className="nexora-label">Why are you the best fit?</label>
                  <textarea
                    className="nexora-input h-40 resize-none"
                    placeholder="Introduce yourself, describe your relevant experience, and explain why you're the perfect match for this project..."
                    defaultValue="I have 5+ years of experience building production AI systems. For this specific project, I've previously built 3 similar systems achieving 95%+ accuracy. I can deliver ahead of schedule with full documentation and post-delivery support."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="nexora-label">Your Bid ({selectedP.budgetType === "fixed" ? "Fixed Price" : "Hourly Rate"})</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input type="number" className="nexora-input pl-7" defaultValue={selectedP.budget * 0.9} />
                    </div>
                  </div>
                  <div>
                    <label className="nexora-label">Delivery Timeline (days)</label>
                    <input type="number" className="nexora-input" defaultValue={14} />
                  </div>
                </div>
                <div>
                  <label className="nexora-label">Milestones (optional)</label>
                  <textarea className="nexora-input h-24 resize-none" placeholder="Week 1: Setup & architecture&#10;Week 2: Core development&#10;Week 3: Testing & delivery" />
                </div>
              </div>
            </Card>

            <button onClick={() => setSubmitted(true)} className="nexora-btn-primary w-full py-3.5 text-base">
              Submit Proposal
            </button>
          </div>

          {/* Project summary */}
          <div>
            <Card className="sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4 text-sm">Project Summary</h2>
              <div className="flex items-center gap-2 mb-3">
                <img src={selectedP.clientLogo} alt={selectedP.clientName} className="w-8 h-8 rounded-lg" />
                <span className="text-sm font-medium text-gray-700">{selectedP.clientName}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-2">{selectedP.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{selectedP.description}</p>
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Budget</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(selectedP.budget)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Deadline</span>
                  <span className="font-semibold text-gray-900">{selectedP.deadline}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Proposals</span>
                  <span className="font-semibold text-gray-900">{selectedP.proposals}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {selectedP.requiredSkills.map((s) => (
                  <span key={s} className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-lg">{s}</span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
