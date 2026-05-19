"use client";

import { useState } from "react";
import { Search, UserPlus, MoreVertical, ChevronDown, Filter } from "lucide-react";

const students = [
  { id: 1, name: "Alex Johnson", className: "10A", quizzesTaken: 12, score: "85%", lastActive: "2 hours ago" },
  { id: 2, name: "Mia Watson", className: "10A", quizzesTaken: 10, score: "82%", lastActive: "3 hours ago" },
  { id: 3, name: "Liam Reyes", className: "10B", quizzesTaken: 14, score: "88%", lastActive: "1 hour ago" },
  { id: 4, name: "Sofia Cruz", className: "10B", quizzesTaken: 11, score: "84%", lastActive: "5 hours ago" },
];

export function StudentsView() {
  // 1. Structural States for Filters
  const [activeTab, setActiveTab] = useState("All Students");
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Compute Filter Matrix Dynamic Pipeline Row Matches
  const filteredStudents = students.filter((student) => {
    const matchesTab = activeTab === "All Students" || student.className === activeTab;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.className.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Students</h2>
          <p className="text-zinc-500 mt-2">Manage your students and track their progress.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/20 transition hover:bg-purple-700">
          <UserPlus className="w-4 h-4" /> Invite Students
        </button>
      </div>

      <div className="bg-[#121213] border border-zinc-800 rounded-3xl p-6">
        <div className="md:flex md:items-center md:justify-between gap-6 mb-6">
          
          {/* FIXED: Dynamic Filtering Tabs Section */}
          <div className="flex items-center gap-4 flex-wrap">
            {['All Students', '10A', '10B'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "border-purple-600 bg-purple-600/10 text-purple-400"
                    : "border-zinc-800 bg-[#0D0D0E] text-zinc-400 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* FIXED: Dynamic Search Binding Control */}
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input
                type="search"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-[#0D0D0E] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-purple-600 transition-all"
              />
            </div>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-[#0D0D0E] px-4 py-3 text-sm text-zinc-300 transition hover:border-purple-600 hover:text-white">
              <Filter className="w-4 h-4" /> Name <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-800">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-[#111113]">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Class</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Quizzes Taken</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Average Score</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Last Active</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-500" />
              </tr>
            </thead>
            <tbody>
              {/* FIXED: Looping over dynamically filtered computed arrays instead of static constant array */}
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.id} className={index % 2 === 0 ? 'bg-[#121213]' : 'bg-[#0D0D0E]'}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-600/20 flex items-center justify-center text-sm font-bold text-white">
                          {student.name.split(' ').map((word) => word[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{student.name}</p>
                          <p className="text-xs text-zinc-500">Student ID #{student.id.toString().padStart(4, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-300">{student.className}</td>
                    <td className="px-6 py-5 text-sm text-zinc-300">{student.quizzesTaken}</td>
                    <td className="px-6 py-5 text-sm font-semibold text-white">{student.score}</td>
                    <td className="px-6 py-5 text-sm text-zinc-400">{student.lastActive}</td>
                    <td className="px-6 py-5 text-right">
                      <button className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-[#0D0D0E] px-3 py-2 text-xs font-semibold text-zinc-400 transition hover:border-purple-600 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-zinc-500 font-medium bg-[#121213]">
                    No student nodes matching the active architecture query criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}