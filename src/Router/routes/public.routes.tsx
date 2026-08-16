import { Navigate, Route } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/public/PublicLayout';
import { HomePage } from '../../pages/public/HomePage';
import { publicPaths } from '../publicPaths';
import { lazyNamed } from '../lazyPages';

const AboutPage = lazyNamed(
  () => import('../../pages/public/AboutPage'),
  'AboutPage',
);
const ServicesPage = lazyNamed(
  () => import('../../pages/public/ServicesPage'),
  'ServicesPage',
);
const ProductPage = lazyNamed(
  () => import('../../pages/public/ProductPage'),
  'ProductPage',
);
const JournalPage = lazyNamed(
  () => import('../../pages/public/JournalPage'),
  'JournalPage',
);
const JournalPostPage = lazyNamed(
  () => import('../../pages/public/JournalPostPage'),
  'JournalPostPage',
);
const ServicePage = lazyNamed(
  () => import('../../pages/public/ServicePage'),
  'ServicePage',
);
const GalleryPage = lazyNamed(
  () => import('../../pages/public/GalleryPage'),
  'GalleryPage',
);
const CaseStudyPage = lazyNamed(
  () => import('../../pages/public/CaseStudyPage'),
  'CaseStudyPage',
);
const ContactPage = lazyNamed(
  () => import('../../pages/public/ContactPage'),
  'ContactPage',
);
const BookCallPage = lazyNamed(
  () => import('../../pages/public/BookCallPage'),
  'BookCallPage',
);

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
