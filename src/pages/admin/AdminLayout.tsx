import { useState, type ReactNode } from 'react';
import { NavLink, Outlet, Navigate, useNavigate, Link } from 'react-router-dom';
import { FileText, Briefcase, Mail, LogOut, Menu, X, Home, Settings } from 'lucide-react';
import { adminApi } from '../../lib/api';
import { isLoggedIn } from '../../lib/auth';
import { ADMIN_ROUTES } from './adminRoutes';
import type { AdminLayoutContextValue } from './adminLayoutContext';

const navItems = [
  { to: ADMIN_ROUTES.blogs, label: 'Blogs', icon: FileText },
  { to: ADMIN_ROUTES.portfolio, label: 'Portfolio', icon: Briefcase },
  { to: ADMIN_ROUTES.newsletter, label: 'Newsletter', icon: Mail },
  { to: ADMIN_ROUTES.settings, label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerExtension, setHeaderExtension] = useState<ReactNode | null>(null);

  const outletContext: AdminLayoutContextValue = { setHeaderExtension };


  if (!isLoggedIn()) {
    return <Navigate to={ADMIN_ROUTES.login} replace />;
  }

  function handleLogout() {

    adminApi.logout();
    navigate(ADMIN_ROUTES.login);
  }

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 bg-white border-r border-slate-200">
      <div>
        <div className="text-[12px] font-medium text-slate-400 mb-3 px-3">
          Main menu
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={false}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-[14px] font-medium transition-all ${
                    isActive
                      ? 'bg-[#38BDF8] text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-sm text-[13px] font-semibold text-[#EF4444] bg-[#FFF5F5] hover:bg-red-100 transition-colors text-start cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans overflow-hidden">
      {/* TOP HEADER BAR - SENIOR UX DESIGN */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs shrink-0">
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Left Side: Burger Menu + Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle admin menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-[#38BDF8] text-white font-bold text-[12px] flex items-center justify-center shrink-0 shadow-xs">
              AI
            </div>
            <div className="leading-tight">
              <span className="font-bold text-[14px] text-slate-900 tracking-tight block">
                Ahmed Ibrahim
              </span>
              <span className="text-[10.5px] text-slate-400 font-medium block lg:hidden">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Right Side: View Site Action + Admin Profile Badge */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700 text-[12.5px] font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <Home className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>View Site</span>
          </Link>

          {/* Desktop Only Role Badge */}
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0284C7] text-[11px] font-bold border border-sky-200/60">
              Admin
            </span>
          </div>
        </div>
        </div>
      </header>

      {/* BODY CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex lg:flex-col w-55 shrink-0 overflow-y-auto border-r border-slate-200 bg-white">
          {sidebarContent}
        </aside>

        {/* MOBILE SIDEBAR OVERLAY WITH GUARANTEED SMOOTH GPU SLIDE */}
        <div
          className={`lg:hidden fixed inset-0 z-50 flex transition-opacity duration-300 ease-out ${
            mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          {/* Dark Backdrop */}
          <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ease-out cursor-pointer ${
              mobileOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setMobileOpen(false)}
          />

          {/* Sliding Menu Panel */}
          <div
            className={`relative w-60 max-w-[80vw] h-full bg-white shadow-2xl z-10 flex flex-col transform transition-transform duration-300 ease-out will-change-transform ${
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#38BDF8] text-white font-bold text-xs flex items-center justify-center">
                  AI
                </div>
                <span className="font-bold text-sm text-slate-900">Admin Menu</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </div>
        </div>

        {/* MAIN CONTENT AREA RIGHT OF SIDEBAR */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {headerExtension && (
            <div className="border-b border-slate-200 bg-white shrink-0">
              {headerExtension}
            </div>
          )}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full min-w-0 overflow-y-auto overflow-x-hidden">
            <Outlet context={outletContext} />
          </main>
        </div>
      </div>
    </div>
  );
}
