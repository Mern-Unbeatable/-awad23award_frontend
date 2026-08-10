import { Seo } from '../../components/Seo';
import { Hero } from '../../components/site/Hero';
import { About } from '../../components/site/About';
import { Services } from '../../components/site/Services';
import { Process } from '../../components/site/Process';
import { Portfolio } from '../../components/site/Portfolio';
import { Testimonials } from '../../components/site/Testimonials';
import { Blog } from '../../components/site/Blog';
import { Contact } from '../../components/site/Contact';
import { SiteFooter } from '../../components/site/SiteFooter';
import { useLocale } from '../../context/LocaleContext';

export function HomePage() {
  const { pathFor } = useLocale();

  return (
    <main className="w-full min-h-screen">
      <Seo path={pathFor('/')} />
      <Hero />
      <About />
      <Services />
      <Process />
      <Portfolio />
      <Testimonials />
      <Blog />
      <Contact />
      <SiteFooter />
    </main>
  );
}
