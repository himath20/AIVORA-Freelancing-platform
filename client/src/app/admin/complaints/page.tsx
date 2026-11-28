"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiRequest } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { AlertTriangle, Search, RefreshCw } from "lucide-react";

interface Complaint {
  complaint_id: number;
  project_id: number;
  project_title: string;
  raised_by: string;
  description: string;
  status: string;
  handled_by: number | null;
  resolution: string | null;
  created_at: string;
  resolved_at: string | null;
}

interface ComplaintResponse {
  complaints: Complaint[];
}

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [resolution, setResolution] = useState("");
  const [status, setStatus] = useState("UNDER_REVIEW");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in again.");
        return;
      }

      const data = await apiRequest<ComplaintResponse>(
        "/api/admin/complaints",
        { token }
      );

      setComplaints(data.complaints || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openReview = (complaint: Complaint) => {
    setSelected(complaint);
    setStatus(complaint.status);
    setResolution(complaint.resolution || "");
    setError("");
    setSuccess("");
  };

  const updateComplaint = async () => {
    if (!selected) return;

    if (
      (status === "RESOLVED" || status === "REJECTED") &&
      !resolution.trim()
    ) {
      setError("Please enter a resolution note.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in again.");
        return;
      }

      await apiRequest(
        `/api/admin/complaints/${selected.complaint_id}`,
        {
          method: "PUT",
          token,
          body: {
            status,
            resolution: resolution.trim() || null,
          },
        }
      );

      setSuccess("Complaint updated successfully.");

      await fetchComplaints();

      setSelected(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update complaint."
      );
    } finally {
      setSaving(false);
    }
  };

  const openCount = complaints.filter(
    (c) => c.status === "OPEN"
  ).length;

  const reviewCount = complaints.filter(
    (c) => c.status === "UNDER_REVIEW"
  ).length;

  const resolvedCount = complaints.filter(
    (c) => c.status === "RESOLVED"
  ).length;

  const rejectedCount = complaints.filter(
    (c) => c.status === "REJECTED"
  ).length;

  const filteredComplaints = complaints.filter((c) =>
    [
      c.complaint_id,
      c.project_title,
      c.raised_by,
      c.description,
      c.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getStatusStyle = (value: string) => {
    switch (value) {
      case "OPEN":
        return "bg-red-100 text-red-700";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-700";
      case "RESOLVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout variant="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Complaints & Disputes
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Review and resolve platform disputes.
            </p>
          </div>

          <button
            onClick={fetchComplaints}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total", value: complaints.length, color: "text-gray-900" },
            { label: "Open", value: openCount, color: "text-red-600" },
            { label: "Under Review", value: reviewCount, color: "text-yellow-600" },
            { label: "Resolved", value: resolvedCount, color: "text-green-600" },
            { label: "Rejected", value: rejectedCount, color: "text-gray-600" },
          ].map((item) => (
            <Card key={item.label} className="text-center !p-5">
              <p className={`text-3xl font-bold ${item.color}`}>
                {item.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{item.label}</p>
            </Card>
          ))}
        </div>

        <Card>
          <div className="flex flex-col sm:flex-row gap-3 justify-between mb-5">
            <h2 className="text-lg font-semibold">All Complaints</h2>

            <div className="relative w-full sm:w-80">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search complaints..."
                className="w-full border rounded-lg py-2 pl-10 pr-3 text-sm"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-center py-10 text-gray-500">
              Loading complaints...
            </p>
          ) : filteredComplaints.length === 0 ? (
            <p className="text-center py-10 text-gray-500">
              No complaints found.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint.complaint_id}
                  className="border rounded-xl p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-xl bg-orange-100 h-fit">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {complaint.project_title}
                          </h3>

                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                              complaint.status
                            )}`}
                          >
                            {complaint.status.replace("_", " ")}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500">
                          Complaint #{complaint.complaint_id} · Raised by{" "}
                          <strong>{complaint.raised_by}</strong>
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          Filed {formatDate(complaint.created_at)}
                        </p>

                        <p className="text-sm text-gray-700 mt-3">
                          {complaint.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => openReview(complaint)}
                      className="nexora-btn-secondary text-xs py-2 px-4"
                    >
                      Review Complaint
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Review Complaint"
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Complaint ID</p>
                <p className="font-semibold">#{selected.complaint_id}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Project</p>
                <p className="font-semibold">{selected.project_title}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Raised By</p>
                <p className="font-semibold">{selected.raised_by}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Current Status</p>
                <StatusBadge status={selected.status} />
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-1">Complaint Details</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
                {selected.description}
              </p>
            </div>

            <div>
              <label className="nexora-label">Update Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="nexora-input"
              >
                <option value="OPEN">Open</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div>
              <label className="nexora-label">Admin Resolution Note</label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="nexora-input h-28 resize-none"
                placeholder="Write your investigation or resolution note..."
                maxLength={1000}
              />
              <p className="text-xs text-gray-400 mt-1">
                {resolution.length}/1000 characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelected(null)}
                className="nexora-btn-secondary flex-1"
                disabled={saving}
              >
                Cancel
              </button>

              <button
                onClick={updateComplaint}
                disabled={saving}
                className="nexora-btn-primary flex-1"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}