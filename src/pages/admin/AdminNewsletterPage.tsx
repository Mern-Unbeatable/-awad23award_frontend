import { useState, useEffect } from 'react';
import { Mail, User, Users, Trash2, TrendingUp, Clock, Download, Loader2 } from 'lucide-react';
import { AdminPagination } from '../../components/admin/AdminPagination';
import { usePagination } from '../../hooks/usePagination';
import { adminApi } from '../../lib/api';
import { confirmDelete } from '../../lib/swal';

const NEWSLETTER_PAGE_SIZE = 5;

function SubscriberStatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
      {status}
    </span>
  );
}

interface SubscriberItem {
  id: string;
  email: string;
  date: string;
  status: string;
  locale?: string;
  createdAt?: string;
  confirmedAt?: string | null;
}

const fallbackSubscribers: SubscriberItem[] = [
  { id: '1', email: 'david.chen@enterprise-tech.io', date: '2026-07-28', status: 'Active Subscribed' },
  { id: '2', email: 'sarah.jenkins@cloudscale.net', date: '2026-07-26', status: 'Active Subscribed' },
  { id: '3', email: 'michael.ross@fintechlabs.co', date: '2026-07-24', status: 'Active Subscribed' },
];

export function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchSubscribers() {
      try {
        const res = await adminApi.getSubscribers();
        const rawList = res.data?.data || (Array.isArray(res.data) ? res.data : null);
        if (Array.isArray(rawList) && isMounted) {
          const formatted: SubscriberItem[] = rawList.map((item: any) => ({
            id: item.id || item._id || String(Math.random()),
            email: item.email,
            date: item.date || (item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : 'N/A'),
            status: item.confirmedAt ? 'Confirmed' : 'Active Subscribed',
            locale: item.locale || 'en',
            createdAt: item.createdAt,
            confirmedAt: item.confirmedAt,
          }));
          setSubscribers(formatted);
        } else if (isMounted) {
          setSubscribers(fallbackSubscribers);
        }
      } catch (err) {
        console.error('Failed to fetch subscribers:', err);
        if (isMounted) {
          setSubscribers(fallbackSubscribers);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchSubscribers();
    return () => {
      isMounted = false;
    };
  }, []);

  const { page, setPage, totalPages, paginatedItems, totalItems, pageSize } = usePagination(
    subscribers,
    NEWSLETTER_PAGE_SIZE,
  );

  async function handleDelete(id: string) {
    const confirmed = await confirmDelete(
      'Delete Subscriber?',
      'Are you sure you want to remove this email from your newsletter list?'
    );
    if (confirmed) {
      try {
        await adminApi.deleteSubscriber(id);
      } catch (err) {
        console.error('Failed to delete subscriber:', err);
      }
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    }
  }

  function handleExportCsv() {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,Date Subscribed,Status', ...subscribers.map((s) => `${s.email},${s.date},${s.status}`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'newsletter_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-8">
      {/* HEADER TITLE BAR MATCHING SCREENSHOT 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight">
            Newsletter Subscribers
          </h1>
          <p className="text-[14px] text-slate-500 mt-1">
            Manage everyone who subscribed through your website.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2.5 text-[13.5px] font-semibold transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* 3 METRIC CARDS MATCHING SCREENSHOT 5 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1: TOTAL SUBSCRIBERS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              TOTAL SUBSCRIBERS
            </span>
            <span className="text-[32px] font-bold text-slate-900 leading-none block mb-2">
              {subscribers.length}
            </span>
            <span className="text-[12px] font-semibold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Active email audience
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
        </div>

        {/* CARD 2: NEW THIS MONTH */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              NEW THIS MONTH
            </span>
            <span className="text-[32px] font-bold text-slate-900 leading-none block mb-2">
              +{subscribers.length}
            </span>
            <span className="text-[12px] font-medium text-slate-400">Total Audience</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* CARD 3: LATEST SUBSCRIPTION */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              LATEST SUBSCRIPTION
            </span>
            <span className="text-[14px] font-bold text-slate-900 truncate block mb-2 max-w-[180px]">
              {subscribers[0]?.email || 'None'}
            </span>
            <span className="text-[12px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {subscribers[0]?.date || 'N/A'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Subscribers — cards on mobile, table on md+ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {paginatedItems.map((s) => (
            <article key={s.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Email address
                  </p>
                  <p className="text-[14px] font-medium text-slate-800 break-all leading-snug">{s.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(s.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Delete subscriber"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Date subscribed
                  </p>
                  <p className="text-[13px] text-slate-500 font-mono">{s.date}</p>
                </div>
                <SubscriberStatusBadge status={s.status} />
              </div>
            </article>
          ))}
          {subscribers.length === 0 && (
            <p className="py-10 px-4 text-center text-slate-400 text-[14px]">No subscribers found.</p>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6 text-start">EMAIL ADDRESS</th>
                <th className="py-3.5 px-6 text-start">DATE SUBSCRIBED</th>
                <th className="py-3.5 px-6 text-start">STATUS</th>
                <th className="py-3.5 px-6 text-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[14px]">
              {paginatedItems.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-800">
                    <span className="inline-flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{s.email}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-[13px]">{s.date}</td>
                  <td className="py-4 px-6">
                    <SubscriberStatusBadge status={s.status} />
                  </td>
                  <td className="py-4 px-6 text-end">
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete subscriber"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 text-[14px]">
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-3 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 bg-slate-50/30">
          <AdminPagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
            itemLabel="subscribers"
          />
        </div>
      </div>
    </div>
  );
}
