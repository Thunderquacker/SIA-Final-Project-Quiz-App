import Image from "next/image";
import { QuizManager } from "../components/QuizManager";

export default async function Home() {
  let questions = [];
  
  try {
    // Fetches data from your Spring Boot QuestionRepository
    const response = await fetch("http://localhost:8080/api/quiz/questions", {
      cache: "no-store",
    });
    
    if (response.ok) {
      questions = await response.json();
    }
  } catch (error) {
    console.error("Connection failed:", error);
  }

  return (
    <div className="flex flex-col items-center justify-center bg-zinc-50 dark:bg-black min-h-screen p-8">
      <main className="w-full max-w-2xl bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-sm">
        <Image className="dark:invert mb-8" src="/next.svg" alt="Logo" width={100} height={20} />
        
        <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-zinc-100">
          BSIT Quiz Module
        </h1>

        {questions.length > 0 ? (
          <QuizManager questions={questions} />
        ) : (
          <div className="text-center p-10 border-2 border-dashed rounded-xl">
            <p className="text-zinc-500">Could not connect to Spring Boot API.</p>
            <p className="text-sm text-zinc-400 mt-2">
              Check if DemoApplication is running on port 8080.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}