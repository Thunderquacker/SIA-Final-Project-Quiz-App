"use client";

import { useState } from "react";
import { UserProfile, QuizHistory, Achievement } from "@/lib/api";
import { QuizManager } from "@/components/QuizManager";
import { QuizHistoryList } from "@/components/QuizHistoryList";
import { EventsView } from "@/components/EventsView";
import { QuizzesView } from "@/components/QuizzesView";
import { StudentClassmatesView } from "@/components/StudentsClassmatesView";
import { FileText, Users, Calendar, LogOut, Award, BarChart3, LayoutGrid, UserCircle } from "lucide-react";

interface StudentDashboardProps {
  profile: UserProfile | null;
  history: QuizHistory[];
  achievements: Achievement[];
  onLogout: () => void;
}

export function StudentDashboard({ profile, history, achievements, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="flex min-h-screen bg-[#0D0D0E] text-zinc-100">
      {/* Sidebar Layout */}
      <aside className="w-64 bg-[#121213] border-r border-zinc-800 p-6 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">Q</div>
          <h1 className="text-xl font-bold tracking-tight text-white">Minu</h1>
        </div>

        <nav className="space-y-1 flex-grow">
          <button onClick={() => setActiveTab("Dashboard")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${activeTab === "Dashboard" ? "bg-purple-600 text-white" : "text-zinc-500 hover:bg-zinc-900"}`}><LayoutGrid className="w-5 h-5" /> Dashboard</button>
          <button onClick={() => setActiveTab("Quizzes")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${activeTab === "Quizzes" ? "bg-purple-600 text-white" : "text-zinc-500 hover:bg-zinc-900"}`}><FileText className="w-5 h-5" /> Quizzes</button>
          <button onClick={() => setActiveTab("Events")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${activeTab === "Events" ? "bg-purple-600 text-white" : "text-zinc-500 hover:bg-zinc-900"}`}><Calendar className="w-5 h-5" /> Events</button>
          <button onClick={() => setActiveTab("Classmates")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${activeTab === "Classmates" ? "bg-purple-600 text-white" : "text-zinc-500 hover:bg-zinc-900"}`}><Users className="w-5 h-5" /> Classmates</button>
          <button onClick={() => setActiveTab("Profile")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${activeTab === "Profile" ? "bg-purple-600 text-white" : "text-zinc-500 hover:bg-zinc-900"}`}><UserCircle className="w-5 h-5" /> My Profile</button>
        </nav>

        <div className="pt-4 border-t border-zinc-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#0D0D0E]/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="font-bold text-xl text-white">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-zinc-300">{profile?.username || "Student"}</p>
              <p className="text-[9px] bg-purple-900/30 text-purple-400 font-bold px-2 py-0.5 rounded border border-purple-500/10 uppercase tracking-wider mt-0.5 inline-block">
                {profile?.role || "STUDENT"}
              </p>
            </div>
          </div>
        </header>

        <main className="p-8 overflow-y-auto max-w-6xl w-full mx-auto space-y-8">
          
          {/* Main Dashboard View: Metric grids completely eliminated here */}
          {activeTab === "Dashboard" && (
            <div className="grid grid-cols-1 gap-8 animate-in fade-in duration-300">
              <QuizManager userRole="STUDENT" />
            </div>
          )}
          
          {activeTab === "Quizzes" && <QuizzesView userRole="STUDENT" />}
          {activeTab === "Events" && <EventsView userRole="STUDENT" />}
          {activeTab === "Classmates" && <StudentClassmatesView />}
          
          {/* Profile Tab Layout: Metric summaries are safely retained exclusively in this workspace framework */}
          {activeTab === "Profile" && profile && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-[#121213] border border-zinc-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Quizzes Taken</span>
                    <FileText className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-3xl font-black text-white mt-3 tracking-tight">{profile.totalQuizzesTaken ?? 0}</p>
                </div>

                <div className="bg-[#121213] border border-zinc-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Average Performance Score</span>
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-black text-white mt-3 tracking-tight">
                    {profile.averageScore ? `${profile.averageScore.toFixed(1)}%` : "0.0%"}
                  </p>
                </div>

                <div className="bg-[#121213] border border-zinc-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Unlocked Achievements</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-3xl font-black text-white mt-3 tracking-tight">{profile.achievementsCount ?? 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3">
                  <QuizHistoryList history={history} userRole="STUDENT" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}