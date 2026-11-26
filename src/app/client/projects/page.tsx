"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { projects } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, Users, FileText, Clock } from "lucide-react";
import Link from "next/link";

export default function ClientProjectsPage() {
  const [filter, setFilter] = useState("all");
  const myProjects = projects.filter((p) => p.clientId === "c1");
  const filtered = filter === "all" ? myProjects : myProjects.filter((p) => p.status === filter);

  return (
    <DashboardLayout variant="client">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Projects</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all your posted projects</p>
        </div>
        <Link href="/client/create-project" className="nexora-btn-primary flex items-center gap-2">
          + Post New Project
        </Link>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["all", "open", "in_progress", "completed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap capitalize transition-all ${
              filter === s ? "bg-violet-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {filtered.map((p) => (
          <Card key={p.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <StatusBadge status={p.status} />
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{p.category}</span>
                  <span className="text-xs text-gray-400">Posted {p.postedAt}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{p.title}</h2>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-2">
                  {p.requiredSkills.map((skill) => (
                    <span key={skill} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="text-right flex-shrink-0 space-y-3 min-w-[140px]">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(p.budget)}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 justify-end">
                  <Users className="w-3.5 h-3.5" />{p.proposals} proposals
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 justify-end">
                  <Clock className="w-3.5 h-3.5" />Due {p.deadline}
                </div>
                <div className="flex gap-2 justify-end">
                  <Link href="/client/proposals" className="nexora-btn-secondary text-xs py-1.5 px-3">View Proposals</Link>
                  <button className="nexora-btn-ghost text-xs py-1.5 px-3">Edit</button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
