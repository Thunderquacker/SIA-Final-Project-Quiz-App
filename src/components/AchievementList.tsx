"use client";

import { Achievement } from "@/lib/api";
import { Award } from "lucide-react";

interface AchievementListProps {
  achievements: Achievement[];
  isLoading?: boolean;
}

export function AchievementList({
  achievements,
  isLoading = false,
}: AchievementListProps) {
  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <p className="text-zinc-400">Loading achievements...</p>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
        <p className="text-zinc-400">No achievements</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-zinc-800">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Achievements
        </h3>
      </div>
      <div className="divide-y divide-zinc-800">
        {achievements.map((achievement) => (
          <div
            key={achievement.achievementId}
            className="p-4 hover:bg-zinc-800/50 transition-all"
          >
            <div className="flex gap-3">
              {achievement.badgeUrl && (
                <img
                  src={achievement.badgeUrl}
                  alt={achievement.title}
                  className="w-10 h-10 rounded"
                />
              )}
              <div className="flex-1">
                <h4 className="font-semibold">{achievement.title}</h4>
                <p className="text-sm text-zinc-400">{achievement.description}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
