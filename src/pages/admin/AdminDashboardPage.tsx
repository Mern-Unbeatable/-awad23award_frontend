import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../lib/api';

export function AdminDashboardPage() {
  const [stats, setStats] = useState({ unread: 0, total: 0, subscribers: 0, posts: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .stats()
      .then((r) => setStats(r.data))
      .catch(() => setError('Could not load stats. Is the API running and database seeded?'));
  }, []);

  const cards = [
    { label: 'Published posts', value: stats.posts, to: '/admin/posts', hint: 'Journal' },
    { label: 'Newsletter list', value: stats.subscribers, to: '/admin/newsletter', hint: 'Subscribers' },
    { label: 'Unread messages', value: stats.unread, to: '/admin/messages', hint: 'Inbox' },
    { label: 'Total messages', value: stats.total, to: '/admin/messages', hint: 'All time' },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <p className="text-xs tracking-[0.18em] uppercase text-[#8b95a8] mb-2">Overview</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-[#8b95a8]">Manage bilingual content, media, bookings, and inbox from one place.</p>
      </div>

      {error && (
        <div className="admin-card p-4 text-amber-300 text-sm border-amber-500/30">{error}</div>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="admin-stat block no-underline">
            <p className="text-[#8b95a8] text-xs tracking-widest uppercase mb-3">{c.label}</p>
            <p className="font-display text-4xl font-bold text-white mb-1">{c.value}</p>
            <p className="text-accent text-xs tracking-wide">{c.hint} →</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="admin-card p-6">
          <h2 className="font-display font-semibold text-lg mb-2">Quick actions</h2>
          <div className="flex flex-wrap gap-2 mt-4">
            <Link to="/admin/posts" className="btn btn-accent py-2! px-3! text-[0.65rem]!">
              New journal post
            </Link>
            <Link to="/admin/gallery" className="btn btn-outline py-2! px-3! text-[0.65rem]!">
              Upload media
            </Link>
            <Link to="/admin/settings" className="btn btn-outline py-2! px-3! text-[0.65rem]!">
              Calendly settings
            </Link>
          </div>
        </div>
        <div className="admin-card p-6">
          <h2 className="font-display font-semibold text-lg mb-2">Bilingual editing</h2>
          <p className="text-sm text-[#8b95a8] leading-relaxed">
            English and Arabic fields sit side by side. Visitors see content based on their language preference —
            no duplicate page maintenance.
          </p>
        </div>
      </div>
    </div>
  );
}
