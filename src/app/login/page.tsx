"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import Link from "next/link";
import { login } from "@/lib/api";

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error on input change
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call backend login endpoint
      const response = await login(credentials);
      console.log("Login successful:", response);

      // Notify parent component or redirect
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        router.replace("/");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome Back" subtitle="Enter your credentials to access your dashboard">
      <form className="space-y-5" onSubmit={handleLogin}>
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
          <input 
            type="email" 
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="name@university.edu"
            required
            disabled={loading}
            className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all disabled:opacity-50"
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
            disabled={loading}
            className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all disabled:opacity-50"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20"
        >
          {loading ? "Signing in..." : "Sign In"}
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