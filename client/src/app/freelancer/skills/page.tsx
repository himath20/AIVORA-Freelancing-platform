"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import { aiSkills } from "@/lib/data";
import { Plus, Zap, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { AISkill } from "@/types";

export default function FreelancerSkillsPage() {
  const [mySkills, setMySkills] = useState<string[]>(["Machine Learning", "Natural Language Processing", "LangChain / RAG"]);

  const columns = [
    {
      key: "name", header: "Skill",
      render: (row: AISkill) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-400">{row.category}</p>
        </div>
      )
    },
    { key: "description", header: "Description", render: (row: AISkill) => <span className="text-xs text-gray-500 line-clamp-2">{row.description}</span> },
    {
      key: "demandLevel", header: "Demand",
      render: (row: AISkill) => <StatusBadge status={row.demandLevel} />
    },
    {
      key: "avgRate", header: "Avg. Rate",
      render: (row: AISkill) => <span className="font-semibold text-gray-900">{formatCurrency(row.avgRate)}/hr</span>
    },
    {
      key: "action", header: "",
      render: (row: AISkill) => {
        const has = mySkills.includes(row.name);
        return (
          <button
            onClick={() => setMySkills(has ? mySkills.filter((s) => s !== row.name) : [...mySkills, row.name])}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${has ? "bg-violet-100 text-violet-700 hover:bg-red-50 hover:text-red-600" : "bg-gray-100 text-gray-700 hover:bg-violet-100 hover:text-violet-700"}`}
          >
            {has ? "✓ Added" : "+ Add"}
          </button>
        );
      }
    },
  ];

  return (
    <DashboardLayout variant="freelancer">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Skills</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and showcase your AI expertise</p>
        </div>
        <button className="nexora-btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Custom Skill
        </button>
      </div>

      {/* My skills */}
      <Card className="mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-violet-600" /> My Skills ({mySkills.length})
        </h2>
        {mySkills.length === 0 ? (
          <p className="text-gray-400 text-sm">No skills added yet. Browse below to add some.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {mySkills.map((s) => (
              <span key={s} className="flex items-center gap-1.5 bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1.5 rounded-xl text-sm font-medium">
                {s}
                <button onClick={() => setMySkills(mySkills.filter((x) => x !== s))} className="text-violet-400 hover:text-red-500 ml-1 font-bold">×</button>
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <Card className="text-center !p-5">
          <p className="text-3xl font-bold text-violet-700">{mySkills.length}</p>
          <p className="text-sm text-gray-500 mt-1">Skills in profile</p>
        </Card>
        <Card className="text-center !p-5">
          <p className="text-3xl font-bold text-green-700">3</p>
          <p className="text-sm text-gray-500 mt-1">High-demand skills</p>
        </Card>
        <Card className="text-center !p-5 flex items-center justify-center gap-3">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-xl font-bold text-blue-700">$85/hr</p>
            <p className="text-sm text-gray-500">Avg. market rate</p>
          </div>
        </Card>
      </div>

      {/* All skills table */}
      <Card>
        <h2 className="font-semibold text-gray-900 mb-5">Browse All AI Skills</h2>
        <DataTable columns={columns} data={aiSkills as unknown as Record<string, unknown>[]} />
      </Card>
    </DashboardLayout>
  );
}
