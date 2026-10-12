import type { Unit } from './types';

// الوحدة 2: شرح المواصفات. كل الأرقام والمواصفات أمثلة تعليمية لأجهزة افتراضية (Model A / Model B).

export const unit2: Unit = {
  id: 'u2',
  order: 2,
  title: 'شرح المواصفات',
  titleEn: 'Explaining specs',
  description: 'تشرح الشاشة والبطارية والأداء والكاميرا والصوت والتوافق بجمل قصيرة وواضحة.',
  cefr: 'A2',
  lessons: [
    {
      id: 'u2l1', unitId: 'u2', title: 'الشاشة والحجم والوزن', titleEn: 'Screen, size & weight', minutes: 10,
      goal: 'تصف الشاشة والحجم والوزن: It has a 6.7-inch screen. It is very light.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['screen', 'inch', 'size', 'clear', 'bright', 'light', 'heavy', 'thin'] },
        {
          kind: 'grammar', id: 'g-has-is', title: 'has أم is؟', pattern: 'It has + اسم · It is + صفة',
          explanation: [
            'has = عنده/فيه: تستخدمها مع شيء يملكه الجهاز (شاشة، كاميرا، بطارية).',
            'is = يكون: تستخدمها مع صفة (خفيف، سريع، واضح).',
            'مع الجمع: They have … · They are …',
          ],
          examples: [
            { en: 'It has a 6.7-inch screen.', ar: 'فيه شاشة 6.7 بوصة.' },
            { en: 'It is very light.', ar: 'هو خفيف جدًا.' },
            { en: 'The screen is bright and clear.', ar: 'الشاشة ساطعة وواضحة.' },
          ],
          note: 'خطأ شائع: It is a big screen ✗ (بمعنى فيه شاشة كبيرة). الصحيح: It has a big screen ✓',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: عميل يبحث عن تابلت للقراءة.',
          lines: [
            { speaker: 'customer', en: 'I want a tablet for reading. Is this one heavy?', ar: 'أبغى تابلت للقراءة. هذا ثقيل؟' },
            { speaker: 'staff', en: 'No, it is very light and thin. It has an 11-inch screen.', ar: 'لا، خفيف جدًا ورفيع. شاشته 11 بوصة.' },
            { speaker: 'customer', en: 'Is the screen good outside?', ar: 'الشاشة زينة في الخارج؟' },
            { speaker: 'staff', en: 'Yes, it is bright and clear.', ar: 'نعم، ساطعة وواضحة.' },
          ],
          questions: [
            {
              id: 'u2l1-l1', type: 'choice', skill: 'listening', itemIds: ['inch'],
              prompt: 'كم حجم الشاشة؟', options: ['10 بوصة', '11 بوصة', '13 بوصة'], answer: 1,
            },
            {
              id: 'u2l1-l2', type: 'choice', skill: 'listening', itemIds: ['light', 'thin'],
              prompt: 'كيف وصف الموظف التابلت؟', options: ['ثقيل وكبير', 'خفيف ورفيع', 'رخيص وقديم'], answer: 1,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'It has a 6.7-inch screen.', ar: 'فيه شاشة 6.7 بوصة.' },
            { en: 'It is very light and thin.', ar: 'هو خفيف جدًا ورفيع.' },
            { en: 'The screen is bright and clear.', ar: 'الشاشة ساطعة وواضحة.' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['screen', 'inch', 'bright', 'light', 'heavy', 'thin'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u2l1-q1', type: 'fill', skill: 'grammar', itemIds: ['screen'],
              prompt: 'has أم is؟', sentence: 'It ___ a big screen.', ar: 'فيه شاشة كبيرة.',
              answers: ['has'], bank: ['has', 'is', 'have'],
              explain: 'الشاشة شيء يملكه الجهاز، فنستخدم has. ومع it تكون has وليس have.',
            },
            {
              id: 'u2l1-q2', type: 'fill', skill: 'grammar', itemIds: ['light'],
              prompt: 'has أم is؟', sentence: 'This tablet ___ very light.', ar: 'هذا التابلت خفيف جدًا.',
              answers: ['is'], bank: ['has', 'is', 'are'],
              explain: 'light صفة، فنستخدم is.',
            },
            {
              id: 'u2l1-q3', type: 'choice', skill: 'grammar', itemIds: ['inch'], optionsDir: 'ltr',
              prompt: 'أي جملة صحيحة؟', options: ['It has a 6.7-inches screen.', 'It has a 6.7-inch screen.', 'It is 6.7-inch screen.'], answer: 1,
              explain: 'قبل الاسم نقول inch مفردة مع شرطة: a 6.7-inch screen.',
            },
            {
              id: 'u2l1-q4', type: 'type', skill: 'writing', itemIds: ['light', 'thin'],
              prompt: 'اكتب: «هو خفيف ورفيع.»', answers: ['It is light and thin.', "It's light and thin."],
              starter: 'It is', hints: ['It is … and …', 'خفيف = light، رفيع = thin'],
            },
          ],
        },
      ],
    },
    {
      id: 'u2l2', unitId: 'u2', title: 'البطارية والشحن', titleEn: 'Battery & charging', minutes: 10,
      goal: 'تشرح كم تدوم البطارية وسرعة الشحن: It lasts all day. It supports fast charging.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['battery-life', 'last', 'hours', 'fast-charging', 'watts', 'fully-charged', 'support'] },
        {
          kind: 'grammar', id: 'g-it-s', title: 'المضارع مع it: أضف s', pattern: 'It lasts · It charges · It supports',
          explanation: [
            'عند وصف ما يفعله الجهاز عادةً نستخدم المضارع البسيط.',
            'مع it / he / she نضيف s للفعل: last → lasts.',
            'للسؤال: Does it …? والفعل بدون s: Does it support …?',
          ],
          examples: [
            { en: 'The battery lasts about 20 hours.', ar: 'البطارية تدوم حوالي 20 ساعة.' },
            { en: 'It charges in one hour.', ar: 'يشحن في ساعة.' },
            { en: 'Does it support fast charging? — Yes, it does.', ar: 'هل يدعم الشحن السريع؟ — نعم.' },
          ],
          note: 'خطأ شائع: Does it supports? ✗ — الصحيح: Does it support? ✓',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: عميل يسأل عن بطارية سماعات.',
          lines: [
            { speaker: 'customer', en: 'How long does the battery last?', ar: 'كم تدوم البطارية؟' },
            { speaker: 'staff', en: 'It lasts about eight hours. With the case, about thirty hours.', ar: 'حوالي ثمان ساعات. ومع العلبة حوالي ثلاثين ساعة.' },
            { speaker: 'customer', en: 'Does it support fast charging?', ar: 'تدعم الشحن السريع؟' },
            { speaker: 'staff', en: 'Yes, it does. Ten minutes gives you about one hour.', ar: 'نعم. عشر دقائق شحن تعطيك حوالي ساعة.' },
          ],
          questions: [
            {
              id: 'u2l2-l1', type: 'choice', skill: 'listening', itemIds: ['hours', 'last'],
              prompt: 'كم تدوم السماعات بدون العلبة؟', options: ['3 ساعات', '8 ساعات', '30 ساعة'], answer: 1,
              explain: 'eight hours = 8 ساعات. وthirty hours (30) مع العلبة.',
            },
            {
              id: 'u2l2-l2', type: 'choice', skill: 'listening', itemIds: ['fast-charging', 'support'],
              prompt: 'هل تدعم الشحن السريع؟', options: ['نعم', 'لا', 'الموظف لا يعرف'], answer: 0,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'The battery lasts all day.', ar: 'البطارية تكفي اليوم كله.' },
            { en: 'It supports fast charging.', ar: 'يدعم الشحن السريع.' },
            { en: 'You need a 25-watt charger.', ar: 'تحتاج شاحن 25 واط.' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['battery-life', 'last', 'hours', 'fast-charging', 'fully-charged', 'support'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u2l2-q1', type: 'fill', skill: 'grammar', itemIds: ['last'],
              prompt: 'اختر الصحيح', sentence: 'The battery ___ all day.', answers: ['lasts'], bank: ['last', 'lasts', 'lasting'],
              explain: 'The battery = it، فنضيف s: lasts.',
            },
            {
              id: 'u2l2-q2', type: 'choice', skill: 'grammar', itemIds: ['support'], optionsDir: 'ltr',
              prompt: 'أي سؤال صحيح؟', options: ['Does it supports wireless charging?', 'Does it support wireless charging?', 'It support wireless charging?'], answer: 1,
            },
            {
              id: 'u2l2-q3', type: 'choice', skill: 'listening', audio: 'It lasts about fourteen hours.', hideAudioText: true, itemIds: ['hours'],
              prompt: 'استمع: كم ساعة؟', options: ['14', '40', '4'], answer: 0, optionsDir: 'ltr',
              explain: 'fourteen (14) الضغط على آخرها. forty (40) الضغط على أولها.',
            },
            {
              id: 'u2l2-q4', type: 'type', skill: 'writing', itemIds: ['fast-charging', 'support'],
              prompt: 'العميل سأل: Does it support fast charging? أجب بنعم وجملة كاملة.',
              answers: ['Yes, it does. It supports fast charging.', 'Yes, it supports fast charging.', 'Yes, it does.'],
              requiredWords: [['yes'], ['does', 'supports']], model: 'Yes, it does. It supports fast charging.',
              starter: 'Yes,', hints: ['Yes, it does.', 'It supports …'],
            },
          ],
        },
      ],
    },
    {
      id: 'u2l3', unitId: 'u2', title: 'الأداء والذاكرة', titleEn: 'Performance & memory', minutes: 10,
      goal: 'تشرح السرعة والرام والمساحة، وتستخدم can للقدرة.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['processor', 'fast-slow', 'ram', 'smooth', 'apps', 'updates', 'can-run'] },
        {
          kind: 'grammar', id: 'g-can-ability', title: 'can للقدرة', pattern: 'It can + فعل · You can + فعل',
          explanation: [
            'can = يقدر/يستطيع. بعدها الفعل كما هو بدون to وبدون s.',
            'It can run heavy games = يقدر يشغّل ألعاب ثقيلة.',
            'You can … تستخدمها لتشرح للعميل ماذا يستطيع أن يفعل بالجهاز.',
            'النفي: can\'t = cannot.',
          ],
          examples: [
            { en: 'It can run heavy games easily.', ar: 'يشغّل الألعاب الثقيلة بسهولة.' },
            { en: 'You can use many apps at the same time.', ar: 'تقدر تستخدم تطبيقات كثيرة معًا.' },
            { en: "The old model can't run this game well.", ar: 'الموديل القديم ما يشغّل هذه اللعبة بشكل جيد.' },
          ],
          note: 'خطأ شائع: It can runs ✗ / It can to run ✗ — الصحيح: It can run ✓',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: الفرق بين الرام والمساحة.',
          lines: [
            { speaker: 'customer', en: 'My phone is very slow. What is RAM?', ar: 'جوالي بطيء مرة. وش يعني رام؟' },
            { speaker: 'staff', en: 'RAM helps the phone run many apps at the same time.', ar: 'الرام يساعد الجوال يشغّل تطبيقات كثيرة في نفس الوقت.' },
            { speaker: 'staff', en: 'Storage is for your photos and files.', ar: 'المساحة لصورك وملفاتك.' },
            { speaker: 'customer', en: 'I see. So this one is fast?', ar: 'فهمت. يعني هذا سريع؟' },
            { speaker: 'staff', en: 'Yes. It has 8 GB of RAM and a fast processor. It feels very smooth.', ar: 'نعم. فيه 8 جيجا رام ومعالج سريع. سلس جدًا.' },
          ],
          questions: [
            {
              id: 'u2l3-l1', type: 'choice', skill: 'listening', itemIds: ['ram'],
              prompt: 'حسب الموظف، ماذا يفعل الرام؟', options: ['يحفظ الصور', 'يساعد على تشغيل تطبيقات كثيرة معًا', 'يحسّن الكاميرا'], answer: 1,
            },
            {
              id: 'u2l3-l2', type: 'choice', skill: 'listening', itemIds: ['ram'],
              prompt: 'كم رام في الجوال المقترح؟', options: ['4 GB', '8 GB', '128 GB'], answer: 1, optionsDir: 'ltr',
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'It has a fast processor.', ar: 'معالجه سريع.' },
            { en: 'It can run heavy games easily.', ar: 'يشغّل الألعاب الثقيلة بسهولة.' },
            { en: 'Storage is for your photos and files.', ar: 'المساحة لصورك وملفاتك.' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['processor', 'fast-slow', 'ram', 'smooth', 'apps', 'updates'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u2l3-q1', type: 'fill', skill: 'grammar', itemIds: ['can-run'],
              prompt: 'اختر الصحيح', sentence: 'It can ___ heavy games.', answers: ['run'], bank: ['run', 'runs', 'to run'],
              explain: 'بعد can الفعل كما هو: run.',
            },
            {
              id: 'u2l3-q2', type: 'choice', skill: 'vocab', itemIds: ['ram'],
              prompt: 'عميل يريد مساحة أكبر لحفظ صوره. عن ماذا يسأل؟', optionsDir: 'ltr', options: ['RAM', 'storage', 'processor'], answer: 1,
              explain: 'حفظ الصور والملفات = storage. أما RAM فللسرعة وتشغيل التطبيقات.',
            },
            {
              id: 'u2l3-q3', type: 'order', skill: 'grammar', itemIds: ['apps'],
              prompt: 'رتّب', ar: 'تقدر تستخدم تطبيقات كثيرة.', words: ['You', 'can', 'use', 'many', 'apps.'],
            },
            {
              id: 'u2l3-q4', type: 'type', skill: 'writing', itemIds: ['processor'],
              prompt: 'اكتب: «فيه معالج سريع.»', answers: ['It has a fast processor.'],
              starter: 'It has', hints: ['It has a …', 'صفة قبل الاسم: fast processor'],
            },
          ],
        },
      ],
    },
    {
      id: 'u2l4', unitId: 'u2', title: 'الكاميرا والصوت', titleEn: 'Camera & sound', minutes: 10,
      goal: 'تشرح مزايا الكاميرا والسماعات، وتستخدم there is / there are.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['photos', 'video', 'zoom', 'night-mode', 'noise-cancelling', 'sound-quality', 'microphone', 'there-is-are'] },
        {
          kind: 'grammar', id: 'g-there', title: 'there is / there are', pattern: 'There is + مفرد · There are + جمع',
          explanation: [
            'there is / there are = يوجد. تستخدمها لتعدّد المزايا.',
            'السؤال: Is there …? / Are there …?',
            'النفي: There isn\'t … / There aren\'t …',
          ],
          examples: [
            { en: 'There are three cameras on the back.', ar: 'يوجد ثلاث كاميرات في الخلف.' },
            { en: 'There is a night mode.', ar: 'يوجد وضع ليلي.' },
            { en: 'Is there noise cancelling? — Yes, there is.', ar: 'فيه عزل ضوضاء؟ — نعم.' },
          ],
          note: 'العرب يقولون غالبًا It has … وهذا صحيح أيضًا. there is طريقة ثانية مفيدة عند تعداد المزايا.',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: عميلة تسأل عن سماعات للطيران.',
          lines: [
            { speaker: 'customer', en: 'I travel a lot. Is there noise cancelling?', ar: 'أسافر كثير. فيها عزل ضوضاء؟' },
            { speaker: 'staff', en: 'Yes, there is. The sound quality is excellent too.', ar: 'نعم، فيها. وجودة الصوت ممتازة بعد.' },
            { speaker: 'customer', en: 'Can I use them for calls?', ar: 'أقدر أستخدمها للمكالمات؟' },
            { speaker: 'staff', en: 'Sure. The microphone is clear for calls.', ar: 'أكيد. المايك واضح في المكالمات.' },
          ],
          questions: [
            {
              id: 'u2l4-l1', type: 'choice', skill: 'listening', itemIds: ['noise-cancelling'],
              prompt: 'لماذا تريد العميلة عزل الضوضاء؟', options: ['للنادي', 'لأنها تسافر كثيرًا', 'للدراسة'], answer: 1,
            },
            {
              id: 'u2l4-l2', type: 'choice', skill: 'listening', itemIds: ['microphone'],
              prompt: 'ماذا قال الموظف عن المايك؟', options: ['ضعيف', 'غير موجود', 'واضح في المكالمات'], answer: 2,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'There are three cameras on the back.', ar: 'يوجد ثلاث كاميرات في الخلف.' },
            { en: 'It takes great photos at night.', ar: 'يصوّر صورًا ممتازة في الليل.' },
            { en: 'These headphones have noise cancelling.', ar: 'هذه السماعات فيها عزل ضوضاء.' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['photos', 'video', 'zoom', 'night-mode', 'noise-cancelling', 'microphone'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u2l4-q1', type: 'fill', skill: 'grammar', itemIds: ['there-is-are'],
              prompt: 'is أم are؟', sentence: 'There ___ three cameras.', answers: ['are'], bank: ['is', 'are'],
              explain: 'three cameras جمع، فنقول There are.',
            },
            {
              id: 'u2l4-q2', type: 'choice', skill: 'vocab', itemIds: ['photos'], optionsDir: 'ltr',
              prompt: 'أي جملة صحيحة؟', options: ['It makes great photos.', 'It takes great photos.', 'It does great photos.'], answer: 1,
              explain: 'نقول take photos.',
            },
            {
              id: 'u2l4-q3', type: 'choice', skill: 'listening', audio: 'The camera has ten times zoom.', hideAudioText: true, itemIds: ['zoom'],
              prompt: 'استمع: كم مرة الزوم؟', options: ['2x', '5x', '10x'], answer: 2, optionsDir: 'ltr',
            },
            {
              id: 'u2l4-q4', type: 'type', skill: 'writing', itemIds: ['noise-cancelling', 'there-is-are'],
              prompt: 'العميل سأل: Is there noise cancelling? أجب بنعم.',
              answers: ['Yes, there is.', 'Yes, there is noise cancelling.'], requiredWords: [['yes'], ['there is', 'it has', 'they have']],
              model: 'Yes, there is.', starter: 'Yes,', hints: ['Yes, there …'],
            },
          ],
        },
      ],
    },
    {
      id: 'u2l5', unitId: 'u2', title: 'التوافق والمتانة', titleEn: 'Compatibility & durability', minutes: 10,
      goal: 'تجيب عن «هل يشتغل مع جوالي؟» وتشرح مقاومة الماء دون مبالغة.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['compatible', 'works-with', 'bluetooth', 'connect', 'water-resistant', 'model', 'version'] },
        {
          kind: 'grammar', id: 'g-does-short', title: 'Does it …? والإجابة القصيرة', pattern: 'Does it work with …? — Yes, it does. / No, it doesn\'t.',
          explanation: [
            'للسؤال عن جهاز بالمضارع: Does it + فعل بدون s.',
            'الإجابة القصيرة تكرر does وليس الفعل: Yes, it does.',
            'النفي: No, it doesn\'t. ثم أضف معلومة مفيدة.',
          ],
          examples: [
            { en: 'Does it work with Android? — Yes, it does.', ar: 'يشتغل مع الأندرويد؟ — نعم.' },
            { en: "Does this case fit my phone? — No, it doesn't. You need this one.", ar: 'هل الغطاء يناسب جوالي؟ — لا. تحتاج هذا.' },
          ],
          note: 'قبل أن تجيب عن التوافق اسأل دائمًا: Which model do you have?',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: عميل يشتري ساعة ذكية.',
          lines: [
            { speaker: 'customer', en: 'Does this watch work with my phone?', ar: 'هذه الساعة تشتغل مع جوالي؟' },
            { speaker: 'staff', en: 'Which model do you have?', ar: 'أي موديل عندك؟' },
            { speaker: 'customer', en: 'An Android phone, the latest version.', ar: 'جوال أندرويد، آخر إصدار.' },
            { speaker: 'staff', en: 'Yes, it does. It connects by Bluetooth. It is water-resistant, but it is not for diving.', ar: 'نعم. تتصل بالبلوتوث. وهي مقاومة للماء، لكنها ليست للغوص.' },
          ],
          questions: [
            {
              id: 'u2l5-l1', type: 'choice', skill: 'listening', itemIds: ['model'],
              prompt: 'ماذا سأل الموظف قبل أن يجيب؟', options: ['عن الميزانية', 'عن موديل الجوال', 'عن اللون'], answer: 1,
            },
            {
              id: 'u2l5-l2', type: 'choice', skill: 'listening', itemIds: ['water-resistant'],
              prompt: 'ماذا قال عن الماء؟', options: ['مضادة للماء تمامًا وتصلح للغوص', 'مقاومة للماء لكن ليست للغوص', 'لا تتحمل الماء أبدًا'], answer: 1,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'Which model do you have?', ar: 'أي موديل عندك؟' },
            { en: 'It works with iPhone and Android.', ar: 'يشتغل مع الآيفون والأندرويد.' },
            { en: 'It is water-resistant, not waterproof.', ar: 'مقاوم للماء، وليس مضادًا تمامًا.' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['compatible', 'works-with', 'bluetooth', 'connect', 'water-resistant', 'model'] },
        {
          kind: 'quiz', title: 'محادثة كاملة',
          exercises: [
            {
              id: 'u2l5-d1', type: 'dialogue', skill: 'conversation', itemIds: ['compatible', 'model', 'works-with'],
              prompt: 'عميل يسأل عن غطاء لجواله.',
              turns: [
                { speaker: 'customer', en: 'Is this case compatible with my phone?', ar: 'هذا الغطاء يناسب جوالي؟' },
                { speaker: 'staff', options: ['Which model do you have?', 'Yes, all cases are the same.', 'How much is your phone?'], answer: 0, ar: 'أي موديل عندك؟', explain: 'لا تؤكد التوافق قبل معرفة الموديل.' },
                { speaker: 'customer', en: "It's Model A, the new version.", ar: 'الموديل A، الإصدار الجديد.' },
                { speaker: 'staff', options: ['Yes, it is. This case is for Model A.', 'Yes, it do. This case for Model A.', 'Goodbye.'], answer: 0, ar: 'نعم. هذا الغطاء للموديل A.', explain: 'السؤال بـ Is …? فالإجابة Yes, it is. ولا تحذف is من الجملة الثانية.' },
                { speaker: 'customer', en: 'Great. Does it support wireless charging?', ar: 'ممتاز. يدعم الشحن اللاسلكي؟' },
                { speaker: 'staff', options: ["I'm not sure. Let me check the box.", 'Yes, 100%. (بدون تحقق)', 'What is charging?'], answer: 0, ar: 'لست متأكدًا. خلني أشيك على العلبة.', explain: 'إذا لم تكن متأكدًا، تحقق من العلبة أو المواصفات.' },
              ],
            },
            {
              id: 'u2l5-q2', type: 'choice', skill: 'grammar', itemIds: ['works-with'], optionsDir: 'ltr',
              prompt: 'Does it work with iPhone? — (نعم)', options: ['Yes, it works.', 'Yes, it does.', 'Yes, it do.'], answer: 1,
            },
          ],
        },
      ],
    },
  ],
  test: [
    {
      id: 'u2t-1', type: 'fill', skill: 'grammar', itemIds: ['screen'],
      prompt: 'أكمل', sentence: 'It ___ a bright screen.', answers: ['has'], bank: ['has', 'is', 'have'],
    },
    {
      id: 'u2t-2', type: 'choice', skill: 'listening', audio: 'The battery lasts about twelve hours.', hideAudioText: true, itemIds: ['last', 'hours'],
      prompt: 'استمع: كم تدوم البطارية؟', options: ['2 ساعة', '12 ساعة', '20 ساعة'], answer: 1,
    },
    {
      id: 'u2t-3', type: 'choice', skill: 'reading', itemIds: ['ram'],
      prompt: 'اقرأ: “This phone has 12 GB of RAM and 256 GB of storage.” كم مساحة التخزين؟', options: ['12 GB', '256 GB', '268 GB'], answer: 1, optionsDir: 'ltr',
    },
    {
      id: 'u2t-4', type: 'fill', skill: 'grammar', itemIds: ['can-run'],
      prompt: 'أكمل', sentence: 'You can ___ many apps.', answers: ['use'], bank: ['use', 'uses', 'using'],
    },
    {
      id: 'u2t-5', type: 'choice', skill: 'reading', itemIds: ['water-resistant'],
      prompt: 'اقرأ: “Water-resistant. Not for swimming.” ماذا تقول للعميل؟', options: ['يتحمل السباحة', 'يقاوم الماء، لكن ليس للسباحة', 'لا يتحمل أي ماء'], answer: 1,
    },
    {
      id: 'u2t-6', type: 'order', skill: 'grammar', itemIds: ['there-is-are'],
      prompt: 'رتّب', ar: 'يوجد ثلاث كاميرات في الخلف.', words: ['There', 'are', 'three', 'cameras', 'on', 'the', 'back.'],
    },
    {
      id: 'u2t-7', type: 'type', skill: 'writing', itemIds: ['model'],
      prompt: 'العميل يسأل إن كان الشاحن يناسب جواله. اسأله عن موديل جواله.', answers: ['Which model do you have?', 'What model do you have?', 'What model is your phone?'],
      requiredWords: [['model']], model: 'Which model do you have?',
    },
    {
      id: 'u2t-8', type: 'choice', skill: 'conversation', itemIds: ['support'], optionsDir: 'ltr',
      prompt: 'Does it support fast charging? (لا تعرف الجواب)', options: ['Yes, of course.', 'Let me check the specs, please.', 'No.'], answer: 1,
    },
  ],
};
