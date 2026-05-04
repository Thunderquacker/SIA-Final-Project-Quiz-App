"use client";
import { FileText } from "lucide-react";

export default function AuthCard({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="min-h-screen bg-[#0D0D0E] flex items-center justify-center p-6 selection:bg-purple-900/40">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-600 mb-6 shadow-lg shadow-purple-900/20">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-zinc-500 mt-2">{subtitle}</p>
        </div>
        
        <div className="bg-[#121213] border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}