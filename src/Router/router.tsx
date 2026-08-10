import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '../components/layout/admin/AdminLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { HomeRedirect } from './HomeRedirect';
import { publicRoutes } from './routes/public.routes';
import { sharedRoutes } from './routes/shared.routes';
import { adminRoutes } from './routes/admin.routes';

/**
 * Portfolio App Router
 *
 * Route groups:
 *
 * | Group   | Access                  | Examples                         |
 * |---------|-------------------------|----------------------------------|
 * | Public  | Everyone                | /, /about, /work, /journal, etc. |
 * | Auth    | Unauthenticated         | /admin/login                     |
 * | Shared  | ADMIN + EDITOR          | blogs, portfolio, settings, etc. |
 * | Admin   | ADMIN only              | newsletter                       |
 */
export function AppRouter() {
  return (
    <Routes>
      {/* ── Public site ─────────────────────────────────────────── */}
      {publicRoutes}

      {/* ── Auth ────────────────────────────────────────────────── */}
      <Route path='/admin/login' element={<LoginPage />} />

      {/* ── Authenticated admin application ─────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<HomeRedirect />} />
          {sharedRoutes}
          {adminRoutes}
        </Route>
      </Route>

      {/* ── 404 ─────────────────────────────────────────────────── */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}
