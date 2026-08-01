import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate, Link } from 'react-router-dom';
import { FileText, Briefcase, Mail, LogOut, Monitor, Menu, X, ArrowLeft } from 'lucide-react';
import { adminApi } from '../../lib/api';

const navItems = [
  { to: '/admin/posts', label: 'Blogs', icon: FileText },
  { to: '/admin/gallery', label: 'Portfolio', icon: Briefcase },
  { to: '/admin/newsletter', label: 'Newsletter', icon: Mail },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const token = localStorage.getItem('awad_token');
  if (!token && localStorage.getItem('awad_admin_logged') !== 'true') {
    return <Navigate to="/admin/login" replace />;
  }

  function handleLogout() {
    localStorage.removeItem('awad_token');
    localStorage.removeItem('awad_admin_logged');
    adminApi.logout();
    navigate('/admin/login');
  }

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 bg-white border-r border-slate-200">
      <div>
        <div className="text-[12px] font-medium text-slate-400 mb-3 px-3">
          Main menu
        </div>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
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
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-[#EF4444] bg-[#FFF5F5] hover:bg-red-100 transition-colors text-start cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* TOP HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#38BDF8] text-white font-bold text-[12px] flex items-center justify-center">
              AI
            </div>
            <span className="font-bold text-[14px] text-slate-900 tracking-tight">
              Ahmed Ibrahim
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[12.5px] font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700">
              <Monitor className="w-4 h-4" />
            </div>
            <div className="text-start leading-tight hidden sm:block">
              <span className="text-[13px] font-bold text-slate-900 block">
                Ahmed Ibrahim
              </span>
              <span className="text-[11px] text-slate-400 font-medium block">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* BODY CONTENT AREA */}
      <div className="flex-1 flex min-h-[calc(100vh-57px)]">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-[220px] shrink-0 sticky top-[57px] h-[calc(100vh-57px)]">
          {sidebarContent}
        </aside>

        {/* MOBILE SIDEBAR OVERLAY */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="w-[220px] h-full pt-[57px]">{sidebarContent}</div>
            <button
              type="button"
              className="flex-1 bg-black/30 backdrop-blur-xs cursor-pointer"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            />
          </div>
        )}

        {/* MAIN CONTENT PAGE */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
