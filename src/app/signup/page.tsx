"use client";
import AuthCard from "@/components/AuthCard";
import Link from "next/link";

export default function SignupPage() {
  return (
    <AuthCard title="Get Started" subtitle="Create your Quizzy instructor account today">
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
          <input 
            type="text" 
            placeholder="Sarah John"
            className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">University Email</label>
          <input 
            type="email" 
            placeholder="name@university.edu"
            className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Create Password</label>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
          />
        </div>

        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20 mt-2">
          Create Account
        </button>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Log In
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}