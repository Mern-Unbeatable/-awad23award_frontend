import type { GalleryItem, HomeSection, Post, Product, SchedulingSettings, Service, SiteSettings, Testimonial } from '../types';

const IMG = {
  // Soft professional portrait (desk / consultant feel) — soft-masked in hero CSS
  hero: '/award.png',
  about: '/award.png',
  service1: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&q=80',
  service2: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=80',
  service3: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&q=80',
  product1: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1000&q=80',
  journal1: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&q=80',
  journal2: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1000&q=80',
  journal3: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&q=80',
  work1: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=80',
  work2: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1000&q=80',
  work3: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&q=80',
};

export const fallbackSettings: SiteSettings = {
  id: 'settings',
  brandName: 'Ahmed Ibrahim',
  taglineEn: 'Technology Strategist & Entrepreneur',
  taglineAr: 'استراتيجي تقني ورائد أعمال',
  contactEmail: 'info@ahmedibrahimofficial.com',
  contactPhone: '966502694984',
  calendlyUrl: '',
  socialInstagram: 'https://www.instagram.com/ahmed__ibrahim.official',
  socialLinkedin: 'https://www.linkedin.com/in/ahmed-ibrahim-a7822153',
  socialYoutube: null,
  seoTitleEn: 'Ahmed Ibrahim | Technology Strategist & Entrepreneur',
  seoTitleAr: 'أحمد إبراهيم | استراتيجي تقني ورائد أعمال',
  seoDescriptionEn:
    'CRM, business systems, WhatsApp automation, and AI agents for enterprises in KSA and globally.',
  seoDescriptionAr:
    'أنظمة CRM، أتمتة واتساب، ووكلاء ذكاء اصطناعي للمؤسسات في السعودية وعالمياً.',
  aboutImageUrl: IMG.about,
  showreelPoster: IMG.hero,
  showreelUrl: '',
};

export const fallbackScheduling: SchedulingSettings = {
  id: 'settings',
  platform: 'calendly',
  isEnabled: false,
  buttonText: 'Book Now',
  buttonColor: '#2563eb',
  bookingUrl: '',
};

export const fallbackSections: HomeSection[] = [
  {
    id: '1',
    key: 'hero',
    titleEn: 'Building Intelligent Business Systems That Scale',
    titleAr: 'بناء أنظمة أعمال ذكية قابلة للتوسع',
    subtitleEn: 'Technology Strategist',
    subtitleAr: 'استراتيجي تقني',
    bodyEn:
      'From CRM and automation to AI and digital solutions, I work with businesses and government entities in KSA to modernize operations and drive real impact.',
    bodyAr:
      'من أنظمة CRM والأتمتة إلى الذكاء الاصطناعي والحلول الرقمية، أعمل مع الشركات والجهات الحكومية في المملكة العربية السعودية لتحديث العمليات وصناعة أثر حقيقي.',
    ctaLabelEn: 'Explore My Work',
    ctaLabelAr: 'استكشف أعمالي',
    ctaLink: '/work',
    imageUrl: IMG.hero,
    order: 0,
  },
  {
    id: '2',
    key: 'mission',
    titleEn: 'Empower organizations through technology, data, and automation — so they can focus on building a better future.',
    titleAr: 'تمكين المؤسسات من خلال التقنية والبيانات والأتمتة — لتتفرغ لبناء مستقبل أفضل.',
    subtitleEn: 'Mission',
    subtitleAr: 'رسالتي',
    bodyEn:
      'Empower organizations through technology, data, and automation — so they can focus on building a better future.',
    bodyAr: 'تمكين المؤسسات من خلال التقنية والبيانات والأتمتة — لتتفرغ لبناء مستقبل أفضل.',
    ctaLabelEn: '',
    ctaLabelAr: '',
    ctaLink: '',
    order: 1,
  },
  {
    id: '3',
    key: 'about',
    titleEn: "I'm Ahmed Ibrahim",
    titleAr: 'أنا أحمد عوض',
    subtitleEn: 'About',
    subtitleAr: 'نبذة',
    bodyEn:
      'Technology strategist and entrepreneur with 8+ years building CRM platforms, WhatsApp automation, and AI agents for enterprises. From Riyadh to global clients, I turn complex operations into scalable digital systems.',
    bodyAr:
      'استراتيجي تقني ورائد أعمال بخبرة تزيد عن 8 سنوات في بناء منصات CRM وأتمتة واتساب ووكلاء ذكاء اصطناعي. من الرياض إلى عملاء عالميين، أحوّل العمليات المعقدة إلى أنظمة رقمية قابلة للتوسع.',
    ctaLabelEn: 'About Me',
    ctaLabelAr: 'من أنا',
    ctaLink: '/about',
    imageUrl: IMG.about,
    order: 2,
  },
  {
    id: '4',
    key: 'services_intro',
    titleEn: 'What I Do',
    titleAr: 'ما أقدمه',
    subtitleEn: 'Services & Product',
    subtitleAr: 'الخدمات والمنتج',
    bodyEn: 'Three core services plus a physical product — all designed for enterprise impact.',
    bodyAr: 'ثلاث خدمات أساسية ومنتج مادي — جميعها مصممة لتأثير مؤسسي.',
    ctaLabelEn: '',
    ctaLabelAr: '',
    ctaLink: '',
    order: 3,
  },
];

