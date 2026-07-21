import type { GalleryItem, HomeSection, Post, Service, SiteSettings, Testimonial } from '../types';

const IMG = {
  hero: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&q=80',
  about: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1200&q=80',
  speaker: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1600&q=80',
  service1: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&q=80',
  service2: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&q=80',
  service3: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&q=80',
  journal1: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000&q=80',
  journal2: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1000&q=80',
  journal3: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1000&q=80',
  gallery1: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&q=80',
  gallery2: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1000&q=80',
  gallery3: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1000&q=80',
  gallery4: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1000&q=80',
  avatar1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  avatar2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
};

export const fallbackSettings: SiteSettings = {
  id: 'settings',
  brandName: 'Awad Official',
  taglineEn: 'Grow personal brands with maximum impact',
  taglineAr: 'نمِّ علامتك الشخصية بأقصى تأثير',
  contactEmail: 'hello@awadofficial.com',
  calendlyUrl: '',
  socialInstagram: 'https://instagram.com',
  socialLinkedin: 'https://linkedin.com',
  socialYoutube: 'https://youtube.com',
  seoTitleEn: 'Awad Official | Personal Brand Strategist',
  seoTitleAr: 'عوض الرسمي | استراتيجي العلامة الشخصية',
  seoDescriptionEn:
    'Personal brand strategist helping entrepreneurs amplify visibility, value, and impact.',
  seoDescriptionAr: 'استراتيجي علامة شخصية يساعد رواد الأعمال على تعزيز الظهور والقيمة والتأثير.',
  aboutImageUrl: IMG.about,
  showreelPoster: IMG.speaker,
  showreelUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
};

export const fallbackSections: HomeSection[] = [
  {
    id: '1',
    key: 'hero',
    titleEn: 'GROW PERSONAL BRANDS WITH MAXIMUM IMPACT',
    titleAr: 'نمِّ العلامات الشخصية بأقصى تأثير',
    subtitleEn: 'MY METHOD',
    subtitleAr: 'منهجي',
    bodyEn: 'Personal Brand Strategist · Keynote Speaker · Mentor',
    bodyAr: 'استراتيجي علامة شخصية · متحدث رئيسي · مرشد',
    ctaLabelEn: 'Book a Consultation',
    ctaLabelAr: 'احجز استشارة',
    ctaLink: '/contact',
    imageUrl: IMG.hero,
    order: 0,
  },
  {
    id: '2',
    key: 'mission',
    titleEn: 'INSPIRE LIMITLESS ACTION EVERY DAY, EVERYWHERE',
    titleAr: 'ألهم عملاً بلا حدود كل يوم وفي كل مكان',
    subtitleEn: 'MY MISSION',
    subtitleAr: 'مهمتي',
    bodyEn: '',
    bodyAr: '',
    ctaLabelEn: '',
    ctaLabelAr: '',
    ctaLink: '',
    order: 1,
  },
  {
    id: '3',
    key: 'about',
    titleEn: "Hiya! I'm Awad",
    titleAr: 'مرحباً! أنا عوض',
    subtitleEn: 'ABOUT',
    subtitleAr: 'نبذة',
    bodyEn:
      'Personal Brand Strategist, Keynote Speaker, and Mentor. I teach entrepreneurs and leaders how to package their brilliance, amplify their message, and build brands so magnetic that opportunities chase them.',
    bodyAr:
      'استراتيجي علامة شخصية ومتحدث رئيسي ومرشد. أعلّم رواد الأعمال والقادة كيف يعبّئون تميزهم ويضخّمون رسالتهم ويبنون علامات تجذب الفرص.',
    ctaLabelEn: 'Get in Touch',
    ctaLabelAr: 'تواصل معي',
    ctaLink: '/contact',
    imageUrl: IMG.about,
    order: 2,
  },
  {
    id: '4',
    key: 'services_intro',
    titleEn: 'Are you ready to be more visible, amplify your value and personal brand?',
    titleAr: 'هل أنت مستعد لتكون أكثر ظهوراً وتعزز قيمتك وعلامتك الشخصية؟',
    subtitleEn: 'WORK WITH ME',
    subtitleAr: 'اعمل معي',
    bodyEn: '',
    bodyAr: '',
    ctaLabelEn: '',
    ctaLabelAr: '',
    ctaLink: '',
    order: 3,
  },
  {
    id: '5',
    key: 'showreel',
    titleEn: 'Speaking on stage',
    titleAr: 'التحدث على المسرح',
    subtitleEn: 'SHOWREEL',
    subtitleAr: 'عرض الأعمال',
    bodyEn:
      'From conference stages to private boardrooms, I help leaders elevate their personal brand to maximise income, influence and impact.',
    bodyAr:
      'من منصات المؤتمرات إلى غرف الاجتماعات الخاصة، أساعد القادة على رفع علاماتهم الشخصية لتعظيم الدخل والتأثير.',
    ctaLabelEn: 'Book as a Speaker',
    ctaLabelAr: 'احجزني كمتحدث',
    ctaLink: '/contact',
    imageUrl: IMG.speaker,
    order: 4,
  },
];

