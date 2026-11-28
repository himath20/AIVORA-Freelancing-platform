"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/api";

type UserRole = "freelancer" | "client" | "admin";

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("freelancer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleLinks: Record<UserRole, string> = {
    freelancer: "/freelancer",
    client: "/client",
    admin: "/admin",
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: {
          email: email.trim(),
          password,
          role,
        },
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push(roleLinks[data.user.role]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/landing"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200">
            <span className="text-white font-bold text-xl">N</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Sign in to your NEXORA account
          </p>
        </div>

        <div className="nexora-card p-8">
          <div className="mb-6">
            <label className="nexora-label">Sign in as</label>

            <div className="grid grid-cols-3 gap-2">
              {(["freelancer", "client", "admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all border capitalize ${
                    role === r
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="nexora-label">
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="nexora-input"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="nexora-label mb-0">
                  Password
                </label>

                <Link
                  href="#"
                  className="text-xs text-violet-600 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="nexora-input pr-10"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="rounded border-gray-300 text-violet-600"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="nexora-btn-primary w-full text-center block py-3 disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-violet-600 font-semibold hover:underline"
            >
              Sign up free
            </Link>
          </p>
        </div>

        <div className="mt-4 p-3.5 bg-violet-50 border border-violet-100 rounded-xl text-xs text-violet-700 text-center">
          <strong>Secure Login:</strong> Sign in using your registered account.
        </div>
      </div>
    </div>
  );
}