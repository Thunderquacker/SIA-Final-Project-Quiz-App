"use client";

import { 
  Search, Filter, Plus, FileText, 
  MoreVertical, Clock, BarChart 
} from "lucide-react";

// The "export" keyword here is the CRITICAL fix
export function QuizzesView({ onCreateClick }: { onCreateClick?: () => void }) {
  const quizzes = [
    {
      id: 1,
      title: "Introduction to Java",
      category: "BSIT - Year 1",
      questions: 20,
      timeLimit: "30 mins",
      attempts: 145,
      lastModified: "2 days ago",
    },
    {
      id: 2,
      title: "Data Structures & Algorithms",
      category: "BSIT - Year 2",
      questions: 50,
      timeLimit: "60 mins",
      attempts: 89,
      lastModified: "5 hours ago",
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">Quiz Bank</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage and edit your library of quiz materials</p>
        </div>
        <button 
          onClick={onCreateClick}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-purple-900/20"
        >
          <Plus className="w-4 h-4" />
          New Quiz
        </button>
      </div>

      <div className="bg-[#121213] border border-zinc-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search quiz titles..." 
              className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-purple-600" 
            />
          </div>
          <button className="bg-[#0D0D0E] border border-zinc-800 px-4 py-2 rounded-xl text-sm text-zinc-400 flex items-center gap-2 hover:bg-zinc-800 transition-all">
            <Filter className="w-4 h-4" />
            Filter by Year
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-[#0D0D0E] border border-zinc-800 rounded-xl p-4 flex items-center justify-between hover:border-zinc-700 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-600/10 rounded-lg flex items-center justify-center border border-purple-600/20">
                  <FileText className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{quiz.title}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{quiz.category}</span>
                    <span className="text-[10px] text-zinc-600 flex items-center gap-1"><Clock className="w-3 h-3"/> {quiz.timeLimit}</span>
                    <span className="text-[10px] text-zinc-600 flex items-center gap-1"><BarChart className="w-3 h-3"/> {quiz.attempts} attempts</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold transition-all">Edit</button>
                <button className="p-2 text-zinc-500 hover:text-white rounded-lg"><MoreVertical className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}