export const fallbackServices: Service[] = [
  {
    id: 's1',
    slug: 'brand-accelerator',
    titleEn: 'Brand Accelerator',
    titleAr: 'مُسرّع العلامة',
    subtitleEn: '1-ON-1 MENTORING',
    subtitleAr: 'إرشاد فردي',
    excerptEn:
      'Accountability & accelerate your visibility. A fool-proof personal branding roadmap in bite-size, actionable steps.',
    excerptAr: 'مساءلة وتسريع ظهورك. خارطة طريق للعلامة الشخصية بخطوات عملية قابلة للتنفيذ.',
    bodyEn:
      'Get Started: Accountability & Accelerate Your Visibility. This programme delivers a fool-proof personal branding road map in bite-size, actionable steps that will help you create more credibility, get more opportunities and make a bigger impact.',
    bodyAr:
      'ابدأ: مساءلة وتسريع ظهورك. يقدّم هذا البرنامج خارطة طريق للعلامة الشخصية بخطوات عملية تساعدك على بناء المصداقية واقتناص الفرص وصنع تأثير أكبر.',
    featuresEn: [
      'Personal brand audit',
      'Visibility roadmap',
      'Content & messaging strategy',
      'Weekly accountability',
    ],
    featuresAr: ['تدقيق العلامة الشخصية', 'خارطة ظهور', 'استراتيجية محتوى ورسالة', 'مساءلة أسبوعية'],
    imageUrl: IMG.service1,
    order: 0,
    published: true,
  },
  {
    id: 's2',
    slug: 'brand-lite',
    titleEn: 'Brand Lite',
    titleAr: 'العلامة لايت',
    subtitleEn: '1-ON-1 MENTORING',
    subtitleAr: 'إرشاد فردي',
    excerptEn:
      'Bridge the gap between who you are and how you’re seen with a personal brand strategy for your next level.',
    excerptAr: 'سد الفجوة بين من أنت وكيف يراك الناس باستراتيجية علامة شخصية لمستواك التالي.',
    bodyEn:
      'Position Your Personal Brand & Business for Success. Bridge the gap between who you are and how you’re seen with a personal brand strategy that supports your next level of business, leadership, or visibility.',
    bodyAr:
      'ضع علامتك الشخصية وعملك في موضع النجاح. سد الفجوة بين من أنت وكيف تُرى باستراتيجية تدعم مستواك التالي في العمل أو القيادة أو الظهور.',
    featuresEn: ['Positioning workshop', 'Offer clarity', 'Brand story framework', 'Launch checklist'],
    featuresAr: ['ورشة تموضع', 'وضوح العرض', 'إطار قصة العلامة', 'قائمة إطلاق'],
    imageUrl: IMG.service2,
    order: 1,
    published: true,
  },
  {
    id: 's3',
    slug: 'brand-speaker',
    titleEn: 'Brand Speaker',
    titleAr: 'متحدث العلامة',
    subtitleEn: '1-ON-1 MENTORING',
    subtitleAr: 'إرشاد فردي',
    excerptEn:
      'Become a paid speaker & thought leader. Transition from business speaker to paid stage opportunities.',
    excerptAr: 'كن متحدثاً مدفوعاً وقائداً فكرياً. انتقل من متحدث أعمال إلى فرص منصات مدفوعة.',
    bodyEn:
      'Become a Paid Speaker & Thought Leader in Your Industry. Ready to take the stage and get paid for it? This programme is designed for professionals who want high-profile speaking and panel opportunities.',
    bodyAr:
      'كن متحدثاً مدفوعاً وقائداً فكرياً في مجالك. هل أنت مستعد للمنصة والحصول على أجر؟ هذا البرنامج للمحترفين الذين يريدون فرص تحدث ولجان عالية المستوى.',
    featuresEn: [
      'Speaker kit & bio',
      'Signature talk outline',
      'Stage presence coaching',
      'Booking outreach plan',
    ],
    featuresAr: ['حقيبة المتحدث والسيرة', 'مخطط حديث مميز', 'تدريب حضور المنصة', 'خطة تواصل للحجز'],
    imageUrl: IMG.service3,
    order: 2,
    published: true,
  },
];

