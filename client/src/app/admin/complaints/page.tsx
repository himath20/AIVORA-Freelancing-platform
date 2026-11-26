"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { complaints } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { AlertTriangle, MessageSquare } from "lucide-react";

export default function AdminComplaintsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedComplaint = complaints.find((c) => c.id === selected);

  return (
    <DashboardLayout variant="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Complaints & Disputes</h1>
        <p className="text-gray-500 text-sm mt-1">Review and resolve platform disputes</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total", value: complaints.length, color: "text-gray-900" },
          { label: "Open", value: complaints.filter((c) => c.status === "open").length, color: "text-red-600" },
          { label: "Investigating", value: complaints.filter((c) => c.status === "investigating").length, color: "text-orange-600" },
          { label: "Resolved", value: complaints.filter((c) => c.status === "resolved").length, color: "text-green-600" },
        ].map((s) => (
          <Card key={s.label} className="text-center !p-5">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${complaint.status === "open" ? "bg-red-100" : "bg-orange-100"}`}>
                  <AlertTriangle className={`w-5 h-5 ${complaint.status === "open" ? "text-red-600" : "text-orange-600"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{complaint.projectTitle}</h3>
                    <StatusBadge status={complaint.status} />
                  </div>
                  <p className="text-xs text-gray-500">
                    Raised by <strong>{complaint.raisedBy}</strong> ({complaint.raisedByRole}) against <strong>{complaint.against}</strong>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Filed {formatDate(complaint.raisedAt)}</p>
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">{complaint.reason}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setSelected(complaint.id)} className="nexora-btn-secondary text-xs py-1.5 px-3">
                  Review
                </button>
                {complaint.status !== "resolved" && (
                  <button className="nexora-btn-primary text-xs py-1.5 px-3">Resolve</button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Complaint Details">
        {selectedComplaint && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-400 text-xs">Project</p><p className="font-semibold">{selectedComplaint.projectTitle}</p></div>
              <div><p className="text-gray-400 text-xs">Status</p><StatusBadge status={selectedComplaint.status} /></div>
              <div><p className="text-gray-400 text-xs">Raised By</p><p className="font-semibold">{selectedComplaint.raisedBy}</p></div>
              <div><p className="text-gray-400 text-xs">Against</p><p className="font-semibold">{selectedComplaint.against}</p></div>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Complaint</p>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl">{selectedComplaint.reason}</p>
            </div>
            <div>
              <label className="nexora-label">Admin Response</label>
              <textarea className="nexora-input h-24 resize-none" placeholder="Write your resolution note..." />
            </div>
            <div className="flex gap-3">
              <button className="nexora-btn-secondary flex-1">Dismiss</button>
              <button className="nexora-btn-primary flex-1">Mark Resolved</button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
