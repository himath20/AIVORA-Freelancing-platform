"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { assignments } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { User, Calendar } from "lucide-react";

export default function ClientAssignmentsPage() {
  const myAssignments = assignments.filter((a) => a.clientId === "c3" || a.clientId === "c2");

  return (
    <DashboardLayout variant="client">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor your active freelancer assignments</p>
      </div>

      <div className="space-y-5">
        {myAssignments.map((a) => (
          <Card key={a.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{a.projectTitle}</h2>
                <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{a.freelancerName}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(a.startDate)} – {formatDate(a.endDate)}</span>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status={a.status} />
                <p className="text-xl font-bold text-gray-900 mt-2">{formatCurrency(a.budget)}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-bold text-violet-700">{a.progress}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full" style={{ width: `${a.progress}%` }} />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button className="nexora-btn-secondary text-sm py-2 px-4">Message Freelancer</button>
              {a.status === "active" && (
                <button className="nexora-btn-primary text-sm py-2 px-4">Release Payment</button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
