import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  BedDouble,
  UserRound,
  ClipboardList,
  AlertTriangle,
  Building2,
  Baby,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", label: "แดชบอร์ด", icon: LayoutDashboard },
  { path: "/labor-room", label: "ห้องคลอด", icon: BedDouble },
  { path: "/high-risk", label: "ความเสี่ยงสูง", icon: AlertTriangle },
  { path: "/hospital-summary", label: "สรุปรายโรงพยาบาล", icon: Building2 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E91E63] to-[#F06292] flex items-center justify-center">
              <Baby size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#333]">MOPH OB</h1>
              <p className="text-[10px] text-[#999] leading-tight">
                Provincial Labor Room Monitor
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-pink-50 text-[#E91E63] font-semibold"
                    : "text-[#666] hover:bg-gray-50 hover:text-[#E91E63]"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-[10px] text-[#aaa] text-center">
            MOPH OB Dashboard v1.0
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h2 className="text-base font-bold text-[#333]">
                ระบบเฝ้าระวังห้องคลอดระดับจังหวัด
              </h2>
              <p className="text-xs text-[#999]">
                Provincial Labor Room Monitoring System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#999] hidden sm:block">
              {new Date().toLocaleDateString("th-TH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FCE4EC] flex items-center justify-center">
              <UserRound size={16} className="text-[#E91E63]" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-auto p-4 lg:p-6 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
