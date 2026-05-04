"use client";

import { useEffect, useState, use } from "react";
import {
  getUserProfile,
  getUserQuizHistory,
  getUserAchievements,
  updateUserProfile,
  UserProfile,
  QuizHistory,
  Achievement,
  UpdateUserProfileRequest,
} from "@/lib/api";
import { UserProfileCard } from "@/components/UserProfileCard";
import { QuizHistoryList } from "@/components/QuizHistoryList";
import { AchievementList } from "@/components/AchievementList";

interface ProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { userId: userIdStr } = use(params);
  const userId = Number(userIdStr);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [profileData, historyData, achievementData] = await Promise.all([
          getUserProfile(userId),
          getUserQuizHistory(userId),
          getUserAchievements(userId),
        ]);

        setProfile(profileData);
        setQuizHistory(historyData);
        setAchievements(achievementData);
      } catch (err) {
        setError("Failed to load profile. Ensure backend is running on port 8081.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadData();
    }
  }, [userId]);

  const handleUpdateProfile = async (data: UpdateUserProfileRequest) => {
    try {
      const updatedProfile = await updateUserProfile(userId, data);
      setProfile(updatedProfile);
    } catch (err) {
      throw new Error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0E] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-zinc-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0E] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0D0D0E] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-zinc-400">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0E] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserProfileCard
          profile={profile}
          onUpdate={handleUpdateProfile}
          isEditing={isEditing}
          onEditToggle={() => setIsEditing(!isEditing)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <QuizHistoryList history={quizHistory} />
          </div>
          <div>
            <AchievementList achievements={achievements} />
          </div>
        </div>
      </div>
    </div>
  );
}
