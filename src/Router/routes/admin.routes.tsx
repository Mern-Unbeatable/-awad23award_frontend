import { Route } from 'react-router-dom';
import { RoleRoute } from '../RoleRoute';
import { NewsletterPage } from '../../pages/admin/NewsletterPage';

/** ADMIN-only routes (newsletter API requires ADMIN role on the server). */
export const adminRoutes = (
  <Route element={<RoleRoute roles={['ADMIN']} />}>
    <Route path="newsletter" element={<NewsletterPage />} />
  </Route>
);
