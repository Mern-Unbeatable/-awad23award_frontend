import { useEffect } from 'react';
import {
  Mail,
  User,
  Users,
  Trash2,
  TrendingUp,
  Clock,
  Download,
  Loader2,
} from 'lucide-react';
import { AdminPagination } from '../../components/admin/AdminPagination';
import { usePagination } from '../../hooks/usePagination';
import { confirmDelete } from '../../lib/swal';
import {
  formatNewsletterStatus,
  type NewsletterSubscriberStatus,
} from '../../types';
import { useNewsletterAdmin } from '../../features/admin/newsletter/newsletterHooks';

const NEWSLETTER_PAGE_SIZE = 5;

function SubscriberStatusBadge({
  status,
}: {
  status: NewsletterSubscriberStatus;
}) {
  const label = formatNewsletterStatus(status);
  const styles =
    status === 'ACTIVE'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
      : status === 'PENDING'
        ? 'bg-amber-50 text-amber-700 border-amber-200/60'
        : status === 'BOUNCED'
          ? 'bg-red-50 text-red-700 border-red-200/60'
          : 'bg-slate-100 text-slate-600 border-slate-200/60';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium border ${styles}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          status === 'ACTIVE'
            ? 'bg-emerald-500'
            : status === 'PENDING'
              ? 'bg-amber-500'
              : status === 'BOUNCED'
                ? 'bg-red-500'
                : 'bg-slate-400'
        }`}
      />
      {label}
    </span>
  );
}

export function NewsletterPage() {
  const {
    subscribers,
    stats,
    isLoading: loading,
    isExporting: exporting,
    error: loadError,
    actionError,
    loadNewsletterData,
    deleteSubscriber,
    exportCsv,
    clearActionError,
  } = useNewsletterAdmin();

  useEffect(() => {
    loadNewsletterData().catch(() => undefined);
  }, [loadNewsletterData]);

  const { page, setPage, totalPages, paginatedItems, totalItems, pageSize } =
    usePagination(subscribers, NEWSLETTER_PAGE_SIZE);

  async function handleDelete(id: string) {
    const confirmed = await confirmDelete(
      'Delete Subscriber?',
      'Are you sure you want to remove this email from your newsletter list?',
    );
    if (!confirmed) return;

    clearActionError();
    try {
      await deleteSubscriber(id);
    } catch (err) {
      console.error('Failed to delete subscriber:', err);
    }
  }

  async function handleExportCsv() {
    clearActionError();
    try {
      await exportCsv();
    } catch (err) {
      console.error('Failed to export subscribers:', err);
    }
  }

  const latestEmail = stats.latestSubscription?.email ?? 'None';
  const latestDate = stats.latestSubscription?.date ?? 'N/A';

  return (
    <div className='space-y-8'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-[26px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight'>
            Newsletter Subscribers
          </h1>
          <p className='text-[14px] text-slate-500 mt-1'>
            Manage everyone who subscribed through your website.
          </p>
        </div>

        <button
          type='button'
          onClick={() => void handleExportCsv()}
          disabled={exporting || loading}
          className='inline-flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2.5 text-[13.5px] font-semibold transition-colors shadow-2xs self-start sm:self-auto cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {exporting ? (
            <Loader2 className='w-4 h-4 text-slate-500 animate-spin' />
          ) : (
            <Download className='w-4 h-4 text-slate-500' />
          )}
          <span>{exporting ? 'Exporting…' : 'Export CSV'}</span>
        </button>
      </div>

      {loadError && (
        <div className='p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 text-[14px]'>
          {loadError}
        </div>
      )}

      {actionError && (
        <div className='p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 text-[14px]'>
          {actionError}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex items-center justify-between'>
          <div>
            <span className='text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1'>
              TOTAL SUBSCRIBERS
            </span>
            <span className='text-[32px] font-bold text-slate-900 leading-none block mb-2'>
              {loading ? '—' : stats.totalSubscribers}
            </span>
            <span className='text-[12px] font-semibold text-emerald-600 flex items-center gap-1'>
              <TrendingUp className='w-3.5 h-3.5' />
              Active email audience
            </span>
          </div>
          <div className='w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0'>
            <User className='w-5 h-5' />
          </div>
        </div>

        <div className='bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex items-center justify-between'>
          <div>
            <span className='text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1'>
              NEW THIS MONTH
            </span>
            <span className='text-[32px] font-bold text-slate-900 leading-none block mb-2'>
              {loading ? '—' : `+${stats.newThisMonth}`}
            </span>
            <span className='text-[12px] font-medium text-slate-400'>
              Subscribers this month
            </span>
          </div>
          <div className='w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0'>
            <Users className='w-5 h-5' />
          </div>
        </div>

        <div className='bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex items-center justify-between'>
          <div className='min-w-0'>
            <span className='text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1'>
              LATEST SUBSCRIPTION
            </span>
            <span className='text-[14px] font-bold text-slate-900 truncate block mb-2 max-w-45'>
              {loading ? '—' : latestEmail}
            </span>
            <span className='text-[12px] text-slate-400 flex items-center gap-1'>
              <Clock className='w-3.5 h-3.5' />
              {loading ? '—' : latestDate}
            </span>
          </div>
          <div className='w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0'>
            <Mail className='w-5 h-5' />
          </div>
        </div>
      </div>

      <div className='bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden'>
        <div className='md:hidden divide-y divide-slate-100'>
          {loading ? (
            <div className='py-10 text-center text-slate-400 flex items-center justify-center gap-2'>
              <Loader2 className='w-5 h-5 animate-spin text-[#38BDF8]' />
              <span className='text-[14px]'>Loading subscribers...</span>
            </div>
          ) : subscribers.length === 0 ? (
            <p className='py-10 px-4 text-center text-slate-400 text-[14px]'>
              {loadError
                ? 'Could not load subscribers.'
                : 'No subscribers found.'}
            </p>
          ) : (
            paginatedItems.map((s) => (
              <article key={s.id} className='p-4 space-y-3'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0 flex-1'>
                    <p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1'>
                      Email address
                    </p>
                    <p className='text-[14px] font-medium text-slate-800 break-all leading-snug'>
                      {s.email}
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={() => void handleDelete(s.id)}
                    className='p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0'
                    title='Delete subscriber'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
                <div className='flex flex-wrap items-end justify-between gap-3'>
                  <div>
                    <p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1'>
                      Date subscribed
                    </p>
                    <p className='text-[13px] text-slate-500 font-mono'>
                      {s.date}
                    </p>
                  </div>
                  <SubscriberStatusBadge status={s.status} />
                </div>
              </article>
            ))
          )}
        </div>

        <div className='hidden md:block overflow-x-auto'>
          <table className='w-full text-start border-collapse'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider'>
                <th className='py-3.5 px-6 text-start'>EMAIL ADDRESS</th>
                <th className='py-3.5 px-6 text-start'>DATE SUBSCRIBED</th>
                <th className='py-3.5 px-6 text-start'>STATUS</th>
                <th className='py-3.5 px-6 text-end'>ACTIONS</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 text-[14px]'>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className='py-12 text-center text-slate-400 font-medium'
                  >
                    <span className='inline-flex items-center gap-2'>
                      <Loader2 className='w-5 h-5 animate-spin text-[#38BDF8]' />
                      Loading subscribers...
                    </span>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className='py-8 text-center text-slate-400 text-[14px]'
                  >
                    {loadError
                      ? 'Could not load subscribers.'
                      : 'No subscribers found.'}
                  </td>
                </tr>
              ) : (
                paginatedItems.map((s) => (
                  <tr
                    key={s.id}
                    className='hover:bg-slate-50/60 transition-colors'
                  >
                    <td className='py-4 px-6 font-medium text-slate-800'>
                      <span className='inline-flex items-center gap-3'>
                        <Mail className='w-4 h-4 text-slate-400 shrink-0' />
                        <span>{s.email}</span>
                      </span>
                    </td>
                    <td className='py-4 px-6 text-slate-500 font-mono text-[13px]'>
                      {s.date}
                    </td>
                    <td className='py-4 px-6'>
                      <SubscriberStatusBadge status={s.status} />
                    </td>
                    <td className='py-4 px-6 text-end'>
                      <button
                        type='button'
                        onClick={() => void handleDelete(s.id)}
                        className='p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer'
                        title='Delete subscriber'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className='px-3 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 bg-slate-50/30'>
          <AdminPagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
            itemLabel='subscribers'
          />
        </div>
      </div>
    </div>
  );
}
