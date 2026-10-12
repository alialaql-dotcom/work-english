import type { Unit } from './types';

// الوحدة 1: الترحيب بالعميل وفهم احتياجه — قسم الجوالات والتابلت والسماعات والإكسسوارات.
// كل المحادثات افتراضية، والأسعار أمثلة تعليمية لا تمثل أسعار جرير.

export const unit1: Unit = {
  id: 'u1',
  order: 1,
  title: 'الترحيب بالعميل وفهم احتياجه',
  titleEn: 'Welcoming & understanding needs',
  description: 'تفتح الحديث، ترافق العميل، تفهم الجهاز الذي يريده، تسأل عن الميزانية والاستخدام، وتستوضح ما لم تفهمه.',
  cefr: 'A1',
  lessons: [
    {
      id: 'u1l1', unitId: 'u1', title: 'فتح الحديث مع العميل', titleEn: 'Opening the conversation', minutes: 10,
      goal: 'تبدأ الحديث، وتفهم «أتفرج فقط» وترد عليها بلطف.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'عبارات الدرس', itemIds: ['how-can-i-help', 'looking-for-something', 'just-looking', 'take-your-time', 'let-me-know', 'of-course', 'sure'] },
        {
          kind: 'grammar', id: 'g-can', title: 'الطلب والعرض بـ can', pattern: 'Can I + فعل…? · Can you + فعل…?',
          explanation: [
            'Can I…? = هل أقدر…؟ تستخدمها لتعرض المساعدة أو تطلب إذنًا.',
            'Can you…? = هل تقدر…؟ تستخدمها لتطلب من شخص شيئًا.',
            'بعد can يأتي الفعل كما هو بدون to وبدون s.',
          ],
          examples: [
            { en: 'Can I help you?', ar: 'أقدر أساعدك؟' },
            { en: 'Can I see this one?', ar: 'أقدر أشوف هذا؟' },
            { en: 'Can you wait a moment?', ar: 'تقدر تنتظر لحظة؟' },
          ],
          note: 'خطأ شائع: Can I to help you? ❌ — الصحيح: Can I help you? ✅',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: عميلة تتجول في قسم الجوالات.',
          lines: [
            { speaker: 'staff', en: 'Good evening! Can I help you?', ar: 'مساء الخير! أقدر أساعدك؟' },
            { speaker: 'customer', en: "No, thanks. I'm just looking.", ar: 'لا، شكرًا. أتفرّج فقط.' },
            { speaker: 'staff', en: 'Sure. Take your time. Let me know if you need help.', ar: 'أكيد. خذي راحتك. أخبريني إذا احتجتِ مساعدة.' },
            { speaker: 'customer', en: 'Thank you.', ar: 'شكرًا.' },
          ],
          questions: [
            {
              id: 'u1l1-l1', type: 'choice', skill: 'listening', itemIds: ['just-looking'],
              prompt: 'ماذا تريد العميلة؟', options: ['تريد شراء جوال الآن', 'تتفرج فقط', 'تبحث عن المدير'], answer: 1,
            },
            {
              id: 'u1l1-l2', type: 'choice', skill: 'listening', itemIds: ['take-your-time'],
              prompt: 'كيف كان رد الموظف؟', options: ['ألحّ عليها لتشتري', 'قال لها خذي راحتك', 'ذهب للمدير'], answer: 1,
              explain: 'Take your time = خذ راحتك. هذا رد لبق لا يضغط على العميل.',
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'Good evening! How can I help you?', ar: 'مساء الخير! كيف أقدر أساعدك؟' },
            { en: 'Sure. Take your time.', ar: 'أكيد. خذ راحتك.' },
            { en: 'Let me know if you need help.', ar: 'أخبرني إذا احتجت مساعدة.' },
          ],
        },
        { kind: 'drill', title: 'تدريب العبارات', itemIds: ['how-can-i-help', 'just-looking', 'take-your-time', 'let-me-know', 'sure'] },
        {
          kind: 'practice', title: 'من الاختيار إلى الرد',
          exercises: [
            {
              id: 'u1l1-p1', type: 'choice', skill: 'conversation', itemIds: ['take-your-time'], optionsDir: 'ltr',
              prompt: "العميل قال: I'm just looking. أفضل رد:",
              options: ['Okay. Buy this one.', 'Sure. Take your time.', 'Sorry, I don\'t know.'], answer: 1,
            },
            {
              id: 'u1l1-p2', type: 'fill', skill: 'grammar', itemIds: ['how-can-i-help'],
              prompt: 'أكمل', sentence: 'How can I ___ you?', ar: 'كيف أقدر أساعدك؟',
              answers: ['help'], bank: ['help', 'to help', 'helps'],
              explain: 'بعد can يأتي الفعل كما هو: help.',
            },
            {
              id: 'u1l1-p3', type: 'order', skill: 'grammar', itemIds: ['let-me-know'],
              prompt: 'رتّب الكلمات', ar: 'أخبرني إذا احتجت مساعدة.',
              words: ['Let', 'me', 'know', 'if', 'you', 'need', 'help.'],
            },
            {
              id: 'u1l1-p4', type: 'type', skill: 'writing', itemIds: ['how-can-i-help', 'good-morning'],
              prompt: 'رحّب بعميل دخل صباحًا واعرض المساعدة.', context: { speaker: 'customer', en: '(The customer walks in at 10 a.m.)', ar: '(العميل يدخل الساعة 10 صباحًا)' },
              answers: ['Good morning! How can I help you?', 'Good morning! Can I help you?'],
              requiredWords: [['good morning', 'hello', 'hi', 'welcome'], ['help']],
              starter: 'Good morning!', model: 'Good morning! How can I help you?',
              hints: ['ابدأ بتحية الصباح.', 'ثم: How can I …?'],
            },
          ],
        },
        {
          kind: 'quiz', title: 'محادثة كاملة',
          exercises: [
            {
              id: 'u1l1-d1', type: 'dialogue', skill: 'conversation', itemIds: ['how-can-i-help', 'take-your-time', 'let-me-know'],
              prompt: 'أكمل المحادثة باختيار ردك في كل مرة.',
              turns: [
                { speaker: 'customer', en: '(A customer enters the store.)', ar: '(عميل يدخل المتجر)' },
                { speaker: 'staff', options: ['Hello! How can I help you?', 'What do you want?', 'Goodbye!'], answer: 0, ar: 'مرحبًا! كيف أقدر أساعدك؟', explain: 'What do you want? تبدو جافة. الأفضل How can I help you?' },
                { speaker: 'customer', en: "Thanks, I'm just looking.", ar: 'شكرًا، أتفرّج فقط.' },
                { speaker: 'staff', options: ['No, you need a phone.', 'Sure. Take your time.', 'Excuse me.'], answer: 1, ar: 'أكيد. خذ راحتك.' },
                { speaker: 'customer', en: 'Thank you.', ar: 'شكرًا.' },
                { speaker: 'staff', options: ['Let me know if you need help.', 'Good night.', 'I am fine.'], answer: 0, ar: 'أخبرني إذا احتجت مساعدة.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'u1l2', unitId: 'u1', title: 'مرافقة العميل ومعرفة طلبه', titleEn: 'Guiding & asking what they need', minutes: 10,
      goal: 'تسأل «عن ماذا تبحث؟»، وتفهم I need / I\'m looking for، وترافق العميل.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'عبارات الدرس', itemIds: ['what-looking-for', 'looking-for', 'need', 'follow-me', 'this-way', 'one-moment'] },
        {
          kind: 'grammar', id: 'g-a-an', title: 'a و an قبل الاسم المفرد', pattern: 'a + صوت ساكن · an + صوت متحرك (a, e, i, o, u)',
          explanation: [
            'قبل الاسم المفرد المعدود نضع a أو an: a phone · an iPad.',
            'العبرة بالصوت لا بالحرف: an hour (لأن h صامتة).',
            'مع الجمع لا نضع a: chargers وليس a chargers.',
          ],
          examples: [
            { en: "I'm looking for a tablet.", ar: 'أبحث عن تابلت.' },
            { en: 'I need an adapter.', ar: 'أحتاج محوّل.' },
            { en: 'I need new earbuds.', ar: 'أحتاج سماعات جديدة.' },
          ],
          note: 'خطأ شائع: I need charger ❌ — الصحيح: I need a charger ✅',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: عميل يبحث عن تابلت.',
          lines: [
            { speaker: 'staff', en: 'Welcome! What are you looking for today?', ar: 'أهلًا! عن ماذا تبحث اليوم؟' },
            { speaker: 'customer', en: "I'm looking for a tablet for my son.", ar: 'أبحث عن تابلت لولدي.' },
            { speaker: 'staff', en: 'Of course. The tablets are this way. Follow me, please.', ar: 'أكيد. التابلتات من هنا. تفضل معي.' },
          ],
          questions: [
            {
              id: 'u1l2-l1', type: 'choice', skill: 'listening', itemIds: ['looking-for', 'tablet'],
              prompt: 'ماذا يريد العميل؟', options: ['جوال لنفسه', 'تابلت لابنه', 'سماعات لابنته'], answer: 1,
            },
            {
              id: 'u1l2-l2', type: 'choice', skill: 'listening', itemIds: ['follow-me'],
              prompt: 'ماذا فعل الموظف؟', options: ['طلب منه الانتظار', 'رافقه إلى مكان التابلتات', 'أعطاه السعر'], answer: 1,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'What are you looking for today?', ar: 'عن ماذا تبحث اليوم؟' },
            { en: 'This way, please.', ar: 'من هنا، تفضل.' },
            { en: 'One moment, please.', ar: 'لحظة من فضلك.' },
          ],
        },
        { kind: 'drill', title: 'تدريب العبارات', itemIds: ['what-looking-for', 'looking-for', 'need', 'follow-me', 'this-way', 'one-moment'] },
        {
          kind: 'practice', title: 'كوّن جملك',
          exercises: [
            {
              id: 'u1l2-p1', type: 'fill', skill: 'grammar', itemIds: ['need'],
              prompt: 'a أم an؟', sentence: 'I need ___ adapter.', answers: ['an'], bank: ['a', 'an'],
              explain: 'adapter تبدأ بصوت متحرك (a)، فنقول an.',
            },
            {
              id: 'u1l2-p2', type: 'fill', skill: 'grammar', itemIds: ['looking-for'],
              prompt: 'أكمل', sentence: "I'm looking ___ a charger.", ar: 'أبحث عن شاحن.',
              answers: ['for'], bank: ['for', 'to', 'at'],
              explain: 'look for = يبحث عن. look at = ينظر إلى.',
            },
            {
              id: 'u1l2-p3', type: 'type', skill: 'writing', itemIds: ['what-looking-for'],
              prompt: 'اسأل العميل عن ماذا يبحث.', answers: ['What are you looking for?', 'What are you looking for today?'],
              starter: 'What are', hints: ['What are you …?', 'looking for'],
            },
          ],
        },
        {
          kind: 'quiz', title: 'محادثة كاملة',
          exercises: [
            {
              id: 'u1l2-d1', type: 'dialogue', skill: 'conversation', itemIds: ['what-looking-for', 'follow-me', 'one-moment'],
              prompt: 'أكمل المحادثة.',
              turns: [
                { speaker: 'customer', en: 'Hi. Excuse me.', ar: 'أهلًا. لو سمحت.' },
                { speaker: 'staff', options: ['Hello! What are you looking for?', 'Hello! What is your name?', 'Hello! Goodbye.'], answer: 0, ar: 'مرحبًا! عن ماذا تبحث؟' },
                { speaker: 'customer', en: 'I need wireless earbuds.', ar: 'أحتاج سماعات أذن لاسلكية.' },
                { speaker: 'staff', options: ['Sure. This way, please.', 'Sorry, I am fine.', 'Thank you for waiting.'], answer: 0, ar: 'أكيد. من هنا، تفضل.' },
              ],
            },
            {
              id: 'u1l2-q2', type: 'type', skill: 'writing', itemIds: ['one-moment'],
              prompt: 'اطلب من العميل أن ينتظر لحظة بأدب.', answers: ['One moment, please.', 'Just a moment, please.', 'One moment please.'],
              requiredWords: [['moment', 'minute', 'second'], ['please']],
              model: 'One moment, please.', hints: ['One …', 'لا تنسَ please'],
            },
          ],
        },
      ],
    },
    {
      id: 'u1l3', unitId: 'u1', title: 'الجوالات والتابلت والسماعات', titleEn: 'Phones, tablets & audio', minutes: 9,
      goal: 'تسمّي الأجهزة وتصفها بصفة واحدة قبل الاسم.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['smartphone', 'tablet', 'headphones', 'earbuds', 'wireless'] },
        {
          kind: 'grammar', id: 'g-adj', title: 'الصفة قبل الاسم', pattern: 'a / an + صفة + اسم',
          explanation: [
            'في العربية: «سماعات لاسلكية». في الإنجليزية الصفة أولًا: wireless earbuds.',
            'الصفة لا تتغير مع الجمع: new phones وليس news phones.',
          ],
          examples: [
            { en: 'a new tablet', ar: 'تابلت جديد' },
            { en: 'wireless headphones', ar: 'سماعات رأس لاسلكية' },
            { en: 'a light phone', ar: 'جوال خفيف' },
          ],
          note: 'خطأ شائع: earbuds wireless ❌ — الصحيح: wireless earbuds ✅',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: عميل يقارن بين نوعي سماعات.',
          lines: [
            { speaker: 'customer', en: 'Do you have wireless headphones?', ar: 'عندكم سماعات رأس لاسلكية؟' },
            { speaker: 'staff', en: 'Yes. Do you want headphones or small earbuds?', ar: 'نعم. تبغى سماعات رأس ولا سماعات أذن صغيرة؟' },
            { speaker: 'customer', en: 'Small earbuds, please. For the gym.', ar: 'صغيرة لو سمحت. للنادي.' },
          ],
          questions: [
            {
              id: 'u1l3-l1', type: 'choice', skill: 'listening', itemIds: ['earbuds'],
              prompt: 'ماذا اختار العميل في النهاية؟', options: ['سماعات رأس كبيرة', 'سماعات أذن صغيرة', 'سماعات سلكية'], answer: 1,
            },
            {
              id: 'u1l3-l2', type: 'choice', skill: 'listening', itemIds: [],
              prompt: 'لأي غرض يريدها؟', options: ['للعمل', 'للنادي الرياضي', 'للألعاب'], answer: 1,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'Do you want headphones or earbuds?', ar: 'تبغى سماعات رأس ولا سماعات أذن؟' },
            { en: 'These earbuds are wireless.', ar: 'هذه السماعات لاسلكية.' },
            { en: 'This tablet is good for students.', ar: 'هذا التابلت مناسب للطلاب.' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['smartphone', 'tablet', 'headphones', 'earbuds', 'wireless'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u1l3-q1', type: 'order', skill: 'grammar', itemIds: ['wireless', 'earbuds'],
              prompt: 'رتّب', ar: 'أبحث عن سماعات أذن لاسلكية.',
              words: ["I'm", 'looking', 'for', 'wireless', 'earbuds.'],
            },
            {
              id: 'u1l3-q2', type: 'choice', skill: 'grammar', itemIds: ['tablet'], optionsDir: 'ltr',
              prompt: 'أي عبارة صحيحة؟', options: ['a tablet new', 'a new tablet', 'new a tablet'], answer: 1,
            },
            {
              id: 'u1l3-q3', type: 'type', skill: 'writing', itemIds: ['headphones', 'earbuds'],
              prompt: 'اسأل العميل: «تبغى سماعات رأس ولا سماعات أذن؟»', answers: ['Do you want headphones or earbuds?'],
              requiredWords: [['headphones'], ['earbuds'], ['or']], model: 'Do you want headphones or earbuds?',
              starter: 'Do you want', hints: ['Do you want … or …?'],
            },
          ],
        },
      ],
    },
    {
      id: 'u1l4', unitId: 'u1', title: 'الإكسسوارات', titleEn: 'Accessories', minutes: 10,
      goal: 'تقترح إكسسوارًا مناسبًا، وتسأل إن كان الشراء هدية.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['charger', 'cable', 'case', 'screen-protector', 'power-bank', 'for-you-or-gift', 'gift'] },
        {
          kind: 'grammar', id: 'g-this-these', title: 'this / these والجمع بـ s', pattern: 'this + مفرد · these + جمع',
          explanation: [
            'this case (هذا الغطاء) · these cases (هذه الأغطية).',
            'معظم الأسماء تُجمع بإضافة s: charger → chargers.',
            'للسؤال عن إضافة شيء: Do you want … too? (تبغى … بعد؟)',
          ],
          examples: [
            { en: 'This charger is fast.', ar: 'هذا الشاحن سريع.' },
            { en: 'These cables are USB-C.', ar: 'هذه الكابلات USB-C.' },
            { en: 'Do you want a case too?', ar: 'تبغى غطاء بعد؟' },
          ],
          note: 'خطأ شائع: this cables ❌ — الصحيح: these cables ✅',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: اقتراح إكسسوارات مع جوال جديد.',
          lines: [
            { speaker: 'staff', en: 'Is it for you or a gift?', ar: 'لك ولا هدية؟' },
            { speaker: 'customer', en: "It's a gift for my brother.", ar: 'هدية لأخوي.' },
            { speaker: 'staff', en: 'Nice! Do you want a case and a screen protector too?', ar: 'حلو! تبغى غطاء وحماية شاشة بعد؟' },
            { speaker: 'customer', en: 'Just a case, please.', ar: 'غطاء فقط لو سمحت.' },
          ],
          questions: [
            {
              id: 'u1l4-l1', type: 'choice', skill: 'listening', itemIds: ['gift'],
              prompt: 'لمن الجوال؟', options: ['للعميل نفسه', 'هدية لأخيه', 'هدية لأبيه'], answer: 1,
            },
            {
              id: 'u1l4-l2', type: 'choice', skill: 'listening', itemIds: ['case', 'screen-protector'],
              prompt: 'ماذا أخذ العميل مع الجوال؟', options: ['غطاء وحماية شاشة', 'غطاء فقط', 'لا شيء'], answer: 1,
              explain: 'Just a case = غطاء فقط.',
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'Is it for you or a gift?', ar: 'لك ولا هدية؟' },
            { en: 'Do you want a case too?', ar: 'تبغى غطاء بعد؟' },
            { en: 'A power bank is useful for travel.', ar: 'الشاحن المتنقل مفيد للسفر.' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['charger', 'cable', 'case', 'screen-protector', 'power-bank', 'gift'] },
        {
          kind: 'practice', title: 'كوّن جملك',
          exercises: [
            {
              id: 'u1l4-p1', type: 'fill', skill: 'grammar', itemIds: ['cable'],
              prompt: 'this أم these؟', sentence: '___ cables are USB-C.', answers: ['These'], bank: ['This', 'These'],
              explain: 'cables جمع، فنستخدم These.',
            },
            {
              id: 'u1l4-p2', type: 'type', skill: 'writing', itemIds: ['screen-protector'],
              prompt: 'اسأل: «تبغى حماية شاشة بعد؟»', answers: ['Do you want a screen protector too?'],
              requiredWords: [['screen protector'], ['too', 'also']], starter: 'Do you want',
              model: 'Do you want a screen protector too?', hints: ['Do you want a …', '… too?'],
            },
          ],
        },
        {
          kind: 'quiz', title: 'محادثة كاملة',
          exercises: [
            {
              id: 'u1l4-d1', type: 'dialogue', skill: 'conversation', itemIds: ['for-you-or-gift', 'case', 'charger'],
              prompt: 'أكمل المحادثة.',
              turns: [
                { speaker: 'customer', en: "I'd like this phone, please.", ar: 'أبغى هذا الجوال لو سمحت.' },
                { speaker: 'staff', options: ['Great choice! Is it for you or a gift?', 'Where is the gift?', 'This phones are new.'], answer: 0, ar: 'اختيار ممتاز! لك ولا هدية؟' },
                { speaker: 'customer', en: "It's for me.", ar: 'لي.' },
                { speaker: 'staff', options: ['Do you want a case too?', 'Do you want a case to?', 'You want case?'], answer: 0, ar: 'تبغى غطاء بعد؟', explain: 'too (بعد/أيضًا) بحرفي o، وليست to.' },
                { speaker: 'customer', en: 'Yes. And a fast charger.', ar: 'نعم. وشاحن سريع.' },
                { speaker: 'staff', options: ['Sure. The chargers are this way.', 'Sure. The charger are this way.', 'Sorry. Goodbye.'], answer: 0, ar: 'أكيد. الشواحن من هنا.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'u1l5', unitId: 'u1', title: 'السؤال عن الميزانية', titleEn: 'Asking about budget', minutes: 9,
      goal: 'تسأل عن الميزانية بلباقة وتفهم الرقم أو النطاق.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['budget', 'whats-your-budget', 'around', 'between', 'affordable', 'expensive'] },
        {
          kind: 'grammar', id: 'g-possessive', title: 'my / your', pattern: 'my = ـي · your = ـك',
          explanation: [
            'my budget = ميزانيتي · your budget = ميزانيتك.',
            'للسؤال: What is your …? = ما …ك؟',
          ],
          examples: [
            { en: 'What is your budget?', ar: 'كم ميزانيتك؟' },
            { en: 'My budget is around 2,000 riyals.', ar: 'ميزانيتي حوالي 2000 ريال.' },
          ],
          note: 'خطأ شائع: How much your budget? ❌ — الصحيح: What is your budget? ✅',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية بأرقام مثال.',
          lines: [
            { speaker: 'staff', en: 'Okay. What is your budget?', ar: 'تمام. كم ميزانيتك؟' },
            { speaker: 'customer', en: 'Between one thousand and one thousand five hundred.', ar: 'بين ألف وألف وخمسمئة.' },
            { speaker: 'customer', en: 'The new models are very expensive.', ar: 'الموديلات الجديدة غالية جدًا.' },
            { speaker: 'staff', en: 'I understand. We have some affordable options.', ar: 'أفهمك. عندنا خيارات سعرها مناسب.' },
          ],
          questions: [
            {
              id: 'u1l5-l1', type: 'choice', skill: 'listening', itemIds: ['between'],
              prompt: 'ما ميزانية العميل؟', options: ['1,000 – 1,500', '100 – 150', '1,500 – 2,000'], answer: 0, optionsDir: 'ltr',
            },
            {
              id: 'u1l5-l2', type: 'choice', skill: 'listening', itemIds: ['affordable'],
              prompt: 'ماذا عرض الموظف؟', options: ['موديلات أغلى', 'خيارات سعرها مناسب', 'أن يعود لاحقًا'], answer: 1,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'What is your budget?', ar: 'كم ميزانيتك؟' },
            { en: 'We have some affordable options.', ar: 'عندنا خيارات سعرها مناسب.' },
            { en: 'Around one thousand riyals.', ar: 'حوالي ألف ريال.' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['budget', 'around', 'between', 'affordable', 'expensive'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u1l5-q1', type: 'choice', skill: 'conversation', itemIds: ['whats-your-budget'], optionsDir: 'ltr',
              prompt: 'أي سؤال عن الميزانية صحيح ولبق؟', options: ['How much money you have?', 'What is your budget?', 'You have budget?'], answer: 1,
            },
            {
              id: 'u1l5-q2', type: 'choice', skill: 'vocab', itemIds: ['affordable'],
              prompt: 'أي كلمة ألطف لوصف جهاز رخيص؟', optionsDir: 'ltr', options: ['cheap', 'affordable', 'expensive'], answer: 1,
              explain: 'affordable = سعره مناسب. أما cheap فقد توحي بأنه رديء.',
            },
            {
              id: 'u1l5-q3', type: 'type', skill: 'writing', itemIds: ['whats-your-budget'],
              prompt: 'العميل يريد جوالًا. اسأله عن ميزانيته.', answers: ['What is your budget?', "What's your budget?"],
              requiredWords: [['budget']], model: 'What is your budget?', hints: ['What is …?', 'your budget'],
            },
          ],
        },
      ],
    },
    {
      id: 'u1l6', unitId: 'u1', title: 'السؤال عن الاستخدام', titleEn: 'Asking about usage', minutes: 10,
      goal: 'تسأل لأي شيء سيستخدم الجهاز، وتفهم الأولويات: كاميرا، ألعاب، بطارية، مساحة.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['use', 'use-it-for', 'camera', 'gaming', 'battery', 'storage', 'for-work-school'] },
        {
          kind: 'grammar', id: 'g-present-s', title: 'المضارع البسيط و s مع he / she', pattern: 'I / you / we / they use · he / she / it uses',
          explanation: [
            'المضارع البسيط للعادات: I use my phone for work.',
            'مع he / she / it نضيف s للفعل: My son uses it for school.',
            'للسؤال: Do you use…? / Does he use…?',
          ],
          examples: [
            { en: 'I use it for photos.', ar: 'أستخدمه للتصوير.' },
            { en: 'She uses it for work.', ar: 'تستخدمه للعمل.' },
            { en: 'Does he play games?', ar: 'هل يلعب ألعابًا؟' },
          ],
          note: 'خطأ شائع: He use it ❌ — الصحيح: He uses it ✅',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: فهم استخدام العميل قبل الاقتراح.',
          lines: [
            { speaker: 'staff', en: 'What will you use it for?', ar: 'لأي شيء ستستخدمه؟' },
            { speaker: 'customer', en: 'My son uses it. He plays games a lot.', ar: 'ولدي يستخدمه. يلعب ألعاب كثير.' },
            { speaker: 'staff', en: 'Okay. So battery and storage are important.', ar: 'تمام. إذن البطارية والمساحة مهمتان.' },
            { speaker: 'customer', en: 'Yes. The camera is not important.', ar: 'نعم. الكاميرا ليست مهمة.' },
          ],
          questions: [
            {
              id: 'u1l6-l1', type: 'choice', skill: 'listening', itemIds: ['gaming'],
              prompt: 'لماذا يحتاج الابن الجهاز؟', options: ['للتصوير', 'للألعاب', 'للدراسة'], answer: 1,
            },
            {
              id: 'u1l6-l2', type: 'choice', skill: 'listening', itemIds: ['camera'],
              prompt: 'ما الشيء غير المهم للعميل؟', options: ['البطارية', 'المساحة', 'الكاميرا'], answer: 2,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'What will you use it for?', ar: 'لأي شيء ستستخدمه؟' },
            { en: 'Is the camera important for you?', ar: 'الكاميرا مهمة لك؟' },
            { en: 'How much storage do you need?', ar: 'كم مساحة تحتاج؟' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['use', 'camera', 'gaming', 'battery', 'storage', 'for-work-school'] },
        {
          kind: 'practice', title: 'كوّن جملك',
          exercises: [
            {
              id: 'u1l6-p1', type: 'fill', skill: 'grammar', itemIds: ['use'],
              prompt: 'اختر الصحيح', sentence: 'My daughter ___ her tablet for school.', ar: 'بنتي تستخدم التابلت للدراسة.',
              answers: ['uses'], bank: ['use', 'uses', 'using'],
              explain: 'My daughter = she، فنضيف s: uses.',
            },
            {
              id: 'u1l6-p2', type: 'order', skill: 'grammar', itemIds: ['use-it-for'],
              prompt: 'رتّب السؤال', ar: 'لأي شيء ستستخدمه؟',
              words: ['What', 'will', 'you', 'use', 'it', 'for?'],
            },
            {
              id: 'u1l6-p3', type: 'type', skill: 'writing', itemIds: ['camera'],
              prompt: 'اسأل العميل: «الكاميرا مهمة لك؟»', answers: ['Is the camera important for you?', 'Is the camera important to you?'],
              requiredWords: [['camera'], ['important']], starter: 'Is the', model: 'Is the camera important for you?',
              hints: ['Is the camera …?', 'important = مهم'],
            },
          ],
        },
        {
          kind: 'quiz', title: 'محادثة كاملة',
          exercises: [
            {
              id: 'u1l6-d1', type: 'dialogue', skill: 'conversation', itemIds: ['use-it-for', 'storage', 'battery'],
              prompt: 'أكمل المحادثة.',
              turns: [
                { speaker: 'customer', en: 'I need a new phone.', ar: 'أحتاج جوال جديد.' },
                { speaker: 'staff', options: ['Sure. What will you use it for?', 'Sure. What will you use it?', 'Where is your phone?'], answer: 0, ar: 'أكيد. لأي شيء ستستخدمه؟', explain: 'لا تنسَ for في آخر السؤال.' },
                { speaker: 'customer', en: 'Photos and videos. I travel a lot.', ar: 'صور وفيديو. أسافر كثير.' },
                { speaker: 'staff', options: ['So the camera is important for you.', 'So you play games.', 'So you need a cable.'], answer: 0, ar: 'إذن الكاميرا مهمة لك.' },
                { speaker: 'customer', en: 'Yes, and the battery.', ar: 'نعم، والبطارية.' },
                { speaker: 'staff', options: ['How much storage do you need?', 'How many storage you need?', 'What is storage?'], answer: 0, ar: 'كم مساحة تحتاج؟' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'u1l7', unitId: 'u1', title: 'عندما لا تفهم', titleEn: 'When you don\'t understand', minutes: 10,
      goal: 'تطلب الإعادة أو البطء، وتتأكد مما فهمت، وتقول «خلني أتأكد» بدل التخمين.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'عبارات الدرس', itemIds: ['repeat-please', 'slowly', 'didnt-understand', 'do-you-mean', 'let-me-check', 'ask-colleague'] },
        {
          kind: 'grammar', id: 'g-didnt-will', title: "didn't و I'll", pattern: "I didn't + فعل · I'll + فعل",
          explanation: [
            "didn't للنفي في الماضي، وبعدها الفعل كما هو: I didn't understand.",
            "I'll = I will، تقولها لما تقرر تفعل شيئًا الآن: I'll check.",
          ],
          examples: [
            { en: "Sorry, I didn't hear you.", ar: 'آسف، ما سمعتك.' },
            { en: "I'll ask my colleague.", ar: 'سأسأل زميلي.' },
            { en: "I'll be right back.", ar: 'سأعود حالًا.' },
          ],
          note: "خطأ شائع: I didn't understood ❌ — الصحيح: I didn't understand ✅",
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: عميل يتكلم بسرعة.',
          lines: [
            { speaker: 'customer', en: 'Do you have the pro model with more storage in dark blue?', ar: 'عندكم موديل البرو بمساحة أكبر باللون الأزرق الغامق؟' },
            { speaker: 'staff', en: "Sorry, could you repeat that, please? Slowly, please.", ar: 'عفوًا، ممكن تعيد لو سمحت؟ ببطء لو سمحت.' },
            { speaker: 'customer', en: 'The pro model. Dark blue. More storage.', ar: 'موديل البرو. أزرق غامق. مساحة أكبر.' },
            { speaker: 'staff', en: "Do you mean 512 gigabytes? Let me check. I'll be right back.", ar: 'تقصد 512 جيجا؟ خلني أتأكد. سأعود حالًا.' },
          ],
          questions: [
            {
              id: 'u1l7-l1', type: 'choice', skill: 'listening', itemIds: ['repeat-please'],
              prompt: 'ماذا طلب الموظف من العميل أولًا؟', options: ['أن يدفع', 'أن يعيد الكلام ببطء', 'أن ينتظر في الخارج'], answer: 1,
            },
            {
              id: 'u1l7-l2', type: 'choice', skill: 'listening', itemIds: [],
              prompt: 'ما اللون الذي يريده العميل؟', options: ['أسود', 'أزرق غامق', 'أبيض'], answer: 1,
            },
            {
              id: 'u1l7-l3', type: 'choice', skill: 'listening', itemIds: ['let-me-check'],
              prompt: 'هل أكّد الموظف التوفر مباشرة؟', options: ['نعم، قال إنه متوفر', 'لا، قال إنه سيتحقق', 'قال إنه غير متوفر'], answer: 1,
              explain: 'Let me check = سأتحقق. التصرف الصحيح عند عدم التأكد.',
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'Could you repeat that, please?', ar: 'ممكن تعيد، لو سمحت؟' },
            { en: 'Can you speak slowly, please?', ar: 'ممكن تتكلم ببطء؟' },
            { en: "Let me check. I'll be right back.", ar: 'خلني أتأكد. سأعود حالًا.' },
          ],
        },
        { kind: 'drill', title: 'تدريب العبارات', itemIds: ['repeat-please', 'slowly', 'didnt-understand', 'do-you-mean', 'let-me-check', 'ask-colleague'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u1l7-q1', type: 'choice', skill: 'conversation', itemIds: ['let-me-check'], optionsDir: 'ltr',
              prompt: 'العميل سألك عن شرط ضمان ولا تعرف الجواب. أفضل رد:',
              options: ['Yes, two years. (تخمين)', "I'm not sure. Let me check, please.", "I don't know. Goodbye."], answer: 1,
              explain: 'لا تخمّن أبدًا معلومات الضمان أو السعر أو التوفر. قل Let me check أو اسأل زميلك.',
            },
            {
              id: 'u1l7-q2', type: 'fill', skill: 'grammar', itemIds: ['didnt-understand'],
              prompt: 'أكمل', sentence: "Sorry, I didn't ___.", ar: 'آسف، ما فهمت.',
              answers: ['understand'], bank: ['understand', 'understood', 'understands'],
              explain: "بعد didn't يأتي الفعل كما هو: understand.",
            },
            {
              id: 'u1l7-q3', type: 'type', skill: 'writing', itemIds: ['repeat-please'],
              prompt: 'لم تسمع العميل جيدًا. اطلب منه أن يعيد بأدب.', answers: ['Could you repeat that, please?', 'Can you repeat that, please?', 'Sorry, could you repeat that, please?'],
              requiredWords: [['repeat', 'say that again'], ['please']], model: 'Sorry, could you repeat that, please?',
              hints: ['Could you …?', 'repeat = يعيد'],
            },
          ],
        },
      ],
    },
  ],
  test: [
    {
      id: 'u1t-1', type: 'choice', skill: 'listening', audio: "I'm just looking, thanks.", hideAudioText: true, itemIds: ['just-looking'],
      prompt: 'استمع: ماذا يقصد العميل؟', options: ['يريد المساعدة الآن', 'يتفرج فقط', 'يبحث عن المدير'], answer: 1,
    },
    {
      id: 'u1t-2', type: 'fill', skill: 'grammar', itemIds: ['looking-for'],
      prompt: 'أكمل', sentence: "I'm looking ___ a power bank.", answers: ['for'], bank: ['for', 'at', 'to'],
    },
    {
      id: 'u1t-3', type: 'choice', skill: 'listening', audio: 'My budget is around eight hundred riyals.', hideAudioText: true, itemIds: ['around', 'budget'],
      prompt: 'استمع: كم ميزانية العميل تقريبًا؟', options: ['180', '800', '8,000'], answer: 1, optionsDir: 'ltr',
    },
    {
      id: 'u1t-4', type: 'order', skill: 'grammar', itemIds: ['use-it-for'],
      prompt: 'رتّب', ar: 'لأي شيء ستستخدمه؟', words: ['What', 'will', 'you', 'use', 'it', 'for?'],
    },
    {
      id: 'u1t-5', type: 'type', skill: 'writing', itemIds: ['whats-your-budget'],
      prompt: 'اسأل العميل عن ميزانيته.', answers: ['What is your budget?', "What's your budget?"], requiredWords: [['budget']],
      model: 'What is your budget?',
    },
    {
      id: 'u1t-6', type: 'choice', skill: 'reading', itemIds: ['wireless', 'battery'],
      prompt: 'اقرأ: “These wireless earbuds have a long battery life.” ما الميزة المذكورة؟',
      options: ['بطارية تدوم طويلًا', 'سعر مناسب', 'كاميرا ممتازة'], answer: 0,
    },
    {
      id: 'u1t-7', type: 'choice', skill: 'conversation', itemIds: ['let-me-check'], optionsDir: 'ltr',
      prompt: 'Is the gold color available? (لا تعرف) — ردك:', options: ['Yes, of course.', 'Let me check, please.', 'No.'], answer: 1,
    },
    {
      id: 'u1t-8', type: 'dialogue', skill: 'conversation', itemIds: ['how-can-i-help', 'use-it-for', 'whats-your-budget'],
      prompt: 'محادثة كاملة: عميل يريد تابلت.',
      turns: [
        { speaker: 'customer', en: 'Hello.', ar: 'مرحبًا.' },
        { speaker: 'staff', options: ['Hello! How can I help you?', 'Hello! How much you want?'], answer: 0, ar: 'مرحبًا! كيف أقدر أساعدك؟' },
        { speaker: 'customer', en: "I'm looking for a tablet.", ar: 'أبحث عن تابلت.' },
        { speaker: 'staff', options: ['Sure. What will you use it for?', 'Sure. Tablet is where?'], answer: 0, ar: 'أكيد. لأي شيء ستستخدمه؟' },
        { speaker: 'customer', en: 'For school. For my daughter.', ar: 'للدراسة. لبنتي.' },
        { speaker: 'staff', options: ['Okay. What is your budget?', 'Okay. Your budget how much?'], answer: 0, ar: 'تمام. كم ميزانيتك؟' },
      ],
    },
  ],
};
