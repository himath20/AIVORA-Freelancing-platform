
"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { apiRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  X,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Star,
  RefreshCw,
  User,
} from "lucide-react";

interface Freelancer {
  freelancer_id: number;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  bio: string | null;
  hourly_rate: number | null;
  avg_rating: number | null;
  account_status: string;
  joined_date: string | null;
}

interface FreelancersResponse {
  freelancers: Freelancer[];
}

interface FreelancerResponse {
  freelancer: Freelancer;
}

export default function AdminFreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFreelancer, setSelectedFreelancer] =
    useState<Freelancer | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in as an administrator.");
        return;
      }

      const response = await apiRequest<FreelancersResponse>(
        "/api/admin/freelancers",
        { token }
      );

      setFreelancers(response.freelancers || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load freelancers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const filtered = useMemo(() => {
    const search = query.toLowerCase().trim();

    if (!search) return freelancers;

    return freelancers.filter((freelancer) =>
      [
        freelancer.full_name,
        freelancer.email,
        freelancer.country || "",
      ].some((value) => value.toLowerCase().includes(search))
    );
  }, [freelancers, query]);

  const activeCount = freelancers.filter(
    (f) => f.account_status === "ACTIVE"
  ).length;

  const suspendedCount = freelancers.filter(
    (f) => f.account_status === "SUSPENDED"
  ).length;

  const averageRating =
    freelancers.length > 0
      ? (
          freelancers.reduce(
            (total, f) => total + Number(f.avg_rating || 0),
            0
          ) / freelancers.length
        ).toFixed(1)
      : "0.0";

  const viewDetails = async (freelancerId: number) => {
    try {
      setDetailsLoading(true);
      setError("");
      setSelectedFreelancer(null);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in as an administrator.");
        return;
      }

      const response = await apiRequest<FreelancerResponse>(
        `/api/admin/freelancers/${freelancerId}`,
        { token }
      );

      setSelectedFreelancer(response.freelancer);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load freelancer details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const toggleStatus = async (freelancer: Freelancer) => {
    const activating = freelancer.account_status !== "ACTIVE";
    const newStatus = activating ? "ACTIVE" : "SUSPENDED";

    const confirmed = window.confirm(
      `Are you sure you want to ${
        activating ? "activate" : "suspend"
      } ${freelancer.full_name}'s account?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(freelancer.freelancer_id);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in as an administrator.");
        return;
      }

      const response = await apiRequest<{
        message: string;
        account_status: string;
      }>(
        `/api/admin/freelancers/${freelancer.freelancer_id}/status`,
        {
          method: "PUT",
          token,
          body: { account_status: newStatus },
        }
      );

      setFreelancers((previous) =>
        previous.map((item) =>
          item.freelancer_id === freelancer.freelancer_id
            ? { ...item, account_status: response.account_status }
            : item
        )
      );

      if (
        selectedFreelancer?.freelancer_id === freelancer.freelancer_id
      ) {
        setSelectedFreelancer({
          ...selectedFreelancer,
          account_status: response.account_status,
        });
      }

      setSuccess(response.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update freelancer status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const statusStyle = (status: string) => {
    if (status === "ACTIVE") {
      return "bg-green-100 text-green-700";
    }

    if (status === "SUSPENDED") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <DashboardLayout variant="admin">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Freelancer Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage freelancer accounts on your platform.
          </p>
        </div>

        <button
          onClick={fetchFreelancers}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Freelancers",
            value: freelancers.length,
            color: "text-gray-900",
          },
          {
            label: "Active Accounts",
            value: activeCount,
            color: "text-green-600",
          },
          {
            label: "Suspended Accounts",
            value: suspendedCount,
            color: "text-yellow-600",
          },
          {
            label: "Average Rating",
            value: averageRating,
            color: "text-yellow-600",
          },
        ].map((stat) => (
          <Card key={stat.label} className="!p-5">
            <p className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="font-semibold text-gray-900">All Freelancers</h2>
            <p className="text-xs text-gray-400 mt-1">
              {filtered.length} records found
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email or country..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-500">
            Loading freelancers from database...
          </div>
        ) : freelancers.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            No freelancer records found in the database.
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            No freelancers match your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase">
                  <th className="py-3 px-3 font-medium">Freelancer</th>
                  <th className="py-3 px-3 font-medium">Location</th>
                  <th className="py-3 px-3 font-medium">Rating</th>
                  <th className="py-3 px-3 font-medium">Hourly Rate</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 px-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((freelancer) => (
                  <tr
                    key={freelancer.freelancer_id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-violet-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-gray-900">
                            {freelancer.full_name}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[190px]">
                            {freelancer.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {freelancer.country || "Not provided"}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        {Number(freelancer.avg_rating || 0).toFixed(1)}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-sm font-semibold text-gray-800">
                      {formatCurrency(Number(freelancer.hourly_rate || 0))}
                    </td>

                    <td className="py-4 px-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(
                          freelancer.account_status
                        )}`}
                      >
                        {freelancer.account_status}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() =>
                            viewDetails(freelancer.freelancer_id)
                          }
                          title="View freelancer details"
                          aria-label="View freelancer details"
                          className="p-2 rounded-lg text-violet-600 hover:bg-violet-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => toggleStatus(freelancer)}
                          disabled={
                            updatingId === freelancer.freelancer_id ||
                            freelancer.account_status === "CLOSED"
                          }
                          title={
                            freelancer.account_status === "ACTIVE"
                              ? "Suspend account"
                              : freelancer.account_status === "SUSPENDED"
                                ? "Activate account"
                                : "Closed account"
                          }
                          aria-label={
                            freelancer.account_status === "ACTIVE"
                              ? "Suspend account"
                              : "Activate account"
                          }
                          className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${
                            freelancer.account_status === "ACTIVE"
                              ? "text-red-500 hover:bg-red-100"
                              : "text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {freelancer.account_status === "ACTIVE" ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {(selectedFreelancer || detailsLoading) && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                Freelancer Details
              </h2>

              <button
                onClick={() => setSelectedFreelancer(null)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailsLoading ? (
              <div className="p-10 text-center text-gray-500">
                Loading freelancer details...
              </div>
            ) : selectedFreelancer ? (
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center">
                    <User className="w-7 h-7 text-violet-600" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedFreelancer.full_name}
                    </h3>
                    <span
                      className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(
                        selectedFreelancer.account_status
                      )}`}
                    >
                      {selectedFreelancer.account_status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{selectedFreelancer.email}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedFreelancer.phone || "Not provided"}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{selectedFreelancer.country || "Not provided"}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>
                      Rating: {Number(selectedFreelancer.avg_rating || 0).toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                      Joined:{" "}
                      {selectedFreelancer.joined_date
                        ? new Date(
                            selectedFreelancer.joined_date
                          ).toLocaleDateString()
                        : "Not available"}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-gray-500 mb-1">Hourly Rate</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(
                        Number(selectedFreelancer.hourly_rate || 0)
                      )}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-gray-500 mb-1">Biography</p>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedFreelancer.bio || "No biography provided."}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={() => setSelectedFreelancer(null)}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>

                  {selectedFreelancer.account_status !== "CLOSED" && (
                    <button
                      onClick={() => toggleStatus(selectedFreelancer)}
                      disabled={
                        updatingId === selectedFreelancer.freelancer_id
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 ${
                        selectedFreelancer.account_status === "ACTIVE"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {selectedFreelancer.account_status === "ACTIVE"
                        ? "Suspend Account"
                        : "Activate Account"}
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
