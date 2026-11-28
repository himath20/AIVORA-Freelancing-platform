"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { apiRequest } from "@/lib/api";
import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  RefreshCw,
  Building2,
  User
} from "lucide-react";

interface Client {
  client_id: number;
  org_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  country: string | null;
  client_type: string;
  avg_rating: number;
  account_status: "ACTIVE" | "SUSPENDED" | "CLOSED";
  joined_date: string;
}

interface ClientsResponse {
  clients: Client[];
}

interface ClientResponse {
  client: Client;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-700";
    case "SUSPENDED":
      return "bg-red-100 text-red-700";
    case "CLOSED":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error("Your login session has expired. Please log in again.");
      }

      const data = await apiRequest<ClientsResponse>(
        "/api/admin/clients",
        { token }
      );

      setClients(data.clients || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load clients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredClients = useMemo(() => {
    const search = query.toLowerCase();

    return clients.filter((client) =>
      [
        client.org_name,
        client.contact_person,
        client.email,
        client.country || "",
        client.client_type
      ]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [clients, query]);

  const activeCount = clients.filter(
    (client) => client.account_status === "ACTIVE"
  ).length;

  const suspendedCount = clients.filter(
    (client) => client.account_status === "SUSPENDED"
  ).length;

  const viewDetails = async (clientId: number) => {
    try {
      setDetailsLoading(true);
      setSelectedClient(null);

      if (!token) {
        throw new Error("Your login session has expired. Please log in again.");
      }

      const data = await apiRequest<ClientResponse>(
        `/api/admin/clients/${clientId}`,
        { token }
      );

      setSelectedClient(data.client);
    } catch (err) {
      setNotice(
        err instanceof Error ? err.message : "Unable to load client details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const toggleStatus = async (client: Client) => {
    const newStatus =
      client.account_status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    const confirmed = window.confirm(
      `Are you sure you want to ${newStatus === "SUSPENDED" ? "suspend" : "activate"} ${client.org_name}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(client.client_id);
      setNotice("");

      if (!token) {
        throw new Error("Your login session has expired. Please log in again.");
      }

      await apiRequest(
        `/api/admin/clients/${client.client_id}/status`,
        {
          method: "PUT",
          token,
          body: { account_status: newStatus }
        }
      );

      setClients((previous) =>
        previous.map((item) =>
          item.client_id === client.client_id
            ? { ...item, account_status: newStatus }
            : item
        )
      );

      if (selectedClient?.client_id === client.client_id) {
        setSelectedClient({
          ...selectedClient,
          account_status: newStatus
        });
      }

      setNotice(
        `${client.org_name} account successfully ${newStatus === "SUSPENDED" ? "suspended" : "activated"}.`
      );
    } catch (err) {
      setNotice(
        err instanceof Error
          ? err.message
          : "Unable to update client status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardLayout variant="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Client Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          View and manage all registered client organizations.
        </p>
      </div>

      {notice && (
        <div className="mb-5 p-3 rounded-lg bg-violet-50 text-violet-700 text-sm flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice("")}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-500">Total Clients</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {clients.length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Active Clients</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {activeCount}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Suspended Clients</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {suspendedCount}
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-semibold text-gray-900">
              All Clients ({filteredClients.length})
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Live records from the platform database
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>

            <button
              onClick={loadClients}
              disabled={loading}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              title="Refresh clients"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500 text-sm">
            Loading clients...
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button
              onClick={loadClients}
              className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm"
            >
              Try Again
            </button>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">
            No clients found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400">
                  <th className="py-3 px-3 font-medium">Organization</th>
                  <th className="py-3 px-3 font-medium">Contact Person</th>
                  <th className="py-3 px-3 font-medium">Country</th>
                  <th className="py-3 px-3 font-medium">Type</th>
                  <th className="py-3 px-3 font-medium">Rating</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 px-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredClients.map((client) => (
                  <tr
                    key={client.client_id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {client.org_name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3 text-sm text-gray-600">
                      {client.contact_person}
                    </td>

                    <td className="py-4 px-3 text-sm text-gray-600">
                      {client.country || "—"}
                    </td>

                    <td className="py-4 px-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {client.client_type}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <span className="flex items-center gap-1 text-sm text-gray-700">
                        <Star className="w-3.5 h-3.5 text-yellow-500" />
                        {Number(client.avg_rating || 0).toFixed(1)}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusStyle(client.account_status)}`}
                      >
                        {client.account_status}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewDetails(client.client_id)}
                          title="View details"
                          className="p-2 rounded-lg text-violet-600 hover:bg-violet-100"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {client.account_status !== "CLOSED" && (
                          <button
                            onClick={() => toggleStatus(client)}
                            disabled={updatingId === client.client_id}
                            title={
                              client.account_status === "ACTIVE"
                                ? "Suspend client"
                                : "Activate client"
                            }
                            className={`p-2 rounded-lg disabled:opacity-50 ${
                              client.account_status === "ACTIVE"
                                ? "text-red-500 hover:bg-red-100"
                                : "text-green-600 hover:bg-green-100"
                            }`}
                          >
                            {client.account_status === "ACTIVE" ? (
                              <Ban className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {detailsLoading && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6">
            Loading client details...
          </div>
        </div>
      )}

      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Client Details
              </h2>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {selectedClient.org_name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(selectedClient.account_status)}`}
                  >
                    {selectedClient.account_status}
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Contact Person</p>
                    <p className="text-gray-800">
                      {selectedClient.contact_person}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-gray-800">{selectedClient.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-gray-800">
                      {selectedClient.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Country</p>
                    <p className="text-gray-800">
                      {selectedClient.country || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Client Type</p>
                    <p className="text-gray-800">
                      {selectedClient.client_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p className="text-xs text-gray-400">Average Rating</p>
                    <p className="text-gray-800">
                      {Number(selectedClient.avg_rating || 0).toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Joined Date</p>
                    <p className="text-gray-800">
                      {new Date(selectedClient.joined_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {selectedClient.account_status !== "CLOSED" && (
                <button
                  onClick={() => toggleStatus(selectedClient)}
                  disabled={updatingId === selectedClient.client_id}
                  className={`w-full mt-7 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 ${
                    selectedClient.account_status === "ACTIVE"
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {selectedClient.account_status === "ACTIVE"
                    ? "Suspend Client"
                    : "Activate Client"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
