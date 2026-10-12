import type { Unit } from './types';

// الوحدة 3: المقارنة بين المنتجات. Model A و Model B أجهزة افتراضية للتدريب.

export const unit3: Unit = {
  id: 'u3',
  order: 3,
  title: 'المقارنة بين المنتجات',
  titleEn: 'Comparing products',
  description: 'تقارن بين جهازين بصيغ «أكبر من» و«الأفضل» و«نفس الشيء»، ثم تنصح العميل بحسب احتياجه.',
  cefr: 'A2',
  lessons: [
    {
      id: 'u3l1', unitId: 'u3', title: 'أكبر من، أخف من', titleEn: 'Bigger, lighter, than', minutes: 10,
      goal: 'تقارن بالصفات القصيرة: Model A is lighter than Model B.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['than', 'bigger', 'smaller', 'cheaper', 'lighter', 'faster', 'longer'] },
        {
          kind: 'grammar', id: 'g-comparative-er', title: 'المقارنة بـ -er', pattern: 'صفة قصيرة + er + than',
          explanation: [
            'الصفة القصيرة (مقطع واحد غالبًا) نضيف لها er: fast → faster.',
            'تنتهي بـ e؟ نضيف r فقط: large → larger.',
            'حرف ساكن بعد حرف متحرك واحد؟ نكرر الحرف: big → bigger, thin → thinner.',
            'تنتهي بـ y؟ تصبح ier: easy → easier.',
            'ثم than = من.',
          ],
          examples: [
            { en: 'Model A is lighter than Model B.', ar: 'الموديل A أخف من الموديل B.' },
            { en: 'Model B has a bigger screen.', ar: 'الموديل B شاشته أكبر.' },
            { en: 'This one is cheaper than that one.', ar: 'هذا أرخص من ذاك.' },
          ],
          note: 'خطأ شائع: lighter from ✗ — الصحيح: lighter than ✓',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: عميل محتار بين جوالين.',
          lines: [
            { speaker: 'customer', en: 'What is the difference between these two?', ar: 'وش الفرق بين هذين؟' },
            { speaker: 'staff', en: 'Model A is smaller and lighter. Model B has a bigger screen and a longer battery life.', ar: 'الموديل A أصغر وأخف. الموديل B شاشته أكبر وبطاريته تدوم أطول.' },
            { speaker: 'customer', en: 'Which one is cheaper?', ar: 'أيهم أرخص؟' },
            { speaker: 'staff', en: 'Model A is cheaper.', ar: 'الموديل A أرخص.' },
          ],
          questions: [
            {
              id: 'u3l1-l1', type: 'choice', skill: 'listening', itemIds: ['longer'],
              prompt: 'أي موديل بطاريته تدوم أطول؟', options: ['Model A', 'Model B', 'نفس الشيء'], answer: 1,
            },
            {
              id: 'u3l1-l2', type: 'choice', skill: 'listening', itemIds: ['cheaper'],
              prompt: 'أي موديل أرخص؟', options: ['Model A', 'Model B', 'لم يذكر'], answer: 0,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'Model A is lighter than Model B.', ar: 'الموديل A أخف من B.' },
            { en: 'Model B has a bigger screen.', ar: 'الموديل B شاشته أكبر.' },
            { en: 'This one is cheaper than that one.', ar: 'هذا أرخص من ذاك.' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['than', 'bigger', 'cheaper', 'lighter', 'faster', 'longer'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u3l1-q1', type: 'fill', skill: 'grammar', itemIds: ['than'],
              prompt: 'أكمل', sentence: 'Model A is lighter ___ Model B.', answers: ['than'], bank: ['than', 'from', 'then'],
              explain: 'في المقارنة نستخدم than (وليس from ولا then).',
            },
            {
              id: 'u3l1-q2', type: 'choice', skill: 'grammar', itemIds: ['bigger'], optionsDir: 'ltr',
              prompt: 'big → ؟', options: ['biger', 'bigger', 'more big'], answer: 1,
            },
            {
              id: 'u3l1-q3', type: 'order', skill: 'grammar', itemIds: ['faster', 'than'],
              prompt: 'رتّب', ar: 'هذا الجهاز أسرع من ذاك.', words: ['This', 'one', 'is', 'faster', 'than', 'that', 'one.'],
            },
            {
              id: 'u3l1-q4', type: 'type', skill: 'writing', itemIds: ['cheaper', 'than'],
              prompt: 'اكتب: «الموديل A أرخص من الموديل B.»', answers: ['Model A is cheaper than Model B.'],
              starter: 'Model A is', hints: ['… cheaper than …'],
            },
          ],
        },
      ],
    },
    {
      id: 'u3l2', unitId: 'u3', title: 'أغلى، أفضل، أريح', titleEn: 'More expensive, better', minutes: 10,
      goal: 'تقارن بالصفات الطويلة (more) والشاذة (better / worse).',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['more-expensive', 'better', 'worse', 'more-powerful', 'more-comfortable', 'this-that-one'] },
        {
          kind: 'grammar', id: 'g-comparative-more', title: 'more + صفة طويلة، والشاذة', pattern: 'more + صفة طويلة + than · good → better · bad → worse',
          explanation: [
            'الصفة الطويلة (مقطعان أو أكثر غالبًا) لا نضيف لها er، بل نضع قبلها more.',
            'expensive → more expensive · powerful → more powerful.',
            'صفات شاذة يجب حفظها: good → better · bad → worse.',
          ],
          examples: [
            { en: 'Model B is more expensive than Model A.', ar: 'الموديل B أغلى من A.' },
            { en: 'The camera is better at night.', ar: 'الكاميرا أفضل في الليل.' },
            { en: 'These headphones are more comfortable.', ar: 'هذه السماعات أريح.' },
          ],
          note: 'خطأ شائع: more better ✗ / expensiver ✗ — الصحيح: better ✓ / more expensive ✓',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: مقارنة سماعتين.',
          lines: [
            { speaker: 'customer', en: 'Why is this one more expensive?', ar: 'ليش هذه أغلى؟' },
            { speaker: 'staff', en: 'This one has better sound and noise cancelling. It is also more comfortable.', ar: 'هذه صوتها أفضل وفيها عزل ضوضاء. وأريح بعد.' },
            { speaker: 'customer', en: 'And that one?', ar: 'وذيك؟' },
            { speaker: 'staff', en: 'That one is cheaper, but the battery is not as good.', ar: 'ذيك أرخص، لكن البطارية مو بنفس الجودة.' },
          ],
          questions: [
            {
              id: 'u3l2-l1', type: 'choice', skill: 'listening', itemIds: ['better', 'more-comfortable'],
              prompt: 'لماذا السماعة الأولى أغلى؟', options: ['لونها أحلى', 'صوتها أفضل وأريح وفيها عزل', 'أحدث فقط'], answer: 1,
            },
            {
              id: 'u3l2-l2', type: 'choice', skill: 'listening', itemIds: ['worse'],
              prompt: 'ما عيب السماعة الأرخص؟', options: ['البطارية', 'الصوت', 'الحجم'], answer: 0,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'This one is more expensive, but the sound is better.', ar: 'هذه أغلى، لكن صوتها أفضل.' },
            { en: 'These are more comfortable for long use.', ar: 'هذه أريح للاستخدام الطويل.' },
            { en: "That one is cheaper, but the battery isn't as good.", ar: 'ذيك أرخص، لكن البطارية مو بنفس الجودة.' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['more-expensive', 'better', 'worse', 'more-powerful', 'more-comfortable', 'this-that-one'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u3l2-q1', type: 'choice', skill: 'grammar', itemIds: ['more-expensive'], optionsDir: 'ltr',
              prompt: 'أي جملة صحيحة؟', options: ['It is expensiver.', 'It is more expensive.', 'It is more expensiver.'], answer: 1,
            },
            {
              id: 'u3l2-q2', type: 'fill', skill: 'grammar', itemIds: ['better'],
              prompt: 'good → ؟', sentence: 'The camera on Model B is ___.', answers: ['better'], bank: ['gooder', 'better', 'more good'],
            },
            {
              id: 'u3l2-q3', type: 'type', skill: 'writing', itemIds: ['more-comfortable'],
              prompt: 'اكتب: «هذه السماعات أريح.»', answers: ['These headphones are more comfortable.'],
              starter: 'These headphones', hints: ['… are more …'],
            },
          ],
        },
      ],
    },
    {
      id: 'u3l3', unitId: 'u3', title: 'الأفضل والأحدث', titleEn: 'The best, the latest', minutes: 9,
      goal: 'تستخدم صيغة التفضيل: the best / the cheapest / the latest.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['the-best', 'the-cheapest', 'the-most-popular', 'the-latest', 'price-range', 'option'] },
        {
          kind: 'grammar', id: 'g-superlative', title: 'صيغة التفضيل (الأعلى)', pattern: 'the + صفة قصيرة + est · the most + صفة طويلة',
          explanation: [
            'للمقارنة بين أكثر من شيئين: الأرخص، الأخف، الأفضل.',
            'cheap → the cheapest · light → the lightest.',
            'popular → the most popular.',
            'good → the best · bad → the worst.',
            'لا تنسَ the قبلها.',
          ],
          examples: [
            { en: 'This is the cheapest option.', ar: 'هذا أرخص خيار.' },
            { en: 'This is the latest model.', ar: 'هذا أحدث موديل.' },
            { en: 'This is one of the most popular models.', ar: 'هذا من أكثر الموديلات طلبًا.' },
          ],
          note: 'كن دقيقًا: قل one of the best بدل the best إذا لم تكن متأكدًا أنه الأفضل فعلًا.',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: ثلاثة خيارات لشاحن متنقل.',
          lines: [
            { speaker: 'customer', en: 'I need a power bank. What is your cheapest option?', ar: 'أحتاج باور بانك. وش أرخص خيار عندكم؟' },
            { speaker: 'staff', en: 'This is the cheapest. But this one is the lightest, and that one has the biggest battery.', ar: 'هذا الأرخص. لكن هذا الأخف، وذاك بطاريته الأكبر.' },
            { speaker: 'customer', en: 'What is the most popular?', ar: 'وش الأكثر طلبًا؟' },
            { speaker: 'staff', en: 'The light one. It is good for travel.', ar: 'الخفيف. مناسب للسفر.' },
          ],
          questions: [
            {
              id: 'u3l3-l1', type: 'choice', skill: 'listening', itemIds: ['the-cheapest'],
              prompt: 'ماذا طلب العميل أولًا؟', options: ['الأخف', 'الأرخص', 'الأحدث'], answer: 1,
            },
            {
              id: 'u3l3-l2', type: 'choice', skill: 'listening', itemIds: ['the-most-popular'],
              prompt: 'أي شاحن هو الأكثر طلبًا حسب الموظف؟', options: ['الأرخص', 'الخفيف', 'ذو البطارية الأكبر'], answer: 1,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'This is the cheapest option.', ar: 'هذا أرخص خيار.' },
            { en: 'This one is the lightest.', ar: 'هذا الأخف.' },
            { en: 'What is your price range?', ar: 'ما الفئة السعرية اللي تناسبك؟' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['the-best', 'the-cheapest', 'the-most-popular', 'the-latest', 'price-range', 'option'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u3l3-q1', type: 'fill', skill: 'grammar', itemIds: ['the-cheapest'],
              prompt: 'أكمل', sentence: 'This is the ___ option.', ar: 'هذا أرخص خيار.', answers: ['cheapest'], bank: ['cheaper', 'cheapest', 'most cheap'],
            },
            {
              id: 'u3l3-q2', type: 'choice', skill: 'grammar', itemIds: ['the-best'], optionsDir: 'ltr',
              prompt: 'good → (الأفضل)', options: ['the goodest', 'the best', 'the most good'], answer: 1,
            },
            {
              id: 'u3l3-q3', type: 'type', skill: 'writing', itemIds: ['the-latest'],
              prompt: 'اكتب: «هذا أحدث موديل.»', answers: ['This is the latest model.'],
              starter: 'This is', hints: ['the latest …'],
            },
          ],
        },
      ],
    },
    {
      id: 'u3l4', unitId: 'u3', title: 'نفس الشيء والفرق', titleEn: 'The same & the difference', minutes: 10,
      goal: 'تشرح ما هو مشترك وما هو مختلف: the same / as … as / the difference is.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['the-same', 'as-as', 'difference', 'both', 'but', 'similar'] },
        {
          kind: 'grammar', id: 'g-same-as', title: 'التشابه والاختلاف', pattern: 'the same · as + صفة + as · not as + صفة + as',
          explanation: [
            'Both have the same camera = الاثنين لهم نفس الكاميرا.',
            'as fast as = بنفس السرعة.',
            'not as heavy as = أقل وزنًا (طريقة لطيفة للمقارنة).',
            'The main difference is … = الفرق الأساسي هو …',
          ],
          examples: [
            { en: 'Both have the same processor.', ar: 'الاثنين نفس المعالج.' },
            { en: "It's as fast as Model B, but it's cheaper.", ar: 'سرعته مثل B، لكنه أرخص.' },
            { en: 'The main difference is the camera.', ar: 'الفرق الأساسي هو الكاميرا.' },
          ],
          note: 'عند المقارنة رتّب كلامك: نفس الشيء أولًا، ثم الفرق، ثم but.',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: جهازان متشابهان.',
          lines: [
            { speaker: 'customer', en: 'They look the same. What is the difference?', ar: 'شكلهم نفس الشيء. وش الفرق؟' },
            { speaker: 'staff', en: 'They are similar. Both have the same screen and processor.', ar: 'متشابهين. الاثنين نفس الشاشة والمعالج.' },
            { speaker: 'staff', en: 'The main difference is the camera. Model B has a zoom camera, but it is more expensive.', ar: 'الفرق الأساسي الكاميرا. B فيه كاميرا زوم، لكنه أغلى.' },
          ],
          questions: [
            {
              id: 'u3l4-l1', type: 'choice', skill: 'listening', itemIds: ['the-same', 'both'],
              prompt: 'ما المشترك بين الجهازين؟', options: ['الكاميرا والسعر', 'الشاشة والمعالج', 'لا شيء'], answer: 1,
            },
            {
              id: 'u3l4-l2', type: 'choice', skill: 'listening', itemIds: ['difference'],
              prompt: 'ما الفرق الأساسي؟', options: ['البطارية', 'الكاميرا', 'اللون'], answer: 1,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'Both have the same screen.', ar: 'الاثنين نفس الشاشة.' },
            { en: 'The main difference is the camera.', ar: 'الفرق الأساسي الكاميرا.' },
            { en: "It's as fast as Model B.", ar: 'سرعته مثل B.' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['the-same', 'as-as', 'difference', 'both', 'but', 'similar'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u3l4-q1', type: 'fill', skill: 'grammar', itemIds: ['as-as'],
              prompt: 'أكمل', sentence: "It's as fast ___ Model B.", answers: ['as'], bank: ['as', 'than', 'like'],
              explain: 'as … as: as fast as.',
            },
            {
              id: 'u3l4-q2', type: 'order', skill: 'grammar', itemIds: ['difference'],
              prompt: 'رتّب', ar: 'الفرق الأساسي هو البطارية.', words: ['The', 'main', 'difference', 'is', 'the', 'battery.'],
            },
            {
              id: 'u3l4-q3', type: 'type', skill: 'writing', itemIds: ['both', 'the-same'],
              prompt: 'اكتب: «الاثنين نفس الكاميرا.»', answers: ['Both have the same camera.'],
              starter: 'Both have', hints: ['… the same …'],
            },
          ],
        },
      ],
    },
    {
      id: 'u3l5', unitId: 'u3', title: 'نصيحة العميل', titleEn: 'Recommending', minutes: 10,
      goal: 'تنصح العميل بحسب احتياجه: If you want …, I recommend …',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'عبارات الدرس', itemIds: ['recommend', 'depends', 'if-you-want', 'worth-it', 'good-for', 'try'] },
        {
          kind: 'grammar', id: 'g-if-recommend', title: 'If you want …, I recommend …', pattern: 'If you + فعل …, I recommend + الجهاز',
          explanation: [
            'جملة الشرط البسيطة تربط احتياج العميل بالجهاز المناسب.',
            'If you want a good camera, I recommend Model B.',
            'If you play games, this one is better.',
            'عندما لا تعرف الاحتياج: It depends on … ثم اسأل.',
          ],
          examples: [
            { en: 'If you want a long battery, I recommend this one.', ar: 'إذا تبغى بطارية تدوم، أنصحك بهذا.' },
            { en: 'It depends on your budget. What is your price range?', ar: 'يعتمد على ميزانيتك. كم الفئة السعرية؟' },
            { en: "It's more expensive, but it's worth it.", ar: 'أغلى، لكنه يستاهل.' },
          ],
          note: 'نصيحة البيع: اربط التوصية بشيء قاله العميل، ولا تمدح جهازًا بمعلومة غير مؤكدة.',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: «أيهم أفضل؟»',
          lines: [
            { speaker: 'customer', en: 'Which one is better?', ar: 'أيهم أفضل؟' },
            { speaker: 'staff', en: 'It depends. What will you use it for?', ar: 'يعتمد. لأي شيء بتستخدمه؟' },
            { speaker: 'customer', en: 'Mostly photos for my small business.', ar: 'غالبًا تصوير لمشروعي الصغير.' },
            { speaker: 'staff', en: 'If you want great photos, I recommend Model B. It is more expensive, but it is worth it. You can try it here.', ar: 'إذا تبغى صور ممتازة، أنصحك بالموديل B. أغلى، لكنه يستاهل. تقدر تجربه هنا.' },
          ],
          questions: [
            {
              id: 'u3l5-l1', type: 'choice', skill: 'listening', itemIds: ['depends'],
              prompt: 'ماذا فعل الموظف قبل أن ينصح؟', options: ['ذكر السعر', 'سأل عن الاستخدام', 'نادى المدير'], answer: 1,
            },
            {
              id: 'u3l5-l2', type: 'choice', skill: 'listening', itemIds: ['recommend'],
              prompt: 'بماذا نصح؟ ولماذا؟', options: ['Model A لأنه أرخص', 'Model B لأن صوره ممتازة', 'لم ينصح بشيء'], answer: 1,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'It depends. What will you use it for?', ar: 'يعتمد. لأي شيء بتستخدمه؟' },
            { en: 'If you want great photos, I recommend this one.', ar: 'إذا تبغى صور ممتازة، أنصحك بهذا.' },
            { en: "It's more expensive, but it's worth it.", ar: 'أغلى، لكنه يستاهل.' },
          ],
        },
        { kind: 'drill', title: 'تدريب العبارات', itemIds: ['recommend', 'depends', 'if-you-want', 'worth-it', 'good-for', 'try'] },
        {
          kind: 'quiz', title: 'محادثة كاملة',
          exercises: [
            {
              id: 'u3l5-d1', type: 'dialogue', skill: 'conversation', itemIds: ['depends', 'recommend', 'cheaper', 'but'],
              prompt: 'عميلة تقارن بين تابلتين.',
              turns: [
                { speaker: 'customer', en: 'Which tablet is better?', ar: 'أي تابلت أفضل؟' },
                { speaker: 'staff', options: ['It depends. Is it for work or for school?', 'This one. Buy it.', 'Both are the bad.'], answer: 0, ar: 'يعتمد. للعمل ولا للدراسة؟' },
                { speaker: 'customer', en: 'For my son. For school.', ar: 'لولدي. للدراسة.' },
                { speaker: 'staff', options: ['Model A is lighter and cheaper. It is good for school.', 'Model A is more light and more cheap.', 'Model A is lightest than Model B.'], answer: 0, ar: 'الموديل A أخف وأرخص. مناسب للدراسة.' },
                { speaker: 'customer', en: 'And Model B?', ar: 'والموديل B؟' },
                { speaker: 'staff', options: ['Model B is more powerful, but it is more expensive.', 'Model B is powerfuler, but expensiver.', 'Model B is the same.'], answer: 0, ar: 'الموديل B أقوى، لكنه أغلى.' },
                { speaker: 'customer', en: 'Okay. What do you recommend?', ar: 'تمام. بماذا تنصح؟' },
                { speaker: 'staff', options: ['For school, I recommend Model A.', 'I recommend you to Model A.', 'Recommend Model A I.'], answer: 0, ar: 'للدراسة، أنصح بالموديل A.' },
              ],
            },
          ],
        },
      ],
    },
  ],
  test: [
    {
      id: 'u3t-1', type: 'fill', skill: 'grammar', itemIds: ['lighter', 'than'],
      prompt: 'أكمل', sentence: 'This laptop is lighter ___ that one.', answers: ['than'], bank: ['than', 'from', 'as'],
    },
    {
      id: 'u3t-2', type: 'choice', skill: 'grammar', itemIds: ['more-expensive'], optionsDir: 'ltr',
      prompt: 'expensive → (أغلى)', options: ['expensiver', 'more expensive', 'most expensive'], answer: 1,
    },
    {
      id: 'u3t-3', type: 'choice', skill: 'listening', audio: 'Model A is cheaper, but Model B has a better camera.', hideAudioText: true, itemIds: ['cheaper', 'better'],
      prompt: 'استمع: ما ميزة Model B؟', options: ['أرخص', 'كاميرا أفضل', 'أخف'], answer: 1,
    },
    {
      id: 'u3t-4', type: 'choice', skill: 'reading', itemIds: ['the-same', 'difference'],
      prompt: 'اقرأ: “Both models have the same battery. The difference is the screen size.” ما الفرق؟', options: ['البطارية', 'حجم الشاشة', 'لا يوجد فرق'], answer: 1,
    },
    {
      id: 'u3t-5', type: 'fill', skill: 'grammar', itemIds: ['the-best'],
      prompt: 'أكمل', sentence: 'This is ___ best camera in this price range.', answers: ['the'], bank: ['the', 'a', 'more'],
    },
    {
      id: 'u3t-6', type: 'order', skill: 'grammar', itemIds: ['if-you-want', 'recommend'],
      prompt: 'رتّب', ar: 'إذا تبغى بطارية طويلة، أنصحك بهذا.', words: ['If', 'you', 'want', 'a', 'long', 'battery,', 'I', 'recommend', 'this', 'one.'],
    },
    {
      id: 'u3t-7', type: 'type', skill: 'writing', itemIds: ['depends'],
      prompt: 'العميل سأل: Which one is better? أجب بأن الأمر يعتمد على ميزانيته.', answers: ['It depends on your budget.'],
      requiredWords: [['depends'], ['budget']], model: 'It depends on your budget.',
    },
    {
      id: 'u3t-8', type: 'choice', skill: 'conversation', itemIds: ['worth-it'], optionsDir: 'ltr',
      prompt: 'العميل: Why is it more expensive? أفضل رد:', options: ['Because it is.', 'Because the camera and battery are better.', 'I don\'t know.'], answer: 1,
    },
  ],
};
