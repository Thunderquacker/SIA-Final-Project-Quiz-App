"use client";

import { 
  Search, Filter, Plus, Calendar, 
  MoreVertical, BookOpen, Clock, Users, FileText
} from "lucide-react";

const events = [
  {
    id: 1,
    title: "Science Mid-term Quiz",
    status: "Active",
    description: "Basic concepts of biology for beginners",
    questions: 15,
    duration: "20 min",
    completions: 32,
    timeLabel: "Created just now",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    buttonText: "View Live",
    primaryButton: "bg-purple-600 hover:bg-purple-700 text-white"
  },
  {
    id: 2,
    title: "Mathematics Weekly Test",
    status: "Upcoming",
    description: "Basic concepts of biology for beginners",
    questions: 15,
    duration: "20 min",
    completions: 32,
    timeLabel: "Created just now",
    statusColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    buttonText: "Manage",
    primaryButton: "bg-zinc-800 hover:bg-zinc-700 text-white"
  },
  {
    id: 3,
    title: "Chemistry Quiz #3",
    status: "Completed",
    description: "Basic concepts of biology for beginners",
    questions: 15,
    duration: "20 min",
    completions: 32,
    timeLabel: "Created just now",
    statusColor: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    buttonText: "Manage",
    primaryButton: "bg-zinc-800 hover:bg-zinc-700 text-white"
  }
];

export function EventsView() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">Quiz Events</h2>
          <p className="text-zinc-500 text-sm mt-1">Schedule and manage quiz sessions for your students</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-purple-900/20">
          <Plus className="w-4 h-4" />
          Schedule Event
        </button>
      </div>

      {/* Event Calendar Card */}
      <div className="bg-[#121213] border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold text-white">Event Calendar</h3>
          <p className="text-zinc-500 text-sm">View and manage your scheduled quiz events</p>
          
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 mt-6 justify-between">
            <div className="flex bg-[#0D0D0E] p-1 rounded-xl border border-zinc-800">
              {["All Events", "Active", "Upcoming", "Completed"].map((tab) => (
                <button key={tab} className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${tab === "All Events" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search events..." 
                  className="bg-[#0D0D0E] border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-purple-600 w-64" 
                />
              </div>
              <button className="bg-[#0D0D0E] border border-zinc-800 px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 flex items-center gap-2 hover:bg-zinc-800">
                <Filter className="w-4 h-4" />
                All Quizzes
              </button>
            </div>
          </div>

          {/* Events List */}
          <div className="mt-6 space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-[#121213] border border-zinc-800/50 rounded-2xl p-5 hover:border-zinc-700 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center border border-purple-600/20">
                      <BookOpen className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-white">{event.title}</h4>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${event.statusColor}`}>
                          {event.status}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-sm mt-1">{event.description}</p>
                      <div className="flex items-center gap-6 mt-3 text-zinc-500 text-[11px] font-medium">
                        <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {event.questions} questions</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {event.duration}</span>
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {event.completions} completions</span>
                        <span className="text-zinc-600 italic">{event.timeLabel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${event.primaryButton}`}>
                      {event.buttonText}
                    </button>
                    <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}