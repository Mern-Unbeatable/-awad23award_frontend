import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Sparkles,
  Building2,
  UserCheck,
  AlertTriangle,
  FileText,
  Code2,
  BookOpen,
  CheckCircle2,
  Zap,
  Users,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  GitBranch,
  Layers,
  Database,
  Cpu,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { Seo } from "../../components/Seo";
import { useLocale } from "../../hooks/LocaleContext";
import { useSite } from "../../hooks/SiteContext";
import { SiteFooter } from "../../components/site/SiteFooter";
import { pick } from "../../types";
import { resolveMediaUrl, isBlobUrl } from "../../lib/api";
import { usePortfolioPublic } from "../../features/public/portfolio/portfolioHooks";
import type { SolutionCard, OutcomeItem } from "../../types";

// ─── Icon resolver ────────────────────────────────────────────────────────────
// Converts a stored icon name string into a Lucide component.
const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  AlertTriangle,
  FileText,
  Code2,
  BookOpen,
  CheckCircle2,
  Zap,
  ShieldCheck,
  ExternalLink,
  GitBranch,
  Layers,
  Database,
  Cpu,
  Building2,
  UserCheck,
};
function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? AlertTriangle;
}

const SOLUTION_COLORS = {
  green: {
    card: "bg-[#F2FAF6] border-emerald-200/90",
    icon: "bg-emerald-100 text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    divider: "border-emerald-200/60",
  },
  blue: {
    card: "bg-[#F0F7FF] border-sky-200/90",
    icon: "bg-sky-100 text-sky-600",
    badge: "bg-sky-100 text-sky-700",
    divider: "border-sky-200/60",
  },
  orange: {
    card: "bg-[#FFF9F2] border-amber-200/90",
    icon: "bg-amber-100 text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    divider: "border-amber-200/60",
  },
  purple: {
    card: "bg-[#F7F5FF] border-purple-200/90",
    icon: "bg-purple-100 text-purple-600",
    badge: "bg-purple-100 text-purple-700",
    divider: "border-purple-200/60",
  },
};

const SOLUTION_ICONS: Record<SolutionCard["color"], LucideIcon> = {
  green: ShieldCheck,
  blue: Building2,
  orange: Database,
  purple: Layers,
};

const OUTCOME_COLORS = {
  emerald: "bg-emerald-950/80 text-emerald-400 border-emerald-700/60",
  purple: "bg-purple-950/80 text-purple-400 border-purple-700/60",
  amber: "bg-amber-950/80 text-amber-400 border-amber-700/60",
};
const OUTCOME_ICONS: Record<OutcomeItem["color"], LucideIcon> = {
  emerald: CheckCircle2,
  purple: ShieldCheck,
  amber: Zap,
};

const hasValue = (value?: unknown) =>
  typeof value === "string"
    ? value.trim().length > 0
    : value !== null && value !== undefined;

const cleanText = (value?: string | null) =>
  typeof value === "string" ? value.trim() : "";

const cleanArray = (values?: Array<string | null | undefined>) =>
  (values ?? []).map((value) => cleanText(value)).filter(hasValue);

// ─── Page ─────────────────────────────────────────────────────────────────────

