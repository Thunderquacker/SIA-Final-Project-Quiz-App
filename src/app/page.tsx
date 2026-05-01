import { QuizManager } from "@/components/QuizManager";
import { 
  Search, LayoutGrid, FileText, CalendarDays, 
  Users, Settings, Plus, UserCircle, BellDot 
} from "lucide-react";

export default function Home() {
  const sidebarNav = [
    { name: "Dashboard", icon: LayoutGrid, active: true },
    { name: "Quizzes", icon: FileText, active: false },
    { name: "Events", icon: CalendarDays, active: false },
    { name: "Students", icon: Users, active: false },
  ];

  return (
    <div className="flex min-h-screen bg-[#0D0D0E] text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#121213] border-r border-zinc-800 p-6 flex flex-col space-y-8 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white">Q</div>
          <h1 className="text-xl font-bold tracking-tight">Quizzy</h1>
        </div>

        <nav className="flex-grow space-y-2">
          {sidebarNav.map((item) => (
            <a key={item.name} href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20" 
                  : "text-zinc-500 hover:bg-zinc-800/50 hover:text-white"
              }`}>
              <item.icon className="w-5 h-5" />
              {item.name}
            </a>
          ))}
          <div className="pt-4 mt-4 border-t border-zinc-800">
            <p className="text-[10px] font-bold text-zinc-600 px-4 uppercase tracking-widest mb-2">Manage</p>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-500 hover:bg-zinc-800/50 hover:text-white">
              <Settings className="w-5 h-5" />
              Settings
            </a>
          </div>
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#0D0D0E]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="text" placeholder="Search..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-purple-600 text-sm" />
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-800 text-sm font-medium transition-all">
              <Plus className="w-4 h-4 text-purple-400" /> Create Quiz
            </button>
            <div className="w-px h-6 bg-zinc-800" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">Sarah John</p>
                <p className="text-[10px] text-zinc-500">Instructor</p>
              </div>
              <div className="w-10 h-10 bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-zinc-500" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          <QuizManager />
        </main>
      </div>
    </div>
  );
}