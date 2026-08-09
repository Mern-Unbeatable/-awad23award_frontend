import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  type LucideIcon,
} from 'lucide-react';
import { Seo } from '../components/Seo';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';
import { SiteFooter } from '../components/site/SiteFooter';
import { pick } from '../types';
import { resolveMediaUrl, isBlobUrl } from '../lib/api';
import type { ChallengeItem, ApproachCard, LeadershipCard, SolutionCard, OutcomeItem, SkillCard } from '../types';

// ─── Icon resolver ────────────────────────────────────────────────────────────
// Converts a stored icon name string into a Lucide component.
const ICON_MAP: Record<string, LucideIcon> = {
  Users, AlertTriangle, FileText, Code2, BookOpen, CheckCircle2,
  Zap, ShieldCheck, ExternalLink, GitBranch, Layers, Database, Cpu,
  Building2, UserCheck,
};
function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? AlertTriangle;
}

// ─── Default fallback data ────────────────────────────────────────────────────
// Used when a portfolio item doesn't yet have a specific field set.

const DEFAULT_CHALLENGE_ITEMS: ChallengeItem[] = [
  { iconName: 'Users', title: 'Previous implementation partner exited', body: 'The incoming consulting phase began abruptly after the departure of the former vendor team.' },
  { iconName: 'AlertTriangle', title: 'No proper handover', body: 'Zero structured transition protocols, knowledge transfer sessions, or operation manuals were provided.' },
  { iconName: 'FileText', title: 'Limited documentation', body: 'System specifications, business rules, and technical architecture blueprints were missing or obsolete.' },
  { iconName: 'Code2', title: 'Fragmented source code', body: 'Custom code artifacts were scattered across unindexed repositories, sandbox environments, and servers.' },
  { iconName: 'BookOpen', title: 'Little institutional knowledge', body: 'Internal teams had minimal clarity on underlying CRM workflows, plugins, and custom entities.' },
];

const DEFAULT_APPROACH_CARDS: ApproachCard[] = [
  { title: 'Technical Archaeology', bullets: ['Investigated scattered source code across different environments.', 'Reviewed old configuration files and deployment artifacts.', 'Watched archived tutorial videos created by previous team members.'] },
  { title: 'Process Synthesis', bullets: ['Collected undocumented notes from multiple stakeholders.', 'Reverse-engineered key business processes and customizations.'] },
];

const DEFAULT_LEADERSHIP_CARDS: LeadershipCard[] = [
  { iconName: 'Users', title: 'Offshore Team Orchestration', body: 'Led daily standups, sprint planning sessions, and cross-timezone code reviews with offshore developers.' },
  { iconName: 'Cpu', title: 'Technical Direction & Architecture', body: 'Defined system roadmap, development standards, and code refactoring guidelines for Dynamics CRM 2.0.' },
  { iconName: 'GitBranch', title: 'Version Control & Governance', body: 'Established standardized Git branching, deployment pipelines, and environment promotion practices.' },
  { iconName: 'ShieldCheck', title: 'Quality Assurance & Handover', body: 'Implemented strict testing benchmarks to ensure flawless deployment into REDF enterprise infrastructure.' },
];

const DEFAULT_SOLUTION_CARDS: SolutionCard[] = [
  { color: 'green', tag: 'Financial Sync', title: 'Credit Bureau integration.', body: 'Automated real-time credit score checks and financial eligibility validation directly within customer case records.' },
  { color: 'blue', tag: 'Gov System API', title: 'Ministry of Housing synchronization.', body: 'Bi-directional synchronization with official government housing registries to verify land ownership and eligibility status.' },
  { color: 'orange', tag: 'Enterprise Batch Jobs', title: 'Oracle Database integration for bill payments through scheduled batch jobs.', body: 'High-volume batch integration transferring billing and transaction logs between Microsoft Dynamics CRM and core Oracle DB systems.' },
  { color: 'purple', tag: 'UX & Workflow', title: 'Multiple usability improvements and workflow enhancements across the Case Management System.', body: 'Comprehensive UI overhaul simplifying case queue views, auto-populating form fields, and refining approval routing.' },
];

