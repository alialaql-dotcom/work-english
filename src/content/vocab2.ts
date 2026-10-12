import type { VocabItem } from './types';

// مفردات الوحدات 2–4 (الإصدار 1.1.0).
// كل الأمثلة افتراضية لأغراض تعليمية، والأرقام والمواصفات أمثلة ولا تمثل منتجًا أو سعرًا أو سياسة حقيقية.

export const VOCAB_2: VocabItem[] = [
  // ───────── الوحدة 2 · الدرس 1: الشاشة والحجم والوزن ─────────
  {
    id: 'screen', en: 'screen', ar: 'شاشة', kind: 'word', ipa: '/skriːn/', arApprox: 'سكرين',
    example: { en: 'The screen is very clear.', ar: 'الشاشة واضحة جدًا.' },
    related: ['display', 'screen protector'],
    cloze: 'screen',
  },
  {
    id: 'inch', en: 'inch / inches', ar: 'بوصة / بوصات', kind: 'word', ipa: '/ɪntʃ/ /ˈɪntʃɪz/', arApprox: 'إنتش / إنتشِز',
    example: { en: 'It has a 6.7-inch screen.', ar: 'شاشته 6.7 بوصة.' },
    usage: 'قبل الاسم نقولها مفردة مع شرطة: a 6.7-inch screen. وبعد الرقم وحدها: The screen is 6.7 inches.',
    mistake: 'لا تقل a 6.7-inches screen.',
    cloze: 'inch',
  },
  {
    id: 'size', en: 'size', ar: 'حجم / مقاس', kind: 'word', ipa: '/saɪz/', arApprox: 'سايز',
    example: { en: 'What size do you prefer, big or small?', ar: 'أي حجم تفضّل، كبير ولا صغير؟' },
    related: ['big', 'small', 'screen size'],
    cloze: 'size',
  },
  {
    id: 'clear', en: 'clear', ar: 'واضح', kind: 'word', ipa: '/klɪr/', arApprox: 'كلير',
    example: { en: 'The colors are bright and clear.', ar: 'الألوان ساطعة وواضحة.' },
    related: ['sharp', 'bright'],
    cloze: 'clear',
  },
  {
    id: 'bright', en: 'bright', ar: 'ساطع', kind: 'word', ipa: '/braɪt/', arApprox: 'برايت',
    example: { en: 'The screen is bright, even outside.', ar: 'الشاشة ساطعة، حتى في الخارج.' },
    related: ['brightness', 'clear'],
    mistake: 'gh صامتة: تُنطق «برايت».',
    cloze: 'bright',
  },
  {
    id: 'light', en: 'light', ar: 'خفيف (الوزن)', kind: 'word', ipa: '/laɪt/', arApprox: 'لايت',
    example: { en: 'This tablet is very light.', ar: 'هذا التابلت خفيف جدًا.' },
    related: ['heavy', 'lighter'],
    usage: 'في الأجهزة تعني غالبًا «خفيف الوزن».',
    mistake: 'light لها معنى آخر هو «ضوء». السياق يحدد المعنى.',
    cloze: 'light',
  },
  {
    id: 'heavy', en: 'heavy', ar: 'ثقيل', kind: 'word', ipa: '/ˈhevi/', arApprox: 'هِفي',
    example: { en: 'This laptop is a little heavy.', ar: 'هذا اللابتوب ثقيل شوي.' },
    related: ['light'],
    cloze: 'heavy',
  },
  {
    id: 'thin', en: 'thin', ar: 'رفيع / نحيف', kind: 'word', ipa: '/θɪn/', arApprox: 'ثِن',
    example: { en: 'The new model is very thin.', ar: 'الموديل الجديد رفيع جدًا.' },
    related: ['light', 'slim'],
    mistake: 'th هنا تُنطق «ث» وليس «ت» أو «س».',
    cloze: 'thin',
  },

  // ───────── الوحدة 2 · الدرس 2: البطارية والشحن ─────────
  {
    id: 'battery-life', en: 'battery life', ar: 'عمر البطارية (كم تدوم بعد الشحن)', kind: 'phrase', ipa: '/ˈbætəri laɪf/', arApprox: 'باتَري لايف',
    example: { en: 'The battery life is very good.', ar: 'البطارية تدوم طويلًا.' },
    related: ['battery', 'last'],
    cloze: 'life',
  },
  {
    id: 'last', en: 'last', ar: 'يدوم', kind: 'word', ipa: '/læst/', arApprox: 'لاست',
    example: { en: 'The battery lasts all day.', ar: 'البطارية تكفي اليوم كله.' },
    usage: 'It lasts + مدة: It lasts about 10 hours.',
    mistake: 'last لها معنى آخر «الأخير». ومع it نضيف s: it lasts.',
    cloze: 'lasts',
  },
  {
    id: 'hours', en: 'hours', ar: 'ساعات', kind: 'word', ipa: '/ˈaʊərz/', arApprox: 'آوَرز',
    example: { en: 'It lasts about 20 hours.', ar: 'تدوم حوالي 20 ساعة.' },
    mistake: 'h صامتة: تُنطق «آوَرز». ولذلك نقول an hour.',
    cloze: 'hours',
  },
  {
    id: 'fast-charging', en: 'fast charging', ar: 'شحن سريع', kind: 'phrase', ipa: '/fæst ˈtʃɑːrdʒɪŋ/', arApprox: 'فاست تشارجِنق',
    example: { en: 'It supports fast charging.', ar: 'يدعم الشحن السريع.' },
    related: ['charger', 'watts'],
    cloze: 'fast',
  },
  {
    id: 'watts', en: 'watts', ar: 'واط', kind: 'word', ipa: '/wɑːts/', arApprox: 'واتس',
    example: { en: 'You need a 25-watt charger for fast charging.', ar: 'تحتاج شاحن 25 واط للشحن السريع.' },
    usage: '20W تُقرأ twenty watts. قبل الاسم مفردة مع شرطة: a 20-watt charger.',
    cloze: 'watt',
  },
  {
    id: 'fully-charged', en: 'fully charged', ar: 'مشحون بالكامل', kind: 'phrase', ipa: '/ˈfʊli tʃɑːrdʒd/', arApprox: 'فولي تشارجد',
    example: { en: 'It takes about one hour to be fully charged.', ar: 'يحتاج حوالي ساعة ليُشحن بالكامل.' },
    related: ['charge', 'battery'],
    cloze: 'fully',
  },
  {
    id: 'support', en: 'support', ar: 'يدعم', kind: 'word', ipa: '/səˈpɔːrt/', arApprox: 'سَبورت',
    example: { en: 'Does it support wireless charging?', ar: 'هل يدعم الشحن اللاسلكي؟' },
    usage: 'للسؤال عن ميزة: Does it support …? والجواب: Yes, it does / No, it doesn\'t.',
    cloze: 'support',
  },

  // ───────── الوحدة 2 · الدرس 3: الأداء والذاكرة ─────────
  {
    id: 'processor', en: 'processor', ar: 'معالج', kind: 'word', ipa: '/ˈprɑːsesər/', arApprox: 'براسِسَر',
    example: { en: 'It has a fast processor.', ar: 'معالجه سريع.' },
    related: ['chip', 'performance'],
    cloze: 'processor',
  },
  {
    id: 'fast-slow', en: 'fast / slow', ar: 'سريع / بطيء', kind: 'word', ipa: '/fæst/ /sloʊ/', arApprox: 'فاست / سلو',
    example: { en: 'My old phone is slow. This one is fast.', ar: 'جوالي القديم بطيء. هذا سريع.' },
    cloze: 'slow',
  },
  {
    id: 'ram', en: 'RAM', ar: 'الرام (ذاكرة التشغيل)', kind: 'word', ipa: '/ræm/', arApprox: 'رام',
    example: { en: 'It has 8 GB of RAM.', ar: 'فيه 8 جيجا رام.' },
    usage: 'RAM تؤثر على السرعة وتشغيل تطبيقات كثيرة معًا. أما storage فهي مساحة حفظ الصور والملفات.',
    mistake: 'لا تخلط بين RAM و storage عند الشرح للعميل.',
    cloze: 'RAM',
  },
  {
    id: 'smooth', en: 'smooth', ar: 'سلس', kind: 'word', ipa: '/smuːð/', arApprox: 'سموذ',
    example: { en: 'The phone feels smooth and fast.', ar: 'الجوال سلس وسريع.' },
    cloze: 'smooth',
  },
  {
    id: 'apps', en: 'apps', ar: 'تطبيقات', kind: 'word', ipa: '/æps/', arApprox: 'آبس',
    example: { en: 'You can use many apps at the same time.', ar: 'تقدر تستخدم تطبيقات كثيرة في نفس الوقت.' },
    related: ['app store', 'download'],
    cloze: 'apps',
  },
  {
    id: 'updates', en: 'updates', ar: 'تحديثات', kind: 'word', ipa: '/ˈʌpdeɪts/', arApprox: 'أبديتس',
    example: { en: 'The phone gets software updates.', ar: 'الجوال تنزل له تحديثات للنظام.' },
    usage: 'لا تذكر عدد سنوات التحديث إلا إذا كانت مكتوبة في مواصفات رسمية.',
    cloze: 'updates',
  },
  {
    id: 'can-run', en: 'It can run …', ar: 'يقدر يشغّل …', kind: 'phrase', ipa: '/ɪt kən rʌn/', arApprox: 'إت كَن رَن',
    example: { en: 'It can run heavy games easily.', ar: 'يشغّل الألعاب الثقيلة بسهولة.' },
    related: ['can', 'gaming'],
    cloze: 'run',
  },

  // ───────── الوحدة 2 · الدرس 4: الكاميرا والصوت ─────────
  {
    id: 'photos', en: 'photos', ar: 'صور', kind: 'word', ipa: '/ˈfoʊtoʊz/', arApprox: 'فوتوز',
    example: { en: 'It takes great photos at night.', ar: 'يصوّر صورًا ممتازة في الليل.' },
    usage: 'نقول take photos (وليس make photos).',
    cloze: 'photos',
  },
  {
    id: 'video', en: 'video', ar: 'فيديو', kind: 'word', ipa: '/ˈvɪdioʊ/', arApprox: 'فِديو',
    example: { en: 'You can record 4K video.', ar: 'تقدر تصوّر فيديو بدقة 4K.' },
    usage: 'record video = يصوّر فيديو. 4K تُقرأ «فور كي».',
    cloze: 'video',
  },
  {
    id: 'zoom', en: 'zoom', ar: 'تقريب (زوم)', kind: 'word', ipa: '/zuːm/', arApprox: 'زوم',
    example: { en: 'The camera has 5x zoom.', ar: 'الكاميرا فيها زوم 5 أضعاف.' },
    usage: '5x تُقرأ five times.',
    cloze: 'zoom',
  },
  {
    id: 'night-mode', en: 'night mode', ar: 'الوضع الليلي', kind: 'phrase', ipa: '/naɪt moʊd/', arApprox: 'نايت مود',
    example: { en: 'Night mode helps in dark places.', ar: 'الوضع الليلي يساعد في الأماكن المظلمة.' },
    cloze: 'Night',
  },
  {
    id: 'noise-cancelling', en: 'noise cancelling', ar: 'عزل الضوضاء', kind: 'phrase', ipa: '/nɔɪz ˈkænsəlɪŋ/', arApprox: 'نويز كانسَلِنق',
    example: { en: 'These headphones have noise cancelling.', ar: 'هذه السماعات فيها عزل للضوضاء.' },
    related: ['ANC', 'headphones', 'earbuds'],
    usage: 'قد تسمع اختصارها ANC من العملاء.',
    cloze: 'noise',
  },
  {
    id: 'sound-quality', en: 'sound quality', ar: 'جودة الصوت', kind: 'phrase', ipa: '/saʊnd ˈkwɑːləti/', arApprox: 'ساوند كوالِتي',
    example: { en: 'The sound quality is excellent.', ar: 'جودة الصوت ممتازة.' },
    cloze: 'quality',
  },
  {
    id: 'microphone', en: 'microphone', ar: 'مايكروفون', kind: 'word', ipa: '/ˈmaɪkrəfoʊn/', arApprox: 'مايكروفون',
    example: { en: 'The microphone is clear for calls.', ar: 'المايك واضح في المكالمات.' },
    related: ['mic', 'calls'],
    cloze: 'microphone',
  },
  {
    id: 'there-is-are', en: 'there is / there are', ar: 'يوجد / يوجد (للجمع)', kind: 'phrase', ipa: '/ðer ɪz/ /ðer ɑːr/', arApprox: 'ذير إز / ذير آر',
    example: { en: 'There are three cameras on the back.', ar: 'يوجد ثلاث كاميرات في الخلف.' },
    usage: 'there is + مفرد، there are + جمع.',
    cloze: 'There',
  },

  // ───────── الوحدة 2 · الدرس 5: التوافق والمتانة ─────────
  {
    id: 'compatible', en: 'compatible', ar: 'متوافق (مع)', kind: 'word', ipa: '/kəmˈpætəbl/', arApprox: 'كَمباتَبُل',
    example: { en: 'Is this case compatible with my phone?', ar: 'هل هذا الغطاء يناسب جوالي؟' },
    related: ['works with', 'model'],
    cloze: 'compatible',
  },
  {
    id: 'works-with', en: 'It works with …', ar: 'يشتغل مع …', kind: 'phrase', ipa: '/ɪt wɜːrks wɪð/', arApprox: 'إت وِركس وِذ',
    example: { en: 'It works with iPhone and Android.', ar: 'يشتغل مع الآيفون والأندرويد.' },
    usage: 'للسؤال: Does it work with …? (بدون s بعد does).',
    cloze: 'works',
  },
  {
    id: 'bluetooth', en: 'Bluetooth', ar: 'بلوتوث', kind: 'word', ipa: '/ˈbluːtuːθ/', arApprox: 'بلوتوث',
    example: { en: 'It connects by Bluetooth.', ar: 'يتصل عن طريق البلوتوث.' },
    related: ['wireless', 'connect'],
    cloze: 'Bluetooth',
  },
  {
    id: 'connect', en: 'connect', ar: 'يوصّل / يربط', kind: 'word', ipa: '/kəˈnekt/', arApprox: 'كَنِكت',
    example: { en: 'Let me connect it to your phone.', ar: 'خلني أوصله بجوالك.' },
    related: ['pair', 'Bluetooth'],
    cloze: 'connect',
  },
  {
    id: 'water-resistant', en: 'water-resistant', ar: 'مقاوم للماء', kind: 'word', ipa: '/ˈwɔːtər rɪˈzɪstənt/', arApprox: 'ووتَر رِزِستَنت',
    example: { en: 'It is water-resistant, not waterproof.', ar: 'هو مقاوم للماء، وليس مضادًا للماء تمامًا.' },
    usage: 'استخدم ما هو مكتوب في المواصفات الرسمية فقط.',
    mistake: 'water-resistant (يقاوم الماء لحد معين) ليست waterproof (لا يتأثر بالماء). لا تَعِد العميل بأكثر من المكتوب.',
    cloze: 'water',
  },
  {
    id: 'model', en: 'model', ar: 'موديل / طراز', kind: 'word', ipa: '/ˈmɑːdl/', arApprox: 'مودِل',
    example: { en: 'Which model do you have?', ar: 'أي موديل عندك؟' },
    related: ['version', 'compatible'],
    cloze: 'model',
  },
  {
    id: 'version', en: 'version', ar: 'إصدار / نسخة', kind: 'word', ipa: '/ˈvɜːrʒn/', arApprox: 'فيرجَن',
    example: { en: 'This is the newest version.', ar: 'هذا أحدث إصدار.' },
    related: ['model', 'latest'],
    cloze: 'version',
  },

  // ───────── الوحدة 3 · الدرس 1: المقارنة بـ -er و than ─────────
  {
    id: 'than', en: 'than', ar: 'من (في المقارنة)', kind: 'word', ipa: '/ðæn/', arApprox: 'ذان',
    example: { en: 'This phone is bigger than that one.', ar: 'هذا الجوال أكبر من ذاك.' },
    mistake: 'than (من) غير then (بعدين). وفي المقارنة لا نستخدم from: bigger from ❌.',
    cloze: 'than',
  },
  {
    id: 'bigger', en: 'bigger', ar: 'أكبر', kind: 'word', ipa: '/ˈbɪɡər/', arApprox: 'بِقَر',
    example: { en: 'Model B has a bigger screen.', ar: 'الموديل B شاشته أكبر.' },
    mistake: 'big → bigger بحرفي g. لا تكتب biger.',
    cloze: 'bigger',
  },
  {
    id: 'smaller', en: 'smaller', ar: 'أصغر', kind: 'word', ipa: '/ˈsmɔːlər/', arApprox: 'سمولَر',
    example: { en: 'The mini is smaller and lighter.', ar: 'الميني أصغر وأخف.' },
    cloze: 'smaller',
  },
  {
    id: 'cheaper', en: 'cheaper', ar: 'أرخص', kind: 'word', ipa: '/ˈtʃiːpər/', arApprox: 'تشيبَر',
    example: { en: 'Model A is cheaper than Model B.', ar: 'الموديل A أرخص من الموديل B.' },
    usage: 'cheaper مقبولة في المقارنة. لوصف جهاز واحد استخدم affordable.',
    cloze: 'cheaper',
  },
  {
    id: 'lighter', en: 'lighter', ar: 'أخف', kind: 'word', ipa: '/ˈlaɪtər/', arApprox: 'لايتَر',
    example: { en: 'The tablet is lighter than a laptop.', ar: 'التابلت أخف من اللابتوب.' },
    cloze: 'lighter',
  },
  {
    id: 'faster', en: 'faster', ar: 'أسرع', kind: 'word', ipa: '/ˈfæstər/', arApprox: 'فاستَر',
    example: { en: 'The new processor is faster.', ar: 'المعالج الجديد أسرع.' },
    cloze: 'faster',
  },
  {
    id: 'longer', en: 'longer', ar: 'أطول', kind: 'word', ipa: '/ˈlɔːŋɡər/', arApprox: 'لونقَر',
    example: { en: 'This model has a longer battery life.', ar: 'هذا الموديل بطاريته تدوم أطول.' },
    cloze: 'longer',
  },

  // ───────── الوحدة 3 · الدرس 2: more و better ─────────
  {
    id: 'more-expensive', en: 'more expensive', ar: 'أغلى', kind: 'phrase', ipa: '/mɔːr ɪkˈspensɪv/', arApprox: 'مور إكسبِنسِف',
    example: { en: 'Model B is more expensive, but the camera is better.', ar: 'الموديل B أغلى، لكن كاميرته أفضل.' },
    mistake: 'لا تقل expensiver. الصفات الطويلة نضع قبلها more.',
    cloze: 'more',
  },
  {
    id: 'better', en: 'better', ar: 'أفضل', kind: 'word', ipa: '/ˈbetər/', arApprox: 'بِتَر',
    example: { en: 'The camera is better at night.', ar: 'الكاميرا أفضل في الليل.' },
    mistake: 'good → better. لا تقل more good أو gooder.',
    cloze: 'better',
  },
  {
    id: 'worse', en: 'worse', ar: 'أسوأ', kind: 'word', ipa: '/wɜːrs/', arApprox: 'وِرس',
    example: { en: 'The battery is worse on the old model.', ar: 'البطارية أسوأ في الموديل القديم.' },
    usage: 'bad → worse. استخدمها بلطف أمام العميل؛ الأفضل أن تقول not as good as.',
    cloze: 'worse',
  },
  {
    id: 'more-powerful', en: 'more powerful', ar: 'أقوى', kind: 'phrase', ipa: '/mɔːr ˈpaʊərfl/', arApprox: 'مور باوَرفُل',
    example: { en: 'This laptop is more powerful.', ar: 'هذا اللابتوب أقوى.' },
    cloze: 'powerful',
  },
  {
    id: 'more-comfortable', en: 'more comfortable', ar: 'أريح', kind: 'phrase', ipa: '/mɔːr ˈkʌmftəbl/', arApprox: 'مور كَمفتَبُل',
    example: { en: 'These headphones are more comfortable for long use.', ar: 'هذه السماعات أريح للاستخدام الطويل.' },
    mistake: 'تُنطق «كَمفتَبُل» بثلاثة مقاطع، وليس «كومفورتابل».',
    cloze: 'comfortable',
  },
  {
    id: 'this-that-one', en: 'this one / that one', ar: 'هذا / ذاك', kind: 'phrase', ipa: '/ðɪs wʌn/ /ðæt wʌn/', arApprox: 'ذِس وَن / ذات وَن',
    example: { en: 'This one is lighter, but that one is faster.', ar: 'هذا أخف، لكن ذاك أسرع.' },
    usage: 'one تمنعك من تكرار اسم الجهاز.',
    cloze: 'one',
  },

  // ───────── الوحدة 3 · الدرس 3: الأفضل والأحدث ─────────
  {
    id: 'the-best', en: 'the best', ar: 'الأفضل', kind: 'phrase', ipa: '/ðə best/', arApprox: 'ذا بِست',
    example: { en: 'This is the best camera in this price range.', ar: 'هذه أفضل كاميرا في هذه الفئة السعرية.' },
    usage: 'استخدمها بحذر: قل one of the best إذا لم تكن متأكدًا.',
    cloze: 'best',
  },
  {
    id: 'the-cheapest', en: 'the cheapest', ar: 'الأرخص', kind: 'phrase', ipa: '/ðə ˈtʃiːpɪst/', arApprox: 'ذا تشيبِست',
    example: { en: 'This is the cheapest option.', ar: 'هذا أرخص خيار.' },
    cloze: 'cheapest',
  },
  {
    id: 'the-most-popular', en: 'the most popular', ar: 'الأكثر طلبًا', kind: 'phrase', ipa: '/ðə moʊst ˈpɑːpjələr/', arApprox: 'ذا موست بوبيولَر',
    example: { en: 'This is one of the most popular models.', ar: 'هذا من أكثر الموديلات طلبًا.' },
    cloze: 'popular',
  },
  {
    id: 'the-latest', en: 'the latest', ar: 'الأحدث', kind: 'phrase', ipa: '/ðə ˈleɪtɪst/', arApprox: 'ذا ليتِست',
    example: { en: 'This is the latest model.', ar: 'هذا أحدث موديل.' },
    related: ['new', 'newest'],
    cloze: 'latest',
  },
  {
    id: 'price-range', en: 'price range', ar: 'الفئة السعرية', kind: 'phrase', ipa: '/praɪs reɪndʒ/', arApprox: 'برايس رينج',
    example: { en: 'What is your price range?', ar: 'ما الفئة السعرية اللي تناسبك؟' },
    related: ['budget'],
    cloze: 'range',
  },
  {
    id: 'option', en: 'option', ar: 'خيار', kind: 'word', ipa: '/ˈɑːpʃn/', arApprox: 'أوبشَن',
    example: { en: 'Here are two good options.', ar: 'هذان خياران جيدان.' },
    related: ['choice'],
    cloze: 'options',
  },

  // ───────── الوحدة 3 · الدرس 4: نفس الشيء والفرق ─────────
  {
    id: 'the-same', en: 'the same', ar: 'نفس الـ', kind: 'phrase', ipa: '/ðə seɪm/', arApprox: 'ذا سيم',
    example: { en: 'Both have the same camera.', ar: 'الاثنان لهما نفس الكاميرا.' },
    usage: 'the same + اسم، أو the same as + شيء: It\'s the same as the old one.',
    cloze: 'same',
  },
  {
    id: 'as-as', en: 'as … as', ar: 'بنفس قدر …', kind: 'phrase', ipa: '/æz … æz/', arApprox: 'آز … آز',
    example: { en: "It's as fast as the Pro.", ar: 'سرعته مثل البرو.' },
    usage: 'not as … as = أقل من: It\'s not as heavy as the laptop.',
    cloze: 'as',
  },
  {
    id: 'difference', en: 'difference', ar: 'الفرق', kind: 'word', ipa: '/ˈdɪfrəns/', arApprox: 'دِفرَنس',
    example: { en: 'The main difference is the camera.', ar: 'الفرق الأساسي هو الكاميرا.' },
    related: ['different', 'main difference'],
    cloze: 'difference',
  },
  {
    id: 'both', en: 'both', ar: 'كلاهما / الاثنين', kind: 'word', ipa: '/boʊθ/', arApprox: 'بوث',
    example: { en: 'Both are good choices.', ar: 'الاثنين خيارات جيدة.' },
    cloze: 'Both',
  },
  {
    id: 'but', en: 'but', ar: 'لكن', kind: 'word', ipa: '/bʌt/', arApprox: 'بَت',
    example: { en: "It's cheaper, but the battery is smaller.", ar: 'هو أرخص، لكن البطارية أصغر.' },
    usage: 'أهم كلمة في المقارنة: ميزة + but + عيب.',
    cloze: 'but',
  },
  {
    id: 'similar', en: 'similar', ar: 'متشابه', kind: 'word', ipa: '/ˈsɪmələr/', arApprox: 'سِمِلَر',
    example: { en: 'They look similar, but they are different inside.', ar: 'شكلهم متشابه، لكنهم مختلفين من الداخل.' },
    cloze: 'similar',
  },

  // ───────── الوحدة 3 · الدرس 5: التوصية ─────────
  {
    id: 'recommend', en: 'recommend', ar: 'أنصح بـ / يرشّح', kind: 'word', ipa: '/ˌrekəˈmend/', arApprox: 'رِكَمِند',
    example: { en: 'I recommend this one for gaming.', ar: 'أنصحك بهذا للألعاب.' },
    mistake: 'قل I recommend this one وليس I recommend you this one.',
    cloze: 'recommend',
  },
  {
    id: 'depends', en: 'It depends on …', ar: 'يعتمد على …', kind: 'phrase', ipa: '/ɪt dɪˈpendz ɑːn/', arApprox: 'إت دِبِندز أون',
    example: { en: 'It depends on your budget.', ar: 'يعتمد على ميزانيتك.' },
    usage: 'رد ذكي عندما يسأل العميل «أيهما أفضل؟» قبل أن تعرف احتياجه.',
    mistake: 'on وليس from: depends from ❌.',
    cloze: 'depends',
  },
  {
    id: 'if-you-want', en: 'If you want …, …', ar: 'إذا تبغى …، …', kind: 'phrase', ipa: '/ɪf juː wɑːnt/', arApprox: 'إف يو وانت',
    example: { en: 'If you want a good camera, I recommend Model B.', ar: 'إذا تبغى كاميرا قوية، أنصحك بالموديل B.' },
    cloze: 'If',
  },
  {
    id: 'worth-it', en: "It's worth it.", ar: 'يستاهل.', kind: 'phrase', ipa: '/ɪts wɜːrθ ɪt/', arApprox: 'إتس وِرث إت',
    example: { en: "It's more expensive, but it's worth it.", ar: 'أغلى، لكنه يستاهل.' },
    mistake: 'th في آخر worth تُنطق «ث».',
    cloze: 'worth',
  },
  {
    id: 'good-for', en: 'good for …', ar: 'مناسب لـ …', kind: 'phrase', ipa: '/ɡʊd fɔːr/', arApprox: 'قُد فور',
    example: { en: 'This model is good for travel.', ar: 'هذا الموديل مناسب للسفر.' },
    cloze: 'good',
  },
  {
    id: 'try', en: 'try', ar: 'يجرّب', kind: 'word', ipa: '/traɪ/', arApprox: 'تراي',
    example: { en: 'You can try it here.', ar: 'تقدر تجربه هنا.' },
    related: ['try it on (للسماعات)'],
    cloze: 'try',
  },

  // ───────── الوحدة 4 · الدرس 1: التوفر ─────────
  {
    id: 'in-stock', en: 'in stock', ar: 'متوفر (في المخزون)', kind: 'phrase', ipa: '/ɪn stɑːk/', arApprox: 'إن ستوك',
    example: { en: "Yes, it's in stock.", ar: 'نعم، متوفر.' },
    related: ['available', 'out of stock'],
    usage: 'قلها فقط بعد أن تتحقق من النظام.',
    cloze: 'stock',
  },
  {
    id: 'out-of-stock', en: 'out of stock', ar: 'نفد (غير متوفر)', kind: 'phrase', ipa: '/aʊt əv stɑːk/', arApprox: 'آوت أوف ستوك',
    example: { en: 'Sorry, the blue one is out of stock.', ar: 'آسف، الأزرق نفد.' },
    related: ['sold out', 'not available'],
    cloze: 'out',
  },
  {
    id: 'color', en: 'color', ar: 'لون', kind: 'word', ipa: '/ˈkʌlər/', arApprox: 'كَلَر',
    example: { en: 'Which color do you like?', ar: 'أي لون يعجبك؟' },
    usage: 'البريطانية تكتبها colour، والنطق واحد.',
    cloze: 'color',
  },
  {
    id: 'have-it-in', en: 'Do you have it in …?', ar: 'عندكم منه بـ …؟', kind: 'phrase', ipa: '/duː juː hæv ɪt ɪn/', arApprox: 'دو يو هاف إت إن',
    example: { en: 'Do you have it in black?', ar: 'عندكم منه أسود؟' },
    usage: 'يسألها العميل عن لون أو مقاس: in black / in 256 GB.',
    cloze: 'have',
  },
  {
    id: 'check-system', en: 'Let me check the system.', ar: 'خلني أشيك على النظام.', kind: 'phrase', ipa: '/let miː tʃek ðə ˈsɪstəm/', arApprox: 'لِت مي تشِك ذا سِستَم',
    example: { en: 'One moment. Let me check the system.', ar: 'لحظة. خلني أشيك على النظام.' },
    related: ['Let me check.'],
    cloze: 'system',
  },
  {
    id: 'another-branch', en: 'another branch', ar: 'فرع آخر', kind: 'phrase', ipa: '/əˈnʌðər bræntʃ/', arApprox: 'أَنَذَر برانتش',
    example: { en: 'It may be available in another branch.', ar: 'ممكن يكون متوفر في فرع ثاني.' },
    usage: 'استخدم may (ممكن) ولا تؤكد قبل التحقق.',
    cloze: 'branch',
  },
  {
    id: 'come-back', en: 'come back', ar: 'يرجع / يعود', kind: 'phrase', ipa: '/kʌm bæk/', arApprox: 'كَم باك',
    example: { en: 'Can I come back tomorrow?', ar: 'أقدر أرجع بكرة؟' },
    cloze: 'back',
  },

  // ───────── الوحدة 4 · الدرس 2: السعر والدفع ─────────
  {
    id: 'cost', en: 'cost', ar: 'يكلّف / تكلفة', kind: 'word', ipa: '/kɔːst/', arApprox: 'كوست',
    example: { en: 'How much does it cost?', ar: 'كم يكلّف؟' },
    usage: 'How much does it cost? = How much is it?',
    cloze: 'cost',
  },
  {
    id: 'total', en: 'total', ar: 'المجموع', kind: 'word', ipa: '/ˈtoʊtl/', arApprox: 'توتَل',
    example: { en: 'The total is 1,450 riyals.', ar: 'المجموع 1450 ريال.' },
    cloze: 'total',
  },
  {
    id: 'discount', en: 'discount', ar: 'خصم', kind: 'word', ipa: '/ˈdɪskaʊnt/', arApprox: 'دِسكاونت',
    example: { en: 'Is there any discount?', ar: 'فيه أي خصم؟' },
    usage: 'لا تَعِد بخصم. إذا لم تكن متأكدًا قل: Let me check if there is an offer.',
    cloze: 'discount',
  },
  {
    id: 'offer', en: 'offer', ar: 'عرض', kind: 'word', ipa: '/ˈɔːfər/', arApprox: 'أوفَر',
    example: { en: 'Is there an offer on this model?', ar: 'فيه عرض على هذا الموديل؟' },
    related: ['discount', 'deal'],
    cloze: 'offer',
  },
  {
    id: 'vat', en: 'VAT', ar: 'ضريبة القيمة المضافة', kind: 'word', ipa: '/ˌviː eɪ ˈtiː/', arApprox: 'في إي تي',
    example: { en: 'Does the price include VAT?', ar: 'هل السعر شامل الضريبة؟' },
    usage: 'include = يشمل. إذا لم تتأكد من الإجابة، تحقق قبل أن ترد.',
    cloze: 'VAT',
  },
  {
    id: 'pay', en: 'pay', ar: 'يدفع', kind: 'word', ipa: '/peɪ/', arApprox: 'باي',
    example: { en: 'You can pay at the cashier.', ar: 'تقدر تدفع عند الكاشير.' },
    related: ['payment', 'cashier'],
    cloze: 'pay',
  },
  {
    id: 'cash-or-card', en: 'Cash or card?', ar: 'كاش ولا بطاقة؟', kind: 'phrase', ipa: '/kæʃ ɔːr kɑːrd/', arApprox: 'كاش أور كارد',
    example: { en: 'Cash or card? — Card, please.', ar: 'كاش ولا بطاقة؟ — بطاقة لو سمحت.' },
    cloze: 'card',
  },
  {
    id: 'receipt', en: 'receipt', ar: 'إيصال / فاتورة', kind: 'word', ipa: '/rɪˈsiːt/', arApprox: 'رِسيت',
    example: { en: 'Please keep your receipt.', ar: 'احتفظ بالفاتورة لو سمحت.' },
    mistake: 'حرف p صامت: تُنطق «رِسيت».',
    cloze: 'receipt',
  },

  // ───────── الوحدة 4 · الدرس 3: الاعتراضات ─────────
  {
    id: 'too-expensive', en: "It's too expensive.", ar: 'غالي مرة (أكثر من اللازم).', kind: 'phrase', ipa: '/ɪts tuː ɪkˈspensɪv/', arApprox: 'إتس تو إكسبِنسِف',
    example: { en: "It's too expensive for me.", ar: 'غالي علي مرة.' },
    usage: 'too = أكثر من اللازم (سلبي). very = جدًا (قد يكون إيجابيًا): very good.',
    mistake: 'لا تقل too good بمعنى ممتاز جدًا؛ قل very good.',
    cloze: 'too',
  },
  {
    id: 'i-understand', en: 'I understand.', ar: 'أفهمك.', kind: 'phrase', ipa: '/aɪ ˌʌndərˈstænd/', arApprox: 'آي أندَرستاند',
    example: { en: 'I understand. Let me show you another option.', ar: 'أفهمك. خلني أوريك خيار ثاني.' },
    usage: 'ابدأ بها الرد على أي اعتراض قبل أن تقترح حلًا.',
    cloze: 'understand',
  },
  {
    id: 'cheaper-option', en: 'a cheaper option', ar: 'خيار أرخص', kind: 'phrase', ipa: '/ə ˈtʃiːpər ˈɑːpʃn/', arApprox: 'أ تشيبَر أوبشَن',
    example: { en: 'Do you have a cheaper option?', ar: 'عندكم خيار أرخص؟' },
    cloze: 'option',
  },
  {
    id: 'think-about-it', en: "I'll think about it.", ar: 'بفكّر في الموضوع.', kind: 'phrase', ipa: '/aɪl θɪŋk əˈbaʊt ɪt/', arApprox: 'آيل ثِنك أباوت إت',
    example: { en: "Thanks. I'll think about it.", ar: 'شكرًا. بفكّر في الموضوع.' },
    usage: 'العميل يقولها كثيرًا. رد بلطف دون ضغط: Sure, no problem.',
    cloze: 'think',
  },
  {
    id: 'no-problem', en: 'No problem.', ar: 'ولا يهمك / ما فيه مشكلة.', kind: 'phrase', ipa: '/noʊ ˈprɑːbləm/', arApprox: 'نو برابلَم',
    example: { en: 'No problem. Take your time.', ar: 'ولا يهمك. خذ راحتك.' },
    cloze: 'problem',
  },
  {
    id: 'because', en: 'because', ar: 'لأن', kind: 'word', ipa: '/bɪˈkɔːz/', arApprox: 'بِكوز',
    example: { en: "It's more expensive because the camera is better.", ar: 'هو أغلى لأن الكاميرا أفضل.' },
    usage: 'لتبرير السعر بميزة حقيقية.',
    cloze: 'because',
  },
  {
    id: 'compare-for-you', en: 'Let me compare them for you.', ar: 'خلني أقارن لك بينهم.', kind: 'phrase', ipa: '/let miː kəmˈper ðem fɔːr juː/', arApprox: 'لِت مي كَمبير ذِم فور يو',
    example: { en: 'Good question. Let me compare them for you.', ar: 'سؤال حلو. خلني أقارن لك بينهم.' },
    cloze: 'compare',
  },

  // ───────── الوحدة 4 · الدرس 4: الضمان والاسترجاع ─────────
  {
    id: 'warranty', en: 'warranty', ar: 'ضمان', kind: 'word', ipa: '/ˈwɔːrənti/', arApprox: 'وورَنتي',
    example: { en: 'How long is the warranty?', ar: 'كم مدة الضمان؟' },
    usage: 'لا تخمّن مدة الضمان أو شروطه أبدًا. تحقق من المصدر الرسمي.',
    cloze: 'warranty',
  },
  {
    id: 'return', en: 'return', ar: 'يُرجِع (استرجاع)', kind: 'word', ipa: '/rɪˈtɜːrn/', arApprox: 'رِتيرن',
    example: { en: "Can I return it if I don't like it?", ar: 'أقدر أرجّعه إذا ما عجبني؟' },
    related: ['refund', 'exchange'],
    cloze: 'return',
  },
  {
    id: 'exchange', en: 'exchange', ar: 'يستبدل (استبدال)', kind: 'word', ipa: '/ɪksˈtʃeɪndʒ/', arApprox: 'إكستشينج',
    example: { en: 'Can I exchange it for another color?', ar: 'أقدر أبدّله بلون ثاني؟' },
    cloze: 'exchange',
  },
  {
    id: 'policy', en: 'policy', ar: 'سياسة', kind: 'word', ipa: '/ˈpɑːləsi/', arApprox: 'بولِسي',
    example: { en: 'Let me check the return policy.', ar: 'خلني أتأكد من سياسة الاسترجاع.' },
    cloze: 'policy',
  },
  {
    id: 'terms', en: 'terms', ar: 'الشروط', kind: 'word', ipa: '/tɜːrmz/', arApprox: 'تيرمز',
    example: { en: 'Let me show you the warranty terms.', ar: 'خلني أوريك شروط الضمان.' },
    related: ['conditions', 'policy'],
    cloze: 'terms',
  },
  {
    id: 'not-sure', en: "I'm not sure.", ar: 'لست متأكدًا.', kind: 'phrase', ipa: '/aɪm nɑːt ʃʊr/', arApprox: 'آيم نوت شُور',
    example: { en: "I'm not sure. Let me ask my manager.", ar: 'لست متأكدًا. خلني أسأل المدير.' },
    usage: 'قول «لست متأكدًا» ثم التحقق أفضل بكثير من معلومة خاطئة.',
    cloze: 'sure',
  },
  {
    id: 'broken', en: 'broken', ar: 'خربان / مكسور', kind: 'word', ipa: '/ˈbroʊkən/', arApprox: 'بروكَن',
    example: { en: "My phone is broken. The screen doesn't work.", ar: 'جوالي خربان. الشاشة ما تشتغل.' },
    related: ["doesn't work", 'damaged'],
    cloze: 'broken',
  },

  // ───────── الوحدة 4 · الدرس 5: إنهاء البيع ─────────
  {
    id: 'anything-else', en: 'Anything else?', ar: 'تبغى شيء ثاني؟', kind: 'phrase', ipa: '/ˈeniθɪŋ els/', arApprox: 'إنِيثِنق إلس',
    example: { en: 'Is there anything else I can help you with?', ar: 'فيه شيء ثاني أقدر أساعدك فيه؟' },
    cloze: 'else',
  },
  {
    id: 'would-you-like', en: 'Would you like …?', ar: 'تحب / تبغى …؟ (مهذبة)', kind: 'phrase', ipa: '/wʊd juː laɪk/', arApprox: 'وُد يو لايك',
    example: { en: 'Would you like a bag?', ar: 'تبغى كيس؟' },
    usage: 'أكثر أدبًا من Do you want. بعدها اسم (a bag) أو to + فعل (to try it).',
    mistake: 'لا تقل Would you like try؛ قل Would you like to try it?',
    cloze: 'like',
  },
  {
    id: 'here-you-are', en: 'Here you are.', ar: 'تفضل.', kind: 'phrase', ipa: '/hɪr juː ɑːr/', arApprox: 'هير يو آر',
    example: { en: 'Here you are. Your phone and your receipt.', ar: 'تفضل. جوالك وفاتورتك.' },
    related: ['Here it is.'],
    cloze: 'Here',
  },
  {
    id: 'enjoy', en: 'Enjoy your new …!', ar: 'بالتوفيق مع … الجديد! / استمتع', kind: 'phrase', ipa: '/ɪnˈdʒɔɪ jʊr nuː/', arApprox: 'إنجوي يور نيو',
    example: { en: 'Enjoy your new phone!', ar: 'بالتوفيق مع جوالك الجديد!' },
    cloze: 'Enjoy',
  },
  {
    id: 'cashier', en: 'cashier', ar: 'الكاشير', kind: 'word', ipa: '/kæˈʃɪr/', arApprox: 'كاشير',
    example: { en: 'The cashier is over there.', ar: 'الكاشير هناك.' },
    cloze: 'cashier',
  },
  {
    id: 'bag', en: 'bag', ar: 'كيس / شنطة', kind: 'word', ipa: '/bæɡ/', arApprox: 'باق',
    example: { en: 'Do you need a bag?', ar: 'تحتاج كيس؟' },
    cloze: 'bag',
  },
  {
    id: 'see-you', en: 'See you again!', ar: 'نشوفك مرة ثانية!', kind: 'phrase', ipa: '/siː juː əˈɡen/', arApprox: 'سي يو أَقِن',
    example: { en: 'Thank you for visiting. See you again!', ar: 'شكرًا لزيارتك. نشوفك مرة ثانية!' },
    cloze: 'again',
  },
];
