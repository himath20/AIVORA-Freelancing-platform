"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { reviews } from "@/lib/data";
import { Star, MessageCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function FreelancerReviewsPage() {
  const myReviews = reviews.filter((r) => r.revieweeId === "f1" || r.revieweeId === "f2");
  const avgRating = myReviews.length ? myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length : 0;

  return (
    <DashboardLayout variant="freelancer">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">See what clients are saying about your work</p>
      </div>

      {/* Rating summary */}
      <Card className="mb-8 flex flex-col md:flex-row items-center gap-8 !p-8">
        <div className="text-center">
          <p className="text-7xl font-extrabold text-gray-900">{avgRating.toFixed(1)}</p>
          <div className="flex justify-center gap-1 mt-2">
            {[1,2,3,4,5].map((n) => (
              <Star key={n} className={`w-5 h-5 ${n <= Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">{myReviews.length} reviews total</p>
        </div>
        <div className="flex-1 w-full space-y-2.5">
          {[5,4,3,2,1].map((n) => {
            const count = myReviews.filter((r) => r.rating === n).length;
            const pct = myReviews.length ? (count / myReviews.length) * 100 : 0;
            return (
              <div key={n} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-4 text-right">{n}</span>
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-6">{count}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Reviews list */}
      <div className="space-y-5">
        {myReviews.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start gap-4">
              <img src={r.reviewerAvatar} alt={r.reviewerName} className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{r.reviewerName}</p>
                    <p className="text-xs text-gray-400">{r.projectTitle} • {formatDate(r.date)}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((n) => (
                      <Star key={n} className={`w-4 h-4 ${n <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mt-3 leading-relaxed">{r.comment}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