export const fallbackServices: Service[] = [
  {
    id: 's1',
    slug: 'crm-business-systems',
    titleEn: 'CRM & Business Systems',
    titleAr: 'CRM وأنظمة الأعمال',
    subtitleEn: 'Enterprise',
    subtitleAr: 'مؤسسي',
    excerptEn:
      'Design and implement Dynamics 365 and custom CRM platforms that unify sales, service, and operations.',
    excerptAr:
      'تصميم وتنفيذ Dynamics 365 ومنصات CRM مخصصة توحّد المبيعات والخدمة والعمليات.',
    bodyEn:
      '<p>From discovery to deployment, I architect CRM ecosystems that align with your business model — not the other way around.</p><p>Includes pipeline design, integration with ERP, reporting dashboards, and team adoption playbooks.</p>',
    bodyAr:
      '<p>من الاكتشاف إلى النشر، أصمم أنظمة CRM تتماشى مع نموذج عملك — وليس العكس.</p><p>يشمل تصميم خط المبيعات والتكامل مع ERP ولوحات التقارير وخطط تبنّي الفريق.</p>',
    featuresEn: [
      'Dynamics 365 implementation',
      'Custom CRM architecture',
      'ERP & third-party integrations',
      'Analytics & reporting',
    ],
    featuresAr: ['تنفيذ Dynamics 365', 'هندسة CRM مخصصة', 'تكامل ERP وأنظمة خارجية', 'تحليلات وتقارير'],
    imageUrl: IMG.service1,
    order: 0,
    published: true,
  },
  {
    id: 's2',
    slug: 'startup-market-entry-strategy',
    titleEn: 'Startup Market Entry & Strategy Assessment',
    titleAr: 'تقييم دخول السوق واستراتيجية الشركات الناشئة',
    subtitleEn: 'Strategy',
    subtitleAr: 'استراتيجية',
    excerptEn:
      'Data-driven strategy and market research to successfully launch and validate your startup.',
    excerptAr:
      'استراتيجية قائمة على البيانات وبحث السوق لإطلاق شركتك الناشئة والتحقق منها بنجاح.',
    bodyEn:
      '<p>I help startups enter new markets with confidence — using data, research, and structured validation before you scale.</p><p>From market fit analysis to competitor benchmarking and product testing, you get a clear roadmap to launch and grow.</p>',
    bodyAr:
      '<p>أساعد الشركات الناشئة على دخول أسواق جديدة بثقة — باستخدام البيانات والبحث والتحقق المنظم قبل التوسع.</p><p>من تحليل ملاءمة السوق إلى مقارنة المنافسين واختبار المنتج، تحصل على خارطة طريق واضحة للإطلاق والنمو.</p>',
    featuresEn: [
      'Market Fit',
      'Strategy Assessment',
      'Market & Competitor Research',
      'Product Validation & Testing',
    ],
    featuresAr: [
      'ملاءمة السوق',
      'تقييم الاستراتيجية',
      'بحث السوق والمنافسين',
      'التحقق من المنتج واختباره',
    ],
    imageUrl: IMG.service2,
    order: 1,
    published: true,
  },
  {
    id: 's3',
    slug: 'lead-generation-ai',
    titleEn: 'Lead Generation & AI Agents',
    titleAr: 'توليد العملاء ووكلاء الذكاء الاصطناعي',
    subtitleEn: 'AI-Powered',
    subtitleAr: 'مدعوم بالذكاء الاصطناعي',
    excerptEn:
      'Deploy AI agents that qualify leads, automate outreach, and integrate with your sales pipeline.',
    excerptAr:
      'نشر وكلاء ذكاء اصطناعي يؤهلون العملاء المحتملين وي automatize التواصل ويتكاملون مع خط المبيعات.',
    bodyEn:
      '<p>Combine Power Platform, Azure AI, and custom agents to accelerate pipeline velocity. From lead scoring to automated follow-ups — measurable ROI from day one.</p>',
    bodyAr:
      '<p>دمج Power Platform وAzure AI ووكلاء مخصصين لتسريع خط المبيعات. من تصنيف العملاء إلى المتابعة الآلية — عائد استثمار قابل للقياس من اليوم الأول.</p>',
    featuresEn: [
      'AI lead qualification',
      'Automated outreach flows',
      'Power Platform & Azure AI',
      'Pipeline analytics',
    ],
    featuresAr: ['تأهيل العملاء بالذكاء الاصطناعي', 'تدفقات تواصل آلية', 'Power Platform وAzure AI', 'تحليلات خط المبيعات'],
    imageUrl: IMG.service3,
    order: 2,
    published: true,
  },
];