export function CaseStudyPage() {
  const { slug = "" } = useParams();
  const { locale, pathFor, t } = useLocale();
  const { settings } = useSite();
  const { item, isLoadingItem, itemError, loadItem } = usePortfolioPublic();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;
    loadItem(slug).catch(() => undefined);
  }, [slug, loadItem]);

  const loading = isLoadingItem;
  const loadError = itemError;

  if (loading) {
    return (
      <div className="bg-white pt-28 pb-16 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#36BFFB] animate-spin" />
      </div>
    );
  }

  if (loadError || !item) {
    return (
      <div className="bg-white pt-28 pb-16 min-h-screen text-slate-800">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            {t("Case study not found", "دراسة الحالة غير موجودة")}
          </h1>
          <p className="text-slate-500 text-[15px] mb-6">
            {loadError ||
              t(
                "This portfolio project could not be loaded or is not published.",
                "تعذر تحميل هذا المشروع أو أنه غير منشور.",
              )}
          </p>
          <Link
            to={pathFor("/work")}
            className="inline-flex items-center gap-2 text-[#36BFFB] font-semibold text-[14px]"
          >
            {t("Back to portfolio", "العودة إلى المعرض")}
          </Link>
        </div>
      </div>
    );
  }

  const title =
    cleanText(pick(item, locale, "title")) ||
    cleanText(locale === "ar" ? item.titleAr : item.titleEn) ||
    t("Project Case Study", "دراسة حالة");

  const excerpt =
    cleanText(pick(item, locale, "excerpt")) ||
    cleanText(locale === "ar" ? item.excerptAr : item.excerptEn) ||
    "";

  const bodyHtml =
    cleanText(pick(item, locale, "body")) ||
    cleanText(locale === "ar" ? item.bodyAr : item.bodyEn) ||
    "";

  let heroImage = cleanText(item.heroImageUrl || item.media?.url || "");
  if (heroImage && !isBlobUrl(heroImage)) {
    heroImage = resolveMediaUrl(heroImage);
  } else {
    heroImage = "";
  }

  const client = cleanText(pick(item, locale, "client") || item.client || "");
  const role = cleanText(pick(item, locale, "role") || item.role || "");
  const duration = cleanText(item.duration || "");

  const challengeHeading = cleanText(
    locale === "ar" ? item.challengeHeadingAr : item.challengeHeadingEn,
  );
  const challengeBody = cleanText(
    locale === "ar" ? item.challengeBodyAr : item.challengeBodyEn,
  );
  const challengeItems = (item.challengeItems ?? []).filter(
    (ci) =>
      hasValue(ci.titleEn ?? ci.title) ||
      hasValue(ci.titleAr) ||
      hasValue(ci.bodyEn ?? ci.body) ||
      hasValue(ci.bodyAr),
  );
  let challengeImage = cleanText(item.challengeImageUrl || "");
  if (challengeImage && !isBlobUrl(challengeImage)) {
    challengeImage = resolveMediaUrl(challengeImage);
  } else {
    challengeImage = "";
  }
  const challengeCaption = cleanText(
    locale === "ar"
      ? (item.challengeCaptionAr ?? item.challengeCaption ?? "")
      : (item.challengeCaptionEn ?? item.challengeCaption ?? ""),
  );

  const approachBody = cleanText(
    locale === "ar" ? item.approachBodyAr : item.approachBodyEn,
  );
  const approachCards = (item.approachCards ?? []).filter(
    (card) =>
      hasValue(card.titleEn) ||
      hasValue(card.titleAr) ||
      hasValue(card.bodyEn) ||
      hasValue(card.bodyAr) ||
      cleanArray(card.bulletsEn).length > 0 ||
      cleanArray(card.bulletsAr).length > 0,
  );
  const approachInsight = cleanText(
    locale === "ar"
      ? (item.approachInsightAr ?? "")
      : (item.approachInsightEn ?? ""),
  );

  const leadershipBody = cleanText(
    locale === "ar" ? item.leadershipBodyAr : item.leadershipBodyEn,
  );
  const leadershipCards = (item.leadershipCards ?? []).filter(
    (card) =>
      hasValue(card.titleEn ?? card.title) ||
      hasValue(card.titleAr) ||
      hasValue(card.bodyEn ?? card.body) ||
      hasValue(card.bodyAr),
  );
  const leadershipStat = cleanText(
    locale === "ar"
      ? (item.leadershipBannerStatAr ?? item.leadershipBannerStat ?? "")
      : (item.leadershipBannerStatEn ?? item.leadershipBannerStat ?? ""),
  );

  const solutionBody = cleanText(
    locale === "ar" ? item.solutionBodyAr : item.solutionBodyEn,
  );
  const solutionCards = (item.solutionCards ?? []).filter(
    (card) =>
      hasValue(card.tagEn ?? card.tag) ||
      hasValue(card.tagAr) ||
      hasValue(card.titleEn ?? card.title) ||
      hasValue(card.titleAr) ||
      hasValue(card.bodyEn ?? card.body) ||
      hasValue(card.bodyAr),
  );
  let solutionArchImg = cleanText(item.solutionArchImageUrl || "");
  if (solutionArchImg && !isBlobUrl(solutionArchImg)) {
    solutionArchImg = resolveMediaUrl(solutionArchImg);
  } else {
    solutionArchImg = "";
  }
  const solutionArchLabel = cleanText(
    locale === "ar"
      ? (item.solutionArchLabelAr ?? item.solutionArchLabelEn ?? "")
      : (item.solutionArchLabelEn ?? item.solutionArchLabelAr ?? ""),
  );
  const solutionArchTitle = cleanText(
    locale === "ar"
      ? (item.solutionArchTitleAr ??
          item.solutionArchTitleEn ??
          item.solutionArchTitle ??
          "")
      : (item.solutionArchTitleEn ??
          item.solutionArchTitleAr ??
          item.solutionArchTitle ??
          ""),
  );
  const solutionArchBody = cleanText(
    locale === "ar"
      ? (item.solutionArchBodyAr ??
          item.solutionArchBodyEn ??
          item.solutionArchBody ??
          "")
      : (item.solutionArchBodyEn ??
          item.solutionArchBodyAr ??
          item.solutionArchBody ??
          ""),
  );

  const outcomeItems = (item.outcomeItems ?? []).filter(
    (item) => hasValue(item.textEn ?? item.text) || hasValue(item.textAr),
  );
  let recognitionImage = cleanText(item.recognitionImageUrl || "");
  if (recognitionImage && !isBlobUrl(recognitionImage)) {
    recognitionImage = resolveMediaUrl(recognitionImage);
  } else {
    recognitionImage = "";
  }
  const recognitionLabel = cleanText(
    locale === "ar"
      ? (item.recognitionLabelAr ??
          item.recognitionLabelEn ??
          item.recognitionLabel ??
          "")
      : (item.recognitionLabelEn ??
          item.recognitionLabelAr ??
          item.recognitionLabel ??
          ""),
  );

  const skillCards = (item.skillCards ?? []).filter(
    (card) =>
      hasValue(card.category) || hasValue(card.title) || hasValue(card.body),
  );

  const hasChallengeSectionContent = Boolean(
    challengeHeading ||
    challengeBody ||
    challengeItems.length ||
    challengeCaption ||
    challengeImage,
  );

  const hasApproachSectionContent = Boolean(
    approachBody || approachCards.length || approachInsight,
  );

  const hasLeadershipSectionContent = Boolean(
    leadershipBody || leadershipCards.length || leadershipStat,
  );

  const hasSolutionSectionContent = Boolean(
    solutionBody ||
    solutionCards.length ||
    solutionArchLabel ||
    solutionArchTitle ||
    solutionArchBody ||
    solutionArchImg,
  );

  const hasOutcomeSectionContent = Boolean(
    outcomeItems.length || recognitionImage || recognitionLabel || client,
  );

  const hasSkillsSectionContent = skillCards.length > 0;

  const hasCustomCaseStudyData = Boolean(
    hasChallengeSectionContent ||
    hasApproachSectionContent ||
    hasLeadershipSectionContent ||
    hasSolutionSectionContent ||
    hasOutcomeSectionContent ||
    hasSkillsSectionContent,
  );

  return (
    <>
      <Seo
        title={`${title} | ${settings.brandName}`}
        description={excerpt}
        path={pathFor(`/work/${slug}`)}
      />

      <div className="bg-white pt-28 pb-16 min-h-screen text-slate-800">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* ── SECTION 1: HERO ─────────────────────────────────────────── */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-[#36BFFB] font-semibold text-[13px] uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4" />
              {t(
                "PAGE 01 • CRM Strategy Case Study",
                "الصفحة 01 • دراسة حالة استراتيجية CRM",
              )}
            </span>

            <h1 className="text-[38px] sm:text-[48px] md:text-[56px] font-serif font-bold text-[#0F2E25] tracking-tight leading-[1.12] mb-8">
              {title}
            </h1>

            {Boolean(client || role) && (
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 pt-4 pb-2">
                {client && (
                  <div className="flex items-center gap-3 text-start">
                    <div className="w-10 h-10 rounded-lg bg-[#053F32] text-white flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-[#36BFFB]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        {t("CLIENT", "العميل")}
                      </span>
                      <span className="text-[14px] font-bold text-slate-800">
                        {client}
                      </span>
                    </div>
                  </div>
                )}

                {role && (
                  <div className="flex items-center gap-3 text-start">
                    <div className="w-10 h-10 rounded-lg bg-[#053F32] text-white flex items-center justify-center shrink-0">
                      <UserCheck className="w-5 h-5 text-[#36BFFB]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        {t("ROLE", "الدور")}
                      </span>
                      <span className="text-[14px] font-bold text-slate-800">
                        {role}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {heroImage && (
            <div className="rounded-lg overflow-hidden bg-[#181C20] p-4 md:p-8 shadow-xl mb-12 border border-slate-200/80">
              <img
                src={heroImage}
                alt={title}
                className="w-full h-auto rounded-lg object-cover max-h-140"
              />
            </div>
          )}

          {/* Intro Text & CTA */}
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
            {excerpt && (
              <p className="text-[17px] md:text-[18.5px] text-slate-700 leading-relaxed font-medium">
                {excerpt}
              </p>
            )}

            {(hasCustomCaseStudyData || duration) && (
              <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
                {hasCustomCaseStudyData && (
                  <a
                    href="#solution"
                    className="inline-flex items-center gap-2 bg-[#36BFFB] hover:bg-[#20B0F0] text-white rounded-lg px-6 py-3 text-[14px] font-semibold transition-colors shadow-sm"
                  >
                    <span>{t("View Case Study", "عرض دراسة الحالة")}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </a>
                )}
                {duration && (
                  <div className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 text-slate-700 rounded-lg px-5 py-3 text-[13px] font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{duration}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── DYNAMIC CONTENT: body HTML or full structured case study ── */}
          {bodyHtml && !hasCustomCaseStudyData ? (
            <div className="pt-12 pb-20 border-t border-slate-200/80">
              <div
                className="prose prose-lg max-w-none text-slate-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </div>
          ) : hasCustomCaseStudyData ? (
            <>
              {/* ── SECTION 2: THE CHALLENGE ─────────────────────────── */}
              {hasChallengeSectionContent && (
                <div className="pt-12 pb-20 border-t border-slate-200/80">
                  <div className="mb-10">
                    <span className="inline-flex items-center gap-1.5 text-[#2E7D6E] font-semibold text-[13px] uppercase tracking-wider mb-2">
                      ⓘ {t("PAGE 02 • The Challenge", "الصفحة 02 • التحدي")}
                    </span>
                    {challengeHeading && (
                      <h2 className="text-[36px] md:text-[46px] font-serif font-bold text-[#0F2E25] tracking-tight">
                        {challengeHeading}
                      </h2>
                    )}
                    {challengeBody && (
                      <p className="text-[16.5px] text-slate-600 mt-2 max-w-2xl">
                        {challengeBody}
                      </p>
                    )}
                  </div>

                  <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left: Challenge Items */}
                    {challengeItems.length > 0 && (
                      <div className="lg:col-span-6 space-y-4">
                        {challengeItems.map((ci, idx) => {
                          const iconName = cleanText(ci.iconName);
                          const Icon = iconName ? getIcon(iconName) : null;
                          const itemTitle = cleanText(
                            locale === "ar"
                              ? (ci.titleAr ?? ci.titleEn ?? ci.title)
                              : (ci.titleEn ?? ci.title),
                          );
                          const itemBody = cleanText(
                            locale === "ar"
                              ? (ci.bodyAr ?? ci.bodyEn ?? ci.body)
                              : (ci.bodyEn ?? ci.body),
                          );
                          return (
                            <div
                              key={idx}
                              className="bg-white border border-slate-200/90 rounded-lg p-4 flex items-start gap-4 shadow-sm"
                            >
                              {Icon && (
                                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                                  <Icon className="w-4 h-4" />
                                </div>
                              )}
                              <div>
                                {itemTitle && (
                                  <h5 className="font-bold text-[14px] text-slate-900 mb-0.5">
                                    {itemTitle}
                                  </h5>
                                )}
                                {itemBody && (
                                  <p className="text-[12.5px] text-slate-500 leading-relaxed">
                                    {itemBody}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {challengeImage || challengeCaption ? (
                      <div className="lg:col-span-6 rounded-lg overflow-hidden bg-[#0A121D] p-6 text-white flex flex-col justify-between relative shadow-lg">
                        {challengeImage && (
                          <img
                            src={challengeImage}
                            alt="Challenge"
                            className="w-full h-90 object-cover rounded-lg mb-6 opacity-85"
                          />
                        )}
                        {challengeCaption && (
                          <div className="p-4 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                            <h4 className="text-[20px] font-serif font-bold text-white mb-2">
                              {t(
                                "Legacy Architecture Audit Required",
                                "مطلوب تدقيق معماري للأنظمة القديمة",
                              )}
                            </h4>
                            <p className="text-[13.5px] text-slate-300 leading-relaxed">
                              {challengeCaption}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* ── SECTION 3: MY APPROACH ───────────────────────────── */}
              {hasApproachSectionContent && (
                <div className="bg-[#053F32] rounded-lg p-8 md:p-14 text-white mb-20 shadow-xl">
                  <div className="mb-10">
                    <span className="inline-flex items-center gap-1.5 text-[#36BFFB] font-semibold text-[13px] uppercase tracking-wider mb-2">
                      🔍{" "}
                      {t("PAGE 03 • MY APPROACH", "الصفحة 03 • منهجي في العمل")}
                    </span>
                    <h2 className="text-[36px] md:text-[46px] font-serif font-bold text-white tracking-tight">
                      {t("My Approach", "منهجيتي")}
                    </h2>
                    {approachBody && (
                      <p className="text-[16px] text-emerald-100/80 mt-1">
                        {approachBody}
                      </p>
                    )}
                  </div>

                  {approachCards.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {approachCards.map((card, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-lg p-7 text-slate-900 shadow-md"
                        >
                          <div className="w-10 h-10 rounded-lg bg-sky-100 text-[#36BFFB] flex items-center justify-center mb-5">
                            <FileText className="w-5 h-5" />
                          </div>
                          {cleanText(
                            locale === "ar"
                              ? (card.titleAr ?? "")
                              : (card.titleEn ?? ""),
                          ) && (
                            <h4 className="text-[20px] font-serif font-bold mb-4 text-[#0F2E25]">
                              {cleanText(
                                locale === "ar"
                                  ? (card.titleAr ?? "")
                                  : (card.titleEn ?? ""),
                              )}
                            </h4>
                          )}
                          <ul className="space-y-3 text-[14px] text-slate-600">
                            {(cleanArray(
                              locale === "ar"
                                ? (card.bulletsAr ?? [])
                                : (card.bulletsEn ?? []),
                            ).length
                              ? cleanArray(
                                  locale === "ar"
                                    ? (card.bulletsAr ?? [])
                                    : (card.bulletsEn ?? []),
                                )
                              : cleanText(
                                  locale === "ar"
                                    ? (card.bodyAr ?? "")
                                    : (card.bodyEn ?? ""),
                                )
                                  .split(/\r?\n/)
                                  .map((line) => line.trim())
                                  .filter(Boolean)
                            ).map((bullet, bIdx) => (
                              <li
                                key={bIdx}
                                className="flex items-start gap-2.5"
                              >
                                <CheckCircle2 className="w-4 h-4 text-[#36BFFB] shrink-0 mt-0.5" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {approachInsight && (
                    <div className="bg-white rounded-lg p-6 text-slate-900 flex items-start gap-5 mb-8 shadow-md">
                      <div className="w-11 h-11 rounded-lg bg-sky-100 text-[#36BFFB] flex items-center justify-center shrink-0">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          ARCHITECTURAL INSIGHT & KEY TAKEAWAY
                        </h5>
                        <p className="text-[15px] text-slate-800 leading-relaxed font-medium">
                          {approachInsight}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── SECTION 4: TECHNICAL LEADERSHIP ─────────────────── */}
              {hasLeadershipSectionContent && (
                <div className="pb-20 border-b border-slate-200/80">
                  <div className="grid lg:grid-cols-12 gap-8 items-start mb-12">
                    <div className="lg:col-span-5 pt-2">
                      <span className="inline-flex items-center gap-1.5 bg-[#EAF7FF] text-[#36BFFB] border border-sky-200 font-semibold text-[12px] px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
                        👥{" "}
                        {t(
                          "PAGE 04 • TECHNICAL LEADERSHIP",
                          "الصفحة 04 • القيادة التقنية",
                        )}
                      </span>
                      <h2 className="text-[38px] md:text-[46px] font-serif font-bold text-[#0F2E25] tracking-tight leading-snug mb-4">
                        {t("Technical Leadership", "القيادة التقنية")}
                      </h2>
                      {leadershipBody && (
                        <p className="text-[16px] text-slate-500 leading-relaxed max-w-md">
                          {leadershipBody}
                        </p>
                      )}
                    </div>

                    <div className="lg:col-span-7 rounded-md bg-[#0A0E17] text-white overflow-hidden flex flex-col justify-between">
                      {heroImage && (
                        <div className="p-6 md:p-8">
                          <img
                            src={heroImage}
                            alt={t("Technical Leadership", "القيادة التقنية")}
                            className="rounded-lg h-60 w-full object-cover shadow-md"
                          />
                        </div>
                      )}
                      {leadershipStat && (
                        <div className="bg-[#36BFFB] text-white p-5 px-7 flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 block">
                              TEAM EXECUTION
                            </span>
                            <span className="text-[17px] font-bold text-white">
                              {t(
                                "Offshore Delivery Alignment",
                                "تنسيق التسليم الخارجي",
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[14px] font-bold">
                            <span className="text-white/80">•</span>
                            <span>{leadershipStat}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {leadershipCards.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {leadershipCards.map((card, idx) => {
                        const iconName = cleanText(card.iconName);
                        const Icon = iconName ? getIcon(iconName) : null;
                        const cardTitle = cleanText(
                          locale === "ar"
                            ? (card.titleAr ?? card.titleEn ?? card.title ?? "")
                            : (card.titleEn ??
                                card.titleAr ??
                                card.title ??
                                ""),
                        );
                        const cardBody = cleanText(
                          locale === "ar"
                            ? (card.bodyAr ?? card.bodyEn ?? card.body ?? "")
                            : (card.bodyEn ?? card.bodyAr ?? card.body ?? ""),
                        );
                        return (
                          <div
                            key={idx}
                            className="bg-[#2A303C] text-white rounded-lg p-7 shadow-lg border border-slate-700/40 flex flex-col justify-between min-h-60"
                          >
                            {Icon && (
                              <div className="w-10 h-10 rounded-lg bg-slate-800/80 text-[#36BFFB] border border-slate-700 flex items-center justify-center mb-5">
                                <Icon className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              {cardTitle && (
                                <h5 className="font-bold text-[17px] mb-2 font-serif text-white leading-snug">
                                  {cardTitle}
                                </h5>
                              )}
                              {cardBody && (
                                <p className="text-[13px] text-slate-300 leading-relaxed font-normal">
                                  {cardBody}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── SECTION 5: SOLUTION DELIVERED ───────────────────── */}
              {hasSolutionSectionContent && (
                <div className="pt-16 pb-12" id="solution">
                  <div className="mb-10">
                    <span className="inline-flex items-center gap-1.5 text-[#36BFFB] font-semibold text-[13px] uppercase tracking-wider mb-2">
                      🛡{" "}
                      {t(
                        "PAGE 05 • SOLUTION DELIVERED",
                        "الصفحة 05 • الحل المنفذ",
                      )}
                    </span>
                    <h2 className="text-[36px] md:text-[46px] font-serif font-bold text-[#0F2E25] tracking-tight">
                      {t("Solution Delivered", "الحل المنفذ")}
                    </h2>
                    {solutionBody && (
                      <p className="text-[16.5px] text-slate-600 mt-2 max-w-3xl">
                        {solutionBody}
                      </p>
                    )}
                  </div>

                  {solutionCards.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                      {solutionCards.map((card, idx) => {
                        const colors =
                          SOLUTION_COLORS[card.color] || SOLUTION_COLORS.green;
                        const Icon = SOLUTION_ICONS[card.color] || ShieldCheck;
                        const cardTag = cleanText(
                          locale === "ar"
                            ? (card.tagAr ?? card.tagEn ?? card.tag ?? "")
                            : (card.tagEn ?? card.tagAr ?? card.tag ?? ""),
                        );
                        const cardTitle = cleanText(
                          locale === "ar"
                            ? (card.titleAr ?? card.titleEn ?? card.title ?? "")
                            : (card.titleEn ??
                                card.titleAr ??
                                card.title ??
                                ""),
                        );
                        const cardBody = cleanText(
                          locale === "ar"
                            ? (card.bodyAr ?? card.bodyEn ?? card.body ?? "")
                            : (card.bodyEn ?? card.bodyAr ?? card.body ?? ""),
                        );
                        return (
                          <div
                            key={idx}
                            className={`${colors.card} border rounded-lg p-6 flex flex-col justify-between`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <div
                                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors.icon}`}
                                >
                                  <Icon className="w-5 h-5" />
                                </div>
                                {cardTag && (
                                  <span
                                    className={`text-[11px] font-semibold px-3 py-1 rounded-full ${colors.badge}`}
                                  >
                                    {cardTag}
                                  </span>
                                )}
                              </div>
                              {cardTitle && (
                                <h4 className="text-[18px] font-serif font-bold text-slate-900 mb-2">
                                  {cardTitle}
                                </h4>
                              )}
                              {cardBody && (
                                <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6">
                                  {cardBody}
                                </p>
                              )}
                            </div>
                            {(cardTag || cardTitle || cardBody) && (
                              <div
                                className={`flex items-center justify-between pt-4 border-t text-[12px] ${colors.divider}`}
                              >
                                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                                  ✓ Live in CRM 2.0
                                </span>
                                <span className="text-[#36BFFB] font-semibold flex items-center gap-1">
                                  View Specs{" "}
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {(solutionArchLabel ||
                    solutionArchTitle ||
                    solutionArchBody ||
                    solutionArchImg) && (
                    <div className="bg-[#EBEBEF] rounded-lg p-6 md:p-8 grid lg:grid-cols-12 gap-8 items-center border border-slate-300/80 mb-16">
                      <div className="lg:col-span-5 space-y-4">
                        {solutionArchLabel && (
                          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                            🛡 {solutionArchLabel}
                          </span>
                        )}
                        {solutionArchTitle && (
                          <h3 className="text-[26px] md:text-[30px] font-serif font-bold text-slate-900 leading-snug">
                            {solutionArchTitle}
                          </h3>
                        )}
                        {solutionArchBody && (
                          <p className="text-[14px] text-slate-600 leading-relaxed">
                            {solutionArchBody}
                          </p>
                        )}
                      </div>
                      {solutionArchImg && (
                        <div className="lg:col-span-7 bg-[#0A121D] rounded-lg p-4 border border-slate-800 shadow-xl">
                          <img
                            src={solutionArchImg}
                            alt="Enterprise Architecture"
                            className="rounded-lg w-full h-70 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── SECTION 6: OUTCOME ──────────────────────────────── */}
                  {hasOutcomeSectionContent && (
                    <div className="pt-12 pb-20 border-t border-slate-200/80">
                      <div className="mb-8">
                        <span className="inline-flex items-center gap-1.5 bg-[#053F32] text-emerald-300 font-semibold text-[12px] px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                          ■ {t("PAGE 06 • OUTCOME", "الصفحة 06 • النتيجة")}
                        </span>
                        <h2 className="text-[36px] md:text-[46px] font-serif font-bold text-[#0F2E25] tracking-tight">
                          {t("Outcome", "النتيجة والأثر")}
                        </h2>
                      </div>

                      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                        {outcomeItems.length > 0 && (
                          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
                            {outcomeItems.map((oi, idx) => {
                              const cls =
                                OUTCOME_COLORS[oi.color] ||
                                OUTCOME_COLORS.emerald;
                              const Icon =
                                OUTCOME_ICONS[oi.color] || CheckCircle2;
                              const outcomeText = cleanText(
                                locale === "ar"
                                  ? (oi.textAr ?? oi.textEn ?? oi.text ?? "")
                                  : (oi.textEn ?? oi.textAr ?? oi.text ?? ""),
                              );
                              return (
                                <div
                                  key={idx}
                                  className="bg-[#111A24] text-white rounded-lg p-6 shadow-md border border-slate-800 flex items-start gap-4"
                                >
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${cls}`}
                                  >
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <p className="text-[14.5px] leading-relaxed text-slate-200 font-medium">
                                    {outcomeText}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {(recognitionImage || recognitionLabel || client) && (
                          <div className="lg:col-span-6 rounded-lg bg-[#0A121D] text-white p-6 shadow-xl border border-slate-800 flex flex-col justify-between">
                            {recognitionImage && (
                              <div className="relative rounded-lg overflow-hidden mb-4 border border-slate-800">
                                <img
                                  src={recognitionImage}
                                  alt={recognitionLabel}
                                  className="w-full h-70 object-cover opacity-90"
                                />
                                {client && (
                                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-amber-300">
                                    ★ {client}
                                  </div>
                                )}
                              </div>
                            )}
                            {(client || recognitionLabel) && (
                              <div className="p-2">
                                {client && (
                                  <h5 className="font-serif font-bold text-amber-400 text-[16px] mb-0.5">
                                    ★ {client}
                                  </h5>
                                )}
                                {recognitionLabel && (
                                  <p className="text-[13px] text-slate-400">
                                    {recognitionLabel}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── SECTION 7: KEY SKILLS ───────────────────────────── */}
                  {hasSkillsSectionContent && (
                    <div className="pt-12 border-t border-slate-200/80">
                      <div className="mb-10">
                        <span className="inline-flex items-center gap-1.5 bg-[#EAF7FF] text-[#36BFFB] border border-sky-200 font-semibold text-[12px] px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                          ✦{" "}
                          {t(
                            "PAGE 07 • Key Skills",
                            "الصفحة 07 • المهارات الرئيسية",
                          )}
                        </span>
                        <h2 className="text-[36px] md:text-[46px] font-serif font-bold text-[#0F2E25] tracking-tight">
                          {t(
                            "Key Skills Demonstrated",
                            "المهارات الرئيسية التي تم تطبيقها",
                          )}
                        </h2>
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {skillCards.map((sk) => (
                          <div
                            key={sk.num}
                            className="bg-[#111A24] text-white rounded-lg p-6 shadow-md border border-slate-800 flex flex-col justify-between min-h-52"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                {hasValue(sk.num) && (
                                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-[#36BFFB] flex items-center justify-center text-[13px] font-bold">
                                    {sk.num}
                                  </div>
                                )}
                                {hasValue(sk.category) && (
                                  <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                                    {sk.category}
                                  </span>
                                )}
                              </div>
                              {hasValue(sk.title) && (
                                <h4 className="font-serif font-bold text-[17px] text-white mb-2 leading-snug">
                                  {sk.title}
                                </h4>
                              )}
                              {hasValue(sk.body) && (
                                <p className="text-[13px] text-slate-300 leading-relaxed font-normal">
                                  {sk.body}
                                </p>
                              )}
                            </div>
                            {(hasValue(sk.num) ||
                              hasValue(sk.category) ||
                              hasValue(sk.title) ||
                              hasValue(sk.body)) && (
                              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-[12px] text-slate-400">
                                {hasValue(sk.num) ? (
                                  <span>Skill #{sk.num}</span>
                                ) : (
                                  <span />
                                )}
                                <span className="text-[#36BFFB] font-semibold">
                                  Verified
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
