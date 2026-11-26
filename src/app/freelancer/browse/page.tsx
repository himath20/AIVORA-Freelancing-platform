"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SearchBar } from "@/components/ui/SearchBar";
import { projects } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Clock, Users, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BrowseProjectsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Data Science", "AI Chatbot", "Computer Vision", "GenAI", "AI Voice"];
  const filtered = projects.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (p.title.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <DashboardLayout variant="freelancer">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Projects</h1>
          <p className="text-gray-500 text-sm mt-1">Find AI projects matching your skills</p>
        </div>
        <div className="text-sm text-gray-500">{filtered.length} projects available</div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchBar placeholder="Search projects..." value={query} onChange={setQuery} className="flex-1" />
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                category === cat ? "bg-violet-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <img src={project.clientLogo} alt={project.clientName} className="w-7 h-7 rounded-lg" />
                  <span className="text-sm text-gray-500">{project.clientName}</span>
                  <StatusBadge status={project.status} />
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{project.category}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.requiredSkills.map((skill) => (
                    <span key={skill} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="text-right flex-shrink-0 space-y-3 min-w-[140px]">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(project.budget)}</p>
                  <p className="text-xs text-gray-400">{project.budgetType}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 justify-end">
                  <Users className="w-3.5 h-3.5" /> {project.proposals} proposals
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 justify-end">
                  <Clock className="w-3.5 h-3.5" /> Due {project.deadline}
                </div>
                <Link
                  href={`/freelancer/submit-proposal?projectId=${project.id}`}
                  className="nexora-btn-primary text-sm py-2 px-4 flex items-center gap-1.5 justify-center"
                >
                  Propose <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