const DEFAULT_OUTCOME_ITEMS: OutcomeItem[] = [
  { color: 'emerald', text: 'The CRM 2.0 release successfully modernized the platform and increased user adoption by providing functionality that better aligned with business processes.' },
  { color: 'purple', text: 'Despite joining a project with almost no documentation or handover, the implementation was delivered successfully through structured investigation, technical leadership, and close coordination with the offshore delivery team.' },
  { color: 'amber', text: 'At the end of my six-month engagement, REDF recognized my contribution with a formal letter of appreciation.' },
];

const DEFAULT_SKILL_CARDS: SkillCard[] = [
  { num: '1', category: 'CORE DOMAIN', title: 'Enterprise Case Management', body: 'Architecting end-to-end case workflows, dynamic ticketing queues, and agent routing.' },
  { num: '2', category: 'TEAM GOVERNANCE', title: 'Technical Leadership', body: 'Directing offshore development teams, code review standards, and sprint deliveries.' },
  { num: '3', category: 'ARCHITECTURE', title: 'Legacy System Reverse Engineering', body: 'Deconstructing undocumented Dynamics CRM assemblies, configuration files, and plugins.' },
  { num: '4', category: 'STRATEGY', title: 'Vendor Transition Management', body: 'Stabilizing platform continuity and taking over operations after exit of previous partner.' },
  { num: '5', category: 'DATA ENGINEERING', title: 'Oracle Database Integration', body: 'Designing scheduled batch ETL syncs for bill payments and accounting reconciliation.' },
  { num: '6', category: 'PUBLIC SECTOR API', title: 'Gov Systems Integration', body: 'Synchronizing CRM cases with Ministry of Housing and Credit Bureau registry services.' },
  { num: '7', category: 'PROCESS DESIGN', title: 'Business Process Analysis', body: 'Mapping stakeholder requirements to Dynamics CRM custom entities and workflow rules.' },
];

// ─── Solution card color maps ─────────────────────────────────────────────────
const SOLUTION_COLORS = {
  green:  { card: 'bg-[#F2FAF6] border-emerald-200/90', icon: 'bg-emerald-100 text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', divider: 'border-emerald-200/60' },
  blue:   { card: 'bg-[#F0F7FF] border-sky-200/90',     icon: 'bg-sky-100 text-sky-600',         badge: 'bg-sky-100 text-sky-700',         divider: 'border-sky-200/60' },
  orange: { card: 'bg-[#FFF9F2] border-amber-200/90',   icon: 'bg-amber-100 text-amber-600',     badge: 'bg-amber-100 text-amber-700',     divider: 'border-amber-200/60' },
  purple: { card: 'bg-[#F7F5FF] border-purple-200/90',  icon: 'bg-purple-100 text-purple-600',   badge: 'bg-purple-100 text-purple-700',   divider: 'border-purple-200/60' },
};

const SOLUTION_ICONS: Record<SolutionCard['color'], LucideIcon> = {
  green: ShieldCheck, blue: Building2, orange: Database, purple: Layers,
};

