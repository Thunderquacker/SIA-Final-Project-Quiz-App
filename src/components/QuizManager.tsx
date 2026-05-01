"use client";

import { useState } from 'react';

interface Question {
  id: number;
  content: string;
}

interface QuizSubmission {
  questionId: number;
  selectedAnswer: string;
}

export function QuizManager({ questions }: { questions: Question[] }) {
  const [userAnswers, setUserAnswers] = useState<QuizSubmission[]>([]);
  const [scoreMessage, setScoreMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Syncs input values with the submission list
  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== questionId);
      return [...filtered, { questionId, selectedAnswer: answer }];
    });
  };

  const submitToSpring = async () => {
    if (userAnswers.length === 0) {
      alert("Please answer at least one question!");
      return;
    }

    setIsSubmitting(true);
    setScoreMessage("");

    try {
      // Sends the DTO list to your QuizController @PostMapping("/submit")
      const response = await fetch('http://localhost:8080/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userAnswers),
      });

      if (!response.ok) throw new Error("Submission failed");

      const result = await response.text();
      setScoreMessage(result); 
    } catch (error) {
      setScoreMessage("Error: Could not reach the Spring Boot server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {questions.map((q) => (
        <div key={q.id} className="p-4 border rounded-lg bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800">
          <p className="font-medium mb-3 text-zinc-800 dark:text-zinc-200">{q.content}</p>
          <input 
            type="text" 
            placeholder="Type your answer here..."
            className="w-full p-2 border rounded outline-none bg-transparent border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
          />
        </div>
      ))}

      <button
        onClick={submitToSpring}
        disabled={isSubmitting}
        className={`w-full h-12 rounded-full font-bold transition-all ${
          isSubmitting 
          ? "bg-zinc-400 cursor-not-allowed" 
          : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
        }`}
      >
        {isSubmitting ? "Calculating Score..." : "Submit Quiz"}
      </button>

      {scoreMessage && (
        <div className={`mt-4 p-4 rounded-lg text-center font-bold animate-in fade-in slide-in-from-bottom-2 ${
          scoreMessage.includes("Error") 
          ? "bg-red-100 text-red-800 border border-red-200" 
          : "bg-green-100 text-green-800 border border-green-200"
        }`}>
          {scoreMessage}
        </div>
      )}
    </div>
  );
}