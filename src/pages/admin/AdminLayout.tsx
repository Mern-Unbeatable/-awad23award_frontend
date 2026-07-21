import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { adminApi } from '../../lib/api';

const links = [
  { to: '/admin', label: 'Dashboard', end: true, icon: '◈' },
  { to: '/admin/homepage', label: 'Homepage', icon: '⌂' },
  { to: '/admin/services', label: 'Services', icon: '✦' },
  { to: '/admin/posts', label: 'Journal', icon: '✎' },
  { to: '/admin/gallery', label: 'Gallery', icon: '▣' },
  { to: '/admin/newsletter', label: 'Newsletter', icon: '✉' },
  { to: '/admin/messages', label: 'Messages', icon: '◉' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙' },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const token = localStorage.getItem('awad_token');
  if (!token) return <Navigate to="/admin/login" replace />;

  function logout() {
    adminApi.logout();
    navigate('/admin/login');
  }

  const sidebar = (
    <aside className="admin-sidebar h-full p-5 flex flex-col gap-1 min-h-screen">
      <div className="px-2 mb-7">
        <p className="font-display font-bold text-lg tracking-tight">
          Awad <span className="text-accent">CMS</span>
        </p>
        <p className="text-[0.7rem] text-[#8b95a8] mt-1 tracking-wide">Content control</p>
      </div>
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
        >
          <span className="opacity-70 w-4 text-center text-xs">{l.icon}</span>
          {l.label}
        </NavLink>
      ))}
      <div className="mt-auto pt-6 space-y-1 border-t border-[#2a3344]">
        <a href="/" className="admin-nav-link" target="_blank" rel="noreferrer">
          <span className="opacity-70 w-4 text-center text-xs">↗</span>
          View site
        </a>
        <button type="button" onClick={logout} className="admin-nav-link w-full text-start">
          <span className="opacity-70 w-4 text-center text-xs">⎋</span>
          Log out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="admin-shell min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">{sidebar}</div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-[280px] h-full overflow-y-auto">{sidebar}</div>
          <button
            type="button"
            className="flex-1 bg-black/60 cursor-pointer"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      <div className="min-w-0 flex flex-col min-h-screen">
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-[#2a3344] bg-[#0c0f14]">
          <button
            type="button"
            className="text-sm tracking-widest uppercase text-accent cursor-pointer"
            onClick={() => setMobileOpen(true)}
          >
            Menu
          </button>
          <p className="font-display font-bold text-sm">
            Awad <span className="text-accent">CMS</span>
          </p>
        </header>
        <main className="p-5 md:p-8 lg:p-10 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
