import { isBlobUrl, resolveMediaUrl } from './api';
import type {
  ApproachCard,
  ChallengeItem,
  GalleryItem,
  LeadershipCard,
  OutcomeItem,
  SkillCard,
  SolutionCard,
} from '../types';

/** Tab-grouped create/update body — matches Postman canonical shape. */
export interface PortfolioPayloadByTab {
  overview: {
    titleEn: string;
    titleAr: string;
    slug: string;
    tag: string;
    excerptEn: string;
    excerptAr: string;
    heroImageUrl: string;
    client: string;
    role: string;
    duration: string;
    screenshots: string[];
    published: boolean;
  };
  challenge: {
    challengeHeadingEn: string;
    challengeHeadingAr: string;
    challengeBodyEn: string;
    challengeBodyAr: string;
    challengeBadgeLabel: string;
    challengeImageUrl: string;
    challengeCaption: string;
    challengeItems: ChallengeItem[];
  };
  approach: {
    approachBodyEn: string;
    approachBodyAr: string;
    approachInsight: string;
    approachCards: ApproachCard[];
  };
  leadership: {
    leadershipBodyEn: string;
    leadershipBodyAr: string;
    leadershipBannerStat: string;
    leadershipCards: LeadershipCard[];
  };
  solution: {
    solutionBodyEn: string;
    solutionBodyAr: string;
    solutionArchImageUrl: string;
    solutionArchTitle: string;
    solutionArchBody: string;
    solutionCards: SolutionCard[];
  };
  outcome: {
    recognitionImageUrl: string;
    recognitionLabel: string;
    outcomeItems: OutcomeItem[];
  };
  skills: {
    skillCards: SkillCard[];
  };
}

export interface PortfolioForm {
  titleEn: string;
  titleAr: string;
  slug: string;
  tag: string;
  published: boolean;
  excerptEn: string;
  excerptAr: string;
  heroImageUrl: string;
  client: string;
  role: string;
  duration: string;
  screenshots: string[];
  challengeHeadingEn: string;
  challengeHeadingAr: string;
  challengeBodyEn: string;
  challengeBodyAr: string;
  challengeItems: ChallengeItem[];
  challengeImageUrl: string;
  challengeCaption: string;
  challengeBadgeLabel: string;
  approachBodyEn: string;
  approachBodyAr: string;
  approachCards: ApproachCard[];
  approachInsight: string;
  leadershipBodyEn: string;
  leadershipBodyAr: string;
  leadershipCards: LeadershipCard[];
  leadershipBannerStat: string;
  solutionBodyEn: string;
  solutionBodyAr: string;
  solutionCards: SolutionCard[];
  solutionArchImageUrl: string;
  solutionArchTitle: string;
  solutionArchBody: string;
  outcomeItems: OutcomeItem[];
  recognitionImageUrl: string;
  recognitionLabel: string;
  skillCards: SkillCard[];
}

function isTabGroupedItem(
  item: unknown,
): item is PortfolioPayloadByTab & { id: string; order?: number; media?: GalleryItem['media'] } {
  return Boolean(item && typeof item === 'object' && 'overview' in item);
}

function persistableUrls(urls: string[]): string[] {
  return urls.filter((u) => u && !isBlobUrl(u));
}

function withResolvedMediaUrl(url: string | undefined): string {
  return url ? resolveMediaUrl(url) : '';
}

function withResolvedMediaUrls(urls: string[] | undefined): string[] {
  return (urls ?? []).map((url) => resolveMediaUrl(url));
}

/** Convert flat form state → tab-grouped API payload (Postman canonical shape). */
export function portfolioFormToPayload(form: PortfolioForm): PortfolioPayloadByTab {
  return {
    overview: {
      titleEn: form.titleEn,
      titleAr: form.titleAr,
      slug: form.slug,
      tag: form.tag,
      excerptEn: form.excerptEn,
      excerptAr: form.excerptAr,
      heroImageUrl: form.heroImageUrl,
      client: form.client,
      role: form.role,
      duration: form.duration,
      screenshots: persistableUrls(form.screenshots),
      published: form.published,
    },
    challenge: {
      challengeHeadingEn: form.challengeHeadingEn,
      challengeHeadingAr: form.challengeHeadingAr,
      challengeBodyEn: form.challengeBodyEn,
      challengeBodyAr: form.challengeBodyAr,
      challengeBadgeLabel: form.challengeBadgeLabel,
      challengeImageUrl: form.challengeImageUrl,
      challengeCaption: form.challengeCaption,
      challengeItems: form.challengeItems,
    },
    approach: {
      approachBodyEn: form.approachBodyEn,
      approachBodyAr: form.approachBodyAr,
      approachInsight: form.approachInsight,
      approachCards: form.approachCards,
    },
    leadership: {
      leadershipBodyEn: form.leadershipBodyEn,
      leadershipBodyAr: form.leadershipBodyAr,
      leadershipBannerStat: form.leadershipBannerStat,
      leadershipCards: form.leadershipCards,
    },
    solution: {
      solutionBodyEn: form.solutionBodyEn,
      solutionBodyAr: form.solutionBodyAr,
      solutionArchImageUrl: form.solutionArchImageUrl,
      solutionArchTitle: form.solutionArchTitle,
      solutionArchBody: form.solutionArchBody,
      solutionCards: form.solutionCards,
    },
    outcome: {
      recognitionImageUrl: form.recognitionImageUrl,
      recognitionLabel: form.recognitionLabel,
      outcomeItems: form.outcomeItems,
    },
    skills: {
      skillCards: form.skillCards,
    },
  };
}

