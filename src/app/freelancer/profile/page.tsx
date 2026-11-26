"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { freelancers } from "@/lib/data";
import { MapPin, Star, Briefcase, DollarSign, CheckCircle, Edit, Plus } from "lucide-react";

export default function FreelancerProfile() {
  const me = freelancers[0];

  return (
    <DashboardLayout variant="freelancer">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your public freelancer profile</p>
          </div>
          <button className="nexora-btn-primary flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
        </div>

        {/* Profile header card */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative">
              <img src={me.avatar} alt={me.name} className="w-24 h-24 rounded-2xl object-cover" />
              {me.verified && (
                <div className="absolute -bottom-2 -right-2 bg-violet-600 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{me.name}</h2>
                  <p className="text-gray-600 mt-1">{me.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{me.location}</span>
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{me.rating} rating</span>
                    <span>Member since {me.memberSince}</span>
                  </div>
                </div>
                <StatusBadge status={me.availability} />
              </div>
              <p className="text-gray-600 text-sm mt-4 leading-relaxed">{me.bio}</p>
            </div>
          </div>
        </Card>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          {[
            { label: "Total Earnings", value: `$${me.totalEarnings.toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-green-600" />, bg: "bg-green-100" },
            { label: "Projects Done", value: String(me.completedProjects), icon: <Briefcase className="w-5 h-5 text-blue-600" />, bg: "bg-blue-100" },
            { label: "Hourly Rate", value: `$${me.hourlyRate}/hr`, icon: <Star className="w-5 h-5 text-yellow-500" />, bg: "bg-yellow-100" },
          ].map((s) => (
            <Card key={s.label} className="flex items-center gap-4 !p-5">
              <div className={`p-3 rounded-xl ${s.bg}`}>{s.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Skills */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">AI Skills</h3>
            <button className="text-sm text-violet-600 font-medium flex items-center gap-1 hover:underline">
              <Plus className="w-4 h-4" /> Add Skill
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {me.skills.map((skill) => (
              <span key={skill} className="px-3.5 py-1.5 bg-violet-50 text-violet-700 rounded-xl text-sm font-medium border border-violet-100">
                {skill}
              </span>
            ))}
          </div>
        </Card>

        {/* Profile completion checklist */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Profile Completion</h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Profile strength</span>
              <span className="font-semibold text-violet-700">85%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-violet-600 rounded-full" style={{ width: "85%" }} />
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "Basic information", done: true },
              { label: "Profile photo", done: true },
              { label: "Bio & title", done: true },
              { label: "AI Skills (min. 3)", done: true },
              { label: "Portfolio samples", done: false },
              { label: "Certifications", done: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? "bg-green-100" : "bg-gray-100"}`}>
                  {item.done ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                </div>
                <span className={item.done ? "text-gray-700" : "text-gray-400"}>{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
