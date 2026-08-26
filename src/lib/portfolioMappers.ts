import type {
  ApproachCard,
  ChallengeItem,
  GalleryItem,
  LeadershipCard,
  OutcomeItem,
  SkillCard,
  SolutionCard,
} from "../types";

type LegacySolutionCard = SolutionCard & {
  tag?: string;
  title?: string;
  body?: string;
};

type LegacyLeadershipCard = LeadershipCard & {
  title?: string;
  body?: string;
};

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
  roleEn: string;
  roleAr: string;
  duration: string;
  durationEn: string;
  durationAr: string;
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
  challengeCaption?: string;
  challengeCaptionEn?: string;
  challengeCaptionAr?: string;
  challengeItems: ChallengeItem[];
}

export interface PortfolioApproachTab {
  approachBodyEn: string;
  approachBodyAr: string;
  approachInsightEn?: string;
  approachInsightAr?: string;
  approachCards: ApproachCard[];
}

export interface PortfolioLeadershipTab {
  leadershipBodyEn: string;
  leadershipBodyAr: string;
  leadershipBannerStatEn: string;
  leadershipBannerStatAr: string;
  leadershipCards: LeadershipCard[];
}

export interface PortfolioSolutionTab {
  solutionBodyEn: string;
  solutionBodyAr: string;
  solutionArchImageUrl: string;
  solutionArchTitleEn: string;
  solutionArchTitleAr: string;
  solutionArchBodyEn: string;
  solutionArchBodyAr: string;
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

export function isTabGroupedPortfolio(
  item: unknown,
): item is PortfolioItemByTab & { id?: string } {
  if (!item || typeof item !== "object" || Array.isArray(item)) return false;
  return "overview" in item && "challenge" in item && "skills" in item;
}

function heroUrlFromItem(item: GalleryItem): string {
  return item.heroImageUrl || item.media?.url || "";
}

function splitBodyLines(value?: string): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeApproachCard(card: ApproachCard): ApproachCard {
  return {
    titleEn: card.titleEn ?? "",
    titleAr: card.titleAr ?? "",
    bodyEn: card.bodyEn ?? "",
    bodyAr: card.bodyAr ?? "",
    bulletsEn: card.bulletsEn ?? splitBodyLines(card.bodyEn),
    bulletsAr: card.bulletsAr ?? splitBodyLines(card.bodyAr),
  };
}

function normalizeLeadershipCard(card: LeadershipCard): LeadershipCard {
  const legacyCard = card as LegacyLeadershipCard;
  const titleEn = legacyCard.titleEn ?? legacyCard.title ?? "";
  const titleAr = legacyCard.titleAr ?? legacyCard.title ?? "";
  const bodyEn = legacyCard.bodyEn ?? legacyCard.body ?? "";
  const bodyAr = legacyCard.bodyAr ?? legacyCard.body ?? "";

  return {
    iconName: card.iconName ?? "Users",
    titleEn,
    titleAr,
    bodyEn,
    bodyAr,
  };
}

function normalizeSolutionCard(card: SolutionCard): SolutionCard {
  const legacyCard = card as LegacySolutionCard;
  const tagEn = legacyCard.tagEn ?? legacyCard.tag ?? "";
  const tagAr = legacyCard.tagAr ?? legacyCard.tag ?? "";
  const titleEn = legacyCard.titleEn ?? legacyCard.title ?? "";
  const titleAr = legacyCard.titleAr ?? legacyCard.title ?? "";
  const bodyEn = legacyCard.bodyEn ?? legacyCard.body ?? "";
  const bodyAr = legacyCard.bodyAr ?? legacyCard.body ?? "";

  return {
    color: card.color,
    tagEn,
    tagAr,
    titleEn,
    titleAr,
    bodyEn,
    bodyAr,
  };
}

/** Map tab-grouped API item (or legacy flat item) to flat GalleryItem for admin/public UI */
export function tabbedToGalleryItem(raw: unknown): GalleryItem {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("Invalid portfolio item response from API.");
  }

