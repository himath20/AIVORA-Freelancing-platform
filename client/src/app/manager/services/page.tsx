"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import { aiServices } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Zap, Star, TrendingUp, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AIService } from "@/types";

export default function ManagerServicesPage() {
  const totalRevenue = aiServices.reduce((s, sv) => s + sv.price, 0);
  const avgRating = (aiServices.reduce((s, sv) => s + sv.rating, 0) / aiServices.length).toFixed(1);
  const ratingByService = aiServices.map((s) => ({ name: s.title.slice(0, 15) + "...", rating: s.rating, reviews: s.reviews }));

  const columns = [
    { key: "title", header: "Service", render: (r: AIService) => <span className="font-medium text-gray-900 max-w-[200px] block truncate">{r.title}</span> },
    { key: "freelancerName", header: "Provider", render: (r: AIService) => (
      <div className="flex items-center gap-2">
        <img src={r.freelancerAvatar} alt={r.freelancerName} className="w-7 h-7 rounded-full" />
        <span className="text-sm">{r.freelancerName}</span>
      </div>
    )},
    { key: "category", header: "Category", render: (r: AIService) => <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{r.category}</span> },
    { key: "price", header: "Price", render: (r: AIService) => <span className="font-bold">{formatCurrency(r.price)}</span> },
    { key: "rating", header: "Rating", render: (r: AIService) => <span className="flex items-center gap-1 font-medium"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{r.rating} ({r.reviews})</span> },
    { key: "deliveryDays", header: "Delivery", render: (r: AIService) => <span className="text-sm">{r.deliveryDays}d</span> },
    { key: "status", header: "Status", render: (r: AIService) => <StatusBadge status={r.status} /> },
  ];

  return (
    <DashboardLayout variant="manager">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Service Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Performance analysis of all AI services</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Services" value={String(aiServices.length)} icon={<Package className="w-5 h-5 text-violet-600" />} iconBg="bg-violet-100" />
        <StatCard label="Total Value" value={formatCurrency(totalRevenue)} icon={<TrendingUp className="w-5 h-5 text-green-600" />} iconBg="bg-green-100" />
        <StatCard label="Avg Rating" value={avgRating} icon={<Star className="w-5 h-5 text-yellow-500" />} iconBg="bg-yellow-100" />
        <StatCard label="Categories" value="6" icon={<Zap className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-100" />
      </div>

      <div className="nexora-card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-5">Service Ratings Comparison</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ratingByService}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis domain={[4, 5]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
            <Bar dataKey="rating" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Card>
        <h2 className="font-semibold text-gray-900 mb-5">All AI Services</h2>
        <DataTable columns={columns} data={aiServices as unknown as Record<string, unknown>[]} />
      </Card>
    </DashboardLayout>
  );
}
