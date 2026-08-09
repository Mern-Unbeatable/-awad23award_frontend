import type {
  ApproachCard,
  ChallengeItem,
  GalleryItem,
  LeadershipCard,
  OutcomeItem,
  SkillCard,
  SolutionCard,
} from '../types';

/** Tab-grouped portfolio payload — matches Postman /gallery canonical shape */
export interface PortfolioOverviewTab {
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
}

export interface PortfolioChallengeTab {
  challengeHeadingEn: string;
  challengeHeadingAr: string;
  challengeBodyEn: string;
  challengeBodyAr: string;
  challengeBadgeLabel: string;
  challengeImageUrl: string;
  challengeCaption: string;
  challengeItems: ChallengeItem[];
}

export interface PortfolioApproachTab {
  approachBodyEn: string;
  approachBodyAr: string;
  approachInsight: string;
  approachCards: ApproachCard[];
}

export interface PortfolioLeadershipTab {
  leadershipBodyEn: string;
  leadershipBodyAr: string;
  leadershipBannerStat: string;
  leadershipCards: LeadershipCard[];
}

export interface PortfolioSolutionTab {
  solutionBodyEn: string;
  solutionBodyAr: string;
  solutionArchImageUrl: string;
  solutionArchTitle: string;
  solutionArchBody: string;
  solutionCards: SolutionCard[];
}

export interface PortfolioOutcomeTab {
  recognitionImageUrl: string;
  recognitionLabel: string;
  outcomeItems: OutcomeItem[];
}

export interface PortfolioSkillsTab {
  skillCards: SkillCard[];
}

export interface PortfolioItemByTab {
  overview: PortfolioOverviewTab;
  challenge: PortfolioChallengeTab;
  approach: PortfolioApproachTab;
  leadership: PortfolioLeadershipTab;
  solution: PortfolioSolutionTab;
  outcome: PortfolioOutcomeTab;
  skills: PortfolioSkillsTab;
}

export type PortfolioTabbedPayload = PortfolioItemByTab;

export function isTabGroupedPortfolio(item: unknown): item is PortfolioItemByTab & { id?: string } {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
  return 'overview' in item && 'challenge' in item && 'skills' in item;
}

function heroUrlFromItem(item: GalleryItem): string {
  return item.heroImageUrl || item.media?.url || '';
}

/** Map tab-grouped API item (or legacy flat item) to flat GalleryItem for admin/public UI */
export function tabbedToGalleryItem(raw: unknown): GalleryItem {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Invalid portfolio item response from API.');
  }

  if (!isTabGroupedPortfolio(raw)) {
    const flat = raw as GalleryItem;
    const url = heroUrlFromItem(flat);
    return {
      ...flat,
      heroImageUrl: flat.heroImageUrl || url,
      media: flat.media ?? {
        id: flat.id,
        type: 'image',
        url,
        altEn: flat.titleEn || '',
        altAr: flat.titleAr || '',
      },
    };
  }

  const item = raw as PortfolioItemByTab & {
    id: string;
    order?: number;
    bodyEn?: string;
    bodyAr?: string;
    mediaId?: string | null;
  };

  const heroUrl = item.overview.heroImageUrl || '';
  const titleEn = item.overview.titleEn || '';
  const titleAr = item.overview.titleAr || '';

  return {
    id: item.id,
    titleEn,
    titleAr,
    slug: item.overview.slug,
    excerptEn: item.overview.excerptEn,
    excerptAr: item.overview.excerptAr,
    bodyEn: item.bodyEn || '',
    bodyAr: item.bodyAr || '',
    order: item.order ?? 0,
    published: item.overview.published,
    media: {
      id: item.mediaId || item.id,
      type: 'image',
      url: heroUrl,
      altEn: titleEn,
      altAr: titleAr,
    },
    tag: item.overview.tag,
    heroImageUrl: heroUrl,
    client: item.overview.client,
    role: item.overview.role,
    duration: item.overview.duration,
    screenshots: item.overview.screenshots || [],
    challengeHeadingEn: item.challenge.challengeHeadingEn,
    challengeHeadingAr: item.challenge.challengeHeadingAr,
    challengeBodyEn: item.challenge.challengeBodyEn,
    challengeBodyAr: item.challenge.challengeBodyAr,
    challengeItems: item.challenge.challengeItems,
    challengeImageUrl: item.challenge.challengeImageUrl,
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
    solutionArchImageUrl: item.solution.solutionArchImageUrl,
    solutionArchTitle: item.solution.solutionArchTitle,
    solutionArchBody: item.solution.solutionArchBody,
    outcomeItems: item.outcome.outcomeItems,
    recognitionImageUrl: item.outcome.recognitionImageUrl,
    recognitionLabel: item.outcome.recognitionLabel,
    skillCards: item.skills.skillCards,
  };
}

