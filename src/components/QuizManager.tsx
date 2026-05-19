"use client";

import { useState } from "react";
import { 
  LayoutGrid, Plus, FileText, 
  Users, Calendar, Clock, BarChart 
} from "lucide-react";

// Explicitly type the incoming properties interface
interface QuizManagerProps {
  userRole?: "STUDENT" | "TEACHER";
}

export function QuizManager({ userRole = "STUDENT" }: QuizManagerProps) {
  // Mock performance metrics data mapping matching the UI cards
  const metrics = [
    { title: "Total Quizzes", value: "2,543", change: "+12.5%", isPositive: true, icon: FileText },
    { title: "Active Events", value: "2,543", change: "+12.5%", isPositive: true, icon: Calendar },
    { title: "Students", value: "2,543", change: "+12.5%", isPositive: true, icon: Users },
    { title: "Avg. Completion", value: "2,543", change: "-12.5%", isPositive: false, icon: Clock },
  ];

  const topStudents = [
    { name: "Alex John", department: "SCIENCE", score: 950 },
    { name: "Emma Watson", department: "MATHEMATICS", score: 920 },
    { name: "Michael Clark", department: "PHYSICS", score: 880 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Dynamic Header Component Block */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-3xl font-bold text-white tracking-tight">Dashboard</h3>
          <p className="text-zinc-500 mt-1 text-sm">
            {userRole === "TEACHER" 
              ? "Welcome back! Here's an administrative overview of your system metrics."
              : "Welcome back! Here's what's happening."}
          </p>
        </div>

        {/* FIXED: The "Create New Quiz" button will now ONLY render for TEACHER profiles */}
        {userRole === "TEACHER" && (
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg shadow-purple-900/20">
            <Plus className="w-4 h-4" /> Create New Quiz
          </button>
        )}
      </div>

      {/* Analytics Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((item, index) => (
          <div key={index} className="bg-[#121213] border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-zinc-500">{item.title}</span>
              <item.icon className="w-5 h-5 text-purple-500/80" />
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-2xl font-bold text-white tracking-tight">{item.value}</span>
              <span className={`text-xs font-bold ${item.isPositive ? "text-emerald-500" : "text-red-500"}`}>
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Core Dashboard Sections Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Live Database Connection Window */}
        <div className="lg:col-span-2 bg-[#121213] border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between min-h-[340px]">
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              BSIT Quiz Module (Live)
            </h4>
            <div className="mt-12 border border-red-500/10 bg-red-500/5 rounded-xl p-8 flex items-center justify-center">
              <p className="text-sm text-red-400 font-medium">Offline: Connect to Spring Boot (Port 8081)</p>
            </div>
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20 text-sm">
            Submit Quiz Results
          </button>
        </div>

        {/* Right Side: High Performers Leaderboard Panel */}
        <div className="bg-[#121213] border border-zinc-800 rounded-2xl p-6">
          <h4 className="text-lg font-bold text-white mb-6">Top Students</h4>
          <div className="space-y-4">
            {topStudents.map((student, idx) => (
              <div key={idx} className="flex items-center justify-between bg-[#0D0D0E] border border-zinc-800/60 p-4 rounded-xl hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-zinc-600 w-4">{idx + 1}</span>
                  <div className="w-9 h-9 rounded-full bg-purple-600/10 flex items-center justify-center font-bold text-purple-400 text-xs">
                    {student.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{student.name}</p>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tight">{student.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/5 border border-amber-500/10 px-2.5 py-1 rounded-lg">
                  <span>🏆</span>
                  <span>{student.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}