export const fallbackPosts: Post[] = [
  {
    id: 'p1',
    slug: 'unapologetically-you',
    titleEn: 'Unapologetically You: The Event That Started It All',
    titleAr: 'كن أنت بلا اعتذار: الحدث الذي بدأ كل شيء',
    excerptEn: 'How one bold room of founders rewired what personal branding can feel like.',
    excerptAr: 'كيف أعاد تجمع جريء من المؤسسين تعريف ما يمكن أن تشعر به العلامة الشخصية.',
    bodyEn:
      '<p>Personal branding is not a logo. It is the energy you bring into every room — online and off.</p><p>In this journal entry I unpack the lessons from hosting an intimate event that became the spark for everything that followed: clarity of message, courage of delivery, and consistency of presence.</p><p>If you have been waiting for permission to show up as yourself — this is it.</p>',
    bodyAr:
      '<p>العلامة الشخصية ليست شعاراً. إنها الطاقة التي تحملها إلى كل غرفة — رقمياً وواقعياً.</p><p>في هذه المقالة أشارك دروس استضافة حدث حميمي أصبح شرارة كل ما تلاه: وضوح الرسالة وشجاعة الإلقاء واستمرارية الحضور.</p>',
    coverImage: IMG.journal1,
    categoryEn: 'Business',
    categoryAr: 'أعمال',
    seoTitleEn: 'Unapologetically You | Awad Official Journal',
    seoTitleAr: 'كن أنت بلا اعتذار | مجلة عوض الرسمي',
    seoDescriptionEn: 'Lessons from the event that redefined personal branding presence.',
    seoDescriptionAr: 'دروس من الحدث الذي أعاد تعريف حضور العلامة الشخصية.',
    status: 'published',
    publishedAt: '2025-01-30T00:00:00.000Z',
    createdAt: '2025-01-30T00:00:00.000Z',
    updatedAt: '2025-01-30T00:00:00.000Z',
  },
  {
    id: 'p2',
    slug: 'elevate-your-personal-brand',
    titleEn: 'Elevate Your Personal Brand — One Step at a Time',
    titleAr: 'ارفع علامتك الشخصية — خطوة بخطوة',
    excerptEn: 'Practical moves to stand out for the right reasons without burning out.',
    excerptAr: 'خطوات عملية للتميز بالأسباب الصحيحة دون إرهاق.',
    bodyEn:
      '<p>You do not need to do everything at once. You need a sequence.</p><ul><li>Define your authentic positioning</li><li>Build the seven core brand elements</li><li>Remove the blockers holding you back</li><li>Ship content that compounds</li></ul>',
    bodyAr:
      '<p>لست بحاجة لفعل كل شيء دفعة واحدة. تحتاج تسلسلاً.</p><ul><li>حدّد تموضعك الأصيل</li><li>ابنِ عناصر العلامة الأساسية</li><li>أزل العوائق التي تُبطئك</li><li>أنشر محتوى يتراكم</li></ul>',
    coverImage: IMG.journal2,
    categoryEn: 'Strategy',
    categoryAr: 'استراتيجية',
    status: 'published',
    publishedAt: '2024-03-29T00:00:00.000Z',
    createdAt: '2024-03-29T00:00:00.000Z',
    updatedAt: '2024-03-29T00:00:00.000Z',
  },
  {
    id: 'p3',
    slug: 'stage-presence-notes',
    titleEn: 'Stage Presence Notes From a Year on the Road',
    titleAr: 'ملاحظات حضور المنصة من عام على الطريق',
    excerptEn: 'What actually lands with audiences when the lights go up.',
    excerptAr: 'ما الذي يصل فعلاً للجمهور عندما تُضاء الأنوار.',
    bodyEn:
      '<p>Energy is contagious. Preparation is invisible. Stories are remembered.</p><p>After a year of keynotes and workshops, these are the notes I keep taped inside my notebook before every talk.</p>',
    bodyAr:
      '<p>الطاقة معدية. التحضير غير مرئي. القصص تُحفظ.</p><p>بعد عام من الكلمات وورش العمل، هذه الملاحظات التي أبقيها قبل كل حديث.</p>',
    coverImage: IMG.journal3,
    categoryEn: 'Speaking',
    categoryAr: 'تحدث',
    status: 'published',
    publishedAt: '2024-03-21T00:00:00.000Z',
    createdAt: '2024-03-21T00:00:00.000Z',
    updatedAt: '2024-03-21T00:00:00.000Z',
  },
];

