"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function CreateProjectPage() {
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  if (submitted) {
    return (
      <DashboardLayout variant="client">
        <div className="max-w-2xl mx-auto text-center pt-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Project Posted!</h2>
          <p className="text-gray-500 mb-8">Your project is now live. Freelancers will start submitting proposals shortly.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setSubmitted(false); setStep(1); }} className="nexora-btn-secondary">Post Another</button>
            <a href="/client/proposals" className="nexora-btn-primary">View Proposals</a>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout variant="client">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Post a New Project</h1>
          <p className="text-gray-500 text-sm mt-1">Describe your project and attract top AI talent</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {["Project Details", "Requirements", "Budget & Timeline"].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step > i + 1 ? "bg-violet-600 text-white" : step === i + 1 ? "bg-violet-600 text-white ring-4 ring-violet-100" : "bg-gray-100 text-gray-500"
              }`}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-medium ${step === i + 1 ? "text-violet-700" : "text-gray-400"}`}>{label}</span>
              {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? "bg-violet-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <Card>
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-semibold text-gray-900 text-lg">Project Details</h2>
              <div>
                <label className="nexora-label">Project Title *</label>
                <input className="nexora-input" placeholder="e.g. Build an AI Chatbot for Customer Support" />
              </div>
              <div>
                <label className="nexora-label">Category *</label>
                <select className="nexora-input">
                  <option>AI Chatbot</option>
                  <option>Machine Learning</option>
                  <option>Computer Vision</option>
                  <option>GenAI / LLM</option>
                  <option>Data Science</option>
                  <option>MLOps</option>
                  <option>NLP</option>
                </select>
              </div>
              <div>
                <label className="nexora-label">Project Description *</label>
                <textarea className="nexora-input h-36 resize-none" placeholder="Describe your project in detail. Include goals, expected outcomes, and any technical context..." />
              </div>
              <button onClick={() => setStep(2)} className="nexora-btn-primary w-full py-3">Continue →</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-semibold text-gray-900 text-lg">Project Requirements</h2>
              <div>
                <label className="nexora-label">Required AI Skills *</label>
                <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-xl bg-white min-h-[80px]">
                  {["Machine Learning", "Python", "React"].map((s) => (
                    <span key={s} className="bg-violet-100 text-violet-700 text-xs px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1">
                      {s} <span className="cursor-pointer text-violet-400 hover:text-red-500">×</span>
                    </span>
                  ))}
                  <input className="outline-none text-sm flex-1 min-w-[120px]" placeholder="Type a skill and press Enter..." />
                </div>
              </div>
              <div>
                <label className="nexora-label">Experience Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Entry", "Intermediate", "Expert"].map((l) => (
                    <label key={l} className="flex items-center gap-2 p-3.5 border border-gray-200 rounded-xl cursor-pointer hover:border-violet-300 transition-colors">
                      <input type="radio" name="level" className="text-violet-600" defaultChecked={l === "Expert"} />
                      <span className="text-sm font-medium text-gray-700">{l}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="nexora-label">Project Scope</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Small", "Medium", "Large"].map((s) => (
                    <label key={s} className="flex items-center gap-2 p-3.5 border border-gray-200 rounded-xl cursor-pointer hover:border-violet-300 transition-colors">
                      <input type="radio" name="scope" className="text-violet-600" defaultChecked={s === "Medium"} />
                      <span className="text-sm font-medium text-gray-700">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="nexora-label">Special Requirements / Notes</label>
                <textarea className="nexora-input h-24 resize-none" placeholder="Any specific requirements, constraints, or technical details..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="nexora-btn-secondary flex-1 py-3">← Back</button>
                <button onClick={() => setStep(3)} className="nexora-btn-primary flex-1 py-3">Continue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-semibold text-gray-900 text-lg">Budget & Timeline</h2>
              <div>
                <label className="nexora-label">Budget Type</label>
                <div className="grid grid-cols-2 gap-4">
                  {["Fixed Price", "Hourly Rate"].map((t) => (
                    <label key={t} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-violet-300 transition-colors">
                      <input type="radio" name="budgetType" className="text-violet-600" defaultChecked={t === "Fixed Price"} />
                      <span className="text-sm font-medium text-gray-700">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="nexora-label">Budget Amount ($)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input type="number" className="nexora-input pl-7" placeholder="3000" />
                  </div>
                </div>
                <div>
                  <label className="nexora-label">Project Deadline</label>
                  <input type="date" className="nexora-input" />
                </div>
              </div>

              <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-violet-700">
                  <strong>Demo Mode:</strong> This form demonstrates UI/UX only. In production, your project will be posted live and AI-matched to qualified freelancers.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="nexora-btn-secondary flex-1 py-3">← Back</button>
                <button onClick={() => setSubmitted(true)} className="nexora-btn-primary flex-1 py-3">Post Project 🚀</button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
