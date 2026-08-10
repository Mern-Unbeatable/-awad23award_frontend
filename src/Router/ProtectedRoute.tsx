import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated } from '../features/auth/authSelectors';
import { ADMIN_ROUTES } from './adminRoutes';

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ADMIN_ROUTES.login} replace />;
  }
  return <Outlet />;
}
