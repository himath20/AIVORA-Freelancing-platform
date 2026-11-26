"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Star, Clock, ArrowLeft } from "lucide-react";
import { aiServices } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function ExploreServicesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "AI Chatbot", "Data Science", "Computer Vision", "GenAI", "NLP", "MLOps"];
  const filtered = aiServices.filter(
    (s) =>
      (category === "All" || s.category === category) &&
      (s.title.toLowerCase().includes(query.toLowerCase()) || s.description.toLowerCase().includes(query.toLowerCase()))
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
            <Link href="/register" className="nexora-btn-primary text-sm py-2 px-4">Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link href="/landing" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore AI Services</h1>
          <p className="text-gray-500">Ready-to-hire AI services from top-rated specialists.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search AI services..."
              className="nexora-input pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat ? "bg-violet-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => (
            <div key={service.id} className="nexora-card overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <div className="h-36 bg-gradient-to-br from-violet-100 via-violet-50 to-blue-50 flex items-center justify-center">
                <span className="text-5xl">{service.category === "AI Chatbot" ? "🤖" : service.category === "Data Science" ? "📊" : service.category === "Computer Vision" ? "👁️" : service.category === "GenAI" ? "✨" : service.category === "NLP" ? "💬" : "⚙️"}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <img src={service.freelancerAvatar} alt={service.freelancerName} className="w-7 h-7 rounded-full" />
                  <span className="text-xs font-medium text-gray-600">{service.freelancerName}</span>
                  <span className="ml-auto text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{service.category}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-violet-700 transition-colors line-clamp-2">{service.title}</h3>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{service.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {service.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{tag}</span>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Starting at</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(service.price)}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-gray-500 justify-end mb-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      {service.rating} ({service.reviews})
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 justify-end">
                      <Clock className="w-3.5 h-3.5" />
                      {service.deliveryDays}d delivery
                    </div>
                  </div>
                </div>
                <Link href="/register" className="nexora-btn-primary w-full text-center block mt-4 text-sm py-2.5">
                  Order Service
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
