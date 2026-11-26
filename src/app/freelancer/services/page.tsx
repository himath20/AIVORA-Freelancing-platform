"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { aiServices } from "@/lib/data";
import { Plus, Edit, Eye, Star, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function FreelancerServicesPage() {
  const [open, setOpen] = useState(false);
  const myServices = aiServices.filter((s) => s.freelancerId === "f1");

  return (
    <DashboardLayout variant="freelancer">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage your AI service offerings</p>
        </div>
        <button onClick={() => setOpen(true)} className="nexora-btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myServices.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">{service.category}</span>
                  <StatusBadge status={service.status} />
                </div>
                <h3 className="font-semibold text-gray-900">{service.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {service.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{tag}</span>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Price</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(service.price)}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{service.rating}</span>
                  <span className="text-gray-400">({service.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  {service.deliveryDays} day delivery
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="nexora-btn-secondary flex-1 text-sm py-2 flex items-center justify-center gap-1.5">
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
              <button className="nexora-btn-ghost flex-1 text-sm py-2 flex items-center justify-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
            </div>
          </Card>
        ))}

        {/* Add new service card */}
        <button
          onClick={() => setOpen(true)}
          className="nexora-card border-2 border-dashed border-gray-200 hover:border-violet-300 hover:bg-violet-50/30 transition-all flex flex-col items-center justify-center gap-3 p-10 cursor-pointer"
        >
          <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-violet-600" />
          </div>
          <span className="font-medium text-gray-600">Add New Service</span>
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create New Service">
        <div className="space-y-5">
          <div>
            <label className="nexora-label">Service Title</label>
            <input className="nexora-input" placeholder="e.g. Custom AI Chatbot for Your Website" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="nexora-label">Category</label>
              <select className="nexora-input">
                <option>AI Chatbot</option>
                <option>Data Science</option>
                <option>Computer Vision</option>
                <option>GenAI</option>
                <option>NLP</option>
                <option>MLOps</option>
              </select>
            </div>
            <div>
              <label className="nexora-label">Starting Price ($)</label>
              <input type="number" className="nexora-input" placeholder="499" />
            </div>
          </div>
          <div>
            <label className="nexora-label">Description</label>
            <textarea className="nexora-input h-24 resize-none" placeholder="Describe what you offer..." />
          </div>
          <div>
            <label className="nexora-label">Delivery Time (days)</label>
            <input type="number" className="nexora-input" placeholder="7" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setOpen(false)} className="nexora-btn-secondary flex-1">Cancel</button>
            <button onClick={() => setOpen(false)} className="nexora-btn-primary flex-1">Create Service</button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
