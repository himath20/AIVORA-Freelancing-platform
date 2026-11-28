"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { apiRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2, Clock } from "lucide-react";

interface AvailableService {
  service_id: number;
  category_id: number;
  service_name: string;
  description: string;
}

interface FreelancerService {
  freelancer_id: number;
  service_id: number;
  base_price: number;
  delivery_days: number;
  service_name: string;
}

interface AvailableServicesResponse {
  message: string;
  total: number;
  services: AvailableService[];
}

interface FreelancerServicesResponse {
  message: string;
  total: number;
  services: FreelancerService[];
}

export default function FreelancerServicesPage() {
  const [open, setOpen] = useState(false);
  const [allServices, setAllServices] = useState<AvailableService[]>([]);
  const [myServices, setMyServices] = useState<FreelancerService[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("7");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchServices = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to manage your services.");
      setLoading(false);
      return;
    }

    try {
      const [availableResponse, myResponse] = await Promise.all([
        apiRequest<AvailableServicesResponse>("/api/services", { token }),
        apiRequest<FreelancerServicesResponse>(
          "/api/freelancer-services",
          { token }
        ),
      ]);

      setAllServices(availableResponse.services);
      setMyServices(myResponse.services);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const addService = async () => {
    const token = localStorage.getItem("token");

    if (!token || !selectedService || !price || !deliveryDays) {
      setError("Please complete all fields.");
      return;
    }

    if (Number(price) <= 0 || Number(deliveryDays) <= 0) {
      setError("Price and delivery days must be greater than zero.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await apiRequest("/api/freelancer-services", {
        method: "POST",
        token,
        body: {
          service_id: Number(selectedService),
          price: Number(price),
          delivery_days: Number(deliveryDays),
        },
      });

      setOpen(false);
      setSelectedService("");
      setPrice("");
      setDeliveryDays("7");

      setLoading(true);
      await fetchServices();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add service."
      );
    } finally {
      setSaving(false);
    }
  };

  const removeService = async (serviceId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in again.");
      return;
    }

    try {
      await apiRequest(
        `/api/freelancer-services/${serviceId}`,
        {
          method: "DELETE",
          token,
        }
      );

      setMyServices((current) =>
        current.filter((service) => service.service_id !== serviceId)
      );

      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove service."
      );
    }
  };

  const availableToAdd = allServices.filter(
    (service) =>
      !myServices.some(
        (mine) => mine.service_id === service.service_id
      )
  );

  return (
    <DashboardLayout variant="freelancer">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Services
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create and manage your AI service offerings
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="nexora-btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {error && (
        <Card className="mb-6">
          <p className="text-red-500 text-sm">{error}</p>
        </Card>
      )}

      {loading ? (
        <Card className="text-center py-16">
          <p className="text-gray-500">Loading your services...</p>
        </Card>
      ) : myServices.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-gray-400">
            You haven't added any services yet.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Click Add Service to get started.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myServices.map((service) => (
            <Card
              key={service.service_id}
              className="hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900">
                {service.service_name}
              </h3>

              <div className="border-t border-gray-100 mt-5 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Starting Price</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(service.base_price)}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {service.delivery_days} days delivery
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeService(service.service_id)}
                className="mt-4 w-full border border-red-200 text-red-600 rounded-lg py-2 text-sm hover:bg-red-50 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove Service
              </button>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-6">
        <h2 className="font-semibold text-gray-900 mb-3">
          Available AI Services ({allServices.length})
        </h2>

        {allServices.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No services are available.
          </p>
        ) : (
          <div className="space-y-3">
            {allServices.map((service) => {
              const added = myServices.some(
                (mine) => mine.service_id === service.service_id
              );

              return (
                <div
                  key={service.service_id}
                  className="border rounded-xl p-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {service.service_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {service.description}
                    </p>
                  </div>

                  <span className="text-xs font-medium">
                    {added ? (
                      <span className="text-green-600">Added</span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedService(String(service.service_id));
                          setOpen(true);
                        }}
                        className="text-violet-700 hover:text-violet-900"
                      >
                        + Select
                      </button>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add New Service"
      >
        <div className="space-y-5">
          <div>
            <label className="nexora-label">Select Service</label>
            <select
              className="nexora-input"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="">Choose a service</option>

              {availableToAdd.map((service) => (
                <option
                  key={service.service_id}
                  value={service.service_id}
                >
                  {service.service_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="nexora-label">
              Starting Price ($)
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="nexora-input"
              placeholder="499"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="nexora-label">
              Delivery Time (days)
            </label>
            <input
              type="number"
              min="1"
              className="nexora-input"
              placeholder="7"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setOpen(false)}
              className="nexora-btn-secondary flex-1"
            >
              Cancel
            </button>

            <button
              onClick={addService}
              disabled={saving || !selectedService}
              className="nexora-btn-primary flex-1 disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Service"}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}