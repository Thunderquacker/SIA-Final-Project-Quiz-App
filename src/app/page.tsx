"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getUserProfile,
  getUserQuizHistory,
  getUserAchievements,
  updateUserProfile,
  UserProfile,
  QuizHistory,
  Achievement,
  UpdateUserProfileRequest
} from "@/lib/api";

import { QuizManager } from "@/components/QuizManager";
import { UserProfileCard } from "@/components/UserProfileCard";
import { AchievementList } from "@/components/AchievementList";
import { QuizHistoryList } from "@/components/QuizHistoryList";
import { EventsView } from "@/components/EventsView";
import { QuizzesView } from "@/components/QuizzesView";
import { StudentsView } from "@/components/StudentsView";

import {
  LayoutGrid, LogOut, UserCircle,
  FileText, Users, Calendar,
  Settings, Search, Plus
} from "lucide-react";
import LoginPage from "./login/page";

export default function RootDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const currentUserId = 1; // Standardized for Sarah John

      const [profileData, historyData, achievementData] = await Promise.all([
        getUserProfile(currentUserId),
        getUserQuizHistory(currentUserId),
        getUserAchievements(currentUserId),
      ]);

      setProfile(profileData);
      setHistory(historyData);
      setAchievements(achievementData);
    } catch (err) {
      // Fallback for BSIT project testing
      setProfile({
        userId: 1,
        username: "Sarah John",
        email: "sarah.john@university.edu",
        bio: "BSIT Instructor | Systems Integration and Architecture",
        totalQuizzesTaken: 25,
        averageScore: 88.5,
        achievementsCount: 3,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    loadDashboardData();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setActiveTab("Dashboard");
  };

  const handleUpdateProfile = async (data: UpdateUserProfileRequest) => {
    if (!profile) return;
    try {
      const updated = await updateUserProfile(profile.userId, data);
      setProfile(updated);
      setIsEditingProfile(false);
    } catch (err) {
      setProfile({ ...profile, ...data });
      setIsEditingProfile(false);
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const mainNav = [
    { name: "Dashboard", icon: LayoutGrid },
    { name: "Quizzes", icon: FileText },
    { name: "Events", icon: Calendar },
    { name: "Students", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-[#0D0D0E] text-zinc-100">
      <aside className="w-64 bg-[#121213] border-r border-zinc-800 p-6 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-purple-900/20">Q</div>
          <h1 className="text-xl font-bold tracking-tight text-white">Minu</h1>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#0D0D0E] border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-purple-600 transition-all"
          />
        </div>

        <nav className="space-y-1 flex-grow">
          {mainNav.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.name
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                  : "text-zinc-500 hover:bg-zinc-800/50 hover:text-white"
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
          <div className="pt-6 pb-2 px-4">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Manage</p>
          </div>
          <button
            onClick={() => setActiveTab("Settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "Settings" ? "bg-purple-600 text-white" : "text-zinc-500 hover:bg-zinc-800/50 hover:text-white"
              }`}
          >
            <Settings className="w-5 h-5" /> Settings
          </button>
        </nav>

        <div className="pt-4 border-t border-zinc-800">
          <button onClick={() => router.push("/login")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#0D0D0E]/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="font-bold text-xl text-white">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-800 text-sm font-medium transition-all">
              <Plus className="w-4 h-4 text-purple-400" /> Create Quiz
            </button>
            <div className="w-px h-6 bg-zinc-800" />
            <button onClick={() => setActiveTab("Profile")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{profile?.username || "Sarah John"}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Instructor</p>
              </div>
              <div className="w-10 h-10 bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center hover:border-purple-500 transition-all">
                <UserCircle className="w-6 h-6 text-zinc-500" />
              </div>
            </button>
          </div>
        </header>

        <main className="p-8 overflow-y-auto">
          {loading ? (
            <p className="text-zinc-500 animate-pulse text-center mt-20">Initializing Dashboard...</p>
          ) : (
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
              {activeTab === "Login" && <LoginPage />}
              {activeTab === "Dashboard" && <QuizManager />}
              {activeTab === "Quizzes" && <QuizzesView />}
              {activeTab === "Events" && <EventsView />}
              {activeTab === "Students" && <StudentsView />}
              {activeTab === "Profile" && profile && (
                <div className="space-y-8">
                  <UserProfileCard
                    profile={profile} onUpdate={handleUpdateProfile}
                    isEditing={isEditingProfile} onEditToggle={() => setIsEditingProfile(!isEditingProfile)}
                  />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2"><QuizHistoryList history={history} /></div>
                    <div><AchievementList achievements={achievements} /></div>
                  </div>
                </div>
              )}
              {activeTab === "Settings" && (
                <div className="flex items-center justify-center h-64 border border-dashed border-zinc-800 rounded-3xl">
                  <p className="text-zinc-600">Settings module coming soon...</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}