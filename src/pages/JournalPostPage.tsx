import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Clock, Calendar, Share2, Sparkles } from 'lucide-react';
import { Seo } from '../components/Seo';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';
import { publicApi } from '../lib/api';
import { pick, type Post } from '../types';
import { SiteFooter } from '../components/site/SiteFooter';

import profileImg from '../../award/src/assets/avatar-1.jpg';

export function JournalPostPage() {
  const { slug = '' } = useParams();
  const { locale, pathFor, t } = useLocale();
  const { settings } = useSite();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    void publicApi.getPost(slug).then(setPost);
  }, [slug]);

  const defaultPost = {
    title: t(
      'Building Smarter Businesses with AI Strategy',
      'بناء أعمال أكثر ذكاءً باستراتيجية الذكاء الاصطناعي'
    ),
    subtitle: t(
      'How Artificial Intelligence Is Helping Businesses Work Smarter, Faster, and More Efficiently',
      'كيف يساعد الذكاء الاصطناعي الشركات على العمل بشكل أذكى وأسرع وأكثر كفاءة'
    ),
    category: t('AI Strategy & Digital Transformation', 'استراتيجية الذكاء الاصطناعي والتحول الرقمي'),
    readTime: t('5 min read', '5 دقائق قراءة'),
    authorName: t('Ahmed Awad', 'أحمد عوض'),
    authorRole: t(
      'Senior AI Strategy Consultant & Enterprise Advisor',
      'مستشار رئيسي لاستراتيجية الذكاء الاصطناعي ومستشار مؤسسي'
    ),
    publishedDate: 'July 28, 2026',
    coverImage:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
  };

  const title = post ? pick(post, locale, 'title') : defaultPost.title;
  const category = (post && pick(post, locale, 'category')) || defaultPost.category;
  const coverImg = post?.coverImage || defaultPost.coverImage;

  return (
    <>
      <Seo
        title={`${title} | ${settings.brandName}`}
        description={defaultPost.subtitle}
        image={coverImg}
        path={pathFor(`/journal/${slug}`)}
      />

      <article className="bg-white pt-28 pb-16">
        {/* Article Container */}
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Category & Read time badge */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 text-[#36BFFB] font-semibold text-[13.5px]">
              <Sparkles className="w-4 h-4" />
              {category}
            </span>

            <span className="inline-flex items-center gap-1.5 text-slate-500 text-[12.5px] bg-slate-100 px-3 py-0.5 rounded-full font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {defaultPost.readTime}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-[38px] sm:text-[48px] md:text-[54px] font-serif font-bold text-[#0F2E25] tracking-tight leading-[1.12] mb-4">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-[17px] md:text-[18.5px] text-[#52606D] font-normal leading-relaxed mb-8">
            {defaultPost.subtitle}
          </p>

          {/* Author Meta Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t border-b border-gray-200/90 mb-10">
            {/* Author details */}
            <div className="flex items-center gap-3.5">
              <img
                src={profileImg}
                alt="Ahmed Awad"
                className="w-11 h-11 rounded-full object-cover shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[14.5px] text-foreground">
                    {defaultPost.authorName}
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                    {t('Author', 'الكاتب')}
                  </span>
                </div>
                <span className="text-[12.5px] text-slate-500 block mt-0.5 font-normal">
                  {defaultPost.authorRole}
                </span>
              </div>
            </div>

            {/* Published Date & Share Button */}
            <div className="flex items-center gap-5 text-[13px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Published {defaultPost.publishedDate}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    void navigator.share({ title, url: window.location.href });
                  } else {
                    void navigator.clipboard.writeText(window.location.href);
                    alert(t('Link copied to clipboard!', 'تم نسخ الرابط!'));
                  }
                }}
                className="inline-flex items-center gap-1.5 border border-slate-200 text-slate-700 text-[12px] font-medium px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('Share', 'مشاركة')}</span>
              </button>
            </div>
          </div>

          {/* Featured Cover Image */}
          <div className="rounded-3xl overflow-hidden mb-14 shadow-sm border border-slate-100">
            <img
              src={coverImg}
              alt={title}
              className="w-full h-auto max-h-125 object-cover"
            />
          </div>

          {/* Article Main Body Content */}
          <div className="space-y-14 text-[#374151] leading-relaxed">
            {/* Section 1 + Dark Green Callout Box Grid */}
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              {/* Left Column: Intro Text */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-[32px] md:text-[38px] font-serif font-bold text-[#111827] tracking-tight leading-snug">
                  {t('Why AI Strategy Matters', 'لماذا تعتبر استراتيجية الذكاء الاصطناعي مهمة')}
                </h2>
                <p className="text-[16px] text-gray-600 leading-relaxed">
                  {t(
                    'Many organisations invest in AI tools without a clear roadmap, often leading to unnecessary costs and limited results.',
                    'تستثمر العديد من المؤسسات في أدوات الذكاء الاصطناعي دون خارطة طريق واضحة، مما يؤدي في كثير من الأحيان إلى تكاليف غير ضرورية ونتائج محدودة.'
                  )}
                </p>
                <p className="text-[16px] text-gray-600 leading-relaxed">
                  {t(
                    'A successful AI strategy starts by identifying areas where technology can solve real business challenges.',
                    'تبدأ استراتيجية الذكاء الاصطناعي الناجحة بتحديد المجالات التي يمكن للتكنولوجيا فيها حل التحديات الحقيقية للأعمال.'
                  )}
                </p>
              </div>

              {/* Right Column: Dark Green Callout Box */}
              <div className="lg:col-span-5 bg-[#053F32] rounded-3xl p-7 text-white shadow-md">
                <p className="text-[#36BFFB] text-[13px] font-medium mb-1">Instead of asking,</p>
                <h3 className="text-[20px] font-serif font-bold text-white leading-snug mb-5">
                  "Which AI tool should we use?"
                </h3>

                <p className="text-[#36BFFB] text-[13px] font-medium mb-1">businesses should ask,</p>
                <h3 className="text-[20px] font-serif font-bold text-white leading-snug mb-6">
                  "What problem are we trying to solve?"
                </h3>

                <div className="border-t border-emerald-800/80 pt-4">
                  <p className="text-emerald-100/90 text-[13.5px] leading-relaxed">
                    This mindset ensures that every technology investment supports measurable business outcomes.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Where AI Creates the Greatest Impact */}
            <div className="space-y-4">
              <h2 className="text-[32px] md:text-[38px] font-serif font-bold text-[#111827] tracking-tight leading-snug">
                {t('Where AI Creates the Greatest Impact', 'أين يحقق الذكاء الاصطناعي أكبر تأثير')}
              </h2>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                AI delivers the most value when applied to repetitive, data-driven, and time-consuming processes.
              </p>
              <p className="text-[16px] text-gray-600 font-medium pt-2">
                Businesses commonly see immediate improvements in:
              </p>
              <ul className="space-y-2.5 pl-4 text-[15.5px] text-gray-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 mt-1.5 text-[10px]">•</span>
                  <span>Automating routine administrative tasks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 mt-1.5 text-[10px]">•</span>
                  <span>Enhancing customer support with intelligent assistants.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 mt-1.5 text-[10px]">•</span>
                  <span>Improving forecasting and business reporting.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 mt-1.5 text-[10px]">•</span>
                  <span>Streamlining internal workflows.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 mt-1.5 text-[10px]">•</span>
                  <span>Delivering more personalised customer experiences.</span>
                </li>
              </ul>
              <p className="text-[16px] text-gray-600 leading-relaxed pt-2">
                These improvements allow teams to focus on strategic work instead of manual processes.
              </p>
            </div>

            {/* Section 3: A Practical Approach to AI Adoption */}
            <div className="space-y-4">
              <h2 className="text-[32px] md:text-[38px] font-serif font-bold text-[#111827] tracking-tight leading-snug">
                {t('A Practical Approach to AI Adoption', 'نهج عملي لتبني الذكاء الاصطناعي')}
              </h2>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                Successful AI implementation doesn't happen overnight.
              </p>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                The most effective organisations introduce AI gradually, starting with small, high-impact initiatives before expanding across the business.
              </p>
              <ul className="space-y-2.5 pl-4 text-[15.5px] text-gray-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 mt-1.5 text-[10px]">•</span>
                  <span>Assessing current workflows.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 mt-1.5 text-[10px]">•</span>
                  <span>Identifying automation opportunities.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 mt-1.5 text-[10px]">•</span>
                  <span>Selecting the right technology.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 mt-1.5 text-[10px]">•</span>
                  <span>Measuring results.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 mt-1.5 text-[10px]">•</span>
                  <span>Continuously improving processes.</span>
                </li>
              </ul>
              <p className="text-[16px] text-gray-600 leading-relaxed pt-2">
                This phased approach reduces risk while maximising long-term value.
              </p>
            </div>

            {/* Section 4: Common Mistakes Businesses Make */}
            <div className="space-y-4">
              <h2 className="text-[32px] md:text-[38px] font-serif font-bold text-[#111827] tracking-tight leading-snug">
                {t('Common Mistakes Businesses Make', 'الأخطاء الشائعة التي تقع فيها الشركات')}
              </h2>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                Many AI initiatives fail because organisations focus too much on technology and not enough on people or processes.
              </p>
              <p className="text-[16px] text-gray-600 font-medium pt-2">
                Common mistakes include:
              </p>
              <ul className="space-y-2.5 pl-4 text-[15.5px] text-gray-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 mt-1.5 text-[10px]">•</span>
                  <span>Implementing AI without clear business objectives.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 mt-1.5 text-[10px]">•</span>
                  <span>Expecting immediate results.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 mt-1.5 text-[10px]">•</span>
                  <span>Ignoring employee adoption and training.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 mt-1.5 text-[10px]">•</span>
                  <span>Choosing tools before defining business needs.</span>
                </li>
              </ul>
              <p className="text-[16px] text-gray-600 leading-relaxed pt-2">
                Avoiding these pitfalls can significantly improve the success of any digital transformation initiative.
              </p>
            </div>

            {/* Section 5: Looking Ahead */}
            <div className="space-y-4">
              <h2 className="text-[32px] md:text-[38px] font-serif font-bold text-[#111827] tracking-tight leading-snug">
                {t('Looking Ahead', 'نظرة مستقبلية')}
              </h2>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                AI will continue to reshape the way businesses operate, but success will depend on thoughtful planning rather than simply following trends.
              </p>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                Organisations that combine technology with strong business strategy will be better positioned to adapt, innovate, and compete in an increasingly digital world.
              </p>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                The future belongs to businesses that embrace AI not as a replacement for human expertise, but as a powerful partner in driving smarter decisions and sustainable growth.
              </p>
            </div>

            {/* Section 6: Final Thoughts */}
            <div className="space-y-4 pb-8">
              <h2 className="text-[32px] md:text-[38px] font-serif font-bold text-[#111827] tracking-tight leading-snug">
                {t('Final Thoughts', 'أفكار ختامية')}
              </h2>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                Building a smarter business with AI is about creating practical solutions that improve efficiency, strengthen decision-making, and support long-term success.
              </p>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                With the right strategy, AI becomes more than a technology investment—it becomes a competitive advantage.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Footer CTA */}
      <SiteFooter />
    </>
  );
}
