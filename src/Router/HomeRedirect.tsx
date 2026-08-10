import { Navigate } from 'react-router-dom';
import { ADMIN_DEFAULT_ROUTE } from './adminRoutes';

export function HomeRedirect() {
  return <Navigate to={ADMIN_DEFAULT_ROUTE} replace />;
}
