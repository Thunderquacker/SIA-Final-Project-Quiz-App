"use client";

import { useState, useEffect } from "react";
import { 
  getUserProfile, getUserQuizHistory, getUserAchievements, 
  UserProfile, QuizHistory, Achievement 
} from "@/lib/api";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { StudentDashboard } from "@/components/StudentDashboard";
import LoginPage from "./login/page";

export default function RootDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const getSafeUserProfile = (): UserProfile | null => {
    const saved = localStorage.getItem('userProfile');
    if (!saved || saved === "undefined" || saved === "null") return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const safeUser = getSafeUserProfile();

    if (authStatus === 'true' && safeUser) {
      setIsAuthenticated(true);
      setProfile(safeUser);
      loadDashboardData(safeUser.userId, safeUser);
    } else {
      localStorage.clear();
      setLoading(false);
    }
  }, []);

  const loadDashboardData = async (userId: number, cachedUser: UserProfile) => {
    try {
      setLoading(true);
      const [profileData, historyData, achievementData] = await Promise.all([
        getUserProfile(userId),
        getUserQuizHistory(userId),
        getUserAchievements(userId),
      ]);

      setProfile({ ...cachedUser, ...profileData });
      setHistory(historyData);
      setAchievements(achievementData);
    } catch (err) {
      console.warn("Backend server down. Resolving session safely with verified storage cache tokens.");
      const fallbackUser = getSafeUserProfile();
      if (fallbackUser) {
        setProfile(fallbackUser);
      } else {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData: UserProfile) => {
    if (!userData) return;
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userProfile', JSON.stringify(userData));
    setProfile(userData);
    setIsAuthenticated(true);
    loadDashboardData(userData.userId, userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setProfile(null);
    setHistory([]);
    setAchievements([]);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0D0E] text-zinc-500">
        <p className="animate-pulse">Initializing Dashboard Ecosystem...</p>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // EXPLICIT ROUTE BLOCK 1: Handles Teacher Account Views
  if (profile.role === "TEACHER") {
    return (
      <TeacherDashboard 
        profile={profile} 
        history={history} 
        achievements={achievements} 
        onLogout={handleLogout}
        onRefreshData={() => loadDashboardData(profile.userId, profile)}
        onUpdateProfile={async () => {}}
      />
    );
  }

  // EXPLICIT ROUTE BLOCK 2: Handles Student Account Views
  if (profile.role === "STUDENT") {
    return (
      <StudentDashboard 
        profile={profile} 
        history={history} 
        achievements={achievements} 
        onLogout={handleLogout}
      />
    );
  }

  // DEFENSIVE ESCAPE FALLBACK: Catches anomalous string roles safely
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0D0E] text-zinc-400 p-6">
      <p className="text-lg font-semibold text-white mb-2">Unknown Account Role Detected</p>
      <p className="text-sm text-zinc-500 mb-6">Expected STUDENT or TEACHER, but found: "{profile.role}"</p>
      <button onClick={handleLogout} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-sm transition-all">
        Return to Login
      </button>
    </div>
  );
}