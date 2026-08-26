export type Locale = "en" | "ar";

export interface SiteSettings {
  id: string;
  brandName: string;
  logoUrl?: string | null;
  taglineEn: string;
  taglineAr: string;
  contactEmail: string;
  contactPhone?: string | null;
  calendlyUrl: string;
  calendlyConnectedAt?: string | null;
  socialInstagram?: string | null;
  socialLinkedin?: string | null;
  socialYoutube?: string | null;
  socialTwitter?: string | null;
  seoTitleEn: string;
  seoTitleAr: string;
  seoDescriptionEn: string;
  seoDescriptionAr: string;
  aboutImageUrl?: string | null;
  showreelUrl?: string | null;
  showreelPoster?: string | null;
}

export type SchedulingPlatform =
  | "calendly"
  | "calcom"
  | "savvycal"
  | "acuity"
  | "custom";

export interface SchedulingSettings {
  id: string;
  platform: SchedulingPlatform;
  isEnabled: boolean;
  calendlyUrl?: string;
  calComUsername?: string;
  savvyCalUsername?: string;
  acuityUserId?: string;
  customLink?: string;
  buttonText: string;
  buttonColor?: string | null;
  bookingUrl: string;
}

export interface HomeSection {
  id: string;
  key: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  bodyEn: string;
  bodyAr: string;
  ctaLabelEn: string;
  ctaLabelAr: string;
  ctaLink: string;
  imageUrl?: string | null;
  order: number;
}

export interface Service {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string;
  bodyAr: string;
  featuresEn: string[];
  featuresAr: string[];
  imageUrl?: string | null;
  order: number;
  published: boolean;
}

export interface Post {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string;
  bodyAr: string;
  coverImage?: string | null;
  categoryEn: string;
  categoryAr: string;
  seoTitleEn?: string | null;
  seoTitleAr?: string | null;
  seoDescriptionEn?: string | null;
  seoDescriptionAr?: string | null;
  status: string;
  readTimeMinutes?: number | null;
  authorName?: string | null;
  authorRole?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string;
  bodyAr: string;
  imageUrl?: string | null;
  priceLabelEn?: string | null;
  priceLabelAr?: string | null;
  order: number;
  published: boolean;
}

export interface ChallengeItem {
  iconName: string;
  title?: string;
  titleEn?: string;
  titleAr?: string;
  body?: string;
  bodyEn?: string;
  bodyAr?: string;
}

export interface ApproachCard {
  titleEn?: string;
  titleAr?: string;
  bodyEn?: string;
  bodyAr?: string;
  bulletsEn?: string[];
  bulletsAr?: string[];
}

export interface LeadershipCard {
  iconName: string;
  title?: string;
  titleEn?: string;
  titleAr?: string;
  body?: string;
  bodyEn?: string;
  bodyAr?: string;
}

export interface SolutionCard {
  color: "green" | "blue" | "orange" | "purple";
  tag?: string;
  tagEn?: string;
  tagAr?: string;
  title?: string;
  titleEn?: string;
  titleAr?: string;
  body?: string;
  bodyEn?: string;
  bodyAr?: string;
}

export interface OutcomeItem {
  color: "emerald" | "purple" | "amber";
  text: string;
}

export interface SkillCard {
  num: string;
  category: string;
  title: string;
  body: string;
}

export interface GalleryItem {
  id: string;
  titleEn: string;
  titleAr: string;
  slug: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string;
  bodyAr: string;
  order: number;
  published: boolean;
  media: {
    id: string;
    type: string;
    url: string;
    altEn: string;
    altAr: string;
  };

  // Overview / Hero
  tag?: string;
  tagStyle?: string;
  subEn?: string;
  subAr?: string;
  heroImageUrl?: string;
  client?: string;
  role?: string;
  roleEn?: string;
  roleAr?: string;
  duration?: string;
  durationEn?: string;
  durationAr?: string;

  // Challenge
  challengeHeadingEn?: string;
  challengeHeadingAr?: string;
  challengeBodyEn?: string;
  challengeBodyAr?: string;
  challengeItems?: ChallengeItem[];
  challengeImageUrl?: string;
  challengeCaption?: string;
  challengeCaptionEn?: string;
  challengeCaptionAr?: string;
  challengeBadgeLabel?: string;

  // Approach
  approachBodyEn?: string;
  approachBodyAr?: string;
  approachCards?: ApproachCard[];
  approachInsightEn?: string;
  approachInsightAr?: string;

  // Technical Leadership
  leadershipBodyEn?: string;
  leadershipBodyAr?: string;
  leadershipCards?: LeadershipCard[];
  leadershipBannerStat?: string;
  leadershipBannerStatEn?: string;
  leadershipBannerStatAr?: string;

  // Solution Delivered
  solutionBodyEn?: string;
  solutionBodyAr?: string;
  solutionCards?: SolutionCard[];
  solutionArchImageUrl?: string;
  solutionArchTitle?: string;
  solutionArchTitleEn?: string;
  solutionArchTitleAr?: string;
  solutionArchBody?: string;
  solutionArchBodyEn?: string;
  solutionArchBodyAr?: string;

  // Outcome
  outcomeItems?: OutcomeItem[];
  recognitionImageUrl?: string;
  recognitionLabel?: string;

  // Key Skills
  skillCards?: SkillCard[];

  // Project Screenshots (multi-upload)
  screenshots?: string[];
}

export interface Testimonial {
  id: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  quoteEn: string;
  quoteAr: string;
  avatarUrl?: string | null;
  order: number;
}

export type NewsletterSubscriberStatus =
  | "PENDING"
  | "ACTIVE"
  | "UNSUBSCRIBED"
  | "BOUNCED";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  locale: string;
  status: NewsletterSubscriberStatus;
  date: string;
  createdAt: string;
  confirmedAt: string | null;
}

export interface NewsletterStats {
  totalSubscribers: number;
  newThisMonth: number;
  latestSubscription: { email: string; date: string } | null;
}

export function formatNewsletterStatus(
  status: NewsletterSubscriberStatus,
): string {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "PENDING":
      return "Pending confirmation";
    case "UNSUBSCRIBED":
      return "Unsubscribed";
    case "BOUNCED":
      return "Bounced";
    default:
      return status;
  }
}

export function pick(item: object, locale: Locale, field: string): string {
  const key = `${field}${locale === "ar" ? "Ar" : "En"}`;
  const value = (item as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}
