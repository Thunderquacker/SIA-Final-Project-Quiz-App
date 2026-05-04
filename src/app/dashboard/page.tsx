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

import { 
  LayoutGrid, LogOut, UserCircle, 
  Award, History, FileText, Users 
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  // Data State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const currentUserId = 1; // Testing ID for SIA project

        const [profileData, historyData, achievementData] = await Promise.all([
          getUserProfile(currentUserId),
          getUserQuizHistory(currentUserId),
          getUserAchievements(currentUserId),
        ]);

        setProfile(profileData);
        setHistory(historyData);
        setAchievements(achievementData);
      } catch (err) {
        // Fallback Mock Data if Backend is not running
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
    loadAllData();
  }, []);

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

  const sidebarNav = [
    { name: "Dashboard", icon: LayoutGrid },
    { name: "Profile", icon: UserCircle },
    { name: "Quizzes", icon: FileText },
    { name: "Students", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-[#0D0D0E] text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#121213] border-r border-zinc-800 p-6 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white">Q</div>
          <h1 className="text-xl font-bold tracking-tight">Quizzy</h1>
        </div>

        <nav className="flex-grow space-y-2">
          {sidebarNav.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.name 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20" 
                  : "text-zinc-500 hover:bg-zinc-800/50 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-zinc-800">
          <button onClick={() => router.push("/login")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#0D0D0E]/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="font-bold text-xl">{activeTab}</h2>
          <button 
            onClick={() => setActiveTab("Profile")} 
            className="w-10 h-10 bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center hover:border-purple-500 transition-all"
          >
            <UserCircle className="w-6 h-6 text-zinc-500" />
          </button>
        </header>

        <main className="p-8 overflow-y-auto">
          {loading ? (
            <p className="text-zinc-500">Loading...</p>
          ) : (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
              {activeTab === "Dashboard" && <QuizManager />}
              
              {activeTab === "Profile" && profile && (
                <div className="space-y-8">
                  {/* The Profile Card */}
                  <UserProfileCard 
                    profile={profile} 
                    onUpdate={handleUpdateProfile} 
                    isEditing={isEditingProfile}
                    onEditToggle={() => setIsEditingProfile(!isEditingProfile)}
                  />
                  
                  {/* History and Achievements grid displayed on the same page */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <QuizHistoryList history={history} />
                    </div>
                    <div>
                      <AchievementList achievements={achievements} />
                    </div>
                  </div>
                </div>
              )}

              {/* Standard tabs if you want them separate as well */}
              {activeTab === "Quizzes" && <div className="text-zinc-500">Quiz Management View...</div>}
              {activeTab === "Students" && <div className="text-zinc-500">Student List View...</div>}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}