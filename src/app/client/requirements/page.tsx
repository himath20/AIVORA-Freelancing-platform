"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { projects } from "@/lib/data";
import { Plus, CheckCircle, ListChecks } from "lucide-react";

interface Requirement {
  id: string;
  projectId: string;
  title: string;
  priority: "high" | "medium" | "low";
  status: "open" | "completed";
}

const initialReqs: Requirement[] = [
  { id: "req1", projectId: "p1", title: "Real-time KPI streaming via WebSocket or polling", priority: "high", status: "completed" },
  { id: "req2", projectId: "p1", title: "Role-based access control for executive vs analyst views", priority: "high", status: "open" },
  { id: "req3", projectId: "p1", title: "Export reports to PDF and CSV formats", priority: "medium", status: "open" },
  { id: "req4", projectId: "p4", title: "SEO keyword scoring and readability analyzer", priority: "high", status: "open" },
  { id: "req5", projectId: "p4", title: "Multi-brand tone-of-voice presets", priority: "low", status: "completed" },
];

export default function ClientRequirementsPage() {
  const myProjects = projects.filter((p) => p.clientId === "c1");
  const [selectedProject, setSelectedProject] = useState(myProjects[0]?.id ?? "p1");
  const [reqs, setReqs] = useState<Requirement[]>(initialReqs);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");

  const filteredReqs = reqs.filter((r) => r.projectId === selectedProject);

  const addRequirement = () => {
    if (!newTitle.trim()) return;
    setReqs([
      ...reqs,
      {
        id: `req${Date.now()}`,
        projectId: selectedProject,
        title: newTitle.trim(),
        priority: newPriority,
        status: "open",
      },
    ]);
    setNewTitle("");
  };

  const toggleStatus = (id: string) => {
    setReqs(reqs.map((r) => (r.id === id ? { ...r, status: r.status === "open" ? "completed" : "open" } : r)));
  };

  return (
    <DashboardLayout variant="client">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Project Requirements</h1>
          <p className="text-gray-500 text-sm mt-1">Define and track functional &amp; technical requirements per project</p>
        </div>

        <Card className="mb-6">
          <label className="nexora-label">Select Project</label>
          <select
            className="nexora-input"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            {myProjects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </Card>

        <Card className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-violet-600" /> Add Requirement
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="nexora-input flex-1"
              placeholder="Describe a project requirement..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addRequirement()}
            />
            <select
              className="nexora-input sm:w-36"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as "high" | "medium" | "low")}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button onClick={addRequirement} className="nexora-btn-primary whitespace-nowrap">
              Add
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-violet-600" /> Requirements ({filteredReqs.length})
          </h2>
          <div className="space-y-3">
            {filteredReqs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No requirements added for this project yet.</p>
            ) : (
              filteredReqs.map((r) => (
                <div
                  key={r.id}
                  onClick={() => toggleStatus(r.id)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all cursor-pointer"
                >
                  <CheckCircle className={`w-5 h-5 flex-shrink-0 ${r.status === "completed" ? "text-green-600" : "text-gray-300"}`} />
                  <span className={`flex-1 text-sm font-medium ${r.status === "completed" ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {r.title}
                  </span>
                  <StatusBadge status={r.priority} />
                  <StatusBadge status={r.status} />
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
