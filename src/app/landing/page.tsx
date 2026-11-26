"use client";

import Link from "next/link";
import { ArrowRight, Zap, Users, Shield, TrendingUp, Star, CheckCircle } from "lucide-react";

export default function LandingPage() {
  const stats = [
    { label: "AI Freelancers", value: "12,000+" },
    { label: "Projects Completed", value: "48,500+" },
    { label: "Global Clients", value: "3,200+" },
    { label: "Total Paid Out", value: "$4.2M+" },
  ];

  const features = [
    { icon: <Zap className="w-6 h-6 text-violet-600" />, title: "AI-Specialized Talent", desc: "Browse vetted experts in ML, NLP, Computer Vision, GenAI, MLOps and more." },
    { icon: <Shield className="w-6 h-6 text-violet-600" />, title: "Secure Payments", desc: "Escrow-protected payments ensure freelancers get paid and clients get results." },
    { icon: <TrendingUp className="w-6 h-6 text-violet-600" />, title: "Smart Matching", desc: "Our AI engine matches your project to the best-fit freelancers instantly." },
    { icon: <Users className="w-6 h-6 text-violet-600" />, title: "Global Community", desc: "Work with top AI talent across 60+ countries in every timezone." },
  ];

  const categories = [
    { label: "Machine Learning", icon: "🤖", count: "2,400 freelancers" },
    { label: "Natural Language Processing", icon: "💬", count: "1,800 freelancers" },
    { label: "Computer Vision", icon: "👁️", count: "1,200 freelancers" },
    { label: "Generative AI", icon: "✨", count: "3,100 freelancers" },
    { label: "Data Science", icon: "📊", count: "2,900 freelancers" },
    { label: "MLOps", icon: "⚙️", count: "900 freelancers" },
  ];

  const testimonials = [
    { name: "Sarah Chen", company: "DataVision AI", rating: 5, quote: "NEXORA connected us with an ML engineer who delivered a churn prediction model that saved us $200K in customer losses.", avatar: "https://i.pravatar.cc/150?img=30" },
    { name: "Marcus Brown", company: "RetailGenius", rating: 5, quote: "Found an AI chatbot developer within 48 hours. The quality of talent on NEXORA is unmatched. Highly recommend.", avatar: "https://i.pravatar.cc/150?img=33" },
    { name: "Aiko Tanaka", company: "Freelancer", rating: 5, quote: "NEXORA tripled my freelance income. The platform is sleek, payment is secure, and clients are serious.", avatar: "https://i.pravatar.cc/150?img=36" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-violet-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-gray-900 text-xl tracking-tight">NEXORA</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/explore-projects" className="hover:text-violet-600 transition-colors">Find Projects</Link>
            <Link href="/explore-services" className="hover:text-violet-600 transition-colors">AI Services</Link>
            <Link href="/discover-freelancers" className="hover:text-violet-600 transition-colors">Find Talent</Link>
            <Link href="#" className="hover:text-violet-600 transition-colors">Enterprise</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="nexora-btn-secondary text-sm py-2 px-4">Log In</Link>
            <Link href="/register" className="nexora-btn-primary text-sm py-2 px-4">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-violet-50/40 to-white pt-20 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(124,58,237,0.08),transparent)]" />
        <div className="max-w-6xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" />
            The #1 Platform for AI Talent
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-none mb-6">
            Where AI Talent<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-violet-400">
              Meets Opportunity
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with world-class AI engineers, data scientists, and ML specialists.
            Post your project. Get matched instantly. Ship faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="nexora-btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2">
              Post a Project <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/discover-freelancers" className="nexora-btn-secondary text-base px-8 py-3.5">
              Find AI Talent
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse AI Specializations</h2>
            <p className="text-gray-500">Find the right expert for every AI challenge.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href="/discover-freelancers"
                className="p-5 rounded-2xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-all duration-200 group"
              >
                <span className="text-3xl mb-3 block">{cat.icon}</span>
                <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">{cat.label}</h3>
                <p className="text-sm text-gray-500 mt-1">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why NEXORA?</h2>
            <p className="text-gray-500">Built for the AI economy from the ground up.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="nexora-card p-6 hover:shadow-md transition-shadow">
                <div className="p-3 bg-violet-100 rounded-xl w-fit mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Get Started in 3 Steps</h2>
          <p className="text-gray-500 mb-12">From sign-up to your first AI project in minutes.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "01", title: "Post your project", desc: "Describe your AI challenge, budget, and timeline." },
              { n: "02", title: "Review proposals", desc: "Get competitive bids from vetted AI specialists." },
              { n: "03", title: "Build & ship", desc: "Collaborate, track progress, and pay securely." },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-14 h-14 bg-violet-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg mx-auto mb-4 shadow-lg shadow-violet-200">
                  {step.n}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Trusted by Teams Worldwide</h2>
            <p className="text-gray-500">See what our community is saying.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="nexora-card p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 to-violet-800">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to build with AI?</h2>
          <p className="text-violet-200 text-lg mb-10">Join thousands of teams and freelancers on NEXORA today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-violet-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-violet-50 transition-colors inline-flex items-center gap-2">
              Start for Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/explore-projects" className="border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
              Browse Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-violet-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="font-bold text-gray-900">NEXORA</span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            {["About", "Careers", "Press", "Blog", "Privacy", "Terms", "Help"].map((l) => (
              <Link key={l} href="#" className="hover:text-violet-600 transition-colors">{l}</Link>
            ))}
          </div>
          <p className="text-sm text-gray-400">© 2025 NEXORA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
