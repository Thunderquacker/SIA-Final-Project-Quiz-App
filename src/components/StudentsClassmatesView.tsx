"use client";

import { useState } from "react";
import { Search, Users, ChevronDown, Filter } from "lucide-react";

const classmatesData = [
  { id: 1, name: "Alex Johnson", className: "10A", totalQuizzesTaken: 12, lastActive: "2 hours ago" },
  { id: 2, name: "Mia Watson", className: "10A", totalQuizzesTaken: 10, lastActive: "3 hours ago" },
  { id: 3, name: "Liam Reyes", className: "10B", totalQuizzesTaken: 14, lastActive: "1 hour ago" },
  { id: 4, name: "Sofia Cruz", className: "10B", totalQuizzesTaken: 11, lastActive: "5 hours ago" },
];

export function StudentClassmatesView() {
  const [activeTab, setActiveTab] = useState("All Classmates");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter classmates safely without exposing grades or administrative parameters
  const filteredClassmates = classmatesData.filter((student) => {
    const matchesTab = activeTab === "All Classmates" || student.className === activeTab;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.className.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Read-Only Header Element */}
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-purple-400" /> Classmates
        </h2>
        <p className="text-zinc-500 mt-2">View your active workspace cohorts and classmates.</p>
      </div>

      <div className="bg-[#121213] border border-zinc-800 rounded-3xl p-6">
        <div className="md:flex md:items-center md:justify-between gap-6 mb-6">
          
          {/* Class Filter Tabs */}
          <div className="flex items-center gap-4 flex-wrap">
            {['All Classmates', '10A', '10B'].map((tab) => (
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

          {/* Search Inputs */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input
                type="search"
                placeholder="Search classmates..."
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

        {/* Read-Only Table Layout */}
        <div className="overflow-hidden rounded-3xl border border-zinc-800">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-[#111113]">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Section</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Quizzes Attempted</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {filteredClassmates.length > 0 ? (
                filteredClassmates.map((student, index) => (
                  <tr key={student.id} className={index % 2 === 0 ? 'bg-[#121213]' : 'bg-[#0D0D0E]'}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-600/20 flex items-center justify-center text-sm font-bold text-purple-400">
                          {student.name.split(' ').map((w) => w[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{student.name}</p>
                          <p className="text-xs text-zinc-500">Student</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-300">{student.className}</td>
                    <td className="px-6 py-5 text-sm text-zinc-300">{student.totalQuizzesTaken}</td>
                    <td className="px-6 py-5 text-sm text-zinc-400">{student.lastActive}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-zinc-500 font-medium bg-[#121213]">
                    No classmates match your current filters.
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