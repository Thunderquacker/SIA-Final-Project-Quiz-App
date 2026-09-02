"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  
  // State to store login credentials
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For your SIA project: This is where you will eventually call your Spring Boot API
    console.log("Attempting login with:", credentials);

    // Simulate a successful login redirect
    router.replace("/"); 
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
            placeholder="name@university.edu"
            required
            className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
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
            className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20"
        >
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