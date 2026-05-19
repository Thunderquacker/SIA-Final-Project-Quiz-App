"use client";

import { useState } from "react";
import { UserProfile } from "@/lib/api";
import AuthCard from "@/components/AuthCard";
import Link from "next/link";

interface LoginPageProps {
  onLoginSuccess: (userData: UserProfile) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dynamically clean and extract name strings from the email entry prefix
    const extractedName = credentials.email.split("@")[0]
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, char => char.toUpperCase());

    // DYNAMIC ROLE ASSIGNMENT: Evaluates if "teacher" is present anywhere in the email
    const assignedRole = credentials.email.toLowerCase().includes("teacher") 
      ? "TEACHER" 
      : "STUDENT";

    const mockUser: UserProfile = {
      userId: 1,
      username: extractedName || "User",
      email: credentials.email,
      role: assignedRole, 
      totalQuizzesTaken: assignedRole === "STUDENT" ? 12 : 0,
      averageScore: assignedRole === "STUDENT" ? 88.5 : 0,
      achievementsCount: assignedRole === "STUDENT" ? 4 : 0
    };

    onLoginSuccess(mockUser);
  };

  return (
    <AuthCard title="Welcome Back" subtitle="Enter your credentials to access your dashboard">
      <form className="space-y-5" onSubmit={handleLogin}>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
          <input 
            type="email" 
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="teacher.name@university.edu or student@edu"
            required
            className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-purple-600 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
          <input 
            type="password" 
            name="password"
            value={credentials.password} 
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-purple-600 transition-all"
          />
        </div>
        
        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all">
          Sign In
        </button>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Create Account
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}