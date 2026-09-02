"use client";

import { QuizHistory } from "@/lib/api";
import { BarChart3 } from "lucide-react";

interface QuizHistoryListProps {
  history: QuizHistory[];
  isLoading?: boolean;
}

export function QuizHistoryList({
  history,
  isLoading = false,
}: QuizHistoryListProps) {
  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <p className="text-zinc-400">Loading quiz history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
        <p className="text-zinc-400">No quiz history</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-zinc-800">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Quiz History
        </h3>
      </div>
      <div className="divide-y divide-zinc-800">
        {history.map((item) => (
          <div key={item.historyId} className="p-4 hover:bg-zinc-800/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{item.quizTitle}</p>
                <p className="text-sm text-zinc-400">
                  {new Date(item.completedAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  item.percentageScore >= 70
                    ? "bg-emerald-900/30 text-emerald-400"
                    : item.percentageScore >= 50
                      ? "bg-yellow-900/30 text-yellow-400"
                      : "bg-red-900/30 text-red-400"
                }`}
              >
                {item.percentageScore.toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-zinc-400">
              {item.score}/{item.totalQuestions}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
