"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiRequest } from "@/lib/api";
import {
  MapPin,
  Star,
  Briefcase,
  DollarSign,
  CheckCircle,
  Edit,
  Save,
  X,
} from "lucide-react";

interface FreelancerProfileData {
  freelancer_id: number;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  bio: string | null;
  hourly_rate: number;
  avg_rating: number;
  account_status: string;
  joined_date: string;
}

interface ProfileResponse {
  message: string;
  profile: FreelancerProfileData;
}

interface FreelancerSkill {
  skill_id: number;
  skill_name: string;
  proficiency: string;
  years_experience: number;
}

interface SkillsResponse {
  message: string;
  total: number;
  skills: FreelancerSkill[];
}

export default function FreelancerProfile() {
  const [profile, setProfile] = useState<FreelancerProfileData | null>(null);
  const [skills, setSkills] = useState<FreelancerSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to view your profile.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiRequest<ProfileResponse>(
        "/api/profile/me",
        { token }
      );

      setProfile(response.profile);
      setFullName(response.profile.full_name);
      setPhone(response.profile.phone || "");
      setCountry(response.profile.country || "");
      setBio(response.profile.bio || "");
      setHourlyRate(String(response.profile.hourly_rate ?? 0));

      try {
        const skillsResponse = await apiRequest<SkillsResponse>(
          "/api/freelancer-skills",
          { token }
        );

        setSkills(skillsResponse.skills);
      } catch {
        setSkills([]);
      }

      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const saveProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in again.");
      return;
    }

    if (!fullName.trim() || hourlyRate.trim() === "") {
      setError("Please provide your name and hourly rate.");
      return;
    }

    const rate = Number(hourlyRate);

    if (!Number.isFinite(rate) || rate < 0 || rate > 999999.99) {
      setError("Please enter a valid hourly rate.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await apiRequest("/api/profile/me", {
        method: "PUT",
        token,
        body: {
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          country: country.trim() || null,
          bio: bio.trim() || null,
          hourly_rate: rate,
        },
      });

      setEditing(false);
      setSuccess("Your profile was updated successfully!");

      await fetchProfile();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    if (!profile) return;

    setFullName(profile.full_name);
    setPhone(profile.phone || "");
    setCountry(profile.country || "");
    setBio(profile.bio || "");
    setHourlyRate(String(profile.hourly_rate ?? 0));
    setEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <DashboardLayout variant="freelancer">
        <Card className="text-center py-16">
          <p className="text-gray-500">Loading your profile...</p>
        </Card>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout variant="freelancer">
        <Card className="text-center py-16">
          <p className="text-red-500">
            {error || "Unable to load your profile."}
          </p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout variant="freelancer">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Profile
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your public freelancer profile
            </p>
          </div>

          {!editing && (
            <button
              onClick={() => {
                setEditing(true);
                setSuccess("");
                setError("");
              }}
              className="nexora-btn-primary flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <Card className="mb-5">
            <p className="text-red-500 text-sm">{error}</p>
          </Card>
        )}

        {success && (
          <Card className="mb-5">
            <p className="text-green-600 text-sm">{success}</p>
          </Card>
        )}

        {editing ? (
          <Card className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-5">
              Edit Your Profile
            </h2>

            <div className="space-y-4">
              <div>
                <label className="nexora-label">Full Name</label>
                <input
                  className="nexora-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div>
                <label className="nexora-label">Email</label>
                <input
                  className="nexora-input bg-gray-100"
                  value={profile.email}
                  disabled
                />
                <p className="text-xs text-gray-400 mt-1">
                  Email cannot be changed here.
                </p>
              </div>

              <div>
                <label className="nexora-label">Phone</label>
                <input
                  className="nexora-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={20}
                />
              </div>

              <div>
                <label className="nexora-label">Country</label>
                <input
                  className="nexora-input"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  maxLength={60}
                />
              </div>

              <div>
                <label className="nexora-label">Hourly Rate ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="nexora-input"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                />
              </div>

              <div>
                <label className="nexora-label">Bio</label>
                <textarea
                  className="nexora-input h-32 resize-none"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={500}
                  placeholder="Tell clients about your experience and expertise..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  Maximum 500 characters.
                </p>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  onClick={cancelEditing}
                  disabled={saving}
                  className="nexora-btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>

                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="nexora-btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-2xl bg-violet-100 flex items-center justify-center">
                  <span className="text-3xl font-bold text-violet-700">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {profile.full_name}
                      </h2>

                      <p className="text-gray-500 text-sm mt-1">
                        {profile.email}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        {profile.country && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {profile.country}
                          </span>
                        )}

                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          {Number(profile.avg_rating || 0).toFixed(2)} rating
                        </span>

                        <span>
                          Member since{" "}
                          {new Date(profile.joined_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <StatusBadge status={profile.account_status} />
                  </div>

                  <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                    {profile.bio || "No profile bio added yet."}
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-5 mb-6">
              <Card className="flex items-center gap-4 !p-5">
                <div className="p-3 rounded-xl bg-green-100">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hourly Rate</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${Number(profile.hourly_rate || 0).toLocaleString()}/hr
                  </p>
                </div>
              </Card>

              <Card className="flex items-center gap-4 !p-5">
                <div className="p-3 rounded-xl bg-blue-100">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Skills Added</p>
                  <p className="text-xl font-bold text-gray-900">
                    {skills.length}
                  </p>
                </div>
              </Card>
            </div>

            <Card className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                AI Skills
              </h3>

              {skills.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No skills added yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.skill_id}
                      className="px-3.5 py-1.5 bg-violet-50 text-violet-700 rounded-xl text-sm font-medium border border-violet-100"
                    >
                      {skill.skill_name}
                      <span className="text-violet-400 ml-1">
                        ({skill.proficiency})
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">
                Profile Information
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Full Name</span>
                  <span className="font-medium text-gray-800">
                    {profile.full_name}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-800">
                    {profile.email}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-800">
                    {profile.phone || "Not provided"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Country</span>
                  <span className="font-medium text-gray-800">
                    {profile.country || "Not provided"}
                  </span>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}