// ─── Outcome color maps ───────────────────────────────────────────────────────
const OUTCOME_COLORS = {
  emerald: 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60',
  purple:  'bg-purple-950/80 text-purple-400 border-purple-700/60',
  amber:   'bg-amber-950/80 text-amber-400 border-amber-700/60',
};
const OUTCOME_ICONS: Record<OutcomeItem['color'], LucideIcon> = {
  emerald: CheckCircle2, purple: ShieldCheck, amber: Zap,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export function CaseStudyPage() {
  const { slug = '' } = useParams();
  const { locale, pathFor, t } = useLocale();
  const { settings, gallery } = useSite();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const item = gallery.find((g) => g.slug === slug);

  // Core fields
  const title = item
    ? pick(item, locale, 'title') || (locale === 'ar' ? item.titleAr : item.titleEn) || (item as unknown as Record<string, string>).title || 'Project Case Study'
    : t("Modernizing REDF's Microsoft Dynamics CRM Platform", "تحديث منصة مايكروسوفت ديناميكس CRM لمؤسسة REDF");

  const excerpt = item
    ? pick(item, locale, 'excerpt') || (locale === 'ar' ? item.excerptAr : item.excerptEn) || (item as unknown as Record<string, string>).excerpt || ''
    : t("How a legacy CRM system was reverse-engineered, modernized, and scaled into an enterprise-wide Case Management System.", "كيف تم تفكيك وإعادة تحديث نظام إدارة علاقات العملاء CRM وتوسيع نطاقه إلى نظام إدارة حالات مؤسسي.");

  const bodyHtml = item
    ? pick(item, locale, 'body') || (locale === 'ar' ? item.bodyAr : item.bodyEn) || (item as unknown as Record<string, string>).body || ''
    : '';

  // Hero
  let heroImage = item?.heroImageUrl || item?.media?.url;
  if (!heroImage || isBlobUrl(heroImage)) {
    heroImage = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80';
  } else {
    heroImage = resolveMediaUrl(heroImage);
  }

  const client = (item && (pick(item, locale, 'client') || item.client)) || (item ? '' : 'Real Estate Development Fund (REDF)');
  const role = (item && (pick(item, locale, 'role') || item.role)) || (item ? '' : 'CRM Consultant & Technical Lead');
  const duration = item?.duration || (item ? '' : '6-Month Engagement • CRM 2.0 Delivery');

  const hasCustomCaseStudyData = Boolean(
    item &&
      (item.challengeItems?.length ||
        item.approachCards?.length ||
        item.leadershipCards?.length ||
        item.solutionCards?.length ||
        item.outcomeItems?.length ||
        item.skillCards?.length)
  );

  // Sections (only used if hasCustomCaseStudyData or default fallback item)
  const challengeHeading = locale === 'ar' ? (item?.challengeHeadingAr || 'التحدي') : (item?.challengeHeadingEn || 'The Challenge');
  const challengeBody = locale === 'ar' ? (item?.challengeBodyAr || t('Before any improvements could be made, the first challenge was understanding how the existing platform actually worked.', 'قبل إجراء أي تحسينات، كان التحدي الأول هو فهم كيفية عمل المنصة الحالية بالفعل.')) : (item?.challengeBodyEn || 'Before any improvements could be made, the first challenge was understanding how the existing platform actually worked.');
  const challengeItems = item?.challengeItems?.length ? item.challengeItems : DEFAULT_CHALLENGE_ITEMS;
  let challengeImage = item?.challengeImageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80';
  if (challengeImage) challengeImage = resolveMediaUrl(challengeImage);
  const challengeCaption = item?.challengeCaption || 'System reverse-engineering was required to stitch together fragmented custom plugins, workflow rules, and missing database schemas.';
  const challengeBadge = item?.challengeBadgeLabel || 'CRITICAL GPA';

  const approachBody = locale === 'ar' ? (item?.approachBodyAr || '') : (item?.approachBodyEn || 'To rebuild the missing knowledge, I:');
  const approachCards = item?.approachCards?.length ? item.approachCards : DEFAULT_APPROACH_CARDS;
  const approachInsight = item?.approachInsight || 'During this phase, I gained a deep understanding of Microsoft Dynamics CRM architecture and concepts such as Round Robin case assignment, which became essential for improving workload distribution.';

  const leadershipBody = locale === 'ar' ? (item?.leadershipBodyAr || '') : (item?.leadershipBodyEn || 'Once the platform was understood, I directed an offshore development team responsible for implementing the next version of the system.');
  const leadershipCards = item?.leadershipCards?.length ? item.leadershipCards : DEFAULT_LEADERSHIP_CARDS;
  const leadershipStat = item?.leadershipBannerStat || '100% On Schedule';

  const solutionBody = locale === 'ar' ? (item?.solutionBodyAr || '') : (item?.solutionBodyEn || "I led the successful deployment of CRM 2.0, introducing several enhancements that significantly improved the platform's capabilities.");
  const solutionCards = item?.solutionCards?.length ? item.solutionCards : DEFAULT_SOLUTION_CARDS;
  let solutionArchImg = item?.solutionArchImageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80';
  if (solutionArchImg) solutionArchImg = resolveMediaUrl(solutionArchImg);
  const solutionArchTitle = item?.solutionArchTitle || 'Microsoft Dynamics CRM 2.0 Architecture';
  const solutionArchBody = item?.solutionArchBody || 'The deployed release turned a siloed CRM into an interconnected enterprise hub, directly communicating with government databases, banking bureaus, and legacy Oracle data warehouses.';

  const outcomeItems = item?.outcomeItems?.length ? item.outcomeItems : DEFAULT_OUTCOME_ITEMS;
  let recognitionImage = item?.recognitionImageUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80';
  if (recognitionImage) recognitionImage = resolveMediaUrl(recognitionImage);
  const recognitionLabel = item?.recognitionLabel || 'Formal Letter of Recognition';

  const skillCards = item?.skillCards?.length ? item.skillCards : DEFAULT_SKILL_CARDS;

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
              {t('PAGE 01 • CRM Strategy Case Study', 'الصفحة 01 • دراسة حالة استراتيجية CRM')}
            </span>

            <h1 className="text-[38px] sm:text-[48px] md:text-[56px] font-serif font-bold text-[#0F2E25] tracking-tight leading-[1.12] mb-8">
              {title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 pt-4 pb-2">
              {client && (
                <div className="flex items-center gap-3 text-start">
                  <div className="w-10 h-10 rounded-lg bg-[#053F32] text-white flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-[#36BFFB]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">{t('CLIENT', 'العميل')}</span>
                    <span className="text-[14px] font-bold text-slate-800">{client}</span>
                  </div>
                </div>
              )}

              {role && (
                <div className="flex items-center gap-3 text-start">
                  <div className="w-10 h-10 rounded-lg bg-[#053F32] text-white flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-[#36BFFB]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">{t('ROLE', 'الدور')}</span>
                    <span className="text-[14px] font-bold text-slate-800">{role}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hero Image */}
          <div className="rounded-lg overflow-hidden bg-[#181C20] p-4 md:p-8 shadow-xl mb-12 border border-slate-200/80">
            <img src={heroImage} alt={title} className="w-full h-auto rounded-lg object-cover max-h-140" />
          </div>

          {/* Intro Text & CTA */}
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
            <p className="text-[17px] md:text-[18.5px] text-slate-700 leading-relaxed font-medium">{excerpt}</p>

            {(hasCustomCaseStudyData || duration) && (
              <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
                {hasCustomCaseStudyData && (
                  <a href="#solution"
                    className="inline-flex items-center gap-2 bg-[#36BFFB] hover:bg-[#20B0F0] text-white rounded-lg px-6 py-3 text-[14px] font-semibold transition-colors shadow-sm">
                    <span>{t('View Case Study', 'عرض دراسة الحالة')}</span>
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
              <div className="pt-12 pb-20 border-t border-slate-200/80">
                <div className="mb-10">
                  <span className="inline-flex items-center gap-1.5 text-[#2E7D6E] font-semibold text-[13px] uppercase tracking-wider mb-2">
                    ⓘ {t('PAGE 02 • The Challenge', 'الصفحة 02 • التحدي')}
                  </span>
                  <h2 className="text-[36px] md:text-[46px] font-serif font-bold text-[#0F2E25] tracking-tight">{challengeHeading}</h2>
                  <p className="text-[16.5px] text-slate-600 mt-2 max-w-2xl">{challengeBody}</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                  {/* Left: Challenge Items */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="bg-[#FFF8F0] border border-amber-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[15px] text-slate-900">Legacy System State</h4>
                          <p className="text-[12px] text-slate-500">Core bottlenecks inherited upon engagement</p>
                        </div>
                      </div>
                      <span className="bg-[#36BFFB] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase">{challengeBadge}</span>
                    </div>

                    {challengeItems.map((ci, idx) => {
                      const Icon = getIcon(ci.iconName);
                      return (
                        <div key={idx} className="bg-white border border-slate-200/90 rounded-lg p-4 flex items-start gap-4 shadow-sm">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-bold text-[14px] text-slate-900 mb-0.5">{ci.title}</h5>
                            <p className="text-[12.5px] text-slate-500 leading-relaxed">{ci.body}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right: Challenge Image */}
                  <div className="lg:col-span-6 rounded-lg overflow-hidden bg-[#0A121D] p-6 text-white flex flex-col justify-between relative shadow-lg">
                    <img src={challengeImage} alt="Legacy Audit Analytics" className="w-full h-90 object-cover rounded-lg mb-6 opacity-85" />
                    <div className="p-4 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                      <h4 className="text-[20px] font-serif font-bold text-white mb-2">Legacy Architecture Audit Required</h4>
                      <p className="text-[13.5px] text-slate-300 leading-relaxed">{challengeCaption}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: MY APPROACH ───────────────────────────── */}
              <div className="bg-[#053F32] rounded-lg p-8 md:p-14 text-white mb-20 shadow-xl">
                <div className="mb-10">
                  <span className="inline-flex items-center gap-1.5 text-[#36BFFB] font-semibold text-[13px] uppercase tracking-wider mb-2">
                    🔍 {t('PAGE 03 • MY APPROACH', 'الصفحة 03 • منهجي في العمل')}
                  </span>
                  <h2 className="text-[36px] md:text-[46px] font-serif font-bold text-white tracking-tight">{t('My Approach', 'منهجيتي')}</h2>
                  <p className="text-[16px] text-emerald-100/80 mt-1">{approachBody}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {approachCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-7 text-slate-900 shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-sky-100 text-[#36BFFB] flex items-center justify-center mb-5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h4 className="text-[20px] font-serif font-bold mb-4 text-[#0F2E25]">{card.title}</h4>
                      <ul className="space-y-3 text-[14px] text-slate-600">
                        {card.bullets.filter(Boolean).map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#36BFFB] shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {approachInsight && (
                  <div className="bg-white rounded-lg p-6 text-slate-900 flex items-start gap-5 mb-8 shadow-md">
                    <div className="w-11 h-11 rounded-lg bg-sky-100 text-[#36BFFB] flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">ARCHITECTURAL INSIGHT & KEY TAKEAWAY</h5>
                      <p className="text-[15px] text-slate-800 leading-relaxed font-medium">{approachInsight}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── SECTION 4: TECHNICAL LEADERSHIP ─────────────────── */}
              <div className="pb-20 border-b border-slate-200/80">
                <div className="grid lg:grid-cols-12 gap-8 items-start mb-12">
                  <div className="lg:col-span-5 pt-2">
                    <span className="inline-flex items-center gap-1.5 bg-[#EAF7FF] text-[#36BFFB] border border-sky-200 font-semibold text-[12px] px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
                      👥 {t('PAGE 04 • TECHNICAL LEADERSHIP', 'الصفحة 04 • القيادة التقنية')}
                    </span>
                    <h2 className="text-[38px] md:text-[46px] font-serif font-bold text-[#0F2E25] tracking-tight leading-snug mb-4">
                      {t('Technical Leadership', 'القيادة التقنية')}
                    </h2>
                    <p className="text-[16px] text-slate-500 leading-relaxed max-w-md">{leadershipBody}</p>
                  </div>

                  <div className="lg:col-span-7 rounded-lg bg-[#0A0E17] text-white overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between">
                    <div className="p-6 md:p-8 grid md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-6 space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">PILLAR 04 • TECHNICAL LEADERSHIP</span>
                        <h3 className="text-[24px] font-serif font-bold text-white leading-snug">{t('Technical Leadership', 'القيادة التقنية')}</h3>
                        <p className="text-[12.5px] text-slate-400 leading-relaxed">{leadershipBody}</p>
                        <div className="space-y-2.5 pt-1">
                          {leadershipCards.slice(0, 2).map((card, idx) => (
                            <div key={idx} className="bg-[#141A26] rounded-lg p-3 border border-slate-800">
                              <h5 className="text-[12px] font-bold text-white mb-0.5">{card.title}</h5>
                              <p className="text-[11px] text-slate-400">{card.body}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-6">
                        <img src={heroImage} alt="Technical Leadership" className="rounded-lg h-60 w-full object-cover shadow-md" />
                      </div>
                    </div>
                    <div className="bg-[#36BFFB] text-white p-5 px-7 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 block">TEAM EXECUTION</span>
                        <span className="text-[17px] font-bold text-white">Offshore Delivery Alignment</span>
                      </div>
                      <div className="flex items-center gap-2 text-[14px] font-bold">
                        <span className="text-white/80">•</span>
                        <span>{leadershipStat}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {leadershipCards.map((card, idx) => {
                    const Icon = getIcon(card.iconName);
                    return (
                      <div key={idx} className="bg-[#2A303C] text-white rounded-lg p-7 shadow-lg border border-slate-700/40 flex flex-col justify-between min-h-60">
                        <div className="w-10 h-10 rounded-lg bg-slate-800/80 text-[#36BFFB] border border-slate-700 flex items-center justify-center mb-5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-[17px] mb-2 font-serif text-white leading-snug">{card.title}</h5>
                          <p className="text-[13px] text-slate-300 leading-relaxed font-normal">{card.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── SECTION 5: SOLUTION DELIVERED ───────────────────── */}
              <div className="pt-16 pb-12" id="solution">
                <div className="mb-10">
                  <span className="inline-flex items-center gap-1.5 text-[#36BFFB] font-semibold text-[13px] uppercase tracking-wider mb-2">
                    🛡 {t('PAGE 05 • SOLUTION DELIVERED', 'الصفحة 05 • الحل المنفذ')}
                  </span>
                  <h2 className="text-[36px] md:text-[46px] font-serif font-bold text-[#0F2E25] tracking-tight">{t('Solution Delivered', 'الحل المنفذ')}</h2>
                  <p className="text-[16.5px] text-slate-600 mt-2 max-w-3xl">{solutionBody}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  {solutionCards.map((card, idx) => {
                    const colors = SOLUTION_COLORS[card.color] || SOLUTION_COLORS.green;
                    const Icon = SOLUTION_ICONS[card.color] || ShieldCheck;
                    return (
                      <div key={idx} className={`${colors.card} border rounded-lg p-6 flex flex-col justify-between`}>
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors.icon}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${colors.badge}`}>{card.tag}</span>
                          </div>
                          <h4 className="text-[18px] font-serif font-bold text-slate-900 mb-2">{card.title}</h4>
                          <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6">{card.body}</p>
                        </div>
                        <div className={`flex items-center justify-between pt-4 border-t text-[12px] ${colors.divider}`}>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1.5">✓ Live in CRM 2.0</span>
                          <span className="text-[#36BFFB] font-semibold flex items-center gap-1">View Specs <ExternalLink className="w-3.5 h-3.5" /></span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Architecture Card */}
                <div className="bg-[#EBEBEF] rounded-lg p-6 md:p-8 grid lg:grid-cols-12 gap-8 items-center border border-slate-300/80 mb-16">
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">🛡 ENTERPRISE ECOSYSTEM INTEGRATION</span>
                    <h3 className="text-[26px] md:text-[30px] font-serif font-bold text-slate-900 leading-snug">{solutionArchTitle}</h3>
                    <p className="text-[14px] text-slate-600 leading-relaxed">{solutionArchBody}</p>
                  </div>
                  <div className="lg:col-span-7 bg-[#0A121D] rounded-lg p-4 border border-slate-800 shadow-xl">
                    <img src={solutionArchImg} alt="Enterprise Architecture" className="rounded-lg w-full h-70 object-cover" />
                  </div>
                </div>

                {/* ── SECTION 6: OUTCOME ──────────────────────────────── */}
                <div className="pt-12 pb-20 border-t border-slate-200/80">
                  <div className="mb-8">
                    <span className="inline-flex items-center gap-1.5 bg-[#053F32] text-emerald-300 font-semibold text-[12px] px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                      ■ {t('PAGE 06 • OUTCOME', 'الصفحة 06 • النتيجة')}
                    </span>
                    <h2 className="text-[36px] md:text-[46px] font-serif font-bold text-[#0F2E25] tracking-tight">{t('Outcome', 'النتيجة والأثر')}</h2>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                    <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
                      {outcomeItems.map((oi, idx) => {
                        const cls = OUTCOME_COLORS[oi.color] || OUTCOME_COLORS.emerald;
                        const Icon = OUTCOME_ICONS[oi.color] || CheckCircle2;
                        return (
                          <div key={idx} className="bg-[#111A24] text-white rounded-lg p-6 shadow-md border border-slate-800 flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${cls}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <p className="text-[14.5px] leading-relaxed text-slate-200 font-medium">{oi.text}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="lg:col-span-6 rounded-lg bg-[#0A121D] text-white p-6 shadow-xl border border-slate-800 flex flex-col justify-between">
                      <div className="relative rounded-lg overflow-hidden mb-4 border border-slate-800">
                        <img src={recognitionImage} alt={recognitionLabel} className="w-full h-70 object-cover opacity-90" />
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-amber-300">
                          ★ {client}
                        </div>
                      </div>
                      <div className="p-2">
                        <h5 className="font-serif font-bold text-amber-400 text-[16px] mb-0.5">★ {client}</h5>
                        <p className="text-[13px] text-slate-400">{recognitionLabel}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── SECTION 7: KEY SKILLS ───────────────────────────── */}
                <div className="pt-12 pb-16 border-t border-slate-200/80">
                  <div className="mb-10">
                    <span className="inline-flex items-center gap-1.5 bg-[#EAF7FF] text-[#36BFFB] border border-sky-200 font-semibold text-[12px] px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                      ✦ {t('PAGE 07 • Key Skills', 'الصفحة 07 • المهارات الرئيسية')}
                    </span>
                    <h2 className="text-[36px] md:text-[46px] font-serif font-bold text-[#0F2E25] tracking-tight">{t('Key Skills Demonstrated', 'المهارات الرئيسية التي تم تطبيقها')}</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skillCards.map((sk) => (
                      <div key={sk.num} className="bg-[#111A24] text-white rounded-lg p-6 shadow-md border border-slate-800 flex flex-col justify-between min-h-52">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 text-[#36BFFB] flex items-center justify-center text-[13px] font-bold">{sk.num}</div>
                            <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">{sk.category}</span>
                          </div>
                          <h4 className="font-serif font-bold text-[17px] text-white mb-2 leading-snug">{sk.title}</h4>
                          <p className="text-[13px] text-slate-300 leading-relaxed font-normal">{sk.body}</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-[12px] text-slate-400">
                          <span>Skill #{sk.num}</span>
                          <span className="text-[#36BFFB] font-semibold">Verified</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}

        </div>
      </div>

      <SiteFooter />
    </>
  );
}