export const fallbackProducts: Product[] = [
  {
    id: 'prod1',
    slug: 'enterprise-automation-kit',
    titleEn: 'Enterprise Automation Kit',
    titleAr: 'مجموعة أتمتة المؤسسات',
    excerptEn:
      'Physical starter kit with documentation, templates, and onboarding materials for CRM and WhatsApp automation projects.',
    excerptAr:
      'مجموعة بدء مادية مع وثائق وقوالب ومواد تهيئة لمشاريع CRM وأتمتة واتساب.',
    bodyEn:
      '<p>A curated physical product for teams kickstarting digital transformation. Includes printed playbooks, workflow templates, and access to exclusive setup guides.</p><p>Ideal for enterprises beginning their automation journey — contact for pricing and availability.</p>',
    bodyAr:
      '<p>منتج مادي منسّق للفرق التي تبدأ التحول الرقمي. يشمل دلائل مطبوعة وقوالب سير عمل ووصول إلى أدلة إعداد حصرية.</p><p>مثالي للمؤسسات في بداية رحلة الأتمتة — تواصل للأسعار والتوفر.</p>',
    imageUrl: IMG.product1,
    priceLabelEn: 'Contact for pricing',
    priceLabelAr: 'تواصل للاستفسار عن السعر',
    order: 0,
    published: true,
  },
];

