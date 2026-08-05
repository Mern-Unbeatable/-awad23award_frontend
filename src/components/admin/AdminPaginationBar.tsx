import { AdminPagination, type AdminPaginationProps } from './AdminPagination';

/** Visible footer bar for admin list pagination (blogs, portfolio, etc.) */
export function AdminPaginationBar(props: AdminPaginationProps) {
  const { className = '', ...paginationProps } = props;

  return (
    <div
      className={`mt-6 bg-white border border-slate-200 rounded-sm px-3 py-3.5 sm:px-4 shadow-2xs ${className}`}
    >
      <AdminPagination {...paginationProps} />
    </div>
  );
}