export const fallbackGallery: GalleryItem[] = [
  {
    id: 'g1',
    titleEn: 'Workshop session',
    titleAr: 'جلسة ورشة',
    order: 0,
    published: true,
    media: { id: 'm1', type: 'image', url: IMG.gallery1, altEn: 'Workshop', altAr: 'ورشة' },
  },
  {
    id: 'g2',
    titleEn: 'Team collaboration',
    titleAr: 'تعاون الفريق',
    order: 1,
    published: true,
    media: { id: 'm2', type: 'image', url: IMG.gallery2, altEn: 'Team', altAr: 'فريق' },
  },
  {
    id: 'g3',
    titleEn: 'Keynote moment',
    titleAr: 'لحظة كلمة رئيسية',
    order: 2,
    published: true,
    media: { id: 'm3', type: 'image', url: IMG.gallery3, altEn: 'Keynote', altAr: 'كلمة' },
  },
  {
    id: 'g4',
    titleEn: 'Stage lights',
    titleAr: 'أضواء المنصة',
    order: 3,
    published: true,
    media: { id: 'm4', type: 'image', url: IMG.gallery4, altEn: 'Stage', altAr: 'منصة' },
  },
];

export const fallbackTestimonials: Testimonial[] = [
  {
    id: 't1',
    nameEn: 'Magda Snowden',
    nameAr: 'ماجدة سنودن',
    roleEn: 'Leadership Coach & Trainer',
    roleAr: 'مدربة قيادة',
    quoteEn:
      'The value of investing in the programme is immense — the more action and commitment you put in, the more you gain. Results showed up exactly when promised.',
    quoteAr:
      'قيمة الاستثمار في البرنامج هائلة — كلما زاد التزامك حصلت على نتائج أكبر. ظهرت النتائج في الوقت المتوقع تماماً.',
    avatarUrl: IMG.avatar1,
    order: 0,
  },
  {
    id: 't2',
    nameEn: 'Kamil Shah',
    nameAr: 'كامل شاه',
    roleEn: 'Founder, Success Academy',
    roleAr: 'مؤسس أكاديمية النجاح',
    quoteEn:
      'An amazing mentor. Helped unlock many personal blockers — especially around brand and style of coaching.',
    quoteAr: 'مرشد رائع. ساعد في فتح الكثير من العوائق الشخصية — خاصة حول العلامة وأسلوب الإرشاد.',
    avatarUrl: IMG.avatar2,
    order: 1,
  },
];