export const fallbackPosts: Post[] = [
  {
    id: 'p1',
    slug: 'crm-transformation-ksa',
    titleEn: 'CRM Transformation in KSA: What Enterprises Get Wrong',
    titleAr: 'تحول CRM في السعودية: ما تخطئ فيه المؤسسات',
    excerptEn: 'Three patterns I see in every failed CRM rollout — and how to avoid them.',
    excerptAr: 'ثلاثة أنماط أراها في كل مشروع CRM فاشل — وكيف تتجنبها.',
    bodyEn:
      '<p>Most CRM failures are not technical. They are adoption and alignment failures.</p><p>In this insight I break down the three most common mistakes Saudi enterprises make when rolling out Dynamics 365 or custom CRM — and the playbook that actually works.</p>',
    bodyAr:
      '<p>معظم إخفاقات CRM ليست تقنية. إنها إخفاقات في التبنّي والمواءمة.</p><p>في هذه الرؤية أشرح أكثر ثلاثة أخطاء شيوعاً عند نشر Dynamics 365 أو CRM مخصص — وخطة العمل التي تنجح فعلاً.</p>',
    coverImage: IMG.journal1,
    categoryEn: 'CRM',
    categoryAr: 'CRM',
    seoTitleEn: 'CRM Transformation in KSA | Ahmed Ibrahim Insights',
    seoTitleAr: 'تحول CRM في السعودية | رؤى أحمد عوض',
    seoDescriptionEn: 'Common CRM rollout mistakes and how to fix them.',
    seoDescriptionAr: 'أخطاء شائعة في نشر CRM وكيفية إصلاحها.',
    status: 'published',
    publishedAt: '2025-02-15T00:00:00.000Z',
    createdAt: '2025-02-15T00:00:00.000Z',
    updatedAt: '2025-02-15T00:00:00.000Z',
  },
  {
    id: 'p2',
    slug: 'whatsapp-api-enterprise',
    titleEn: 'WhatsApp Business API: Enterprise Implementation Guide',
    titleAr: 'WhatsApp Business API: دليل التنفيذ المؤسسي',
    excerptEn: 'Compliance, scaling, and integration patterns for WhatsApp at scale.',
    excerptAr: 'أنماط الامتثال والتوسع والتكامل لواتساب على نطاق واسع.',
    bodyEn:
      '<p>WhatsApp is the default channel in KSA. But enterprise API implementation requires careful planning.</p><ul><li>Meta Business verification</li><li>Message template approval</li><li>CRM logging and audit trails</li><li>Agent handoff workflows</li></ul>',
    bodyAr:
      '<p>واتساب هو القناة الافتراضية في السعودية. لكن تنفيذ API المؤسسي يتطلب تخطيطاً دقيقاً.</p><ul><li>التحقق من Meta Business</li><li>اعتماد قوالب الرسائل</li><li>تسجيل CRM ومسارات التدقيق</li><li>سير عمل تحويل الوكيل</li></ul>',
    coverImage: IMG.journal2,
    categoryEn: 'Automation',
    categoryAr: 'أتمتة',
    status: 'published',
    publishedAt: '2025-01-20T00:00:00.000Z',
    createdAt: '2025-01-20T00:00:00.000Z',
    updatedAt: '2025-01-20T00:00:00.000Z',
  },
  {
    id: 'p3',
    slug: 'ai-agents-sales-pipeline',
    titleEn: 'AI Agents in the Sales Pipeline: From Hype to ROI',
    titleAr: 'وكلاء الذكاء الاصطناعي في خط المبيعات: من الضجيج إلى العائد',
    excerptEn: 'How to deploy AI agents that actually move pipeline metrics.',
    excerptAr: 'كيف تنشر وكلاء ذكاء اصطناعي يحركون مقاييس خط المبيعات فعلاً.',
    bodyEn:
      '<p>AI agents are not magic. They are workflow automation with intelligence layered on top.</p><p>I share the framework I use with clients: define the job, measure the baseline, deploy incrementally, and iterate on real data.</p>',
    bodyAr:
      '<p>وكلاء الذكاء الاصطناعي ليسوا سحراً. إنهم أتمتة سير عمل مع طبقة ذكاء فوقها.</p><p>أشارك الإطار الذي أستخدمه مع العملاء: حدّد المهمة، قِس الأساس، انشر تدريجياً، وكرّر على بيانات حقيقية.</p>',
    coverImage: IMG.journal3,
    categoryEn: 'AI',
    categoryAr: 'ذكاء اصطناعي',
    status: 'published',
    publishedAt: '2024-12-10T00:00:00.000Z',
    createdAt: '2024-12-10T00:00:00.000Z',
    updatedAt: '2024-12-10T00:00:00.000Z',
  },
];

