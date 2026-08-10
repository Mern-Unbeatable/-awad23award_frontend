import { Navigate, Route } from 'react-router-dom';
import { RoleRoute } from '../RoleRoute';
import { HomepagePage } from '../../pages/admin/HomepagePage';
import { ServicesPage } from '../../pages/admin/ServicesPage';
import { BlogPage } from '../../pages/admin/BlogPage';
import { PortfolioPage } from '../../pages/admin/PortfolioPage';
import { MessagesPage } from '../../pages/admin/MessagesPage';
import { SettingsPage } from '../../pages/admin/SettingsPage';
import { ADMIN_ROUTES } from '../adminRoutes';

/** Authenticated routes available to ADMIN and EDITOR (matches backend authorize). */
export const sharedRoutes = (
  <Route element={<RoleRoute roles={['ADMIN', 'EDITOR']} />}>
    <Route path='homepage' element={<HomepagePage />} />
    <Route path='services' element={<ServicesPage />} />
    <Route path='blogs/new' element={<BlogPage />} />
    <Route path='blogs/:postId/edit' element={<BlogPage />} />
    <Route path='blogs' element={<BlogPage />} />
    <Route path='portfolio/new' element={<PortfolioPage />} />
    <Route path='portfolio/:itemId/edit' element={<PortfolioPage />} />
    <Route path='portfolio' element={<PortfolioPage />} />
    <Route
      path='posts'
      element={<Navigate to={ADMIN_ROUTES.blogs} replace />}
    />
    <Route
      path='gallery'
      element={<Navigate to={ADMIN_ROUTES.portfolio} replace />}
    />
    <Route path='messages' element={<MessagesPage />} />
    <Route path='settings' element={<SettingsPage />} />
  </Route>
);
