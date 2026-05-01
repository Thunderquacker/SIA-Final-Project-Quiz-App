"use client";

import { useState, useEffect } from 'react';
import { 
  LayoutGrid, Users, FileBarChart, Clock3, 
  Award, BrainCircuit, Bot, Plus, TrendingUp 
} from "lucide-react";

interface Question {
  id: number;
  content: string;
}

export function QuizManager({ initialQuestions = [] }: { initialQuestions?: Question[] }) {
  // CRITICAL: We initialize with a guaranteed empty array []
  const [questions, setQuestions] = useState<Question[]>(initialQuestions || []);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("http://localhost:8080/api/quiz/questions");
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
        }
      } catch (err) {
        console.error("Spring Boot connect failed:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== questionId);
      return [...filtered, { questionId, selectedAnswer: answer }];
    });
  };

  const stats = [
    { label: "Total Quizzes", value: "2,543", trend: "+12.5%", icon: LayoutGrid, color: "text-purple-400" },
    { label: "Active Events", value: "2,543", trend: "+12.5%", icon: TrendingUp, color: "text-emerald-400" },
    { label: "Students", value: "2,543", trend: "+12.5%", icon: Users, color: "text-sky-400" },
    { label: "Avg. Completion", value: "2,543", trend: "-12.5%", icon: Clock3, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
          <p className="text-zinc-500 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
          <Plus className="w-5 h-5" /> Create New Quiz
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#121213] border border-zinc-800 p-6 rounded-2xl">
            <div className="flex justify-between mb-4">
              <span className="text-zinc-400 text-sm font-medium">{s.label}</span>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{s.value}</span>
              <span className={`text-[10px] font-bold ${s.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                {s.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#121213] border border-zinc-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-purple-600/10 rounded-full flex items-center justify-center text-purple-500">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">BSIT Quiz Module (Live)</h3>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <div className="h-40 flex items-center justify-center border border-dashed border-zinc-800 rounded-xl text-zinc-600">
                Connecting to Spring Boot API...
              </div>
            ) : (questions?.length > 0) ? (
              // Safety check: only map if questions exists and has length
              questions?.map((q) => (
                <div key={q.id} className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <p className="font-semibold mb-4 text-zinc-200">{q.content}</p>
                  <input 
                    type="text" 
                    placeholder="Type your answer..." 
                    className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-lg p-3 text-sm focus:border-purple-600 outline-none text-white transition-all"
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-red-950/10 border border-red-900/20 rounded-xl">
                <p className="text-red-400 text-sm">Offline: Connect to Spring Boot (Port 8080)</p>
              </div>
            )}
            <button className="w-full bg-purple-600 py-4 rounded-xl font-bold text-white hover:bg-purple-700 transition-all shadow-xl shadow-purple-900/10 mt-4 disabled:opacity-50">
              Submit Quiz Results
            </button>
          </div>
        </div>

        {/* Top Students Card */}
        <div className="bg-[#121213] border border-zinc-800 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-8 text-white">Top Students</h3>
          <div className="space-y-6">
            {[
              { name: "Alex John", sub: "Science", score: 950 },
              { name: "Emma Watson", sub: "Mathematics", score: 920 },
              { name: "Michael Clark", sub: "Physics", score: 880 }
            ].map((st, i) => (
              <div key={st.name} className="flex items-center gap-4">
                <span className="text-zinc-600 font-bold w-4">{i + 1}</span>
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{st.name}</p>
                  <p className="text-[10px] text-zinc-500 uppercase">{st.sub}</p>
                </div>
                <div className="text-amber-500 font-bold text-sm flex items-center gap-1">
                  <Award className="w-4 h-4" /> {st.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}