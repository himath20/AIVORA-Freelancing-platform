"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SearchBar } from "@/components/ui/SearchBar";
import { DataTable } from "@/components/ui/DataTable";
import { aiSkills } from "@/lib/data";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { AISkill } from "@/types";

export default function AdminSkillsPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = aiSkills.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  const columns = [
    { key: "name", header: "Skill", render: (r: AISkill) => <span className="font-medium text-gray-900">{r.name}</span> },
    { key: "category", header: "Category", render: (r: AISkill) => <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{r.category}</span> },
    { key: "description", header: "Description", render: (r: AISkill) => <span className="text-xs text-gray-500 line-clamp-1">{r.description}</span> },
    { key: "demandLevel", header: "Demand", render: (r: AISkill) => <StatusBadge status={r.demandLevel} /> },
    { key: "avgRate", header: "Avg Rate", render: (r: AISkill) => <span className="font-semibold">${r.avgRate}/hr</span> },
    {
      key: "actions", header: "",
      render: () => (
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-violet-100 rounded-lg text-violet-600"><Edit className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-red-100 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
        </div>
      )
    },
  ];

  return (
    <DashboardLayout variant="admin">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Skills Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all available AI skill categories</p>
        </div>
        <button onClick={() => setOpen(true)} className="nexora-btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900">All Skills ({filtered.length})</h2>
          <SearchBar placeholder="Search skills..." value={query} onChange={setQuery} className="w-72" />
        </div>
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add New AI Skill">
        <div className="space-y-5">
          <div><label className="nexora-label">Skill Name</label><input className="nexora-input" placeholder="e.g. Federated Learning" /></div>
          <div><label className="nexora-label">Category</label><select className="nexora-input"><option>AI/ML</option><option>GenAI</option><option>Data</option><option>Infrastructure</option></select></div>
          <div><label className="nexora-label">Description</label><textarea className="nexora-input h-24 resize-none" placeholder="Describe this skill..." /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="nexora-label">Demand Level</label><select className="nexora-input"><option>high</option><option>medium</option><option>low</option></select></div>
            <div><label className="nexora-label">Average Rate ($/hr)</label><input type="number" className="nexora-input" placeholder="80" /></div>
          </div>
          <div className="flex gap-3"><button onClick={() => setOpen(false)} className="nexora-btn-secondary flex-1">Cancel</button><button onClick={() => setOpen(false)} className="nexora-btn-primary flex-1">Add Skill</button></div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
