import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LocaleProvider } from './context/LocaleContext';
import { SiteProvider } from './context/SiteContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProductPage } from './pages/ProductPage';
import { JournalPage } from './pages/JournalPage';
import { JournalPostPage } from './pages/JournalPostPage';
import { ServicePage } from './pages/ServicePage';
import { GalleryPage } from './pages/GalleryPage';
import { CaseStudyPage } from './pages/CaseStudyPage';
import { ContactPage } from './pages/ContactPage';
import { BookCallPage } from './pages/BookCallPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminHomepagePage } from './pages/admin/AdminHomepagePage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminPostsPage } from './pages/admin/AdminPostsPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminNewsletterPage } from './pages/admin/AdminNewsletterPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { ADMIN_DEFAULT_ROUTE, ADMIN_ROUTES } from './pages/admin/adminRoutes';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SiteProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </SiteProvider>
  );
}

function publicPaths(path: string) {
  if (path === '/') return ['/', '/ar'];
  return [path, `/ar${path}`];
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <Providers>
                <PublicLayout />
              </Providers>
            }
          >
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
              <Route key={p} path={p} element={<Navigate to={p.replace('/gallery', '/work')} replace />} />
            ))}
            {publicPaths('/book').map((p) => (
              <Route key={p} path={p} element={<BookCallPage />} />
            ))}
            {publicPaths('/contact').map((p) => (
              <Route key={p} path={p} element={<ContactPage />} />
            ))}
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to={ADMIN_DEFAULT_ROUTE} replace />} />
            <Route path="homepage" element={<AdminHomepagePage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="blogs/new" element={<AdminPostsPage />} />
            <Route path="blogs/:postId/edit" element={<AdminPostsPage />} />
            <Route path="blogs" element={<AdminPostsPage />} />
            <Route path="portfolio/new" element={<AdminGalleryPage />} />
            <Route path="portfolio/:itemId/edit" element={<AdminGalleryPage />} />
            <Route path="portfolio" element={<AdminGalleryPage />} />
            <Route path="posts" element={<Navigate to={ADMIN_ROUTES.blogs} replace />} />
            <Route path="gallery" element={<Navigate to={ADMIN_ROUTES.portfolio} replace />} />
            <Route path="newsletter" element={<AdminNewsletterPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
