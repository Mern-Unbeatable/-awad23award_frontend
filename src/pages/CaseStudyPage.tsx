import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
} from 'lucide-react';
import { Seo } from '../components/Seo';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';
import { SiteFooter } from '../components/site/SiteFooter';
import { pick } from '../types';

export function CaseStudyPage() {
  const { slug = '' } = useParams();
  const { locale, pathFor, t } = useLocale();
  const { settings, gallery } = useSite();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const item = gallery.find((g) => g.slug === slug);
  const title = item ? pick(item, locale, 'title') : t("Modernizing REDF's Microsoft Dynamics CRM Platform", "تحديث منصة مايكروسوفت ديناميكس CRM لمؤسسة REDF");
  const excerpt = item ? pick(item, locale, 'excerpt') : t("How a legacy CRM system was reverse-engineered, modernized, and scaled into an enterprise-wide Case Management System.", "كيف تم تفكيك وإعادة تحديث نظام إدارة علاقات العملاء CRM وتوسيع نطاقه إلى نظام إدارة حالات مؤسسي.");

  return (
    <>
      <Seo
        title={`${title} | ${settings.brandName}`}
        description={excerpt}
        path={pathFor(`/work/${slug}`)}
      />

      <div className="bg-white pt-28 pb-16 min-h-screen text-slate-800">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* HEADER / HERO SECTION */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-[#36BFFB] font-semibold text-[13px] uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4" />
              {t('PAGE 01 • CRM Strategy Case Study', 'الصفحة 01 • دراسة حالة استراتيجية CRM')}
            </span>

            <h1 className="text-[38px] sm:text-[48px] md:text-[56px] font-serif font-bold text-[#0F2E25] tracking-tight leading-[1.12] mb-8">
              {title}
            </h1>

            {/* Client & Role Metadata Bar */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 pt-4 pb-2">
              <div className="flex items-center gap-3 text-start">
                <div className="w-10 h-10 rounded-lg bg-[#053F32] text-white flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-[#36BFFB]" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {t('CLIENT', 'العميل')}
                  </span>
                  <span className="text-[14px] font-bold text-slate-800">
                    Real Estate Development Fund (REDF)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-start">
                <div className="w-10 h-10 rounded-lg bg-[#053F32] text-white flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5 text-[#36BFFB]" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {t('ROLE', 'الدور')}
                  </span>
                  <span className="text-[14px] font-bold text-slate-800">
                    CRM Consultant & Technical Lead
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Laptop Image Mockup */}
          <div className="rounded-lg overflow-hidden bg-[#181C20] p-4 md:p-8 shadow-xl mb-12 border border-slate-200/80">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80"
              alt="REDF CRM Dashboard"
              className="w-full h-auto rounded-lg object-cover max-h-[560px]"
            />
          </div>

          {/* Intro Text & Action Badges */}
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
            <p className="text-[17px] md:text-[18.5px] text-slate-700 leading-relaxed font-medium">
              {t(
                'I joined REDF to help improve adoption of its Microsoft Dynamics CRM-based Case Management System.',
                'انضممت إلى REDF للمساعدة في تحسين تبني نظام إدارة الحالات القائم على مايكروسوفت ديناميكس CRM.'
              )}
            </p>
            <p className="text-[15.5px] text-slate-600 leading-relaxed">
              {t(
                'The project presented an unusual challenge: the previous implementation partner had exited without a proper handover, leaving behind limited documentation, fragmented source code, and little institutional knowledge.',
                'قدم المشروع تحدياً غير عادي: خرج الشريك المنفذ السابق دون تسليم مناسب، مخلفاً وراءه وثائق محدودة، وشفرات مبعثرة، وقليلاً من المعرفة المؤسسية.'
              )}
            </p>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#solution"
                className="inline-flex items-center gap-2 bg-[#36BFFB] hover:bg-[#20B0F0] text-white rounded-lg px-6 py-3 text-[14px] font-semibold transition-colors shadow-sm"
              >
                <span>{t('View Case Study', 'عرض دراسة الحالة')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>

              <div className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 text-slate-700 rounded-lg px-5 py-3 text-[13px] font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>6-Month Engagement • CRM 2.0 Delivery</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: PAGE 02 • THE CHALLENGE */}
          <div className="pt-12 pb-20 border-t border-slate-200/80">
            <div className="mb-10">
              <span className="inline-flex items-center gap-1.5 text-[#2E7D6E] font-semibold text-[13px] uppercase tracking-wider mb-2">
                ⓘ {t('PAGE 02 • The Challenge', 'الصفحة 02 • التحدي')}
              </span>
              <h2 className="text-[36px] md:text-[46px] font-serif font-bold text-[#0F2E25] tracking-tight">
                {t('The Challenge', 'التحدي')}
              </h2>
              <p className="text-[16.5px] text-slate-600 mt-2 max-w-2xl">
                {t(
                  'Before any improvements could be made, the first challenge was understanding how the existing platform actually worked.',
                  'قبل إجراء أي تحسينات، كان التحدي الأول هو فهم كيفية عمل المنصة الحالية بالفعل.'
                )}
              </p>
            </div>

            {/* 2-Column Grid */}
            <div className="grid lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column: Legacy System State */}
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
                  <span className="bg-[#36BFFB] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                    CRITICAL GPA
                  </span>
                </div>

                {/* 5 Stacked Cards */}
                {[
                  {
                    icon: Users,
                    title: 'Previous implementation partner exited',
                    body: 'The incoming consulting phase began abruptly after the departure of the former vendor team.',
                  },
                  {
                    icon: AlertTriangle,
                    title: 'No proper handover',
                    body: 'Zero structured transition protocols, knowledge transfer sessions, or operation manuals were provided.',
                  },
                  {
                    icon: FileText,
                    title: 'Limited documentation',
                    body: 'System specifications, business rules, and technical architecture blueprints were missing or obsolete.',
                  },
                  {
                    icon: Code2,
                    title: 'Fragmented source code',
                    body: 'Custom code artifacts were scattered across unindexed repositories, sandbox environments, and servers.',
                  },
                  {
                    icon: BookOpen,
                    title: 'Little institutional knowledge',
                    body: 'Internal teams had minimal clarity on underlying CRM workflows, plugins, and custom entities.',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200/90 rounded-lg p-4 flex items-start gap-4 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[14px] text-slate-900 mb-0.5">{item.title}</h5>
                      <p className="text-[12.5px] text-slate-500 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider pt-2">
                  <span>MICROSOFT DYNAMICS CRM 2011/2016 LEGACY INSTANCE</span>
                  <span>REDF CASE MANAGEMENT SYSTEM</span>
                </div>
              </div>

              {/* Right Column: Dark Analytics Laptop Audit Box */}
              <div className="lg:col-span-6 rounded-lg overflow-hidden bg-[#0A121D] p-6 text-white flex flex-col justify-between relative shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80"
                  alt="Legacy Audit Analytics"
                  className="w-full h-[360px] object-cover rounded-lg mb-6 opacity-85"
                />
                <div className="p-4 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                  <h4 className="text-[20px] font-serif font-bold text-white mb-2">
                    Legacy Architecture Audit Required
                  </h4>
                  <p className="text-[13.5px] text-slate-300 leading-relaxed">
                    System reverse-engineering was required to stitch together fragmented custom plugins, workflow rules, and missing database schemas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: PAGE 03 • MY APPROACH (DARK GREEN BG CONTAINER) */}
          <div className="bg-[#053F32] rounded-lg p-8 md:p-14 text-white mb-20 shadow-xl">
            <div className="mb-10">
              <span className="inline-flex items-center gap-1.5 text-[#36BFFB] font-semibold text-[13px] uppercase tracking-wider mb-2">
                🔍 {t('PAGE 03 • MY APPROACH', 'الصفحة 03 • منهجي في العمل')}
              </span>
              <h2 className="text-[36px] md:text-[46px] font-serif font-bold text-white tracking-tight">
                {t('My Approach', 'منهجيتي')}
              </h2>
              <p className="text-[16px] text-emerald-100/80 mt-1">To rebuild the missing knowledge, I:</p>
            </div>

            {/* Top 2 White Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg p-7 text-slate-900 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-sky-100 text-[#36BFFB] flex items-center justify-center mb-5">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-[20px] font-serif font-bold mb-4 text-[#0F2E25]">Technical Archaeology</h4>
                <ul className="space-y-3 text-[14px] text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#36BFFB] shrink-0 mt-0.5" />
                    <span>Investigated scattered source code across different environments.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#36BFFB] shrink-0 mt-0.5" />
                    <span>Reviewed old configuration files and deployment artifacts.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#36BFFB] shrink-0 mt-0.5" />
                    <span>Watched archived tutorial videos created by previous team members.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-7 text-slate-900 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-sky-100 text-[#36BFFB] flex items-center justify-center mb-5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-[20px] font-serif font-bold mb-4 text-[#0F2E25]">Process Synthesis</h4>
                <ul className="space-y-3 text-[14px] text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#36BFFB] shrink-0 mt-0.5" />
                    <span>Collected undocumented notes from multiple stakeholders.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#36BFFB] shrink-0 mt-0.5" />
                    <span>Reverse-engineered key business processes and customizations.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Middle Architectural Insight Banner */}
            <div className="bg-white rounded-lg p-6 text-slate-900 flex items-start gap-5 mb-8 shadow-md">
              <div className="w-11 h-11 rounded-lg bg-sky-100 text-[#36BFFB] flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  ARCHITECTURAL INSIGHT & KEY TAKEAWAY
                </h5>
                <p className="text-[15px] text-slate-800 leading-relaxed font-medium">
                  During this phase, I gained a deep understanding of Microsoft Dynamics CRM architecture and concepts such as Round Robin case assignment, which became essential for improving workload distribution.
                </p>
              </div>
            </div>

            {/* Simulator Grid */}
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
              <div className="bg-[#111A24] rounded-lg p-6 border border-emerald-800/60 flex flex-col justify-between">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
                  alt="CRM Batch Simulator"
                  className="rounded-lg object-cover h-[220px] w-full mb-4 opacity-90"
                />
                <div className="flex items-center justify-between text-[12px] text-emerald-300">
                  <span>Microsoft Dynamics CRM Reverse Engineering</span>
                  <span className="text-[#36BFFB] font-semibold">Architecture Inspection</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 text-slate-900 flex flex-col justify-between shadow-md">
                <div>
                  <h4 className="font-bold text-[17px] text-[#0F2E25] mb-2 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#36BFFB]" />
                    Dynamics CRM Round Robin Simulator
                  </h4>
                  <p className="text-[13px] text-slate-500 mb-6">
                    Interactive demonstration of the reverse-engineered case assignment algorithm balancing case queue load evenly across REDF consultants:
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-slate-800 text-white rounded-lg p-3 text-center">
                      <span className="text-[11px] text-slate-400 block">Agent Sarah</span>
                      <span className="text-[16px] font-bold text-[#36BFFB]">3 Cases</span>
                    </div>
                    <div className="bg-slate-800 text-white rounded-lg p-3 text-center">
                      <span className="text-[11px] text-slate-400 block">Agent Tariq</span>
                      <span className="text-[16px] font-bold text-[#36BFFB]">2 Cases</span>
                    </div>
                    <div className="bg-slate-800 text-white rounded-lg p-3 text-center">
                      <span className="text-[11px] text-slate-400 block">Agent Maya</span>
                      <span className="text-[16px] font-bold text-[#36BFFB]">2 Cases</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#053F32] rounded-lg p-3.5 text-white flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-emerald-200">ROUTING ENGINE ACTIVITY LOG</span>
                  <span className="bg-[#36BFFB] text-white font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                    ACTIVE ENGINE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: PAGE 04 • TECHNICAL LEADERSHIP */}
          <div className="pb-20 border-b border-slate-200/80">
            <div className="grid lg:grid-cols-12 gap-8 items-start mb-12">
              {/* Left Title Column */}
              <div className="lg:col-span-5 pt-2">
                <span className="inline-flex items-center gap-1.5 bg-[#EAF7FF] text-[#36BFFB] border border-sky-200 font-semibold text-[12px] px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
                  👥 {t('PAGE 04 • TECHNICAL LEADERSHIP', 'الصفحة 04 • القيادة التقنية')}
                </span>
                <h2 className="text-[38px] md:text-[46px] font-serif font-bold text-[#0F2E25] tracking-tight leading-snug mb-4">
                  {t('Technical Leadership', 'القيادة التقنية')}
                </h2>
                <p className="text-[16px] text-slate-500 leading-relaxed max-w-md">
                  {t(
                    'Once the platform was understood, I directed an offshore development team responsible for implementing the next version of the system.',
                    'بمجرد فهم المنصة، قمت بتوجيه فريق تطوير خارجي مسؤول عن تنفيذ الإصدار التالي من النظام.'
                  )}
                </p>
              </div>

              {/* Right Big Card with Cyan Footer Banner */}
              <div className="lg:col-span-7 rounded-lg bg-[#0A0E17] text-white overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between">
                <div className="p-6 md:p-8 grid md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-6 space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                      PILLAR 04 • TECHNICAL LEADERSHIP
                    </span>
                    <h3 className="text-[24px] font-serif font-bold text-white leading-snug">
                      Technical Leadership
                    </h3>
                    <p className="text-[12.5px] text-slate-400 leading-relaxed">
                      While the platform was understood, I directed an offshore development team responsible for implementing the next version of the system.
                    </p>

                    <div className="space-y-2.5 pt-1">
                      <div className="bg-[#141A26] rounded-lg p-3 border border-slate-800">
                        <h5 className="text-[12px] font-bold text-white mb-0.5">Technical Direction & Architecture</h5>
                        <p className="text-[11px] text-slate-400">Defined the system roadmap, development standards, and code refactoring guidelines for Dynamics CRM 2.0.</p>
                      </div>
                      <div className="bg-[#141A26] rounded-lg p-3 border border-slate-800">
                        <h5 className="text-[12px] font-bold text-white mb-0.5">Offshore Team Orchestration</h5>
                        <p className="text-[11px] text-slate-400">Led daily standups, sprint planning, reviews, and cross-timezone code reviews with offshore developers.</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-6">
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                      alt="Technical Leadership & Team Orchestration"
                      className="rounded-lg h-[240px] w-full object-cover shadow-md"
                    />
                  </div>
                </div>

                {/* Bright Cyan Bottom Banner */}
                <div className="bg-[#36BFFB] text-white p-5 px-7 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 block">TEAM EXECUTION</span>
                    <span className="text-[17px] font-bold text-white">Offshore Delivery Alignment</span>
                  </div>
                  <div className="flex items-center gap-2 text-[14px] font-bold">
                    <span className="text-white/80">•</span>
                    <span>100% On Schedule</span>
                  </div>
                  <div className="bg-white/20 hover:bg-white/30 transition-colors border border-white/40 px-4 py-1.5 rounded-lg text-[12px] font-bold text-white cursor-pointer">
                    CRM 2.0 Roadmap
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Bottom Dark Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Users,
                  title: 'Offshore Team Orchestration',
                  body: 'Led daily standups, sprint planning sessions, and cross-timezone code reviews with offshore developers.',
                },
                {
                  icon: Cpu,
                  title: 'Technical Direction & Architecture',
                  body: 'Defined system roadmap, development standards, and code refactoring guidelines for Dynamics CRM 2.0.',
                },
                {
                  icon: GitBranch,
                  title: 'Version Control & Governance',
                  body: 'Established standardized Git branching, deployment pipelines, and environment promotion practices.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Quality Assurance & Handover',
                  body: 'Implemented strict testing benchmarks to ensure flawless deployment into REDF enterprise infrastructure.',
                },
              ].map((c, i) => (
                <div key={i} className="bg-[#2A303C] text-white rounded-lg p-7 shadow-lg border border-slate-700/40 flex flex-col justify-between min-h-[240px]">
                  <div className="w-10 h-10 rounded-lg bg-slate-800/80 text-[#36BFFB] border border-slate-700 flex items-center justify-center mb-5">
                    <c.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[17px] mb-2 font-serif text-white leading-snug">{c.title}</h5>
                    <p className="text-[13px] text-slate-300 leading-relaxed font-normal">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: PAGE 05 • SOLUTION DELIVERED */}
          <div className="id-solution pt-16 pb-12" id="solution">
            <div className="mb-10">
              <span className="inline-flex items-center gap-1.5 text-[#36BFFB] font-semibold text-[13px] uppercase tracking-wider mb-2">
                🛡 {t('PAGE 05 • SOLUTION DELIVERED', 'الصفحة 05 • الحل المنفذ')}
              </span>
              <h2 className="text-[36px] md:text-[46px] font-serif font-bold text-[#0F2E25] tracking-tight">
                {t('Solution Delivered', 'الحل المنفذ')}
              </h2>
              <p className="text-[16.5px] text-slate-600 mt-2 max-w-3xl">
                {t(
                  "I led the successful deployment of CRM 2.0, introducing several enhancements that significantly improved the platform's capabilities.",
                  "قمت بقيادة النشر الناجح لـ CRM 2.0، وتقديم العديد من التحسينات التي حسنت بشكل كبير قدرات المنصة."
                )}
              </p>
            </div>

            {/* 4 Feature Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Card 1: Green */}
              <div className="bg-[#F2FAF6] border border-emerald-200/90 rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full">
                      Financial Sync
                    </span>
                  </div>
                  <h4 className="text-[18px] font-serif font-bold text-slate-900 mb-2">
                    Credit Bureau integration.
                  </h4>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6">
                    Automated real-time credit score checks and financial eligibility validation directly within customer case records.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-emerald-200/60 text-[12px]">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    ✓ Live in CRM 2.0
                  </span>
                  <span className="text-[#36BFFB] font-semibold flex items-center gap-1">
                    View Specs <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Card 2: Blue */}
              <div className="bg-[#F0F7FF] border border-sky-200/90 rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] bg-sky-100 text-sky-700 font-semibold px-3 py-1 rounded-full">
                      Gov System API
                    </span>
                  </div>
                  <h4 className="text-[18px] font-serif font-bold text-slate-900 mb-2">
                    Ministry of Housing synchronization.
                  </h4>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6">
                    Bi-directional synchronization with official government housing registries to verify land ownership and eligibility status.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-sky-200/60 text-[12px]">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    ✓ Live in CRM 2.0
                  </span>
                  <span className="text-[#36BFFB] font-semibold flex items-center gap-1">
                    View Specs <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Card 3: Orange */}
              <div className="bg-[#FFF9F2] border border-amber-200/90 rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Database className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] bg-amber-100 text-amber-700 font-semibold px-3 py-1 rounded-full">
                      Enterprise Batch Jobs
                    </span>
                  </div>
                  <h4 className="text-[18px] font-serif font-bold text-slate-900 mb-2">
                    Oracle Database integration for bill payments through scheduled batch jobs.
                  </h4>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6">
                    High-volume batch integration transferring billing and transaction logs between Microsoft Dynamics CRM and core Oracle DB systems.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-amber-200/60 text-[12px]">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    ✓ Live in CRM 2.0
                  </span>
                  <span className="text-[#36BFFB] font-semibold flex items-center gap-1">
                    View Specs <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Card 4: Purple */}
              <div className="bg-[#F7F5FF] border border-purple-200/90 rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] bg-purple-100 text-purple-700 font-semibold px-3 py-1 rounded-full">
                      UX & Workflow
                    </span>
                  </div>
                  <h4 className="text-[18px] font-serif font-bold text-slate-900 mb-2">
                    Multiple usability improvements and workflow enhancements across the Case Management System.
                  </h4>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6">
                    Comprehensive UI overhaul simplifying case queue views, auto-populating form fields, and refining approval routing.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-purple-200/60 text-[12px]">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    ✓ Live in CRM 2.0
                  </span>
                  <span className="text-[#36BFFB] font-semibold flex items-center gap-1">
                    View Specs <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Architecture Ecosystem Card */}
            <div className="bg-[#EBEBEF] rounded-lg p-6 md:p-8 grid lg:grid-cols-12 gap-8 items-center border border-slate-300/80 mb-16">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                  🛡 ENTERPRISE ECOSYSTEM INTEGRATION
                </span>
                <h3 className="text-[26px] md:text-[30px] font-serif font-bold text-slate-900 leading-snug">
                  Microsoft Dynamics CRM 2.0 Architecture
                </h3>
                <p className="text-[14px] text-slate-600 leading-relaxed">
                  The deployed release turned a siloed CRM into an interconnected enterprise hub, directly communicating with government databases, banking bureaus, and legacy Oracle data warehouses.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="bg-[#36BFFB] text-white text-[12px] font-semibold px-3 py-1 rounded-lg">
                    Batch Cron: Nightly @ 02:00
                  </span>
                  <span className="bg-white text-slate-700 text-[12px] font-semibold px-3 py-1 rounded-lg border border-slate-300">
                    Zero Downtime Release
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 bg-[#0A121D] rounded-lg p-4 border border-slate-800 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80"
                  alt="Enterprise Architecture Diagram"
                  className="rounded-lg w-full h-[280px] object-cover"
                />
              </div>
            </div>

            {/* SECTION 6: PAGE 06 • OUTCOME */}
            <div className="pt-12 pb-20 border-t border-slate-200/80">
              <div className="mb-8">
                <span className="inline-flex items-center gap-1.5 bg-[#053F32] text-emerald-300 font-semibold text-[12px] px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                  ■ {t('PAGE 06 • OUTCOME', 'الصفحة 06 • النتيجة')}
                </span>
                <h2 className="text-[36px] md:text-[46px] font-serif font-bold text-[#0F2E25] tracking-tight">
                  {t('Outcome', 'النتيجة والأثر')}
                </h2>
              </div>

              <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                {/* Left Column: 3 Dark Outcome Cards */}
                <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
                  <div className="bg-[#111A24] text-white rounded-lg p-6 shadow-md border border-slate-800 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-[14.5px] leading-relaxed text-slate-200 font-medium">
                      The CRM 2.0 release successfully modernized the platform and increased user adoption by providing functionality that better aligned with business processes.
                    </p>
                  </div>

                  <div className="bg-[#111A24] text-white rounded-lg p-6 shadow-md border border-slate-800 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-950/80 text-purple-400 border border-purple-700/60 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <p className="text-[14.5px] leading-relaxed text-slate-200 font-medium">
                      Despite joining a project with almost no documentation or handover, the implementation was delivered successfully through structured investigation, technical leadership, and close coordination with the offshore delivery team.
                    </p>
                  </div>

                  <div className="bg-[#111A24] text-white rounded-lg p-6 shadow-md border border-slate-800 flex flex-col justify-between">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-amber-950/80 text-amber-400 border border-amber-700/60 flex items-center justify-center shrink-0 mt-0.5">
                        <Zap className="w-5 h-5" />
                      </div>
                      <p className="text-[14.5px] leading-relaxed text-slate-200 font-medium">
                        At the end of my six-month engagement, REDF recognized my contribution with a formal letter of appreciation.
                      </p>
                    </div>

                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 bg-[#36BFFB] hover:bg-[#20B0F0] text-white rounded-lg px-5 py-2.5 text-[13px] font-semibold transition-colors self-start shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Inspect Formal Appreciation Document</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Right Column: Formal Letter Preview Card */}
                <div className="lg:col-span-6 rounded-lg bg-[#0A121D] text-white p-6 shadow-xl border border-slate-800 flex flex-col justify-between">
                  <div className="relative rounded-lg overflow-hidden mb-4 border border-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"
                      alt="REDF Formal Letter of Recognition"
                      className="w-full h-[280px] object-cover opacity-90"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-amber-300">
                      ★ Real Estate Development Fund (REDF)
                    </div>
                  </div>

                  <div className="p-2">
                    <h5 className="font-serif font-bold text-amber-400 text-[16px] mb-0.5">
                      ★ Real Estate Development Fund (REDF)
                    </h5>
                    <p className="text-[13px] text-slate-400">Formal Letter of Recognition</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 7: PAGE 07 • KEY SKILLS DEMONSTRATED */}
            <div className="pt-12 pb-16 border-t border-slate-200/80">
              <div className="mb-10">
                <span className="inline-flex items-center gap-1.5 bg-[#EAF7FF] text-[#36BFFB] border border-sky-200 font-semibold text-[12px] px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                  ✦ {t('PAGE 07 • Key Skills', 'الصفحة 07 • المهارات الرئيسية')}
                </span>
                <h2 className="text-[36px] md:text-[46px] font-serif font-bold text-[#0F2E25] tracking-tight">
                  {t('Key Skills Demonstrated', 'المهارات الرئيسية التي تم تطبيقها')}
                </h2>
                <p className="text-[16px] text-slate-600 mt-2">
                  Core competencies applied throughout the 6-month REDF engagement:
                </p>
              </div>

              {/* 7 Skill Cards Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    num: '1',
                    category: 'CORE DOMAIN',
                    title: 'Enterprise Case Management',
                    body: 'Architecting end-to-end case workflows, dynamic ticketing queues, and agent routing.',
                  },
                  {
                    num: '2',
                    category: 'TEAM GOVERNANCE',
                    title: 'Technical Leadership',
                    body: 'Directing offshore development teams, code review standards, and sprint deliveries.',
                  },
                  {
                    num: '3',
                    category: 'ARCHITECTURE',
                    title: 'Legacy System Reverse Engineering',
                    body: 'Deconstructing undocumented Dynamics CRM assemblies, configuration files, and plugins.',
                  },
                  {
                    num: '4',
                    category: 'STRATEGY',
                    title: 'Vendor Transition Management',
                    body: 'Stabilizing platform continuity and taking over operations after exit of previous partner.',
                  },
                  {
                    num: '5',
                    category: 'DATA ENGINEERING',
                    title: 'Oracle Database Integration',
                    body: 'Designing scheduled batch ETL syncs for bill payments and accounting reconciliation.',
                  },
                  {
                    num: '6',
                    category: 'PUBLIC SECTOR API',
                    title: 'Gov Systems Integration',
                    body: 'Synchronizing CRM cases with Ministry of Housing and Credit Bureau registry services.',
                  },
                  {
                    num: '7',
                    category: 'PROCESS DESIGN',
                    title: 'Business Process Analysis',
                    body: 'Mapping stakeholder requirements to Dynamics CRM custom entities and workflow rules.',
                  },
                ].map((sk) => (
                  <div
                    key={sk.num}
                    className="bg-[#111A24] text-white rounded-lg p-6 shadow-md border border-slate-800 flex flex-col justify-between min-h-[210px]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 text-[#36BFFB] flex items-center justify-center text-[13px] font-bold">
                          {sk.num}
                        </div>
                        <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {sk.category}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-[17px] text-white mb-2 leading-snug">
                        {sk.title}
                      </h4>
                      <p className="text-[13px] text-slate-300 leading-relaxed font-normal">
                        {sk.body}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-[12px] text-slate-400">
                      <span>Skill #{sk.num}</span>
                      <span className="text-[#36BFFB] font-semibold flex items-center gap-1">
                        Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