/** Normalize tab-grouped or flat API item → flat form state. */
export function portfolioItemToForm(
  item: GalleryItem | (PortfolioPayloadByTab & { id: string }),
  empty: PortfolioForm,
): PortfolioForm {
  if (isTabGroupedItem(item)) {
    const { overview, challenge, approach, leadership, solution, outcome, skills } = item;
    return {
      titleEn: overview.titleEn,
      titleAr: overview.titleAr,
      slug: overview.slug,
      tag: overview.tag || 'Case Study',
      published: overview.published,
      excerptEn: overview.excerptEn,
      excerptAr: overview.excerptAr,
      heroImageUrl: overview.heroImageUrl || '',
      client: overview.client || '',
      role: overview.role || '',
      duration: overview.duration || '',
      screenshots: overview.screenshots || [],
      challengeHeadingEn: challenge.challengeHeadingEn || 'The Challenge',
      challengeHeadingAr: challenge.challengeHeadingAr || '',
      challengeBodyEn: challenge.challengeBodyEn || '',
      challengeBodyAr: challenge.challengeBodyAr || '',
      challengeItems: challenge.challengeItems?.length
        ? challenge.challengeItems
        : empty.challengeItems,
      challengeImageUrl: challenge.challengeImageUrl || '',
      challengeCaption: challenge.challengeCaption || '',
      challengeBadgeLabel: challenge.challengeBadgeLabel || 'CRITICAL',
      approachBodyEn: approach.approachBodyEn || '',
      approachBodyAr: approach.approachBodyAr || '',
      approachCards: approach.approachCards?.length
        ? approach.approachCards
        : empty.approachCards,
      approachInsight: approach.approachInsight || '',
      leadershipBodyEn: leadership.leadershipBodyEn || '',
      leadershipBodyAr: leadership.leadershipBodyAr || '',
      leadershipCards: leadership.leadershipCards?.length
        ? leadership.leadershipCards
        : empty.leadershipCards,
      leadershipBannerStat: leadership.leadershipBannerStat || '',
      solutionBodyEn: solution.solutionBodyEn || '',
      solutionBodyAr: solution.solutionBodyAr || '',
      solutionCards: solution.solutionCards?.length
        ? solution.solutionCards
        : empty.solutionCards,
      solutionArchImageUrl: solution.solutionArchImageUrl || '',
      solutionArchTitle: solution.solutionArchTitle || '',
      solutionArchBody: solution.solutionArchBody || '',
      outcomeItems: outcome.outcomeItems?.length
        ? outcome.outcomeItems
        : empty.outcomeItems,
      recognitionImageUrl: outcome.recognitionImageUrl || '',
      recognitionLabel: outcome.recognitionLabel || '',
      skillCards: skills.skillCards?.length ? skills.skillCards : empty.skillCards,
    };
  }

  return {
    titleEn: item.titleEn,
    titleAr: item.titleAr,
    slug: item.slug,
    tag: item.tag || 'Case Study',
    published: item.published,
    excerptEn: item.excerptEn,
    excerptAr: item.excerptAr,
    heroImageUrl: item.heroImageUrl || item.media?.url || '',
    client: item.client || '',
    role: item.role || '',
    duration: item.duration || '',
    screenshots: item.screenshots || [],
    challengeHeadingEn: item.challengeHeadingEn || 'The Challenge',
    challengeHeadingAr: item.challengeHeadingAr || '',
    challengeBodyEn: item.challengeBodyEn || '',
    challengeBodyAr: item.challengeBodyAr || '',
    challengeItems: item.challengeItems?.length ? item.challengeItems : empty.challengeItems,
    challengeImageUrl: item.challengeImageUrl || '',
    challengeCaption: item.challengeCaption || '',
    challengeBadgeLabel: item.challengeBadgeLabel || 'CRITICAL',
    approachBodyEn: item.approachBodyEn || '',
    approachBodyAr: item.approachBodyAr || '',
    approachCards: item.approachCards?.length ? item.approachCards : empty.approachCards,
    approachInsight: item.approachInsight || '',
    leadershipBodyEn: item.leadershipBodyEn || '',
    leadershipBodyAr: item.leadershipBodyAr || '',
    leadershipCards: item.leadershipCards?.length
      ? item.leadershipCards
      : empty.leadershipCards,
    leadershipBannerStat: item.leadershipBannerStat || '',
    solutionBodyEn: item.solutionBodyEn || '',
    solutionBodyAr: item.solutionBodyAr || '',
    solutionCards: item.solutionCards?.length ? item.solutionCards : empty.solutionCards,
    solutionArchImageUrl: item.solutionArchImageUrl || '',
    solutionArchTitle: item.solutionArchTitle || '',
    solutionArchBody: item.solutionArchBody || '',
    outcomeItems: item.outcomeItems?.length ? item.outcomeItems : empty.outcomeItems,
    recognitionImageUrl: item.recognitionImageUrl || '',
    recognitionLabel: item.recognitionLabel || '',
    skillCards: item.skillCards?.length ? item.skillCards : empty.skillCards,
  };
}

