import { Navigate, Route } from 'react-router-dom';
import { RoleRoute } from '../RoleRoute';
import { ADMIN_ROUTES } from '../adminRoutes';
import { lazyNamed } from '../lazyPages';

const HomepagePage = lazyNamed(
  () => import('../../pages/admin/HomepagePage'),
  'HomepagePage',
);
const ServicesPage = lazyNamed(
  () => import('../../pages/admin/ServicesPage'),
  'ServicesPage',
);
const BlogPage = lazyNamed(
  () => import('../../pages/admin/BlogPage'),
  'BlogPage',
);
const PortfolioPage = lazyNamed(
  () => import('../../pages/admin/PortfolioPage'),
  'PortfolioPage',
);
const MessagesPage = lazyNamed(
  () => import('../../pages/admin/MessagesPage'),
  'MessagesPage',
);
const SettingsPage = lazyNamed(
  () => import('../../pages/admin/SettingsPage'),
  'SettingsPage',
);

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
