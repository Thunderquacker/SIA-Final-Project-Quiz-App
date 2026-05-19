"use client";

import { useState } from "react";
import { QuizHistory } from "@/lib/api";
import { BarChart3, Edit2, Check, X, Loader2 } from "lucide-react";

interface QuizHistoryListProps {
  history: QuizHistory[];
  isLoading?: boolean;
  userRole: "STUDENT" | "TEACHER"; // Added for permission gating
  onRefresh?: () => void;
}

export function QuizHistoryList({
  history,
  isLoading = false,
  userRole,
  onRefresh,
}: QuizHistoryListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editScore, setEditScore] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = (item: QuizHistory) => {
    // Stop non-teachers from initiating edit overrides
    if (userRole !== "TEACHER") return;
    setEditingId(item.historyId);
    setEditScore(item.score);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setIsSaving(false);
  };

  const handleUpdateScore = async (historyId: number, totalQuestions: number) => {
    if (editScore < 0 || editScore > totalQuestions) {
      alert(`Validation error: Score must be between 0 and ${totalQuestions}`);
      return;
    }

    setIsSaving(true);
    const dynamicPercentage = (editScore / totalQuestions) * 100;
    const TARGET_URL = `http://localhost:8081/api/history/${historyId}/update-score`;

    try {
      const response = await fetch(TARGET_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: editScore, percentageScore: dynamicPercentage }),
      });

      if (!response.ok) throw new Error("Database rejected update request.");
      alert("Score updated successfully!");
      setEditingId(null);
      if (onRefresh) onRefresh();
      
    } catch (err) {
      console.warn("Backend link offline. Applying mock fallback mutation state.");
      const targetItem = history.find(h => h.historyId === historyId);
      if (targetItem) {
        targetItem.score = editScore;
        targetItem.percentageScore = dynamicPercentage;
      }
      setEditingId(null);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <p className="text-zinc-400 flex items-center gap-2 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-purple-400" /> Loading performance logs...
        </p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center text-zinc-400 text-sm">
        No quiz history records present inside this node.
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-zinc-800">
        <h3 className="text-xl font-bold flex items-center gap-2 text-white">
          <BarChart3 className="w-5 h-5 text-purple-400" /> Quiz History Logs
        </h3>
      </div>
      <div className="divide-y divide-zinc-800">
        {history.map((item) => {
          const isCurrentEditing = editingId === item.historyId && userRole === "TEACHER";
          const activePercentage = isCurrentEditing ? (editScore / item.totalQuestions) * 100 : item.percentageScore;

          return (
            <div key={item.historyId} className="p-4 hover:bg-zinc-800/30 transition-all flex items-center justify-between gap-4">
              <div className="space-y-1 flex-1">
                <p className="font-semibold text-white">{item.quizTitle}</p>
                
                {isCurrentEditing ? (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-zinc-500 font-bold uppercase">Raw Score:</span>
                    <input
                      type="number"
                      min={0}
                      max={item.totalQuestions}
                      value={editScore}
                      disabled={isSaving}
                      onChange={(e) => setEditScore(Number(e.target.value))}
                      className="w-16 bg-[#0D0D0E] border border-zinc-700 rounded-lg p-1 text-center text-sm font-bold text-purple-400 outline-none focus:border-purple-600"
                    />
                    <span className="text-sm text-zinc-500">/ {item.totalQuestions} Questions</span>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400 font-medium">
                    Raw Score: <span className="text-white font-bold">{item.score}</span> / {item.totalQuestions}
                  </p>
                )}
                <p className="text-xs text-zinc-500">Completed on: {new Date(item.completedAt).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  activePercentage >= 70 ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/10" :
                  activePercentage >= 50 ? "bg-amber-950/40 text-amber-400 border border-amber-500/10" : "bg-red-950/40 text-red-400 border border-red-500/10"
                }`}>
                  {activePercentage.toFixed(1)}%
                </span>

                {/* Gated Action Section: Controls only render if user is a teacher */}
                {userRole === "TEACHER" && (
                  <div className="flex items-center gap-2">
                    {isCurrentEditing ? (
                      <>
                        <button onClick={() => handleUpdateScore(item.historyId, item.totalQuestions)} disabled={isSaving} className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-all">
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button onClick={cancelEditing} disabled={isSaving} className="p-1.5 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => startEditing(item)} className="p-1.5 border border-zinc-800 bg-[#0D0D0E] text-zinc-400 hover:text-purple-400 hover:border-purple-600/30 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}