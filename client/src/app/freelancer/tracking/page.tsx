"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { assignments } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function ProjectTrackingPage() {
  const milestones = [
    { label: "Project kickoff & requirements", done: true, date: "Jun 8" },
    { label: "Architecture design & setup", done: true, date: "Jun 12" },
    { label: "Core chatbot development", done: true, date: "Jun 20" },
    { label: "NLP integration & training", done: false, date: "Jun 28", current: true },
    { label: "Testing & QA", done: false, date: "Jul 3" },
    { label: "Deployment & delivery", done: false, date: "Jul 7" },
  ];

  const myAssignment = assignments.find((a) => a.freelancerId === "f1" && a.status === "active");

  return (
    <DashboardLayout variant="freelancer">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Project Tracking</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor your active project progress</p>
      </div>

      {!myAssignment ? (
        <Card className="text-center py-16">
          <p className="text-gray-400">No active projects to track.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Overview card */}
            <Card>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{myAssignment.projectTitle}</h2>
                  <p className="text-sm text-gray-500 mt-1">Client: {myAssignment.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-violet-700">{myAssignment.progress}%</p>
                  <p className="text-xs text-gray-400">Complete</p>
                </div>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full"
                  style={{ width: `${myAssignment.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Started {myAssignment.startDate}</span>
                <span>Due {myAssignment.endDate}</span>
              </div>
            </Card>

            {/* Milestones */}
            <Card>
              <h2 className="font-semibold text-gray-900 mb-5">Project Milestones</h2>
              <div className="space-y-4">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      m.done ? "bg-green-100" : m.current ? "bg-violet-100 ring-2 ring-violet-300" : "bg-gray-100"
                    }`}>
                      {m.done ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : m.current ? (
                        <Clock className="w-4 h-4 text-violet-600" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${m.done ? "text-gray-700 line-through" : m.current ? "text-violet-700" : "text-gray-500"}`}>
                          {m.label}
                        </p>
                        <span className={`text-xs ${m.done ? "text-green-600" : m.current ? "text-violet-600 font-semibold" : "text-gray-400"}`}>
                          {m.date}
                        </span>
                      </div>
                      {m.current && (
                        <div className="mt-2 p-2.5 bg-violet-50 rounded-lg text-xs text-violet-700">
                          ⚡ Currently in progress
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Side panel */}
          <div className="space-y-5">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">Project Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Budget</span>
                  <span className="font-semibold">{formatCurrency(myAssignment.budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Start date</span>
                  <span className="font-semibold">{myAssignment.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Deadline</span>
                  <span className="font-semibold text-orange-600">{myAssignment.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="font-semibold text-blue-600 capitalize">{myAssignment.status}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Quick Actions</h3>
              <div className="space-y-2.5">
                <button className="nexora-btn-primary w-full text-sm py-2.5">Log Progress Update</button>
                <button className="nexora-btn-secondary w-full text-sm py-2.5">Message Client</button>
                <button className="w-full flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium py-2 px-3 rounded-xl hover:bg-orange-50 transition-colors">
                  <AlertTriangle className="w-4 h-4" /> Report Issue
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
