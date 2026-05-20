"use client";

import { useState } from "react";
import { UserProfile, QuizHistory, Achievement, UpdateUserProfileRequest } from "@/lib/api";
import { QuizManager } from "@/components/QuizManager";
import { UserProfileCard } from "@/components/UserProfileCard";
import { EventsView } from "@/components/EventsView";
import { QuizzesView } from "@/components/QuizzesView";
import { StudentsView } from "@/components/StudentsView";
import { LayoutGrid, LogOut, UserCircle, FileText, Users, Calendar, Settings, Plus } from "lucide-react";

interface TeacherDashboardProps {
  profile: UserProfile | null;
  history: QuizHistory[];
  achievements: Achievement[];
  onLogout: () => void;
  onRefreshData: () => void;
  onUpdateProfile: (data: UpdateUserProfileRequest) => Promise<void>;
}

export function TeacherDashboard({ profile, onLogout, onUpdateProfile }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="flex min-h-screen bg-[#0D0D0E] text-zinc-100">
      <aside className="w-64 bg-[#121213] border-r border-zinc-800 p-6 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">Q</div>
          <h1 className="text-xl font-bold tracking-tight text-white">Minu</h1>
        </div>
        <nav className="space-y-1 flex-grow">
          <button onClick={() => setActiveTab("Dashboard")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${activeTab === "Dashboard" ? "bg-purple-600 text-white" : "text-zinc-500 hover:bg-zinc-800/50"}`}><LayoutGrid className="w-5 h-5" /> Dashboard</button>
          <button onClick={() => setActiveTab("Quizzes")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${activeTab === "Quizzes" ? "bg-purple-600 text-white" : "text-zinc-500 hover:bg-zinc-800/50"}`}><FileText className="w-5 h-5" /> Quizzes</button>
          <button onClick={() => setActiveTab("Events")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${activeTab === "Events" ? "bg-purple-600 text-white" : "text-zinc-500 hover:bg-zinc-800/50"}`}><Calendar className="w-5 h-5" /> Events</button>
          <button onClick={() => setActiveTab("Students")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${activeTab === "Students" ? "bg-purple-600 text-white" : "text-zinc-500 hover:bg-zinc-800/50"}`}><Users className="w-5 h-5" /> Students</button>
          <div className="pt-6 pb-2 px-4"><p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Manage</p></div>
          <button onClick={() => setActiveTab("Settings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${activeTab === "Settings" ? "bg-purple-600 text-white" : "text-zinc-500 hover:bg-zinc-800/50"}`}><Settings className="w-5 h-5" /> Settings</button>
        </nav>
        <div className="pt-4 border-t border-zinc-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"><LogOut className="w-5 h-5" /> Logout</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#0D0D0E]/50">
          <h2 className="font-bold text-xl text-white">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-800 text-sm font-medium transition-all"><Plus className="w-4 h-4 text-purple-400" /> Create Quiz</button>
            <div className="w-px h-6 bg-zinc-800" />
            <button onClick={() => setActiveTab("Profile")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block"><p className="text-sm font-medium">{profile?.username || "Instructor"}</p><p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Instructor</p></div>
              <div className="w-10 h-10 bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center"><UserCircle className="w-6 h-6 text-zinc-500" /></div>
            </button>
          </div>
        </header>

        <main className="p-8 overflow-y-auto max-w-6xl w-full mx-auto">
          {activeTab === "Dashboard" && <QuizManager userRole="TEACHER" />}
          {activeTab === "Quizzes" && <QuizzesView userRole="TEACHER" />}
          {activeTab === "Events" && <EventsView userRole="TEACHER" />}
          {activeTab === "Students" && <StudentsView />}
          {activeTab === "Profile" && profile && (
            <UserProfileCard profile={profile} onUpdate={onUpdateProfile} isEditing={false} onEditToggle={() => {}} />
          )}
          {activeTab === "Settings" && <div className="flex items-center justify-center h-64 border border-dashed border-zinc-800 rounded-3xl"><p className="text-zinc-600">Settings configuration module active.</p></div>}
        </main>
      </div>
    </div>
  );
}