export type Locale = 'en' | 'ar';

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

export type SchedulingPlatform = 'calendly' | 'calcom' | 'savvycal' | 'acuity' | 'custom';

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
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
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
  title: string;
  body: string;
}

export interface ApproachCard {
  title: string;
  bullets: string[];
}

export interface LeadershipCard {
  iconName: string;
  title: string;
  body: string;
}

export interface SolutionCard {
  color: 'green' | 'blue' | 'orange' | 'purple';
  tag: string;
  title: string;
  body: string;
}

export interface OutcomeItem {
  color: 'emerald' | 'purple' | 'amber';
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
  heroImageUrl?: string;
  client?: string;
  role?: string;
  duration?: string;

  // Challenge
  challengeHeadingEn?: string;
  challengeHeadingAr?: string;
  challengeBodyEn?: string;
  challengeBodyAr?: string;
  challengeItems?: ChallengeItem[];
  challengeImageUrl?: string;
  challengeCaption?: string;
  challengeBadgeLabel?: string;

  // Approach
  approachBodyEn?: string;
  approachBodyAr?: string;
  approachCards?: ApproachCard[];
  approachInsight?: string;

  // Technical Leadership
  leadershipBodyEn?: string;
  leadershipBodyAr?: string;
  leadershipCards?: LeadershipCard[];
  leadershipBannerStat?: string;

  // Solution Delivered
  solutionBodyEn?: string;
  solutionBodyAr?: string;
  solutionCards?: SolutionCard[];
  solutionArchImageUrl?: string;
  solutionArchTitle?: string;
  solutionArchBody?: string;

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

export function pick(
  item: object,
  locale: Locale,
  field: string
): string {
  const key = `${field}${locale === 'ar' ? 'Ar' : 'En'}`;
  const value = (item as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : '';
}
