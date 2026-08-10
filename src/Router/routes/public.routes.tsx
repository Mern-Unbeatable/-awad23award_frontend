import { Navigate, Route } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/public/PublicLayout';
import { HomePage } from '../../pages/public/HomePage';
import { AboutPage } from '../../pages/public/AboutPage';
import { ServicesPage } from '../../pages/public/ServicesPage';
import { ProductPage } from '../../pages/public/ProductPage';
import { JournalPage } from '../../pages/public/JournalPage';
import { JournalPostPage } from '../../pages/public/JournalPostPage';
import { ServicePage } from '../../pages/public/ServicePage';
import { GalleryPage } from '../../pages/public/GalleryPage';
import { CaseStudyPage } from '../../pages/public/CaseStudyPage';
import { ContactPage } from '../../pages/public/ContactPage';
import { BookCallPage } from '../../pages/public/BookCallPage';
import { publicPaths } from '../publicPaths';

export const publicRoutes = (
  <Route element={<PublicLayout />}>
    {publicPaths('/').map((p) => (
      <Route key={p} path={p} element={<HomePage />} />
    ))}
    {publicPaths('/about').map((p) => (
      <Route key={p} path={p} element={<AboutPage />} />
    ))}
    {publicPaths('/services').map((p) => (
      <Route key={p} path={p} element={<ServicesPage />} />
    ))}
    {publicPaths('/journal').map((p) => (
      <Route key={p} path={p} element={<JournalPage />} />
    ))}
    {publicPaths('/journal/:slug').map((p) => (
      <Route key={p} path={p} element={<JournalPostPage />} />
    ))}
    {publicPaths('/services/:slug').map((p) => (
      <Route key={p} path={p} element={<ServicePage />} />
    ))}
    {publicPaths('/product/:slug').map((p) => (
      <Route key={p} path={p} element={<ProductPage />} />
    ))}
    {publicPaths('/work').map((p) => (
      <Route key={p} path={p} element={<GalleryPage />} />
    ))}
    {publicPaths('/work/:slug').map((p) => (
      <Route key={p} path={p} element={<CaseStudyPage />} />
    ))}
    {publicPaths('/gallery').map((p) => (
      <Route
        key={p}
        path={p}
        element={<Navigate to={p.replace('/gallery', '/work')} replace />}
      />
    ))}
    {publicPaths('/book').map((p) => (
      <Route key={p} path={p} element={<BookCallPage />} />
    ))}
    {publicPaths('/contact').map((p) => (
      <Route key={p} path={p} element={<ContactPage />} />
    ))}
  </Route>
);
