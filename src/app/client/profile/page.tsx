"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { clients } from "@/lib/data";
import { Globe, Building2, CheckCircle, Edit } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ClientProfilePage() {
  const me = clients[0];

  return (
    <DashboardLayout variant="client">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organization Profile</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your organization&apos;s public profile</p>
          </div>
          <button className="nexora-btn-primary flex items-center gap-2"><Edit className="w-4 h-4" /> Edit Profile</button>
        </div>

        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative">
              <img src={me.logo} alt={me.organizationName} className="w-24 h-24 rounded-2xl object-cover" />
              {me.verified && (
                <div className="absolute -bottom-2 -right-2 bg-violet-600 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{me.organizationName}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{me.industry}</span>
                <span>{me.location}</span>
                <span className="flex items-center gap-1"><Globe className="w-4 h-4" />{me.website}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Member since {me.memberSince}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-5">
          {[
            { label: "Total Spent", value: formatCurrency(me.totalSpent) },
            { label: "Projects Posted", value: String(me.projectsPosted) },
            { label: "Freelancers Hired", value: "8" },
          ].map((s) => (
            <Card key={s.label} className="text-center !p-5">
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
