"use client";

import { useState } from "react";
import { Calendar, Plus, Clock, CheckCircle, AlertCircle, Search, Filter } from "lucide-react";

interface EventsViewProps {
  userRole: "STUDENT" | "TEACHER";
}

export function EventsView({ userRole }: EventsViewProps) {
  // Filter state matrix mappings matching the requested parameters
  const [activeStatusFilter, setActiveStatusFilter] = useState<"UPCOMING" | "ACTIVE" | "COMPLETED" | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const eventsData = [
    {
      id: 1,
      title: "Midterm Practical Examination",
      description: "Hands-on application test covering dynamic interface structuring and backend integration routing.",
      status: "ACTIVE", // Current active phase matching display
      dateTime: "May 20, 2026 - 09:00 AM",
      venue: "Lab 3 - IT Building",
    },
    {
      id: 2,
      title: "Systems Integration Architecture Defense",
      description: "Final capstone architecture evaluation presentation demonstrating robust multi-tier web architectures.",
      status: "UPCOMING",
      dateTime: "June 02, 2026 - 01:30 PM",
      venue: "Audio Visual Room (AVR)",
    },
    {
      id: 3,
      title: "Quiz 1: Low-Level Memory Structures",
      description: "Completed assessment regarding circular structures, buffer systems, and cursor-based indexing maps.",
      status: "COMPLETED",
      dateTime: "May 12, 2026 - 10:00 AM",
      venue: "Online Portal",
    }
  ];

  // Process item matches conditionally using defensive filters
  const filteredEvents = eventsData.filter((event) => {
    const matchesStatus = activeStatusFilter === "ALL" || event.status === activeStatusFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-purple-500/10 border-purple-500/20 text-purple-400";
      case "UPCOMING":
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      case "COMPLETED":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      default:
        return "bg-zinc-800 border-zinc-700 text-zinc-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <AlertCircle className="w-3.5 h-3.5 text-purple-400" />;
      case "UPCOMING":
        return <Clock className="w-3.5 h-3.5 text-blue-400" />;
      case "COMPLETED":
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Header Block Component */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-500" /> Academic Events
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            {userRole === "TEACHER" 
              ? "Schedule milestones, exams, and evaluate classroom session deadlines." 
              : "Monitor your active, upcoming, and completed academic course milestones."}
          </p>
        </div>

        {/* FIXED PRIVILEGE GATE: "Schedule Event" will ONLY show for Teachers */}
        {userRole === "TEACHER" && (
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-purple-900/20">
            <Plus className="w-4 h-4" />
            Schedule Event
          </button>
        )}
      </div>

      <div className="bg-[#121213] border border-zinc-800 rounded-2xl p-6">
        
        {/* Sorting Filters & Search Navigation Grid */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          
          {/* Tabs for Status Navigation */}
          <div className="flex items-center gap-2 flex-wrap bg-[#0D0D0E] border border-zinc-800 p-1.5 rounded-xl">
            {(["ALL", "ACTIVE", "UPCOMING", "COMPLETED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStatusFilter(tab)}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition-all uppercase tracking-wider ${
                  activeStatusFilter === tab
                    ? "bg-purple-600 text-white shadow-md shadow-purple-900/10"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event keywords..." 
              className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-purple-600 transition-all" 
            />
          </div>
        </div>

        {/* Display Item List Node */}
        <div className="grid grid-cols-1 gap-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div 
                key={event.id} 
                className="bg-[#0D0D0E] border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-700 transition-all"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-bold text-white text-base tracking-tight">{event.title}</h4>
                    
                    {/* Status Badge Node Mapping */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border ${getStatusBadgeStyles(event.status)}`}>
                      {getStatusIcon(event.status)}
                      {event.status}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">{event.description}</p>
                </div>

                {/* Meta properties text vectors columns */}
                <div className="text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-zinc-800/60 flex flex-col justify-center min-w-[200px]">
                  <p className="text-xs font-semibold text-zinc-300">{event.dateTime}</p>
                  <p className="text-[11px] text-zinc-500 mt-1 font-medium">{event.venue}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl text-zinc-600 text-sm font-medium">
              No academic milestones match the active status parameters.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}