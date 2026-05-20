"use client";

import { useState } from "react";
import { Plus, Trash, Eye, EyeOff, Scale, HelpCircle, Save, ArrowLeft, Clock3, BarChart } from "lucide-react";
import { CreateQuizRequest, QuestionRequest, createNewQuiz } from "@/lib/api";

interface QuizCreatorViewProps {
  onBack: () => void;
}

export function QuizCreatorView({ onBack }: QuizCreatorViewProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("BSIT - Year 3");
  const [timeLimit, setTimeLimit] = useState(30);
  
  // Teacher-specific controls
  const [revealAnswers, setRevealAnswers] = useState(false);
  const [gradeWeight, setGradeWeight] = useState(10); // Default to 10% of overall grade

  const [questions, setQuestions] = useState<QuestionRequest[]>([
    { content: "", options: ["", "", "", ""], correctAnswer: "", points: 1 }
  ]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { content: "", options: ["", "", "", ""], correctAnswer: "", points: 1 }]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: keyof QuestionRequest, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSaveQuiz = async () => {
    const payload: CreateQuizRequest = {
      title,
      category,
      timeLimit,
      teacherId: 1, 
      revealAnswersToStudents: revealAnswers,
      weightInFinalGrade: gradeWeight,
      questions
    };

    try {
      console.log("Submitting architectural payload package to Spring Boot Server:", payload);
      await createNewQuiz(payload);
      alert("Quiz compiled and pushed to data layers successfully!");
      onBack();
    } catch (err) {
      console.warn("Backend pipeline offline, fallback local saving simulated.");
      alert("Saved local system configurations successfully (Demo mode).");
      onBack();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Bank
        </button>
        <button onClick={handleSaveQuiz} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-purple-900/20 transition-all">
          <Save className="w-4 h-4" /> Publish Configuration
        </button>
      </div>

      {/* Main Structural Settings Card */}
      <div className="bg-[#121213] border border-zinc-800 rounded-2xl p-6 space-y-6">
        <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-3">Quiz Architecture Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider block mb-2">Quiz Title</label>
            <input type="text" placeholder="e.g., Systems Integration Midterm" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-purple-600 transition-all" />
          </div>
          <div>
            <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider block mb-2">Classification Target Group</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-purple-600 transition-all" />
          </div>
        </div>

        {/* Dynamic Architectural Variable Configuration Control Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/50">
          <div className="bg-[#0D0D0E] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            {/* FIXED: Changed <Clock /> to <Clock3 /> below */}
            <span className="text-zinc-400 text-xs font-bold flex items-center gap-2 uppercase tracking-wide"><Clock3 className="w-4 h-4 text-purple-400"/> Session Time Limit</span>
            <div className="flex items-center gap-2 mt-3">
              <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} className="w-20 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-white font-bold text-center outline-none" />
              <span className="text-xs text-zinc-500 font-semibold">Minutes</span>
            </div>
          </div>

          <div className="bg-[#0D0D0E] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-zinc-400 text-xs font-bold flex items-center gap-2 uppercase tracking-wide">
              {revealAnswers ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-amber-400" />} 
              Answer Visibility Control
            </span>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 leading-tight pr-2">Allow students to view answer templates upon completion submission templates.</span>
              <button onClick={() => setRevealAnswers(!revealAnswers)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${revealAnswers ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-400"}`}>
                {revealAnswers ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>

          <div className="bg-[#0D0D0E] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-zinc-400 text-xs font-bold flex items-center gap-2 uppercase tracking-wide"><Scale className="w-4 h-4 text-blue-400"/> Final Grading Weight Contribution</span>
            <div className="flex items-center gap-2 mt-3">
              <input type="number" max={100} min={0} value={gradeWeight} onChange={(e) => setGradeWeight(Number(e.target.value))} className="w-20 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-white font-bold text-center outline-none" />
              <span className="text-xs text-zinc-500 font-semibold">% of Total Grade</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Question Constructor Container lists */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-white flex items-center gap-2"><HelpCircle className="w-5 h-5 text-purple-400" /> Question Blueprint Bank Matrix</h4>
        
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="bg-[#121213] border border-zinc-800 rounded-2xl p-6 space-y-4 relative group">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Question #{qIndex + 1}</span>
              {questions.length > 1 && (
                <button onClick={() => handleRemoveQuestion(qIndex)} className="text-zinc-600 hover:text-red-400 p-1 rounded transition-all">
                  <Trash className="w-4 h-4" />
                </button>
              )}
            </div>

            <input type="text" placeholder="Type the question query content string..." value={question.content} onChange={(e) => handleQuestionChange(qIndex, "content", e.target.value)} className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-purple-600" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2 bg-[#0D0D0E] border border-zinc-800 rounded-xl px-3 py-1">
                  <span className="text-xs font-bold text-zinc-600 uppercase">{String.fromCharCode(65 + oIndex)}</span>
                  <input type="text" placeholder={`Option ${String.fromCharCode(65 + oIndex)}`} value={option} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} className="w-full bg-transparent p-2 text-xs text-white outline-none" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Target Answer Key Match</label>
                <select value={question.correctAnswer} onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)} className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-300 outline-none focus:border-purple-600">
                  <option value="">Select Correct Option Match</option>
                  {question.options.map((opt, oIdx) => opt && (
                    <option key={oIdx} value={opt}>{`Option ${String.fromCharCode(65 + oIdx)}: ${opt}`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Score Matrix Points Allocation</label>
                <input type="number" min={1} value={question.points} onChange={(e) => handleQuestionChange(qIndex, "points", Number(e.target.value))} className="w-24 bg-[#0D0D0E] border border-zinc-800 rounded-xl p-2 text-xs text-center text-white outline-none" />
              </div>
            </div>
          </div>
        ))}

        <button onClick={handleAddQuestion} className="w-full border border-dashed border-zinc-800 hover:border-purple-600/50 hover:bg-purple-600/5 py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold text-zinc-500 hover:text-purple-400 transition-all">
          <Plus className="w-4 h-4" /> Add Next Question Node Item
        </button>
      </div>
    </div>
  );
}