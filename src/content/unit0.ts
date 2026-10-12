import type { Unit } from './types';

// الوحدة 0: أساسيات للبداية من الصفر. كل المحادثات افتراضية لأغراض تعليمية.

export const unit0: Unit = {
  id: 'u0',
  order: 0,
  title: 'الأساسيات',
  titleEn: 'Foundations',
  description: 'تحية ومجاملة، الضمائر و am/is/are، أدوات السؤال، والأرقام والأسعار.',
  cefr: 'Pre-A1',
  lessons: [
    {
      id: 'u0l1', unitId: 'u0', title: 'التحية', titleEn: 'Greetings', minutes: 8,
      goal: 'تحيّي العميل بحسب الوقت، وترد على «كيف حالك؟».',
      steps: [
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['hello', 'hi', 'good-morning', 'good-evening', 'welcome', 'how-are-you', 'im-fine'] },
        {
          kind: 'grammar', id: 'g-greet-time', title: 'التحية حسب الوقت', pattern: 'Good + morning / afternoon / evening',
          explanation: [
            'Good morning من الصباح حتى الظهر.',
            'Good afternoon من الظهر حتى العصر تقريبًا.',
            'Good evening من المغرب وفي الليل.',
            'Hello تصلح في أي وقت.',
          ],
          examples: [
            { en: 'Good morning! Welcome.', ar: 'صباح الخير! أهلًا بك.' },
            { en: 'Good evening, sir.', ar: 'مساء الخير يا أستاذ.' },
          ],
          note: 'Good night ليست تحية لقاء؛ تُقال عند الوداع ليلًا.',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: عميل يدخل المتجر مساءً.',
          lines: [
            { speaker: 'staff', en: 'Good evening! Welcome.', ar: 'مساء الخير! أهلًا وسهلًا.' },
            { speaker: 'customer', en: 'Hi! How are you?', ar: 'أهلًا! كيف حالك؟' },
            { speaker: 'staff', en: "I'm fine, thanks. And you?", ar: 'بخير، شكرًا. وأنت؟' },
            { speaker: 'customer', en: "I'm fine, thank you.", ar: 'بخير، شكرًا لك.' },
          ],
          questions: [
            {
              id: 'u0l1-l1', type: 'choice', skill: 'listening', itemIds: ['good-evening'],
              prompt: 'في أي وقت كانت المحادثة؟', options: ['الصباح', 'المساء', 'الظهر'], answer: 1,
              explain: 'قال الموظف Good evening، وهي تحية المساء.',
            },
            {
              id: 'u0l1-l2', type: 'choice', skill: 'listening', itemIds: ['im-fine'],
              prompt: 'كيف رد الموظف على How are you؟', options: ["I'm fine, thanks. And you?", 'Good morning.', 'Welcome.'], answer: 0, optionsDir: 'ltr',
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'Good morning! Welcome.', ar: 'صباح الخير! أهلًا بك.' },
            { en: 'Good evening! How are you?', ar: 'مساء الخير! كيف حالك؟' },
            { en: "I'm fine, thanks. And you?", ar: 'بخير، شكرًا. وأنت؟' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['hello', 'good-morning', 'good-evening', 'welcome', 'im-fine'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u0l1-q1', type: 'choice', skill: 'conversation', itemIds: ['good-morning'],
              prompt: 'الساعة 9 صباحًا ودخل عميل. ماذا تقول؟', optionsDir: 'ltr',
              options: ['Good night!', 'Good morning! Welcome.', 'Good evening!'], answer: 1,
              explain: 'في الصباح نقول Good morning. وGood night للوداع ليلًا فقط.',
            },
            {
              id: 'u0l1-q2', type: 'order', skill: 'grammar', itemIds: ['im-fine'],
              prompt: 'رتّب الكلمات: «بخير، شكرًا.»', ar: 'بخير، شكرًا.',
              words: ["I'm", 'fine,', 'thanks.'],
            },
            {
              id: 'u0l1-q3', type: 'fill', skill: 'vocab', itemIds: ['welcome'],
              prompt: 'أكمل الترحيب', sentence: 'Hello! ___ to the store.', ar: 'مرحبًا! أهلًا بك في المتجر.',
              answers: ['Welcome'], bank: ['Welcome', 'Thanks', 'Sorry'],
              hints: ['الكلمة تعني «أهلًا بك».', 'تبدأ بحرف W.'],
            },
          ],
        },
      ],
    },
    {
      id: 'u0l2', unitId: 'u0', title: 'كلمات المجاملة', titleEn: 'Polite words', minutes: 9,
      goal: 'تشكر وتعتذر وتطلب بأدب، وتودّع العميل.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['thank-you', 'youre-welcome', 'please', 'sorry', 'excuse-me', 'goodbye'] },
        {
          kind: 'grammar', id: 'g-thank-for', title: 'الشكر على شيء', pattern: 'Thank you for + الاسم أو الفعل بـ ing',
          explanation: [
            'إذا أردت أن تقول «شكرًا على…» استخدم for.',
            'بعد for يأتي اسم (your help) أو فعل ينتهي بـ ing (waiting).',
          ],
          examples: [
            { en: 'Thank you for waiting.', ar: 'شكرًا لانتظارك.' },
            { en: 'Thank you for your help.', ar: 'شكرًا على مساعدتك.' },
            { en: 'Thank you for visiting.', ar: 'شكرًا لزيارتك.' },
          ],
          note: 'خطأ شائع: Thank you for wait. الصحيح: Thank you for waiting.',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: الموظف يطلب من العميل الانتظار ثم يودّعه.',
          lines: [
            { speaker: 'staff', en: 'One moment, please.', ar: 'لحظة من فضلك.' },
            { speaker: 'staff', en: 'Sorry! Thank you for waiting.', ar: 'آسف! شكرًا لانتظارك.' },
            { speaker: 'customer', en: 'No problem. Thank you!', ar: 'ولا يهمك. شكرًا!' },
            { speaker: 'staff', en: "You're welcome. Have a nice day!", ar: 'العفو. يومك سعيد!' },
          ],
          questions: [
            {
              id: 'u0l2-l1', type: 'choice', skill: 'listening', itemIds: ['thank-you'],
              prompt: 'لماذا شكر الموظفُ العميلَ؟', options: ['لأنه اشترى', 'لأنه انتظر', 'لأنه سأل'], answer: 1,
              explain: 'Thank you for waiting = شكرًا لانتظارك.',
            },
            {
              id: 'u0l2-l2', type: 'choice', skill: 'listening', itemIds: ['goodbye'],
              prompt: 'ما العبارة التي ودّع بها الموظف العميل؟', optionsDir: 'ltr',
              options: ['Have a nice day!', 'Good morning!', 'Excuse me.'], answer: 0,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'Thank you for waiting.', ar: 'شكرًا لانتظارك.' },
            { en: "You're welcome.", ar: 'العفو.' },
            { en: 'Excuse me, can I help you?', ar: 'لو سمحت، أقدر أساعدك؟' },
            { en: 'Have a nice day!', ar: 'يومك سعيد!' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['thank-you', 'youre-welcome', 'please', 'sorry', 'excuse-me', 'goodbye'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u0l2-q1', type: 'choice', skill: 'conversation', itemIds: ['youre-welcome'],
              prompt: 'قال لك العميل: Thank you! بماذا ترد؟', optionsDir: 'ltr',
              options: ['Welcome to the store.', "You're welcome.", 'Excuse me.'], answer: 1,
              explain: "الرد على الشكر هو You're welcome. أما Welcome وحدها فللترحيب عند الدخول.",
            },
            {
              id: 'u0l2-q2', type: 'fill', skill: 'grammar', itemIds: ['thank-you'],
              prompt: 'أكمل الجملة', sentence: 'Thank you for ___.', ar: 'شكرًا لانتظارك.',
              answers: ['waiting'], bank: ['wait', 'waiting', 'waits'],
              explain: 'بعد for يأتي الفعل بـ ing: waiting.',
              hints: ['بعد for نضيف ing للفعل.'],
            },
            {
              id: 'u0l2-q3', type: 'choice', skill: 'vocab', itemIds: ['excuse-me', 'sorry'],
              prompt: 'تريد أن تلفت انتباه عميل بأدب قبل أن تكلمه. ماذا تقول؟', optionsDir: 'ltr',
              options: ['Excuse me.', 'Sorry.', 'Goodbye.'], answer: 0,
              explain: 'Excuse me قبل أن تقاطع أو تلفت الانتباه، وSorry بعد الخطأ.',
            },
          ],
        },
      ],
    },
    {
      id: 'u0l3', unitId: 'u0', title: 'الضمائر و am / is / are', titleEn: 'Pronouns & to be', minutes: 10,
      goal: 'تبني جملة بسيطة: I am… / It is… / They are…',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['i', 'you', 'he-she', 'it', 'we-they', 'am-is-are'] },
        {
          kind: 'grammar', id: 'g-be', title: 'فعل الكينونة', pattern: 'I am · he / she / it is · you / we / they are',
          explanation: [
            'في العربية نقول «الجوال جديد» بدون فعل. في الإنجليزية لازم نضع am أو is أو are.',
            'نختصر عادة: I am = I\'m · it is = it\'s · they are = they\'re.',
            'الأشياء (جوال، سماعة، شاحن) نستخدم معها it، وجمعها they.',
          ],
          examples: [
            { en: "I'm Saad. I'm a sales associate.", ar: 'أنا سعد. أنا موظف مبيعات.' },
            { en: "It's new. It's light.", ar: 'إنه جديد. إنه خفيف.' },
            { en: 'They are on the shelf.', ar: 'هي على الرف.' },
          ],
          note: 'الخطأ الأشهر للعرب: The phone new ❌ — الصحيح: The phone is new ✅',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: الموظف يعرّف نفسه.',
          lines: [
            { speaker: 'staff', en: "Hello! I'm Saad. I'm here to help.", ar: 'مرحبًا! أنا سعد. أنا هنا للمساعدة.' },
            { speaker: 'customer', en: 'Hi, Saad. Is this phone new?', ar: 'أهلًا يا سعد. هل هذا الجوال جديد؟' },
            { speaker: 'staff', en: "Yes, it is. It's very light.", ar: 'نعم. وهو خفيف جدًا.' },
          ],
          questions: [
            {
              id: 'u0l3-l1', type: 'choice', skill: 'listening', itemIds: ['it'],
              prompt: 'ماذا قال الموظف عن الجوال؟', options: ['إنه ثقيل', 'إنه خفيف جدًا', 'إنه قديم'], answer: 1,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: "I'm here to help.", ar: 'أنا هنا للمساعدة.' },
            { en: "It's very light.", ar: 'إنه خفيف جدًا.' },
            { en: 'They are on the shelf.', ar: 'هي على الرف.' },
          ],
        },
        {
          kind: 'practice', title: 'كوّن الجملة',
          exercises: [
            {
              id: 'u0l3-p1', type: 'fill', skill: 'grammar', itemIds: ['am-is-are'],
              prompt: 'اختر الفعل الصحيح', sentence: 'The phone ___ new.', ar: 'الجوال جديد.',
              answers: ['is'], bank: ['am', 'is', 'are'],
              explain: 'The phone مفرد (it)، ومعه is.',
              hints: ['الجوال = it.', 'it يأتي معه is.'],
            },
            {
              id: 'u0l3-p2', type: 'fill', skill: 'grammar', itemIds: ['am-is-are', 'we-they'],
              prompt: 'اختر الفعل الصحيح', sentence: 'The cables ___ here.', ar: 'الكابلات هنا.',
              answers: ['are'], bank: ['am', 'is', 'are'],
              explain: 'The cables جمع (they)، ومعه are.',
              hints: ['الكلمة تنتهي بـ s، فهي جمع.'],
            },
            {
              id: 'u0l3-p3', type: 'order', skill: 'grammar', itemIds: ['it', 'am-is-are'],
              prompt: 'رتّب الكلمات', ar: 'هذا الغطاء أسود.',
              words: ['This', 'case', 'is', 'black.'],
            },
            {
              id: 'u0l3-p4', type: 'choice', skill: 'grammar', itemIds: ['it'],
              prompt: 'أي جملة صحيحة عن السماعة؟', optionsDir: 'ltr',
              options: ['He is wireless.', 'It is wireless.', 'It wireless.'], answer: 1,
              explain: 'السماعة شيء، فنستخدم it، ولا نحذف is.',
            },
          ],
        },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u0l3-q1', type: 'type', skill: 'writing', itemIds: ['i', 'am-is-are'],
              prompt: 'اكتب بالإنجليزية: «أنا هنا للمساعدة.»', answers: ["I'm here to help.", 'I am here to help.'],
              starter: "I'm", hints: ['ابدأ بـ I\'m', 'here = هنا، to help = للمساعدة'],
            },
            {
              id: 'u0l3-q2', type: 'fill', skill: 'grammar', itemIds: ['you', 'am-is-are'],
              prompt: 'اختر الفعل الصحيح', sentence: '___ you looking for a phone?', ar: 'هل تبحث عن جوال؟',
              answers: ['Are'], bank: ['Am', 'Is', 'Are'],
              explain: 'you دائمًا معها are، وفي السؤال تتقدم: Are you…?',
            },
          ],
        },
      ],
    },
    {
      id: 'u0l4', unitId: 'u0', title: 'الناس والأماكن في العمل', titleEn: 'People at work', minutes: 9,
      goal: 'تعرّف بزملائك ومديرك، وتستخدم النفي isn\'t / aren\'t.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['customer', 'colleague', 'manager', 'store', 'phone'] },
        {
          kind: 'grammar', id: 'g-be-neg', title: 'النفي مع is / are', pattern: "is not = isn't · are not = aren't · I am not = I'm not",
          explanation: [
            'للنفي نضع not بعد am / is / are.',
            "في الكلام نختصر: isn't و aren't.",
          ],
          examples: [
            { en: "The manager isn't here now.", ar: 'المدير ليس هنا الآن.' },
            { en: "These cases aren't expensive.", ar: 'هذه الأغطية ليست غالية.' },
            { en: "I'm not sure. Let me check.", ar: 'لست متأكدًا. خلني أتأكد.' },
          ],
          note: "لا يوجد amn't. قل I'm not.",
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: عميل يسأل عن المدير.',
          lines: [
            { speaker: 'customer', en: 'Excuse me, is the manager here?', ar: 'لو سمحت، هل المدير موجود؟' },
            { speaker: 'staff', en: "Sorry, he isn't here now. My colleague can help you.", ar: 'آسف، هو ليس هنا الآن. زميلي يقدر يساعدك.' },
            { speaker: 'customer', en: 'Okay, thank you.', ar: 'تمام، شكرًا.' },
          ],
          questions: [
            {
              id: 'u0l4-l1', type: 'choice', skill: 'listening', itemIds: ['manager'],
              prompt: 'هل المدير موجود؟', options: ['نعم، موجود', 'لا، ليس موجودًا الآن', 'في الاستراحة'], answer: 1,
              explain: "he isn't here now = هو ليس هنا الآن.",
            },
            {
              id: 'u0l4-l2', type: 'choice', skill: 'listening', itemIds: ['colleague'],
              prompt: 'من سيساعد العميل؟', options: ['المدير', 'الزميل', 'لا أحد'], answer: 1,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: "He isn't here now.", ar: 'هو ليس هنا الآن.' },
            { en: 'My colleague can help you.', ar: 'زميلي يقدر يساعدك.' },
            { en: "I'm not sure.", ar: 'لست متأكدًا.' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['customer', 'colleague', 'manager', 'store', 'phone'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u0l4-q1', type: 'fill', skill: 'grammar', itemIds: ['am-is-are'],
              prompt: 'انفِ الجملة', sentence: "The manager ___ here now.", ar: 'المدير ليس هنا الآن.',
              answers: ["isn't", 'is not'], bank: ["isn't", "aren't", "not"],
              explain: "The manager مفرد، فالنفي isn't.",
            },
            {
              id: 'u0l4-q2', type: 'order', skill: 'grammar', itemIds: ['colleague'],
              prompt: 'رتّب الكلمات', ar: 'زميلي يقدر يساعدك.',
              words: ['My', 'colleague', 'can', 'help', 'you.'],
            },
          ],
        },
      ],
    },
    {
      id: 'u0l5', unitId: 'u0', title: 'أدوات السؤال', titleEn: 'Question words', minutes: 9,
      goal: 'تفهم أسئلة العملاء وتسأل: Where is…? What…? Which…?',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['what', 'which', 'where', 'who', 'when', 'how-much'] },
        {
          kind: 'grammar', id: 'g-wh-be', title: 'السؤال مع is / are', pattern: 'أداة السؤال + is / are + الاسم؟',
          explanation: [
            'في السؤال نقدّم is أو are قبل الاسم.',
            'Where is + مفرد · Where are + جمع.',
          ],
          examples: [
            { en: 'Where is the charger?', ar: 'أين الشاحن؟' },
            { en: 'Where are the headphones?', ar: 'أين السماعات؟' },
            { en: 'What is your name?', ar: 'ما اسمك؟' },
          ],
          note: 'خطأ شائع: Where the charger is? ❌ — الصحيح: Where is the charger? ✅',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: عميل يسأل عن مكان منتج.',
          lines: [
            { speaker: 'customer', en: 'Excuse me, where are the chargers?', ar: 'لو سمحت، أين الشواحن؟' },
            { speaker: 'staff', en: 'They are over there. Which phone do you have?', ar: 'هي هناك. أي جوال عندك؟' },
            { speaker: 'customer', en: 'An Android phone.', ar: 'جوال أندرويد.' },
          ],
          questions: [
            {
              id: 'u0l5-l1', type: 'choice', skill: 'listening', itemIds: ['where'],
              prompt: 'عن ماذا سأل العميل؟', options: ['السعر', 'مكان الشواحن', 'وقت الإغلاق'], answer: 1,
            },
            {
              id: 'u0l5-l2', type: 'choice', skill: 'listening', itemIds: ['which'],
              prompt: 'لماذا سأل الموظف: Which phone do you have؟', options: ['ليعرف نوع الشاحن المناسب', 'ليعرف اسم العميل', 'ليعرف الميزانية'], answer: 0,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'Where are the chargers?', ar: 'أين الشواحن؟' },
            { en: 'Which phone do you have?', ar: 'أي جوال عندك؟' },
            { en: 'How much is it?', ar: 'بكم هو؟' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['what', 'which', 'where', 'who', 'when', 'how-much'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u0l5-q1', type: 'order', skill: 'grammar', itemIds: ['where'],
              prompt: 'رتّب السؤال', ar: 'أين السماعات؟',
              words: ['Where', 'are', 'the', 'headphones?'],
            },
            {
              id: 'u0l5-q2', type: 'choice', skill: 'vocab', itemIds: ['who', 'when'],
              prompt: 'تريد أن تسأل: «متى استراحتي؟»', optionsDir: 'ltr',
              options: ['Who is my break?', 'When is my break?', 'Where is my break?'], answer: 1,
              explain: 'when = متى، who = من، where = أين.',
            },
          ],
        },
      ],
    },
    {
      id: 'u0l6', unitId: 'u0', title: 'الأرقام والأسعار', titleEn: 'Numbers & prices', minutes: 10,
      goal: 'تفهم السعر عندما يُقال، وتقوله بوضوح.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['price', 'riyal', 'hundred', 'thousand', 'available'] },
        {
          kind: 'grammar', id: 'g-prices', title: 'قول السعر', pattern: "It's + الرقم + riyals",
          explanation: [
            '1,299 تُقال: one thousand two hundred (and) ninety-nine.',
            'hundred و thousand لا نضيف لهما s بعد رقم.',
            'How much is + مفرد؟ · How much are + جمع؟',
          ],
          examples: [
            { en: "It's 250 riyals. (two hundred fifty)", ar: 'سعره 250 ريال.' },
            { en: "They're 1,500 riyals. (one thousand five hundred)", ar: 'سعرها 1500 ريال.' },
          ],
          note: 'السعر في المحادثات هنا مثال افتراضي فقط. في العمل، اعتمد دائمًا على الملصق أو النظام.',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية بأسعار مثال.',
          lines: [
            { speaker: 'customer', en: 'How much is this power bank?', ar: 'بكم هذا الشاحن المتنقل؟' },
            { speaker: 'staff', en: "It's one hundred and fifty riyals.", ar: 'سعره مئة وخمسون ريال.' },
            { speaker: 'customer', en: 'Is the white one available?', ar: 'هل الأبيض متوفر؟' },
            { speaker: 'staff', en: 'Let me check, please.', ar: 'خلني أتأكد لو سمحت.' },
          ],
          questions: [
            {
              id: 'u0l6-l1', type: 'choice', skill: 'listening', itemIds: ['hundred'],
              prompt: 'كم السعر الذي سمعته؟', options: ['115', '150', '1,500'], answer: 1, optionsDir: 'ltr',
              explain: 'one hundred and fifty = 150. أما fifteen فهي 15.',
            },
            {
              id: 'u0l6-l2', type: 'choice', skill: 'listening', itemIds: ['available'],
              prompt: 'ماذا فعل الموظف عندما سُئل عن توفر اللون الأبيض؟', options: ['قال إنه متوفر', 'قال إنه غير متوفر', 'قال إنه سيتحقق'], answer: 2,
              explain: 'Let me check = خلني أتأكد. وهذا هو التصرف الصحيح بدل التخمين.',
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: "It's one hundred and fifty riyals.", ar: 'سعره 150 ريال.' },
            { en: 'Two thousand riyals.', ar: 'ألفين ريال.' },
            { en: 'Let me check if it is available.', ar: 'خلني أتأكد إذا كان متوفرًا.' },
          ],
        },
        {
          kind: 'practice', title: 'الأرقام بالاستماع',
          exercises: [
            {
              id: 'u0l6-p1', type: 'choice', skill: 'listening', audio: 'Thirteen', hideAudioText: true, itemIds: [],
              prompt: 'استمع: أي رقم؟', options: ['13', '30'], answer: 0, optionsDir: 'ltr',
              explain: 'thirteen (13) الضغط على آخرها «ثيرتين»، thirty (30) الضغط على أولها «ثيرتي».',
            },
            {
              id: 'u0l6-p2', type: 'choice', skill: 'listening', audio: 'Fifty', hideAudioText: true, itemIds: [],
              prompt: 'استمع: أي رقم؟', options: ['15', '50'], answer: 1, optionsDir: 'ltr',
              explain: 'fifty = 50 والضغط على أولها. fifteen = 15 والضغط على آخرها.',
            },
            {
              id: 'u0l6-p3', type: 'choice', skill: 'listening', audio: "It's two thousand four hundred riyals.", hideAudioText: true, itemIds: ['thousand', 'hundred'],
              prompt: 'استمع: كم السعر؟', options: ['2,040', '2,400', '4,200'], answer: 1, optionsDir: 'ltr',
            },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['price', 'riyal', 'hundred', 'thousand', 'available'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u0l6-q1', type: 'choice', skill: 'grammar', itemIds: ['hundred'],
              prompt: 'أي جملة صحيحة؟', optionsDir: 'ltr',
              options: ['Three hundreds riyals.', 'Three hundred riyals.', 'Three hundred riyal.'], answer: 1,
              explain: 'hundred بدون s بعد الرقم، وriyals بالجمع.',
            },
            {
              id: 'u0l6-q2', type: 'type', skill: 'writing', itemIds: ['available'],
              prompt: 'اكتب: «هل هذا اللون متوفر؟»', answers: ['Is this color available?', 'Is this colour available?'],
              starter: 'Is', hints: ['Is this color …?', 'متوفر = available'],
            },
          ],
        },
      ],
    },
  ],
  test: [
    {
      id: 'u0t-1', type: 'choice', skill: 'conversation', itemIds: ['good-evening'], optionsDir: 'ltr',
      prompt: 'الساعة 8 مساءً ودخل عميل. أفضل تحية:', options: ['Good morning!', 'Good evening! Welcome.', 'Good night!'], answer: 1,
    },
    {
      id: 'u0t-2', type: 'fill', skill: 'grammar', itemIds: ['am-is-are'],
      prompt: 'أكمل', sentence: 'These headphones ___ wireless.', answers: ['are'], bank: ['is', 'are', 'am'],
      explain: 'headphones جمع، فمعها are.',
    },
    {
      id: 'u0t-3', type: 'choice', skill: 'listening', audio: 'Where are the cases?', hideAudioText: true, itemIds: ['where'],
      prompt: 'استمع: عن ماذا يسأل العميل؟', options: ['مكان الأغطية', 'سعر الأغطية', 'لون الأغطية'], answer: 0,
    },
    {
      id: 'u0t-4', type: 'order', skill: 'grammar', itemIds: ['thank-you'],
      prompt: 'رتّب', ar: 'شكرًا لانتظارك.', words: ['Thank', 'you', 'for', 'waiting.'],
    },
    {
      id: 'u0t-5', type: 'choice', skill: 'listening', audio: "It's seven hundred and ninety riyals.", hideAudioText: true, itemIds: ['hundred'],
      prompt: 'استمع: كم السعر؟', options: ['719', '790', '970'], answer: 1, optionsDir: 'ltr',
    },
    {
      id: 'u0t-6', type: 'type', skill: 'writing', itemIds: ['he-she', 'am-is-are'],
      prompt: 'اكتب: «المدير ليس هنا الآن.»', answers: ["The manager isn't here now.", 'The manager is not here now.'],
      hints: ['The manager …', "isn't = is not"],
    },
    {
      id: 'u0t-7', type: 'choice', skill: 'reading', itemIds: ['available'],
      prompt: 'اقرأ: “Sorry, this color is not available now.” ماذا يعني؟',
      options: ['اللون متوفر الآن', 'اللون غير متوفر الآن', 'اللون غالي'], answer: 1,
    },
    {
      id: 'u0t-8', type: 'choice', skill: 'vocab', itemIds: ['youre-welcome'], optionsDir: 'ltr',
      prompt: 'العميل قال: Thanks for your help! ردّك:', options: ["You're welcome!", 'Welcome!', 'Sorry!'], answer: 0,
    },
  ],
};
