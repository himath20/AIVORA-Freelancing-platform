"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, ArrowLeft, Clock, DollarSign, Users, ChevronDown } from "lucide-react";
import { projects } from "@/lib/data";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";

export default function ExploreProjectsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Data Science", "AI Chatbot", "Computer Vision", "GenAI", "AI Voice", "MLOps"];
  const filtered = projects.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-violet-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-gray-900 text-xl">NEXORA</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="nexora-btn-secondary text-sm py-2 px-4">Log In</Link>
            <Link href="/register" className="nexora-btn-primary text-sm py-2 px-4">Post a Project</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link href="/landing" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore AI Projects</h1>
          <p className="text-gray-500">Discover exciting AI projects looking for your expertise.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects by title, skill, or description..."
              className="nexora-input pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat
                    ? "bg-violet-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <p className="text-sm text-gray-500 mb-4">{filtered.length} projects found</p>
        <div className="space-y-4">
          {filtered.map((project) => (
            <div key={project.id} className="nexora-card p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={project.clientLogo} alt={project.clientName} className="w-8 h-8 rounded-lg" />
                    <div>
                      <span className="text-sm font-semibold text-gray-900">{project.clientName}</span>
                      <span className="text-xs text-gray-400 ml-2">{project.postedAt}</span>
                    </div>
                    <StatusBadge status={project.status} />
                    <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">{project.category}</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.requiredSkills.map((skill) => (
                      <span key={skill} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">Budget</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(project.budget)}</p>
                    <p className="text-xs text-gray-400">{project.budgetType}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 justify-end">
                    <Users className="w-3.5 h-3.5" />
                    {project.proposals} proposals
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    Due {project.deadline}
                  </div>
                  <Link href="/register" className="nexora-btn-primary text-xs py-2 px-4 block text-center">
                    Submit Proposal
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
