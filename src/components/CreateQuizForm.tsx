"use client";

import { useState } from "react";
import { Plus, X, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { createQuiz, CreateQuizRequest } from "@/lib/api";

interface FormQuestion {
  id: string;
  questionText: string;
  displayOrder: number;
  options: FormOption[];
}

interface FormOption {
  id: string;
  optionText: string;
  isCorrect: boolean;
  displayOrder: number;
}

export function CreateQuizForm({ userId, onSuccess }: { userId: number; onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [questions, setQuestions] = useState<FormQuestion[]>([
    {
      id: "q1",
      questionText: "",
      displayOrder: 0,
      options: [
        { id: "o1", optionText: "", isCorrect: false, displayOrder: 0 },
        { id: "o2", optionText: "", isCorrect: false, displayOrder: 1 },
        { id: "o3", optionText: "", isCorrect: false, displayOrder: 2 },
        { id: "o4", optionText: "", isCorrect: false, displayOrder: 3 },
      ],
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addQuestion = () => {
    const newId = `q${Date.now()}`;
    const newQuestion: FormQuestion = {
      id: newId,
      questionText: "",
      displayOrder: questions.length,
      options: [
        { id: `${newId}_o1`, optionText: "", isCorrect: false, displayOrder: 0 },
        { id: `${newId}_o2`, optionText: "", isCorrect: false, displayOrder: 1 },
        { id: `${newId}_o3`, optionText: "", isCorrect: false, displayOrder: 2 },
        { id: `${newId}_o4`, optionText: "", isCorrect: false, displayOrder: 3 },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (qId: string) => {
    setQuestions(questions.filter((q) => q.id !== qId));
  };

  const updateQuestion = (qId: string, questionText: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId ? { ...q, questionText } : q
      )
    );
  };

  const updateOption = (qId: string, oId: string, optionText: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === oId ? { ...o, optionText } : o
              ),
            }
          : q
      )
    );
  };

  const setCorrectAnswer = (qId: string, oId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === oId
                  ? { ...o, isCorrect: true }
                  : { ...o, isCorrect: false }
              ),
            }
          : q
      )
    );
  };

  const validateForm = (): string | null => {
    if (!title.trim()) return "Quiz title is required";
    if (!category.trim()) return "Quiz category is required";
    if (questions.length === 0) return "At least one question is required";

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) return `Question ${i + 1} text is required`;
      if (q.options.length < 2) return `Question ${i + 1} must have at least 2 options`;

      for (let j = 0; j < q.options.length; j++) {
        const o = q.options[j];
        if (!o.optionText.trim()) return `Question ${i + 1}, Option ${j + 1} text is required`;
      }

      const hasCorrect = q.options.some((o) => o.isCorrect);
      if (!hasCorrect) return `Question ${i + 1} must have a correct answer`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const request: CreateQuizRequest = {
        title,
        description,
        category,
        difficulty,
        questions: questions.map((q) => ({
          questionText: q.questionText,
          displayOrder: q.displayOrder,
          options: q.options.map((o) => ({
            optionText: o.optionText,
            isCorrect: o.isCorrect,
            displayOrder: o.displayOrder,
          })),
        })),
      };

      await createQuiz(request);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create quiz");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-2xl border border-zinc-800">
      <h2 className="text-3xl font-bold text-white mb-8">Create a New Quiz</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-400">Quiz created successfully! Redirecting...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Section */}
        <div className="space-y-6 p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <h3 className="text-lg font-semibold text-white">Quiz Information</h3>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Quiz Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              placeholder="e.g., Biology Basics 101"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              placeholder="Describe your quiz..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Category *
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                placeholder="e.g., Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Questions</h3>

          {questions.map((question, qIndex) => (
            <div key={question.id} className="p-6 bg-zinc-900/50 rounded-xl border border-zinc-800 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-zinc-300">Question {qIndex + 1}</h4>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Question Text *
                </label>
                <textarea
                  value={question.questionText}
                  onChange={(e) => updateQuestion(question.id, e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  placeholder="Enter your question here..."
                />
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-zinc-300">
                  Options * (mark the correct answer)
                </label>

                {question.options.map((option, oIndex) => (
                  <div
                    key={option.id}
                    className={`flex gap-3 p-3 rounded-lg border transition-colors ${
                      option.isCorrect
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-zinc-800/50 border-zinc-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`correct_${question.id}`}
                      checked={option.isCorrect}
                      onChange={() => setCorrectAnswer(question.id, option.id)}
                      className="mt-3 w-5 h-5 cursor-pointer accent-green-500"
                    />
                    <input
                      type="text"
                      value={option.optionText}
                      onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                      className="flex-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                      placeholder={`Option ${oIndex + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="w-full px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 border border-zinc-700 transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Question
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-5 h-5" /> {isLoading ? "Creating..." : "Create Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
}
