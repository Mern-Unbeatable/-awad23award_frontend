import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Hero } from "@/components/site/Hero";
import { LogoStrip } from "@/components/site/LogoStrip";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Process } from "@/components/site/Process";
import { Portfolio } from "@/components/site/Portfolio";
import { Testimonials } from "@/components/site/Testimonials";
import { Blog } from "@/components/site/Blog";
import { Contact } from "@/components/site/Contact";
import { SiteFooter } from "@/components/site/SiteFooter";

const title = "Ahmed Ibrahim — Technology Consultant & AI Strategist";
const description =
  "I help founders and executives simplify operations, adopt AI, and build technology systems that actually scale. Consulting, strategy, and keynote speaking.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Ahmed Ibrahim",
          jobTitle: "Technology Consultant, AI Strategist & Keynote Speaker",
          description,
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <main>
      <Hero />
      <LogoStrip />
      <About />
      <Services />
      <Process />
      <Portfolio />
      <Testimonials />
      <Blog />
      <Contact />
      <SiteFooter />
      <Toaster />
    </main>
  );
}
