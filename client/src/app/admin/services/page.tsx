"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { apiRequest } from "@/lib/api";
import {
  Search,
  RefreshCw,
  Eye,
  Edit,
  X,
  Loader2,
  Wrench,
  Layers,
  Save,
} from "lucide-react";

interface AIService {
  service_id: number;
  service_name: string;
  description: string | null;
  category_id: number;
  category_name: string;
}

interface Category {
  category_id: number;
  category_name: string;
  description: string | null;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<AIService[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState<AIService | null>(null);
  const [editingService, setEditingService] = useState<AIService | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const [serviceData, categoryData] = await Promise.all([
        apiRequest<{ services: AIService[] }>("/api/admin/services", { token }),
        apiRequest<{ categories: Category[] }>("/api/categories", { token }),
      ]);

      setServices(serviceData.services || []);
      setCategories(categoryData.categories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredServices = useMemo(() => {
    const term = search.toLowerCase();

    return services.filter(
      (service) =>
        service.service_name.toLowerCase().includes(term) ||
        service.category_name.toLowerCase().includes(term) ||
        (service.description || "").toLowerCase().includes(term)
    );
  }, [services, search]);

  const saveService = async () => {
    if (!editingService) return;

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      await apiRequest(`/api/admin/services/${editingService.service_id}`, {
        method: "PUT",
        token,
        body: {
          service_name: editingService.service_name,
          description: editingService.description,
          category_id: editingService.category_id,
        },
      });

      setEditingService(null);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update service.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout variant="admin">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            AI Services Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage AI services and their categories.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Services</p>
              <h3 className="text-2xl font-bold mt-1">{services.length}</h3>
            </div>
            <Wrench className="w-8 h-8 text-violet-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Service Categories</p>
              <h3 className="text-2xl font-bold mt-1">{categories.length}</h3>
            </div>
            <Layers className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <h2 className="font-semibold text-gray-900">
            All Services ({filteredServices.length})
          </h2>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading services...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No services found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredServices.map((service) => (
                  <tr
                    key={service.service_id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="py-4 px-3 text-sm text-gray-500">
                      {service.service_id}
                    </td>

                    <td className="py-4 px-3">
                      <span className="font-medium text-gray-900">
                        {service.service_name}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-sm text-gray-600 max-w-xs">
                      <span className="block truncate">
                        {service.description || "No description"}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full whitespace-nowrap">
                        {service.category_name}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedService(service)}
                          title="View service"
                          className="p-2 hover:bg-violet-100 rounded-lg text-violet-600"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setEditingService({ ...service })}
                          title="Edit service"
                          className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
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

      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Service Details
                </h2>
                <p className="text-xs text-gray-500">
                  Service #{selectedService.service_id}
                </p>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500">Service Name</p>
                <p className="font-semibold text-gray-900">
                  {selectedService.service_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-medium text-gray-900">
                  {selectedService.category_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedService.description || "No description available."}
                </p>
              </div>
            </div>

            <div className="p-5 border-t flex justify-end">
              <button
                onClick={() => setSelectedService(null)}
                className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-gray-900">Edit Service</h2>
              <button
                onClick={() => setEditingService(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name
                </label>
                <input
                  value={editingService.service_name}
                  maxLength={100}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      service_name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingService.description || ""}
                  maxLength={255}
                  rows={4}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editingService.category_id}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      category_id: Number(e.target.value),
                      category_name:
                        categories.find(
                          (category) =>
                            category.category_id === Number(e.target.value)
                        )?.category_name || "",
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-5 border-t flex justify-end gap-3">
              <button
                onClick={() => setEditingService(null)}
                disabled={saving}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveService}
                disabled={saving || !editingService.service_name.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
