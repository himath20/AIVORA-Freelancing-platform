"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { apiRequest } from "@/lib/api";
import { Calendar, Building2 } from "lucide-react";

interface FreelancerAssignment {
  assignment_id: number;
  project_id: number;
  agreed_amount: number;
  start_date: string | null;
  end_date: string | null;
  progress_pct: number;
  status: string;
  project_title: string;
  description: string;
  deadline: string;
  client_name: string;
}

interface AssignmentsResponse {
  message: string;
  total: number;
  assignments: FreelancerAssignment[];
}

export default function FreelancerAssignmentsPage() {
  const [myAssignments, setMyAssignments] = useState<FreelancerAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your assignments.");
          return;
        }

        const response = await apiRequest<AssignmentsResponse>(
          "/api/assignments/freelancer",
          { token }
        );

        setMyAssignments(response.assignments);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load assignments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <DashboardLayout variant="freelancer">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-gray-500 text-sm mt-1">
          Projects you&apos;ve been assigned to
        </p>
      </div>

      {loading ? (
        <Card className="text-center py-16">
          <p className="text-gray-500">Loading your assignments...</p>
        </Card>
      ) : error ? (
        <Card className="text-center py-16">
          <p className="text-red-500">{error}</p>
        </Card>
      ) : myAssignments.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-gray-400">
            No assignments yet. Win a proposal to get started!
          </p>
        </Card>
      ) : (
        <div className="space-y-5">
          {myAssignments.map((a) => (
            <Card
              key={a.assignment_id}
              className="hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {a.project_title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 mt-1.5 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      {a.client_name}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {a.start_date ? formatDate(a.start_date) : "Not started"}
                      {" – "}
                      {a.end_date ? formatDate(a.end_date) : "End date not set"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <StatusBadge status={a.status} />
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(a.agreed_amount)}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Progress</span>
                  <span className="font-bold text-violet-700">
                    {a.progress_pct}%
                  </span>
                </div>

                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-600 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, a.progress_pct))}%`,
                    }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}