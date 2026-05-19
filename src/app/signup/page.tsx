"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import Link from "next/link";
import { signup } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error on input change
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate form
      if (!formData.username || !formData.email || !formData.password) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      // Call backend signup endpoint
      const response = await signup(formData);
      console.log("Signup successful:", response);

      // Redirect to dashboard after successful signup
      router.replace("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed";
      setError(errorMessage);
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Get Started" subtitle="Create your Minu account today">
      <form className="space-y-5" onSubmit={handleSignup}>
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
          <input 
            type="text" 
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Sarah John"
            required
            disabled={loading}
            className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">University Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@university.edu"
            required
            disabled={loading}
            className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Create Password</label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
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
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20 mt-2"
        >
          {loading ? "Creating Account..." : "Create Account"}
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