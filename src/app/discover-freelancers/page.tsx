"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Star, MapPin, ArrowLeft, CheckCircle } from "lucide-react";
import { freelancers } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function DiscoverFreelancersPage() {
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState("All");

  const skillFilters = ["All", "Machine Learning", "NLP", "Computer Vision", "LangChain / RAG", "MLOps"];
  const filtered = freelancers.filter(
    (f) =>
      (skill === "All" || f.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))) &&
      (f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.title.toLowerCase().includes(query.toLowerCase()) ||
        f.skills.some((s) => s.toLowerCase().includes(query.toLowerCase())))
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover AI Freelancers</h1>
          <p className="text-gray-500">Find vetted AI experts ready to bring your project to life.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, skill, or title..."
              className="nexora-input pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {skillFilters.map((s) => (
              <button
                key={s}
                onClick={() => setSkill(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  skill === s ? "bg-violet-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} freelancers available</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((f) => (
            <div key={f.id} className="nexora-card p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="relative">
                  <img src={f.avatar} alt={f.name} className="w-14 h-14 rounded-full object-cover" />
                  {f.verified && (
                    <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-violet-600 bg-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{f.name}</h3>
                    <StatusBadge status={f.availability} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{f.title}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" /> {f.location}
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{f.bio}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {f.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-lg font-medium">{skill}</span>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <strong className="text-gray-800">{f.rating}</strong>
                  </span>
                  <span>{f.completedProjects} projects</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${f.hourlyRate}/hr</p>
                </div>
              </div>

              <Link href="/register" className="nexora-btn-primary w-full text-center block mt-4 text-sm py-2.5">
                Hire {f.name.split(" ")[0]}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
