"use client";

import { UserProfile, UpdateUserProfileRequest } from "@/lib/api";
import { Mail, BookOpen, GraduationCap, User } from "lucide-react";

interface UserProfileCardProps {
  profile: UserProfile;
  onUpdate: (data: UpdateUserProfileRequest) => Promise<void>;
  isEditing: boolean;
  onEditToggle: () => void;
}

export function UserProfileCard({ profile, onUpdate, isEditing, onEditToggle }: UserProfileCardProps) {
  return (
    <div className="bg-[#121213] border border-zinc-800 rounded-2xl p-8 space-y-8">
      
      {/* Name and Email Section */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center">
          <User className="w-10 h-10 text-zinc-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{profile.username}</h2>
          <div className="flex items-center gap-2 text-zinc-400 mt-1">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{profile.email}</span>
          </div>
        </div>
      </div>

      {/* --- TEACHER SPECIFIC DATA GATE --- */}
      {profile.role === "TEACHER" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4" /> Subjects Taught
            </label>
            <div className="flex flex-wrap gap-2">
              {profile.subjects?.map((subj, i) => (
                <span key={i} className="bg-purple-900/20 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-lg text-xs font-bold">
                  {subj}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4" /> Year Levels
            </label>
            <div className="flex flex-wrap gap-2">
              {profile.yearLevels?.map((yr, i) => (
                <span key={i} className="bg-blue-900/20 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg text-xs font-bold">
                  {yr}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metric Section (Only for Students) */}
      {profile.role !== "TEACHER" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800/60">
          {/* ... (Your existing student metrics code) ... */}
        </div>
      )}
    </div>
  );
}