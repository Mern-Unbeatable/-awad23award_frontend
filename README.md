# Ahmed Ibrahim — Portfolio Website

A bilingual (English / Arabic) **React + TypeScript + Vite + Tailwind CSS v4** portfolio website for Ahmed Ibrahim — a technology strategist and entrepreneur showcasing expertise in CRM, WhatsApp automation, AI agents, and enterprise digital transformation across Saudi Arabia and globally.

![Tech Stack](https://img.shields.io/badge/React-19%2B-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-%23646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-%233178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-%2306B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [API Layer](#api-layer)
- [Bilingual Support (i18n)](#bilingual-support-i18n)
- [Global State](#global-state)
- [Admin Panel](#admin-panel)
- [Styling & Animations](#styling--animations)
- [Deployment](#deployment)
- [Data Types](#data-types)

---

## Overview

This is the client-side portfolio application for Ahmed Ibrahim — a technology strategist and entrepreneur. It lives in the `awad23/web` package alongside the Express API in `awad23/server`. It serves as both a public-facing portfolio showcasing services (CRM, WhatsApp automation, AI agents), a case study gallery, a blog/journal, and a contact/booking flow, plus an admin dashboard (CMS) for managing content.

---

## Features

- **Bilingual UI** — English and Arabic with full RTL support
- **Server-driven content** — All site data (settings, services, posts, gallery, etc.) is fetched from a backend REST API, with comprehensive local fallback data
- **SEO management** — Per-page `<title>`, meta descriptions, and Open Graph tags via `react-helmet-async`
- **Smooth scrolling** — Lenis-based smooth scroll with GSAP ScrollTrigger animations
- **Dark-mode capable theme** — CSS custom properties and Tailwind CSS v4
- **Admin dashboard** — Protected routes for managing all site content
- **Book a Consultation** — Configurable booking URL (`calendlyUrl` in settings) with Calendly popup widget support; admin scheduling settings at `/admin/settings`
- **Responsive design** — Mobile-first with adaptive layouts across all pages
- **Boot loader** — Tech-aesthetic splash screen during initial load

---

## Tech Stack

| Category            | Technology                          |
|---------------------|-------------------------------------|
| Framework           | React 19 + TypeScript               |
| Build Tool          | Vite 6                              |
| Styling             | Tailwind CSS 4 (`@tailwindcss/vite`)|
| Routing             | React Router DOM 7                  |
| HTTP Client         | Axios                               |
| Animations          | GSAP 3 + ScrollTrigger              |
| Smooth Scroll       | Lenis                               |
| Icons               | Lucide React                        |
| Rich Text Editor    | Tiptap (for admin)                  |
| SEO                 | react-helmet-async                  |
| Linting             | oxlint                              |

---

## Prerequisites

- **Node.js** `>= 20.19.0`
- **npm** (or any compatible package manager)
- A running backend API server (see [API Layer](#api-layer))

---

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd awad23/web
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables** (see [Environment Variables](#environment-variables)):

   Create a `.env` file in the project root (see below).

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

---

## Environment Variables

### Vite Proxy Configuration

The Vite dev server proxies API requests (`/api/*`) to the backend. The default target in `vite.config.ts` is the hosted API (`https://backendawad23.maktechgroup.tech`). For local backend development, point the proxy at `http://localhost:4000`:

```ts
// vite.config.ts
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:4000', // or your deployed API URL
      changeOrigin: true,
    },
  },
},
```

Start the API server from `awad23/server` (`npm run dev`) and ensure `CORS_ORIGIN` includes `http://localhost:5173`.

### `.env` File

For production builds or to override the API base URL, create a `.env` file in the project root. The demo setup uses a Vite proxy to forward `/api` requests, so no additional env var is required for local development. For production, set the target explicitly:

```env
VITE_API_BASE=https://your-backend.com/api
```

> **Note:** Vite only exposes variables prefixed with `VITE_` to client-side code. The Axios instance in `src/lib/api.ts` uses a hardcoded `baseURL: '/api'`, which works through the Vite proxy in development. For production, wire up the `VITE_API_BASE` variable accordingly.

---

## Available Scripts

| Script          | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Start Vite development server        |
| `npm run build` | Run TypeScript compilation + Vite build (production) |
| `npm run preview` | Serve the built output locally     |
| `npm run lint`  | Run oxlint linter                    |
| `npm run start` | Run Vite preview with host binding   |

---

## Project Structure

```
awad23/web/
├── index.html                    # Root HTML entry point
├── vite.config.ts               # Vite config with proxy settings
├── package.json
├── tsconfig.json                 # Base TS config
├── tsconfig.app.json             # App-specific TS config
├── tsconfig.node.json            # Node config TS config
├── public/                       # Static assets
│   ├── favicon.svg
│   ├── icons.svg
│   ├── boot-loader.css           # Splash screen styles
│   ├── *.png                     # Brand images, award photos
│   └── p1–p9.png                 # Partner logos for marquee
└── src/
    ├── main.tsx                  # React entry point (root render)
    ├── App.tsx                   # App component (routes + providers)
    ├── types.ts                  # All shared TypeScript types + utility
    ├── index.css                 # Global styles + Tailwind imports
    ├── assets/                   # Imported images (e.g., award.png)
    ├── api/ → lib/api.ts         # (Alias target)
    ├── lib/
    │   ├── api.ts                # Axios instance + publicApi + adminApi
    │   ├── auth.ts               # Session/localStorage auth helpers
    │   └── calendly.ts           # Calendly widget + URL normalization
    ├── context/
    │   ├── LocaleContext.tsx     # en/ar locale, RTL, pathFor()
    │   └── SiteContext.tsx       # All site data (settings, content)
    ├── components/
    │   ├── Seo.tsx               # Helmet-based SEO head management
    │   ├── PageReveal.tsx        # GSAP entrance reveal
    │   ├── SmoothScroll.tsx      # Lenis scroll + ScrollTrigger glue
    │   ├── JournalCard.tsx       # Reusable blog post card
    │   ├── layout/
    │   │   ├── PublicLayout.tsx  # Switches between homepage/journal/work/inner layouts
    │   │   ├── Navbar.tsx        # Desktop + mobile nav with service dropdown
    │   │   ├── Nav.tsx           # Dark variant nav (used on journal/work pages)
    │   │   ├── Footer.tsx        # Inner-page footer
    │   │   ├── SiteEffects.tsx   # Scroll progress bar + film grain
    │   │   └── ScrollToTop.tsx   # Floating scroll-to-top button
    │   ├── site/                 # Homepage section components
    │   │   ├── Hero.tsx          # Hero section with animated headline
    │   │   ├── About.tsx         # About section
    │   │   ├── Services.tsx      # Services overview
    │   │   ├── Process.tsx       # 3-step work process
    │   │   ├── Portfolio.tsx     # Featured projects (hardcoded)
    │   │   ├── Testimonials.tsx  # Testimonial carousel
    │   │   ├── Blog.tsx          # Blog preview (hardcoded)
    │   │   ├── Contact.tsx       # Newsletter subscribe
    │   ├── tech/                 # UI primitives + tech showcase
    │   │   ├── index.ts          # Barrel exports
    │   │   ├── TechButton.tsx    # Link/button component (router + anchor + button)
    │   │   ├── ConnectButton.tsx # Calendly-aware button
    │   │   ├── GlassCard.tsx     # Glass-morphism card
    │   │   ├── TechMarquee.tsx   # Partner logo scrolling marquee
    │   │   ├── TechGridBg.tsx    # Diagonal grid background
    │   │   ├── AnimatedCounter.tsx # Number counter with Arabic numeral support
    │   │   ├── BrandLogo.tsx     # "AI" mark + brand name
    │   │   ├── ArrowIcon.tsx     # SVG arrow
    │   │   ├── SectionHeading.tsx # Section header component
    │   │   ├── MissionBlock.tsx  # Mission + tech experience strip
    │   │   ├── ExperienceStrip.tsx
    │   │   ├── HomeNewsletter.tsx # Newsletter form (API-connected)
    │   │   └── HeroParticles.tsx # Canvas particle background
    │   └── admin/
    │       ├── ImagePicker.tsx    # Image upload + media library
    │       └── RichTextEditor.tsx # Tiptap-based editor
    ├── hooks/
    │   ├── useCalendly.ts         # Calendly widget lifecycle
    │   └── useReveal.ts           # GSAP scroll-reveal hook
    ├── context/                   # (context files listed above)
    ├── data/
    │   └── fallback.ts            # All fallback content (settings, services, posts, gallery, testimonials)
    └── pages/
        ├── HomePage.tsx
        ├── AboutPage.tsx
        ├── ServicesPage.tsx
        ├── ServicePage.tsx        # Individual service detail (fetches by slug)
        ├── ProductPage.tsx        # Product detail (fetches by slug)
        ├── JournalPage.tsx        # Currently renders JournalPostPage (see Notes)
        ├── JournalPostPage.tsx    # Blog post detail (hardcoded fallback content)
        ├── GalleryPage.tsx        # Portfolio listing (uses live data)
        ├── CaseStudyPage.tsx      # Full case study (uses live data with extensive defaults)
        ├── ContactPage.tsx        # Contact form (API-connected)
        ├── BookCallPage.tsx       # Booking page with Calendly integration
        └── admin/
            ├── adminRoutes.ts       # Centralized admin path constants
            ├── AdminLayout.tsx      # Sidebar shell (Blogs, Portfolio, Newsletter, Settings)
            ├── AdminLoginPage.tsx
            ├── AdminHomepagePage.tsx
            ├── AdminServicesPage.tsx
            ├── AdminPostsPage.tsx   # Routed at /admin/blogs
            ├── AdminGalleryPage.tsx # Routed at /admin/portfolio
            ├── AdminMessagesPage.tsx
            ├── AdminNewsletterPage.tsx
            └── AdminSettingsPage.tsx # Scheduling / booking URL config
```

---

## Routing

Routing is configured in `src/App.tsx` using React Router v7 `Routes`. All public routes are duplicated for both English (`/path`) and Arabic (`/ar/path`) locales.

| Route (EN)         | Route (AR)       | Component          | Layout      |
|--------------------|------------------|--------------------|-------------|
| `/`                | `/ar`            | `HomePage`         | Public      |
| `/about`           | `/ar/about`      | `AboutPage`        | Public      |
| `/services`        | `/ar/services`   | `ServicesPage`     | Public      |
| `/services/:slug`  | `/ar/services/:slug` | `ServicePage`  | Public      |
| `/product/:slug`   | `/ar/product/:slug` | `ProductPage`   | Public      |
| `/journal`         | `/ar/journal`    | `JournalPage`      | Public      |
| `/journal/:slug`   | `/ar/journal/:slug` | `JournalPostPage`| Public      |
| `/work`            | `/ar/work`       | `GalleryPage`      | Public      |
| `/work/:slug`      | `/ar/work/:slug` | `CaseStudyPage`    | Public      |
| `/gallery`         | `/ar/gallery`    | (redirect → `/work`) | Public   |
| `/book`            | `/ar/book`       | `BookCallPage`     | Public      |
| `/contact`         | `/ar/contact`    | `ContactPage`      | Public      |
| `/admin/login`     | —                | `AdminLoginPage`   | None        |
| `/admin/*`         | —                | `AdminLayout` + nested | Admin    |
| `*`                | —                | (redirect → `/`)   | Public      |

**Public layout selection** (`src/components/layout/PublicLayout.tsx`):
- **Home** (`/`): Minimal — `SmoothScroll` wrapper with `Outlet` only
- **Journal & Work pages**: `Nav` (dark variant), `SiteEffects`, white background
- **All other inner pages**: `Navbar`, `SiteEffects`, `TechGridBg`, `Footer`, `HomeNewsletter`

---

## API Layer

The API is built with Axios in `src/lib/api.ts`. It uses a shared instance with a **JWT token refresh interceptor** that automatically retries failed requests with a refreshed token.

### Endpoints

**Public API** (`publicApi`) — all return fallback data on failure:

| Method  | Endpoint                   | Description                          |
|---------|----------------------------|--------------------------------------|
| `GET`   | `/settings`                | Site-wide settings                   |
| `GET`   | `/pages`                   | Homepage sections                      |
| `GET`   | `/services`                | List all published services          |
| `GET`   | `/services/:slug`          | Single service                       |
| `GET`   | `/products`                | List all published products          |
| `GET`   | `/products/:slug`          | Single product                       |
| `GET`   | `/posts`                   | List all published posts             |
| `GET`   | `/posts/:slug`             | Single post                          |
| `GET`   | `/gallery`                 | List all published gallery items     |
| `GET`   | `/testimonials`            | List all testimonials                |
| `POST`  | `/newsletter/subscribe`    | Subscribe to newsletter              |
| `POST`  | `/contact`                 | Send a contact message               |

**Admin API** (`adminApi`) — requires authentication:

| Method  | Endpoint                     | Description                          |
|---------|------------------------------|--------------------------------------|
| `POST`  | `/auth/login`                | Login (returns access + refresh tokens)|
| `GET`   | `/auth/me`                   | Get current admin user               |
| `POST`  | `/auth/refresh`              | Refresh access token                 |
| `POST`  | `/auth/logout`               | Logout                               |
| `GET`   | `/contact/stats`             | Dashboard stats                      |
| `PUT`   | `/settings`                  | Update site settings                 |
| `GET`   | `/pages`                     | Get all homepage sections            |
| `PUT`   | `/pages/:key`                | Update a homepage section            |
| `GET`   | `/services?all=1`            | Get all services (incl. drafts)      |
| `POST`  | `/services`                  | Create a service                     |
| `PUT`   | `/services/:id`              | Update a service                     |
| `DELETE`| `/services/:id`              | Delete a service                     |
| `GET`   | `/posts?all=1`               | Get all posts (incl. drafts)         |
| `POST`  | `/posts`                     | Create a post                        |
| `PUT`   | `/posts/:id`                 | Update a post                        |
| `DELETE`| `/posts/:id`                 | Delete a post                        |
| `GET`   | `/gallery?all=1`             | Get all gallery items                |
| `POST`  | `/gallery`                   | Create a gallery/portfolio item      |
| `PUT`   | `/gallery/:id`               | Update a gallery item                |
| `DELETE`| `/gallery/:id`               | Delete a gallery item                |
| `GET`   | `/media`                     | List all uploaded media              |
| `POST`  | `/media/upload`              | Upload a file                        |
| `POST`  | `/media/url`                 | Register a remote URL as media       |
| `GET`   | `/newsletter`                | List all subscribers                 |
| `GET`   | `/newsletter/export`         | Export subscribers (CSV blob)        |
| `GET`   | `/contact`                   | List all contact messages            |
| `PATCH` | `/contact/:id/read`          | Mark message as read                 |
| `DELETE`| `/contact/:id`               | Delete a message                     |
| `GET`   | `/testimonials?all=1`        | Get all testimonials                 |
| `POST`  | `/testimonials`              | Create a testimonial                 |
| `PUT`   | `/testimonials/:id`          | Update a testimonial                 |
| `DELETE`| `/testimonials/:id`          | Delete a testimonial                 |
| `GET`   | `/calendly/auth-url`         | *(client stub — not implemented on server)* |
| `GET`   | `/calendly/status`           | *(client stub — not implemented on server)* |
| `POST`  | `/calendly/sync`             | *(client stub — not implemented on server)* |
| `POST`  | `/calendly/disconnect`       | *(client stub — not implemented on server)* |

> **Booking URL:** The live booking link is stored as `calendlyUrl` on `SiteSettings` and updated via `PUT /api/settings`. The frontend reads it through `SiteContext` and `useCalendly` / `ConnectButton`. `AdminSettingsPage` currently calls `/api/admin/scheduling`, which is **not** implemented — it should use `PUT /api/settings` instead.

### Auth

Auth tokens are stored in `localStorage`:

| Key                | Value                  |
|--------------------|------------------------|
| `awad_access_token`| JWT access token       |
| `awad_refresh_token`| Refresh token         |
| `awad_admin`       | JSON string of admin info |

The refresh interceptor (`api.ts:39-86`) queues pending requests while a refresh is in-flight and redirects to `/admin/login` on fatal auth failure.

---

## Bilingual Support (i18n)

Internationalization is handled by `LocaleContext.tsx`. There is no external i18n library — instead, every user-facing string uses a `t(en, ar)` function that returns the appropriate translation based on the current locale.

**Locale detection**:
- Arabic is determined by checking if the URL path starts with `/ar`
- The locale is set on `<html lang>` and `<html dir>` via an effect
- The user's preference is persisted to `localStorage` (`awad_locale`)

**Path handling** (`pathFor`):
- Converts a path to include the `/ar` prefix when in Arabic
- Strips `/ar` when in English
- Prevents double-prefixing (e.g., `/ar/ar/path`)

**Arabic numerals**: `AnimatedCounter` converts Western digits to Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) for RTL display.

**CSS**: Tailwind's `dir` attribute and custom `[dir="rtl"]` selectors handle RTL styling. Fonts switch based on direction:
- LTR: `DM Sans` (body) + `Lora` (display)
- RTL: `Tajawal` (everything)

---

## Global State

The app uses two context providers, nested in `src/App.tsx`:

```tsx
<SiteProvider>
  <LocaleProvider>
    {children}
  </LocaleProvider>
</SiteProvider>
```

### SiteContext (`src/context/SiteContext.tsx`)

Holds all site-wide data with automatic fetching on mount:

- `settings: SiteSettings` — brand info, contact, SEO, social, `calendlyUrl` (booking/consultation link)
- `sections: HomeSection[]` — homepage section definitions
- `services: Service[]` — published services
- `products: Product[]` — published products
- `posts: Post[]` — published posts
- `gallery: GalleryItem[]` — published portfolio items
- `testimonials: Testimonial[]` — testimonials
- `loading: boolean`
- `refresh()` — re-fetch all data
- `sectionByKey(key)` — lookup helper

**Data sanitization**: On fetch, `SiteContext` normalizes the brand name — replacing "Awad"→"Ibrahim" in English and "عوض"→"إبراهيم" in Arabic to maintain brand consistency. It also fills in missing images from local fallback data.

### LocaleContext (`src/context/LocaleContext.tsx`)

- `locale: Locale` (`'en'` | `'ar'`)
- `isRtl: boolean`
- `setLocale(locale)` — navigate to the localized path
- `toggleLocale()` — switch between EN and AR
- `pathFor(path, localeOverride?)` — localize a path
- `t(en, ar)` — translate a string

---

## Admin Panel

The admin dashboard is at `/admin/login` and is protected by a localStorage-based session check (`isLoggedIn()`). After login, the default landing route is `/admin/blogs`.

**Access**: Navigate to `http://localhost:5173/admin/login` and enter credentials seeded on the backend (`ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env`).

### Sidebar navigation

The admin sidebar (`AdminLayout.tsx`) shows:

| Item        | Route               |
|-------------|---------------------|
| Blogs       | `/admin/blogs`      |
| Portfolio   | `/admin/portfolio`  |
| Newsletter  | `/admin/newsletter` |
| Settings    | `/admin/settings`   |

Legacy paths `/admin/posts` and `/admin/gallery` redirect to the routes above.

### All admin routes

| Section       | Route                    | Capabilities                                      |
|---------------|--------------------------|--------------------------------------------------|
| **Blogs**     | `/admin/blogs`           | List, create, edit blog posts                     |
| **Portfolio** | `/admin/portfolio`       | Tabbed case study builder (7 tabs), media upload  |
| **Newsletter**| `/admin/newsletter`      | View/export subscriber list                       |
| **Settings**  | `/admin/settings`        | Booking platform + scheduling URL configuration   |
| **Homepage**  | `/admin/homepage`        | Edit homepage sections (not in sidebar)           |
| **Services**  | `/admin/services`        | CRUD services (not in sidebar)                    |
| **Messages**  | `/admin/messages`        | Contact inbox (not in sidebar)                    |

### Scheduling settings (`AdminSettingsPage`)

`/admin/settings` lets admins pick a booking platform (Calendly, Cal.com, SavvyCal, Acuity, or custom) and save the corresponding URL. The public site uses `settings.calendlyUrl` from `GET /api/settings` for **Book a Consultation** CTAs (`ConnectButton`, `/book` page).

**Intended flow:**

```
Admin Settings → PUT /api/settings { calendlyUrl }
  → PostgreSQL SiteSettings
  → GET /api/settings
  → SiteContext
  → useCalendly / ConnectButton
  → Calendly URL → popup widget | other URL → window.open
```

> The settings page currently posts to `/api/admin/scheduling`, which does not exist on the backend. Wire it to `adminApi` / `PUT /api/settings` with the `calendlyUrl` field.

### Portfolio Builder (`AdminGalleryPage`)

The gallery admin is the most sophisticated component. It features a **7-tab form** for building full case study pages:

1. **Overview** — Titles, slug, tag, excerpts, hero image, client/role/duration, screenshots, publish toggle
2. **Challenge** — Section headings (EN/AR), badge label, challenge items (icon + title + body), image upload
3. **Approach** — Section body (EN/AR), approach cards (title + bullet list), architectural insight
4. **Leadership** — Section body (EN/AR), leadership cards (icon + title + body), banner stat
5. **Solution** — Section body (EN/AR), feature cards (color-coded with badge), architecture diagram
6. **Outcome** — Outcome items (color-coded), recognition image + label
7. **Skills** — Skill cards (number + category + title + body)

Features: drag-and-drop image upload, media library, live URL preview, draft/published toggle, tab navigation with prev/next.

### Content Fallback

All admin operations gracefully handle API failures. The `SiteContext` always starts with `fallback.ts` data and replaces it with live API data when available.

---

## Styling & Animations

### Tailwind CSS v4

Tailwind is imported via `@tailwindcss/vite` plugin (no separate `tailwind.config.js` needed — configuration is handled through CSS `@layer` and `@theme` directives in `src/index.css`).

Key customizations in `src/index.css`:
- CSS variable theme with brand colors: `--forest` (`#064738`), `--sky` (`#35bffb`)
- Custom font variables: `--font-display` (Lora), `--font-sans` (DM Sans), `--font-ar` (Tajawal)
- Color aliases: `--color-forest`, `--color-accent`, `--color-ink`, `--color-canvas`

### Animations

Custom CSS keyframes defined in `src/index.css`:
- `marquee` / `animate-marquee` — partner logo scroll
- `glass-shine` / `animate-glass-shine` — glassmorphism highlight sweep
- `text-glass-shimmer` / `animate-text-glass` — gradient text shimmer
- `wave-bounce` / `animate-wave-char` — character wave animation
- `hero-title-wave` / `animate-hero-title-wave` — per-word color flash
- `journey-beam` / `animate-journey-beam` — timeline beam sweep

### GSAP + Lenis

- `SmoothScroll` (`SmoothScroll.tsx`) initializes Lenis and bridges its scroll events to GSAP `ScrollTrigger` for scroll-based animations
- `useReveal` hook triggers one-time fade/scale/slide animations on scroll
- `PageReveal` provides staggered entrance for page headers
- `ScrollReveal` (CSS-transition based) handles simpler reveal animations

### Boot Loader

`public/boot-loader.css` defines a tech-aesthetic splash screen with grid background, spinning rings, hexagonal core, scanlines, and a progress bar. It's shown while the app loads and fades out once ready.

---

## Deployment

### Building for Production

```bash
npm run build
```

This runs `tsc -b && vite build` — type-checking first, then Vite bundling. Output goes to `dist/`.

### Serving

```bash
npm run start
```

Or with the preview server:

```bash
npm run preview
```

The preview server binds to `0.0.0.0` (all interfaces) and defaults to port 3000 (settable via the `PORT` env var).

### Production Considerations

- Ensure the backend API is accessible at the configured `/api` proxy target
- Set the booking URL via `PUT /api/settings` (`calendlyUrl` field) or the admin Settings page once wired to the API
- Calendly popup requires a valid event URL (not the bare `calendly.com` homepage)
- For static hosting, configure the server to redirect all non-API routes (including `/ar/*`) to `index.html` for client-side routing

---

## Data Types

Core types are defined in `src/types.ts`:

| Type              | Description                                      |
|-------------------|--------------------------------------------------|
| `Locale`          | `'en' \| 'ar'`                                   |
| `SiteSettings`    | Brand, contact, SEO, social, `calendlyUrl` (booking link) |
| `HomeSection`     | A homepage section (hero, mission, about, etc.)  |
| `Service`         | Service with EN/AR fields, features, images      |
| `Product`         | Product with EN/AR fields and pricing            |
| `Post`            | Blog post with EN/AR content, cover, category    |
| `GalleryItem`     | Portfolio/case study with full multi-section schema (challenge, approach, leadership, solution, outcome, skills) |
| `Testimonial`     | Customer testimonial with EN/AR fields           |
| `ChallengeItem`   | Icon + title + body for case study challenge     |
| `ApproachCard`    | Title + bullet points for methodology section    |
| `LeadershipCard`  | Icon + title + body for technical leadership     |
| `SolutionCard`    | Color variant + tag + title + body               |
| `OutcomeItem`     | Color variant + text for results                 |
| `SkillCard`       | Number + category + title + body                 |

### Utility: `pick()`

```ts
export function pick(item: object, locale: Locale, field: string): string
```

Helper that selects the locale-appropriate field (`fieldEn` or `fieldAr`) from any item object. Used throughout all page components.

---

## Notes & Known Considerations

1. **`JournalPage`** currently delegates to `JournalPostPage` without passing a slug. To display a journal listing page, `JournalPage` should render `JournalCard` components from `useSite().posts` rather than directly rendering a single post.

2. **`Blog.tsx` (homepage)** uses hardcoded post previews rather than data from `SiteContext.posts`. Consider populating from live data.

3. **`Portfolio.tsx` (homepage)** uses hardcoded project cards rather than the live `gallery` data from `SiteContext`.

4. **Arabic translation keys** in some components (e.g., `Blog.tsx`) contain "أحمد عوض" instead of "أحمد إبراهيم". The `SiteContext` normalizes the brand name from the API, but hardcoded strings in components bypass this normalization.

5. The admin `AdminPostsPage` uses local component state for blog management and does not connect to the live API.

6. CSS classes like `.tech-btn`, `.ref-*`, `.field`, `.book-page`, `.page-hero__*`, etc. are used across public and admin pages but are only partially defined in `index.css`. Some layouts (e.g. `/book`, admin Settings form fields) may appear unstyled until shared site CSS is added.

7. **`AdminSettingsPage`** uses `fetch('/api/admin/scheduling')` instead of `PUT /api/settings`. Until refactored, saving scheduling settings from the admin UI will fail against the current backend.

8. **Monorepo layout:** Frontend lives in `awad23/web`, API in `awad23/server`. See `server/README.md` for API documentation.
