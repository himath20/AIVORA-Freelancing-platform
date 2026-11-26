"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Building2, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [role, setRole] = useState<"freelancer" | "client">("freelancer");
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/landing" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1 text-sm">Join thousands building the AI economy</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6 max-w-xs mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                step > s ? "bg-violet-600 text-white" : step === s ? "bg-violet-600 text-white ring-4 ring-violet-100" : "bg-gray-100 text-gray-400"
              }`}>
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? "bg-violet-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="nexora-card p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-semibold text-gray-900">I want to…</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "freelancer" as const, icon: <User className="w-6 h-6" />, title: "Work as Freelancer", desc: "Offer AI services and find projects" },
                  { key: "client" as const, icon: <Building2 className="w-6 h-6" />, title: "Hire AI Talent", desc: "Post projects and find specialists" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setRole(opt.key)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      role === opt.key ? "border-violet-600 bg-violet-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`mb-3 ${role === opt.key ? "text-violet-600" : "text-gray-400"}`}>{opt.icon}</div>
                    <p className={`font-semibold text-sm ${role === opt.key ? "text-violet-700" : "text-gray-800"}`}>{opt.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="nexora-btn-primary w-full py-3">Continue</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-semibold text-gray-900">Your details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="nexora-label">First Name</label>
                  <input className="nexora-input" placeholder="Alex" />
                </div>
                <div>
                  <label className="nexora-label">Last Name</label>
                  <input className="nexora-input" placeholder="Johnson" />
                </div>
              </div>
              <div>
                <label className="nexora-label">Email address</label>
                <input type="email" className="nexora-input" placeholder="alex@example.com" />
              </div>
              {role === "client" && (
                <div>
                  <label className="nexora-label">Organization Name</label>
                  <input className="nexora-input" placeholder="TechCorp Ltd." />
                </div>
              )}
              <div>
                <label className="nexora-label">Password</label>
                <input type="password" className="nexora-input" placeholder="Min. 8 characters" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="nexora-btn-secondary flex-1 py-3">Back</button>
                <button onClick={() => setStep(3)} className="nexora-btn-primary flex-1 py-3">Continue</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-900 mb-2">Account Created!</h2>
                <p className="text-gray-500 text-sm">Welcome to NEXORA. Your account is ready.</p>
              </div>
              <div className="p-4 bg-violet-50 rounded-xl text-sm text-violet-700">
                Check your email to verify your account.
              </div>
              <Link
                href={role === "freelancer" ? "/freelancer" : "/client"}
                className="nexora-btn-primary w-full py-3 text-center block"
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          {step < 3 && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-violet-600 font-semibold hover:underline">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
