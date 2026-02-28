import { NavLink, Outlet } from "react-router";
import {
  LayoutDashboard,
  Radio,
  Bell,
  FileText,
  Settings,
  Activity,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/sources", icon: Radio, label: "Sources" },
  { to: "/changes", icon: FileText, label: "Changes Feed" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/system-status", icon: Activity, label: "System Status" },
];

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-sidebar to-sidebar/95 text-sidebar-foreground border-r border-sidebar-border shrink-0 shadow-xl">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border/50">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sidebar-primary to-blue-600 shadow-lg">
            <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <p className="text-base font-bold text-sidebar-foreground tracking-tight">ComplianceIQ</p>
            <p className="text-xs text-sidebar-foreground/60 font-medium">Intelligence Platform</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-5 border-t border-sidebar-border/50 bg-sidebar-accent/30">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-sidebar/40">
            <div className="relative">
              <Bell className="w-4 h-4 text-sidebar-foreground/60" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-[pulse-subtle_2s_ease-in-out_infinite]" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-sidebar-foreground/90">System Active</p>
              <p className="text-[10px] text-sidebar-foreground/50">Last sync: 2 min ago</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="lg:hidden flex items-center justify-between px-5 py-4 bg-gradient-to-r from-sidebar to-sidebar/95 text-sidebar-foreground border-b border-sidebar-border shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-sidebar-primary to-blue-600 shadow-md">
              <Shield className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="text-sm font-bold">ComplianceIQ</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-[57px] left-0 right-0 z-50 bg-sidebar text-sidebar-foreground border-b border-sidebar-border shadow-2xl animate-[slideIn_0.2s_ease-out]">
            <nav className="px-4 py-4 space-y-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70"
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
