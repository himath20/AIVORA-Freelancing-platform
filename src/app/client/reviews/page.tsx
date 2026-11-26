"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { reviews } from "@/lib/data";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ClientReviewsPage() {
  const myReviews = reviews.filter((r) => r.reviewerId === "c2" || r.reviewerId === "c3");

  return (
    <DashboardLayout variant="client">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reviews Given</h1>
        <p className="text-gray-500 text-sm mt-1">Reviews you have submitted for freelancers</p>
      </div>

      <div className="space-y-5">
        {myReviews.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start gap-4">
              <img src={r.reviewerAvatar} alt={r.reviewerName} className="w-12 h-12 rounded-xl" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Review for Freelancer #{r.revieweeId}</p>
                    <p className="text-xs text-gray-400">Project: {r.projectTitle} • {formatDate(r.date)}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((n) => (
                      <Star key={n} className={`w-4 h-4 ${n <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mt-3 leading-relaxed text-sm">{r.comment}</p>
              </div>
            </div>
          </Card>
        ))}
        {myReviews.length === 0 && (
          <Card className="text-center py-16">
            <p className="text-gray-400">No reviews given yet.</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
