"use client";

import { UserProfile, UpdateUserProfileRequest } from "@/lib/api";
import { Edit2, X, Check } from "lucide-react";
import { useState } from "react";

interface UserProfileCardProps {
  profile: UserProfile;
  onUpdate: (data: UpdateUserProfileRequest) => Promise<void>;
  isEditing: boolean;
  onEditToggle: () => void;
}

export function UserProfileCard({
  profile,
  onUpdate,
  isEditing,
  onEditToggle,
}: UserProfileCardProps) {
  const [formData, setFormData] = useState<UpdateUserProfileRequest>({
    username: profile.username,
    email: profile.email,
    bio: profile.bio || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await onUpdate(formData);
      onEditToggle();
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: profile.username,
      email: profile.email,
      bio: profile.bio || "",
    });
    onEditToggle();
  };

  if (isEditing) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        <div>
          <label className="text-sm text-zinc-400 block mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username || ""}
            onChange={handleInputChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400 block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400 block mb-2">Bio</label>
          <textarea
            name="bio"
            value={formData.bio || ""}
            onChange={handleInputChange}
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-purple-600 outline-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-all"
          >
            <Check className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold">{profile.username}</h2>
          <p className="text-zinc-400">{profile.email}</p>
        </div>
        <button
          onClick={onEditToggle}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-all"
        >
          <Edit2 className="w-5 h-5 text-purple-400" />
        </button>
      </div>

      {profile.bio && (
        <p className="text-zinc-300 text-sm">{profile.bio}</p>
      )}

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <p className="text-zinc-400 text-sm">Total Quizzes</p>
          <p className="text-2xl font-bold text-purple-400">
            {profile.totalQuizzesTaken}
          </p>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <p className="text-zinc-400 text-sm">Avg Score</p>
          <p className="text-2xl font-bold text-emerald-400">
            {profile.averageScore.toFixed(1)}%
          </p>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <p className="text-zinc-400 text-sm">Achievements</p>
          <p className="text-2xl font-bold text-amber-400">
            {profile.achievementsCount}
          </p>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <p className="text-zinc-400 text-sm">Member Since</p>
          <p className="text-sm font-bold text-blue-400">
            {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