  if (!isTabGroupedPortfolio(raw)) {
    const flat = raw as GalleryItem;
    const url = heroUrlFromItem(flat);
    return {
      ...flat,
      heroImageUrl: flat.heroImageUrl || url,
      media: flat.media ?? {
        id: flat.id,
        type: "image",
        url,
        altEn: flat.titleEn || "",
        altAr: flat.titleAr || "",
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

  const heroUrl = item.overview.heroImageUrl || "";
  const titleEn = item.overview.titleEn || "";
  const titleAr = item.overview.titleAr || "";

  return {
    id: item.id,
    titleEn,
    titleAr,
    slug: item.overview.slug,
    excerptEn: item.overview.excerptEn,
    excerptAr: item.overview.excerptAr,
    bodyEn: item.bodyEn || "",
    bodyAr: item.bodyAr || "",
    order: item.order ?? 0,
    published: item.overview.published,
    media: {
      id: item.mediaId || item.id,
      type: "image",
      url: heroUrl,
      altEn: titleEn,
      altAr: titleAr,
    },
    tag: item.overview.tag,
    heroImageUrl: heroUrl,
    client: item.overview.client,
    role: item.overview.role,
    roleEn: item.overview.roleEn || item.overview.role || "",
    roleAr: item.overview.roleAr || "",
    duration: item.overview.duration,
    durationEn: item.overview.durationEn || item.overview.duration || "",
    durationAr: item.overview.durationAr || "",
    screenshots: item.overview.screenshots || [],
    challengeHeadingEn: item.challenge.challengeHeadingEn,
    challengeHeadingAr: item.challenge.challengeHeadingAr,
    challengeBodyEn: item.challenge.challengeBodyEn,
    challengeBodyAr: item.challenge.challengeBodyAr,
    challengeItems: item.challenge.challengeItems,
    challengeImageUrl: item.challenge.challengeImageUrl,
    challengeCaption:
      item.challenge.challengeCaption ??
      item.challenge.challengeCaptionEn ??
      "",
    challengeCaptionEn:
      item.challenge.challengeCaptionEn ??
      item.challenge.challengeCaption ??
      "",
    challengeCaptionAr: item.challenge.challengeCaptionAr ?? "",
    challengeBadgeLabel: item.challenge.challengeBadgeLabel,
    approachBodyEn: item.approach.approachBodyEn,
    approachBodyAr: item.approach.approachBodyAr,
    approachCards: item.approach.approachCards.map(normalizeApproachCard),
    approachInsightEn: item.approach.approachInsightEn ?? "",
    approachInsightAr: item.approach.approachInsightAr ?? "",
    leadershipBodyEn: item.leadership.leadershipBodyEn,
    leadershipBodyAr: item.leadership.leadershipBodyAr,
    leadershipCards: item.leadership.leadershipCards.map(normalizeLeadershipCard),
    leadershipBannerStatEn:
      item.leadership.leadershipBannerStatEn ??
      item.leadership.leadershipBannerStat ??
      "",
    leadershipBannerStatAr:
      item.leadership.leadershipBannerStatAr ??
      item.leadership.leadershipBannerStat ??
      "",
    leadershipBannerStat:
      item.leadership.leadershipBannerStat ??
      item.leadership.leadershipBannerStatEn ??
      item.leadership.leadershipBannerStatAr ??
      "",
    solutionBodyEn: item.solution.solutionBodyEn,
    solutionBodyAr: item.solution.solutionBodyAr,
    solutionCards: item.solution.solutionCards.map(normalizeSolutionCard),
    solutionArchImageUrl: item.solution.solutionArchImageUrl,
    solutionArchTitleEn:
      item.solution.solutionArchTitleEn ?? item.solution.solutionArchTitle ?? "",
    solutionArchTitleAr:
      item.solution.solutionArchTitleAr ?? item.solution.solutionArchTitle ?? "",
    solutionArchBodyEn:
      item.solution.solutionArchBodyEn ?? item.solution.solutionArchBody ?? "",
    solutionArchBodyAr:
      item.solution.solutionArchBodyAr ?? item.solution.solutionArchBody ?? "",
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
  roleEn: string;
  roleAr: string;
  duration: string;
  durationEn: string;
  durationAr: string;
  screenshots: string[];
  challengeHeadingEn: string;
  challengeHeadingAr: string;
  challengeBodyEn: string;
  challengeBodyAr: string;
  challengeItems: ChallengeItem[];
  challengeImageUrl: string;
  challengeCaption: string;
  challengeCaptionEn: string;
  challengeCaptionAr: string;
  challengeBadgeLabel: string;
  approachBodyEn: string;
  approachBodyAr: string;
  approachCards: ApproachCard[];
  approachInsightEn: string;
  approachInsightAr: string;
  leadershipBodyEn: string;
  leadershipBodyAr: string;
  leadershipCards: LeadershipCard[];
  leadershipBannerStatEn: string;
  leadershipBannerStatAr: string;
  solutionBodyEn: string;
  solutionBodyAr: string;
  solutionCards: SolutionCard[];
  solutionArchImageUrl: string;
  solutionArchTitleEn: string;
  solutionArchTitleAr: string;
  solutionArchBodyEn: string;
  solutionArchBodyAr: string;
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
      tag: form.tag.trim() || "Case Study",
      excerptEn: form.excerptEn.trim(),
      excerptAr: form.excerptAr.trim(),
      heroImageUrl: form.heroImageUrl.trim(),
      client: form.client.trim(),
      role: form.roleEn.trim() || form.role.trim(),
      roleEn: form.roleEn.trim(),
      roleAr: form.roleAr.trim(),
      duration: form.durationEn.trim() || form.duration.trim(),
      durationEn: form.durationEn.trim(),
      durationAr: form.durationAr.trim(),
      screenshots: form.screenshots.filter(Boolean),
      published: form.published,
    },
    challenge: {
      challengeHeadingEn: form.challengeHeadingEn.trim(),
      challengeHeadingAr: form.challengeHeadingAr.trim(),
      challengeBodyEn: form.challengeBodyEn.trim(),
      challengeBodyAr: form.challengeBodyAr.trim(),
      challengeBadgeLabel: form.challengeBadgeLabel.trim() || "CRITICAL",
      challengeImageUrl: form.challengeImageUrl.trim(),
      challengeCaption:
        form.challengeCaptionEn.trim() || form.challengeCaption.trim(),
      challengeCaptionEn: form.challengeCaptionEn.trim(),
      challengeCaptionAr: form.challengeCaptionAr.trim(),
      challengeItems: form.challengeItems
        .filter((i) => {
          const iconName = (i.iconName ?? "").trim();
          const titleEn = (i.titleEn ?? i.title ?? "").trim();
          const titleAr = (i.titleAr ?? "").trim();
          const bodyEn = (i.bodyEn ?? i.body ?? "").trim();
          const bodyAr = (i.bodyAr ?? "").trim();
          return iconName || titleEn || titleAr || bodyEn || bodyAr;
        })
        .map((i) => {
          const titleEn = (i.titleEn ?? i.title ?? "").trim();
          const titleAr = (i.titleAr ?? "").trim();
          const bodyEn = (i.bodyEn ?? i.body ?? "").trim();
          const bodyAr = (i.bodyAr ?? "").trim();
          return {
            iconName: (i.iconName ?? "").trim(),
            title: titleEn,
            titleEn,
            titleAr,
            body: bodyEn,
            bodyEn,
            bodyAr,
          };
        }),
    },
    approach: {
      approachBodyEn: form.approachBodyEn.trim(),
      approachBodyAr: form.approachBodyAr.trim(),
      approachInsightEn: form.approachInsightEn.trim(),
      approachInsightAr: form.approachInsightAr.trim(),
      approachCards: form.approachCards
        .filter(
          (c) =>
            c.titleEn?.trim() ||
            c.titleAr?.trim() ||
            c.bodyEn?.trim() ||
            c.bodyAr?.trim() ||
            c.bulletsEn?.some((bullet) => bullet.trim()) ||
            c.bulletsAr?.some((bullet) => bullet.trim()) ||
            c.titleEn?.trim() ||
            c.titleAr?.trim() ||
            c.bodyEn?.trim() ||
            c.bodyAr?.trim(),
        )
        .map((c) => {
          const titleEn = c.titleEn.trim();
          const titleAr = c.titleAr.trim();
          const bodyEn = c.bodyEn.trim();
          const bodyAr = c.bodyAr.trim();
          const body = bodyEn || bodyAr;
          const bulletsEn = c.bulletsEn
            .map((bullet) => bullet.trim())
            .filter(Boolean);
          const bulletsAr = c.bulletsAr
            .map((bullet) => bullet.trim())
            .filter(Boolean);
          return {
            titleEn,
            titleAr,
            body,
            bodyEn,
            bodyAr,
            bulletsEn,
            bulletsAr,
          };
        }),
    },
    leadership: {
      leadershipBodyEn: form.leadershipBodyEn.trim(),
      leadershipBodyAr: form.leadershipBodyAr.trim(),
      leadershipBannerStatEn: form.leadershipBannerStatEn.trim(),
      leadershipBannerStatAr: form.leadershipBannerStatAr.trim(),
      leadershipCards: form.leadershipCards
        .filter(
          (c) =>
            c.titleEn?.trim() ||
            c.titleAr?.trim() ||
            c.bodyEn?.trim() ||
            c.bodyAr?.trim() ||
            c.title?.trim() ||
            c.body?.trim(),
        )
        .map((c) => ({
          iconName: c.iconName.trim(),
          titleEn: c.titleEn?.trim() || c.title?.trim() || "",
          titleAr: c.titleAr?.trim() || c.title?.trim() || "",
          bodyEn: c.bodyEn?.trim() || c.body?.trim() || "",
          bodyAr: c.bodyAr?.trim() || c.body?.trim() || "",
        })),
    },
    solution: {
      solutionBodyEn: form.solutionBodyEn.trim(),
      solutionBodyAr: form.solutionBodyAr.trim(),
      solutionArchImageUrl: form.solutionArchImageUrl.trim(),
      solutionArchTitleEn: form.solutionArchTitleEn.trim(),
      solutionArchTitleAr: form.solutionArchTitleAr.trim(),
      solutionArchBodyEn: form.solutionArchBodyEn.trim(),
      solutionArchBodyAr: form.solutionArchBodyAr.trim(),
      solutionCards: form.solutionCards.filter(
        (c) =>
          c.tagEn?.trim() ||
          c.tagAr?.trim() ||
          c.titleEn?.trim() ||
          c.titleAr?.trim() ||
          c.bodyEn?.trim() ||
          c.bodyAr?.trim() ||
          c.tag?.trim() ||
          c.title?.trim() ||
          c.body?.trim(),
      ).map((c) => {
        const tagEn = c.tagEn?.trim() || c.tag?.trim() || "";
        const tagAr = c.tagAr?.trim() || c.tag?.trim() || "";
        const titleEn = c.titleEn?.trim() || c.title?.trim() || "";
        const titleAr = c.titleAr?.trim() || c.title?.trim() || "";
        const bodyEn = c.bodyEn?.trim() || c.body?.trim() || "";
        const bodyAr = c.bodyAr?.trim() || c.body?.trim() || "";
        return {
          color: c.color,
          tagEn,
          tagAr,
          titleEn,
          titleAr,
          bodyEn,
          bodyAr,
        };
      }),
    },
    outcome: {
      recognitionImageUrl: form.recognitionImageUrl.trim(),
      recognitionLabel: form.recognitionLabel.trim(),
      outcomeItems: form.outcomeItems.filter((o) => o.text.trim()),
    },
    skills: {
      skillCards: form.skillCards.filter(
        (s) => s.title.trim() || s.body.trim(),
      ),
    },
  };
}
