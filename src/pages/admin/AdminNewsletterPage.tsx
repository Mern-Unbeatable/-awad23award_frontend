import { useState } from 'react';
import { Mail, User, Users, Trash2, TrendingUp, Clock, Download } from 'lucide-react';

interface SubscriberItem {
  id: string;
  email: string;
  date: string;
  status: string;
}

const initialSubscribers: SubscriberItem[] = [
  { id: '1', email: 'david.chen@enterprise-tech.io', date: '2026-07-28', status: 'Active Subscribed' },
  { id: '2', email: 'sarah.jenkins@cloudscale.net', date: '2026-07-26', status: 'Active Subscribed' },
  { id: '3', email: 'michael.ross@fintechlabs.co', date: '2026-07-24', status: 'Active Subscribed' },
  { id: '4', email: 'a.kumar@techglobal.de', date: '2026-07-22', status: 'Active Subscribed' },
  { id: '5', email: 'elena.vladimirov@cybernet.ch', date: '2026-07-19', status: 'Active Subscribed' },
  { id: '6', email: 'jason.m@startuphub.sg', date: '2026-07-15', status: 'Active Subscribed' },
  { id: '7', email: 'olivia.brown@retailventures.com', date: '2026-07-12', status: 'Active Subscribed' },
];

export function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>(initialSubscribers);

  function handleDelete(id: string) {
    if (confirm('Delete subscriber from list?')) {
      setSubscribers(subscribers.filter((s) => s.id !== id));
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#38BDF8] text-white flex items-center justify-center shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight">
              Newsletter Subscribers
            </h1>
            <p className="text-[14px] text-slate-500 mt-1">
              Manage everyone who subscribed through your website.
            </p>
          </div>
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
              +{subscribers.length > 5 ? subscribers.length - 2 : subscribers.length}
            </span>
            <span className="text-[12px] font-medium text-slate-400">July 2026 Cohort</span>
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
              {subscribers[0]?.date || '2026-07-28'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SUBSCRIBERS TABLE MATCHING SCREENSHOT 5 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
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
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-800 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{s.email}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-[13px]">{s.date}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {s.status}
                    </span>
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
      </div>
    </div>
  );
}