export function normalizePortfolioList(data: unknown): GalleryItem[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => tabbedToGalleryItem(item));
}

/** Admin form → tab-grouped create/update body (Postman canonical) */
export function portfolioFormToTabbedPayload(form: {
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
}): PortfolioTabbedPayload {
  return {
    overview: {
      titleEn: form.titleEn.trim(),
      titleAr: form.titleAr.trim(),
      slug: form.slug.trim(),
      tag: form.tag.trim() || 'Case Study',
      excerptEn: form.excerptEn.trim(),
      excerptAr: form.excerptAr.trim(),
      heroImageUrl: form.heroImageUrl.trim(),
      client: form.client.trim(),
      role: form.role.trim(),
      duration: form.duration.trim(),
      screenshots: form.screenshots.filter(Boolean),
      published: form.published,
    },
    challenge: {
      challengeHeadingEn: form.challengeHeadingEn.trim(),
      challengeHeadingAr: form.challengeHeadingAr.trim(),
      challengeBodyEn: form.challengeBodyEn.trim(),
      challengeBodyAr: form.challengeBodyAr.trim(),
      challengeBadgeLabel: form.challengeBadgeLabel.trim() || 'CRITICAL',
      challengeImageUrl: form.challengeImageUrl.trim(),
      challengeCaption: form.challengeCaption.trim(),
      challengeItems: form.challengeItems.filter((i) => i.title.trim() || i.body.trim()),
    },
    approach: {
      approachBodyEn: form.approachBodyEn.trim(),
      approachBodyAr: form.approachBodyAr.trim(),
      approachInsight: form.approachInsight.trim(),
      approachCards: form.approachCards
        .filter((c) => c.title.trim())
        .map((c) => ({
          title: c.title.trim(),
          bullets: c.bullets.map((b) => b.trim()).filter(Boolean),
        })),
    },
    leadership: {
      leadershipBodyEn: form.leadershipBodyEn.trim(),
      leadershipBodyAr: form.leadershipBodyAr.trim(),
      leadershipBannerStat: form.leadershipBannerStat.trim(),
      leadershipCards: form.leadershipCards.filter((c) => c.title.trim() || c.body.trim()),
    },
    solution: {
      solutionBodyEn: form.solutionBodyEn.trim(),
      solutionBodyAr: form.solutionBodyAr.trim(),
      solutionArchImageUrl: form.solutionArchImageUrl.trim(),
      solutionArchTitle: form.solutionArchTitle.trim(),
      solutionArchBody: form.solutionArchBody.trim(),
      solutionCards: form.solutionCards.filter((c) => c.title.trim() || c.body.trim()),
    },
    outcome: {
      recognitionImageUrl: form.recognitionImageUrl.trim(),
      recognitionLabel: form.recognitionLabel.trim(),
      outcomeItems: form.outcomeItems.filter((o) => o.text.trim()),
    },
    skills: {
      skillCards: form.skillCards.filter((s) => s.title.trim() || s.body.trim()),
    },
  };
}