/** Normalize tab-grouped or flat API item → flat GalleryItem for list display. */
export function normalizeGalleryItem(raw: unknown): GalleryItem {
  const item = raw as GalleryItem & PortfolioPayloadByTab;

  if (isTabGroupedItem(item)) {
    const heroImageUrl = withResolvedMediaUrl(item.overview.heroImageUrl);
    return {
      id: item.id,
      titleEn: item.overview.titleEn,
      titleAr: item.overview.titleAr,
      slug: item.overview.slug,
      excerptEn: item.overview.excerptEn,
      excerptAr: item.overview.excerptAr,
      bodyEn: '',
      bodyAr: '',
      order: item.order ?? 0,
      published: item.overview.published,
      media: {
        id: item.media?.id ?? '',
        type: item.media?.type ?? 'image',
        url: withResolvedMediaUrl(item.media?.url || item.overview.heroImageUrl),
        altEn: item.media?.altEn ?? '',
        altAr: item.media?.altAr ?? '',
      },
      tag: item.overview.tag,
      heroImageUrl,
      client: item.overview.client,
      role: item.overview.role,
      duration: item.overview.duration,
      screenshots: withResolvedMediaUrls(item.overview.screenshots),
      challengeHeadingEn: item.challenge.challengeHeadingEn,
      challengeHeadingAr: item.challenge.challengeHeadingAr,
      challengeBodyEn: item.challenge.challengeBodyEn,
      challengeBodyAr: item.challenge.challengeBodyAr,
      challengeItems: item.challenge.challengeItems,
      challengeImageUrl: withResolvedMediaUrl(item.challenge.challengeImageUrl),
      challengeCaption: item.challenge.challengeCaption,
      challengeBadgeLabel: item.challenge.challengeBadgeLabel,
      approachBodyEn: item.approach.approachBodyEn,
      approachBodyAr: item.approach.approachBodyAr,
      approachCards: item.approach.approachCards,
      approachInsight: item.approach.approachInsight,
      leadershipBodyEn: item.leadership.leadershipBodyEn,
      leadershipBodyAr: item.leadership.leadershipBodyAr,
      leadershipCards: item.leadership.leadershipCards,
      leadershipBannerStat: item.leadership.leadershipBannerStat,
      solutionBodyEn: item.solution.solutionBodyEn,
      solutionBodyAr: item.solution.solutionBodyAr,
      solutionCards: item.solution.solutionCards,
      solutionArchImageUrl: withResolvedMediaUrl(item.solution.solutionArchImageUrl),
      solutionArchTitle: item.solution.solutionArchTitle,
      solutionArchBody: item.solution.solutionArchBody,
      outcomeItems: item.outcome.outcomeItems,
      recognitionImageUrl: withResolvedMediaUrl(item.outcome.recognitionImageUrl),
      recognitionLabel: item.outcome.recognitionLabel,
      skillCards: item.skills.skillCards,
    };
  }

  const flatHero = withResolvedMediaUrl(item.heroImageUrl || item.media?.url);
  return {
    ...item,
    heroImageUrl: flatHero,
    media: {
      ...item.media,
      url: withResolvedMediaUrl(item.media?.url || item.heroImageUrl),
    },
    screenshots: withResolvedMediaUrls(item.screenshots),
    challengeImageUrl: withResolvedMediaUrl(item.challengeImageUrl),
    solutionArchImageUrl: withResolvedMediaUrl(item.solutionArchImageUrl),
    recognitionImageUrl: withResolvedMediaUrl(item.recognitionImageUrl),
  };
}

export function normalizeGalleryList(raw: unknown): GalleryItem[] {
  const list = Array.isArray(raw) ? raw : [];
  return list.map(normalizeGalleryItem);
}
