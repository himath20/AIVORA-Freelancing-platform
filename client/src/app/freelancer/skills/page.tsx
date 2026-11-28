"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiRequest } from "@/lib/api";
import { Plus, Zap, TrendingUp, X } from "lucide-react";

interface AvailableSkill {
  skill_id: number;
  skill_name: string;
  category_id: number;
  category_name: string;
}

interface FreelancerSkill {
  freelancer_id: number;
  skill_id: number;
  skill_name: string;
  category_id: number;
  category_name: string;
  proficiency: string;
  years_experience: number;
}

interface SkillsResponse {
  message: string;
  total: number;
  skills: AvailableSkill[];
}

interface FreelancerSkillsResponse {
  message: string;
  total: number;
  skills: FreelancerSkill[];
}

export default function FreelancerSkillsPage() {
  const [allSkills, setAllSkills] = useState<AvailableSkill[]>([]);
  const [mySkills, setMySkills] = useState<FreelancerSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [proficiency, setProficiency] = useState("INTERMEDIATE");
  const [experience, setExperience] = useState(0);
  const [saving, setSaving] = useState(false);

  const fetchSkills = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to manage your skills.");
      setLoading(false);
      return;
    }

    try {
      const [availableResponse, myResponse] = await Promise.all([
        apiRequest<SkillsResponse>("/api/skills", { token }),
        apiRequest<FreelancerSkillsResponse>(
          "/api/freelancer-skills",
          { token }
        ),
      ]);

      setAllSkills(availableResponse.skills);
      setMySkills(myResponse.skills);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load skills."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const addSkill = async () => {
    const token = localStorage.getItem("token");

    if (!token || !selectedSkill) return;

    setSaving(true);
    setError("");

    try {
      await apiRequest("/api/freelancer-skills", {
        method: "POST",
        token,
        body: {
          skill_id: Number(selectedSkill),
          proficiency,
          years_experience: experience,
        },
      });

      setSelectedSkill("");
      setProficiency("INTERMEDIATE");
      setExperience(0);

      await fetchSkills();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add skill."
      );
    } finally {
      setSaving(false);
    }
  };

  const removeSkill = async (skillId: number) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    setError("");

    try {
      await apiRequest(
        `/api/freelancer-skills/${skillId}`,
        { method: "DELETE", token }
      );

      setMySkills((current) =>
        current.filter((skill) => skill.skill_id !== skillId)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove skill."
      );
    }
  };

  const availableToAdd = allSkills.filter(
    (skill) =>
      !mySkills.some((mine) => mine.skill_id === skill.skill_id)
  );

  const highDemandCount = mySkills.filter(
    (skill) => skill.proficiency === "EXPERT"
  ).length;

  return (
    <DashboardLayout variant="freelancer">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Skills</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage and showcase your AI expertise
        </p>
      </div>

      {error && (
        <Card className="mb-6">
          <p className="text-red-500 text-sm">{error}</p>
        </Card>
      )}

      {loading ? (
        <Card className="text-center py-16">
          <p className="text-gray-500">Loading your skills...</p>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-600" />
              My Skills ({mySkills.length})
            </h2>

            {mySkills.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No skills added yet. Browse below to add some.
              </p>
            ) : (
              <div className="space-y-3">
                {mySkills.map((skill) => (
                  <div
                    key={skill.skill_id}
                    className="flex flex-wrap items-center justify-between gap-3 bg-violet-50 border border-violet-100 p-3 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-violet-800">
                        {skill.skill_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {skill.category_name} · {skill.proficiency} ·{" "}
                        {skill.years_experience} years experience
                      </p>
                    </div>

                    <button
                      onClick={() => removeSkill(skill.skill_id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Remove skill"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="grid grid-cols-2 gap-5 mb-6">
            <Card className="text-center !p-5">
              <p className="text-3xl font-bold text-violet-700">
                {mySkills.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Skills in profile
              </p>
            </Card>

            <Card className="text-center !p-5">
              <p className="text-3xl font-bold text-green-700">
                {highDemandCount}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Expert-level skills
              </p>
            </Card>
          </div>

          <Card className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-5">
              <Plus className="w-4 h-4 inline mr-2 text-violet-600" />
              Add a Skill
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Skill
                </label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full border rounded-lg p-3 text-sm"
                >
                  <option value="">Choose a skill</option>
                  {availableToAdd.map((skill) => (
                    <option
                      key={skill.skill_id}
                      value={skill.skill_id}
                    >
                      {skill.skill_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Proficiency
                </label>
                <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  className="w-full border rounded-lg p-3 text-sm"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={experience}
                  onChange={(e) =>
                    setExperience(Number(e.target.value))
                  }
                  className="w-full border rounded-lg p-3 text-sm"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={addSkill}
                  disabled={!selectedSkill || saving}
                  className="nexora-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  {saving ? "Adding..." : "Add Skill"}
                </button>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-600" />
              Browse All AI Skills ({allSkills.length})
            </h2>

            {allSkills.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No skills are available.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allSkills.map((skill) => {
                  const added = mySkills.some(
                    (mine) => mine.skill_id === skill.skill_id
                  );

                  return (
                    <div
                      key={skill.skill_id}
                      className="border rounded-xl p-4 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {skill.skill_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {skill.category_name}
                        </p>
                      </div>

                      {added ? (
                        <StatusBadge status="COMPLETED" />
                      ) : (
                        <button
                          onClick={() =>
                            setSelectedSkill(String(skill.skill_id))
                          }
                          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-violet-100 hover:text-violet-700"
                        >
                          + Select
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}