export const fallbackGallery: GalleryItem[] = [
  {
    id: 'g1',
    titleEn: 'EKSB Platform',
    titleAr: 'منصة EKSB',
    slug: 'eksb-platform',
    excerptEn: 'Enterprise CRM and operations platform built for measurable impact across teams.',
    excerptAr: 'منصة CRM وعمليات مؤسسية صُممت لأثر قابل للقياس عبر الفرق.',
    bodyEn:
      '<p>EKSB Platform modernized how enterprise teams manage projects, data, and reporting in one connected system.</p><p>We designed workflows, dashboards, and integrations that reduced manual work and gave leadership a clear view of delivery performance.</p><ul><li>Unified project and operations dashboards</li><li>Role-based workflows for multi-team delivery</li><li>Reporting that supports faster executive decisions</li></ul>',
    bodyAr:
      '<p>حدّثت منصة EKSB طريقة إدارة الفرق للمشاريع والبيانات والتقارير ضمن نظام متصل واحد.</p><p>صممنا سير العمل ولوحات المتابعة والتكاملات لتقليل العمل اليدوي ومنح القيادة رؤية أوضح لأداء التسليم.</p><ul><li>لوحات موحدة للمشاريع والعمليات</li><li>سير عمل حسب الأدوار لفرق متعددة</li><li>تقارير تدعم قرارات تنفيذية أسرع</li></ul>',
    order: 0,
    published: true,
    media: { id: 'm1', type: 'image', url: IMG.work1, altEn: 'EKSB Platform', altAr: 'منصة EKSB' },
  },
  {
    id: 'g2',
    titleEn: 'WhatsApp Bot System',
    titleAr: 'نظام روبوت واتساب',
    slug: 'whatsapp-bot-system',
    excerptEn: 'Automated WhatsApp engagement that qualifies leads and supports customers around the clock.',
    excerptAr: 'تفاعل واتساب مؤتمت يؤهل العملاء المحتملين ويدعم العملاء على مدار الساعة.',
    bodyEn:
      '<p>This WhatsApp automation system handles conversations, qualification, and routing so sales and support teams focus on high-value interactions.</p><p>The bot connects messaging flows with CRM updates, reminders, and handoff rules for live agents when needed.</p><ul><li>24/7 lead capture and qualification</li><li>CRM sync for conversation context</li><li>Smart handoff from bot to human agents</li></ul>',
    bodyAr:
      '<p>يتولى نظام أتمتة واتساب هذا المحادثات والتأهيل والتوجيه حتى تركز فرق المبيعات والدعم على التفاعلات عالية القيمة.</p><p>يربط الروبوت تدفقات الرسائل بتحديثات CRM والتذكيرات وقواعد التحويل للوكلاء البشريين عند الحاجة.</p><ul><li>التقاط وتأهيل العملاء المحتملين على مدار الساعة</li><li>مزامنة CRM لسياق المحادثة</li><li>تحويل ذكي من الروبوت إلى الوكلاء البشريين</li></ul>',
    order: 1,
    published: true,
    media: { id: 'm2', type: 'image', url: IMG.work2, altEn: 'WhatsApp Bot', altAr: 'روبوت واتساب' },
  },
  {
    id: 'g3',
    titleEn: 'BaytStay Hospitality',
    titleAr: 'بيت ستاي للضيافة',
    slug: 'baytstay-hospitality',
    excerptEn: 'Hospitality technology that streamlines booking, guest experience, and operations.',
    excerptAr: 'تقنية ضيافة تبسّط الحجز وتجربة الضيف والعمليات.',
    bodyEn:
      '<p>BaytStay needed a clearer digital experience for guests and a more reliable operations backbone for the team.</p><p>We delivered product and systems work that improved booking clarity, guest communication, and day-to-day hospitality workflows.</p><ul><li>Guest-facing booking and discovery improvements</li><li>Operational tooling for hospitality teams</li><li>Connected communication touchpoints for guests</li></ul>',
    bodyAr:
      '<p>احتاجت بيت ستاي تجربة رقمية أوضح للضيوف وعمود عمليات أكثر موثوقية للفريق.</p><p>قدّمنا عملاً على المنتج والأنظمة حسّن وضوح الحجز وتواصل الضيوف وسير عمل الضيافة اليومي.</p><ul><li>تحسينات الحجز والاكتشاف للضيوف</li><li>أدوات تشغيلية لفرق الضيافة</li><li>نقاط تواصل متصلة للضيوف</li></ul>',
    order: 2,
    published: true,
    media: { id: 'm3', type: 'image', url: IMG.work3, altEn: 'BaytStay', altAr: 'بيت ستاي' },
  },
];

export const fallbackTestimonials: Testimonial[] = [];
