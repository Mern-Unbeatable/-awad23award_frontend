import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectUserRole } from '../features/auth/authSelectors';
import type { UserRole } from '../features/auth/authTypes';
import { ADMIN_DEFAULT_ROUTE } from './adminRoutes';

export function RoleRoute({ roles }: { roles: UserRole[] }) {
  const role = useAppSelector(selectUserRole);
  const parentContext = useOutletContext();

  if (!role || !roles.includes(role)) {
    return <Navigate to={ADMIN_DEFAULT_ROUTE} replace />;
  }
  return <Outlet context={parentContext} />;
}
