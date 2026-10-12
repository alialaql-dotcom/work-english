import type { Unit } from './types';

// الوحدة 4: السعر والتوفر والاعتراضات.
// مهم: لا نعلّم أي سياسة حقيقية (ضمان، استرجاع، خصومات، تقسيط). نعلّم اللغة وكيف تتحقق قبل أن تجيب.
// الأسعار أمثلة افتراضية.

export const unit4: Unit = {
  id: 'u4',
  order: 4,
  title: 'السعر والتوفر والاعتراضات',
  titleEn: 'Price, availability & objections',
  description: 'تتحقق من التوفر، وتقول السعر والمجموع، وترد على «غالي» بلباقة، وتجيب عن الضمان دون تخمين، ثم تُنهي البيع.',
  cefr: 'A2',
  lessons: [
    {
      id: 'u4l1', unitId: 'u4', title: 'التوفر والألوان', titleEn: 'Availability & colors', minutes: 10,
      goal: 'تفهم «عندكم منه أسود؟» وترد بعد التحقق: in stock / out of stock.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'عبارات الدرس', itemIds: ['in-stock', 'out-of-stock', 'color', 'have-it-in', 'check-system', 'another-branch', 'come-back'] },
        {
          kind: 'grammar', id: 'g-may-will', title: 'may و will: ممكن وأكيد', pattern: 'It may be … (ممكن) · I will … / I\'ll … (سأفعل)',
          explanation: [
            'may = ممكن (لست متأكدًا): It may be available in another branch.',
            "I'll = I will: لما تقرر تفعل شيئًا الآن: I'll check for you.",
            'لا تستخدم it will be available إلا إذا كنت متأكدًا من النظام.',
          ],
          examples: [
            { en: "I'll check for you.", ar: 'بشيك لك.' },
            { en: 'It may be available in another branch.', ar: 'ممكن يكون متوفر في فرع ثاني.' },
            { en: "Sorry, it's out of stock right now.", ar: 'آسف، نفد حاليًا.' },
          ],
          note: 'الوعد الخاطئ يضر أكثر من «لا أعرف». استخدم may عندما لا تكون متأكدًا.',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: لون غير متوفر.',
          lines: [
            { speaker: 'customer', en: 'Do you have this phone in blue?', ar: 'عندكم هذا الجوال أزرق؟' },
            { speaker: 'staff', en: "One moment. Let me check the system.", ar: 'لحظة. خلني أشيك على النظام.' },
            { speaker: 'staff', en: "Sorry, blue is out of stock. We have black and white in stock.", ar: 'آسف، الأزرق نفد. عندنا أسود وأبيض متوفر.' },
            { speaker: 'customer', en: 'Can I come back next week?', ar: 'أقدر أرجع الأسبوع الجاي؟' },
            { speaker: 'staff', en: "Sure. It may be available in another branch too. I'll check for you.", ar: 'أكيد. وممكن يكون متوفر في فرع ثاني. بشيك لك.' },
          ],
          questions: [
            {
              id: 'u4l1-l1', type: 'choice', skill: 'listening', itemIds: ['out-of-stock'],
              prompt: 'ما اللون غير المتوفر؟', options: ['الأسود', 'الأبيض', 'الأزرق'], answer: 2,
            },
            {
              id: 'u4l1-l2', type: 'choice', skill: 'listening', itemIds: ['another-branch'],
              prompt: 'هل أكّد الموظف أنه متوفر في فرع آخر؟', options: ['نعم، أكّد', 'لا، قال «ممكن» وسيتحقق', 'قال إنه غير متوفر في أي مكان'], answer: 1,
              explain: 'It may be = ممكن. لم يَعِد قبل أن يتحقق.',
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'One moment. Let me check the system.', ar: 'لحظة. خلني أشيك على النظام.' },
            { en: "Sorry, it's out of stock.", ar: 'آسف، نفد.' },
            { en: "I'll check another branch for you.", ar: 'بشيك لك على فرع ثاني.' },
          ],
        },
        { kind: 'drill', title: 'تدريب العبارات', itemIds: ['in-stock', 'out-of-stock', 'color', 'have-it-in', 'check-system', 'another-branch'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u4l1-q1', type: 'choice', skill: 'conversation', itemIds: ['check-system'], optionsDir: 'ltr',
              prompt: 'Do you have it in gold? (لم تتحقق بعد)', options: ['Yes, we have.', 'Let me check the system.', 'No, never.'], answer: 1,
            },
            {
              id: 'u4l1-q2', type: 'fill', skill: 'grammar', itemIds: ['another-branch'],
              prompt: 'ممكن (لست متأكدًا)', sentence: 'It ___ be available in another branch.', answers: ['may'], bank: ['may', 'will', 'is'],
              explain: 'may = ممكن، وهي المناسبة عندما لا تكون متأكدًا.',
            },
            {
              id: 'u4l1-q3', type: 'choice', skill: 'listening', audio: "Sorry, the white one is out of stock.", hideAudioText: true, itemIds: ['out-of-stock', 'color'],
              prompt: 'استمع: ماذا قال؟', options: ['الأبيض متوفر', 'الأبيض نفد', 'الأبيض أرخص'], answer: 1,
            },
            {
              id: 'u4l1-q4', type: 'type', skill: 'writing', itemIds: ['in-stock'],
              prompt: 'تحققت ووجدته متوفرًا. قل للعميل: «نعم، متوفر.»', answers: ["Yes, it's in stock.", 'Yes, it is in stock.', 'Yes, it is available.'],
              requiredWords: [['yes'], ['in stock', 'available']], model: "Yes, it's in stock.", hints: ['Yes, it\'s in …'],
            },
          ],
        },
      ],
    },
    {
      id: 'u4l2', unitId: 'u4', title: 'السعر والدفع', titleEn: 'Price & payment', minutes: 10,
      goal: 'تقول السعر والمجموع، وتفهم أسئلة الخصم والضريبة والدفع.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['cost', 'total', 'discount', 'offer', 'vat', 'pay', 'cash-or-card', 'receipt'] },
        {
          kind: 'grammar', id: 'g-how-much-does', title: 'السؤال عن السعر', pattern: 'How much is it? · How much does it cost? · It costs …',
          explanation: [
            'How much is it? و How much does it cost? معناهما واحد.',
            'في الإجابة: It\'s … riyals أو It costs … riyals (مع s).',
            'للمجموع: The total is … riyals.',
          ],
          examples: [
            { en: 'It costs 899 riyals.', ar: 'سعره 899 ريال.' },
            { en: 'The total is 1,048 riyals.', ar: 'المجموع 1048 ريال.' },
            { en: 'Is there an offer on this model? — Let me check.', ar: 'فيه عرض على هذا الموديل؟ — خلني أتأكد.' },
          ],
          note: 'الأسعار هنا أمثلة. في العمل اعتمد على الملصق والنظام فقط، ولا تَعِد بخصم أو عرض قبل التحقق.',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية بأرقام مثال.',
          lines: [
            { speaker: 'customer', en: 'How much does this charger cost?', ar: 'كم سعر هذا الشاحن؟' },
            { speaker: 'staff', en: 'It costs ninety-nine riyals. With the cable, the total is one hundred and forty-nine.', ar: 'سعره تسعة وتسعين ريال. مع الكابل المجموع مئة وتسعة وأربعين.' },
            { speaker: 'customer', en: 'Is there any discount?', ar: 'فيه خصم؟' },
            { speaker: 'staff', en: "Let me check if there is an offer. You can pay at the cashier, cash or card.", ar: 'خلني أشوف إذا فيه عرض. تقدر تدفع عند الكاشير، كاش أو بطاقة.' },
          ],
          questions: [
            {
              id: 'u4l2-l1', type: 'choice', skill: 'listening', itemIds: ['total'],
              prompt: 'كم المجموع مع الكابل؟', options: ['99', '140', '149'], answer: 2, optionsDir: 'ltr',
            },
            {
              id: 'u4l2-l2', type: 'choice', skill: 'listening', itemIds: ['discount'],
              prompt: 'كيف رد الموظف على سؤال الخصم؟', options: ['وعد بخصم 10%', 'قال إنه سيتحقق من وجود عرض', 'قال لا يوجد'], answer: 1,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'It costs ninety-nine riyals.', ar: 'سعره 99 ريال.' },
            { en: 'The total is one hundred and forty-nine riyals.', ar: 'المجموع 149 ريال.' },
            { en: 'You can pay at the cashier.', ar: 'تقدر تدفع عند الكاشير.' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['cost', 'total', 'discount', 'offer', 'pay', 'receipt'] },
        {
          kind: 'practice', title: 'الأرقام والأسعار',
          exercises: [
            {
              id: 'u4l2-p1', type: 'choice', skill: 'listening', audio: 'The total is three hundred and sixty riyals.', hideAudioText: true, itemIds: ['total'],
              prompt: 'استمع: كم المجموع؟', options: ['316', '360', '3,600'], answer: 1, optionsDir: 'ltr',
            },
            {
              id: 'u4l2-p2', type: 'choice', skill: 'listening', audio: 'It costs one thousand one hundred and ninety-nine riyals.', hideAudioText: true, itemIds: ['cost'],
              prompt: 'استمع: كم السعر؟', options: ['1,099', '1,199', '1,990'], answer: 1, optionsDir: 'ltr',
            },
          ],
        },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u4l2-q1', type: 'fill', skill: 'grammar', itemIds: ['cost'],
              prompt: 'أكمل', sentence: 'How much does it ___?', answers: ['cost'], bank: ['cost', 'costs', 'price'],
              explain: 'بعد does الفعل بدون s: cost.',
            },
            {
              id: 'u4l2-q2', type: 'choice', skill: 'conversation', itemIds: ['discount'], optionsDir: 'ltr',
              prompt: 'Is there any discount? (لا تعرف)', options: ['Yes, 20%.', 'Let me check if there is an offer.', 'No discount ever.'], answer: 1,
            },
            {
              id: 'u4l2-q3', type: 'type', skill: 'writing', itemIds: ['pay'],
              prompt: 'اكتب: «تقدر تدفع عند الكاشير.»', answers: ['You can pay at the cashier.'],
              starter: 'You can', hints: ['… pay at the …'],
            },
          ],
        },
      ],
    },
    {
      id: 'u4l3', unitId: 'u4', title: 'عندما يقول العميل «غالي»', titleEn: 'Handling “too expensive”', minutes: 10,
      goal: 'ترد على الاعتراض بلباقة: I understand + سبب أو خيار أرخص، دون ضغط.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'عبارات الدرس', itemIds: ['too-expensive', 'i-understand', 'cheaper-option', 'because', 'compare-for-you', 'think-about-it', 'no-problem'] },
        {
          kind: 'grammar', id: 'g-too-very', title: 'too أم very؟ و because', pattern: 'too + صفة (أكثر من اللازم) · very + صفة (جدًا) · because + سبب',
          explanation: [
            "It's very good = ممتاز جدًا (إيجابي).",
            "It's too expensive = غالي أكثر من اللازم (مشكلة).",
            'because = لأن: تربط السعر بميزة حقيقية.',
          ],
          examples: [
            { en: "I understand. It's more expensive because the battery is bigger.", ar: 'أفهمك. أغلى لأن البطارية أكبر.' },
            { en: 'Here is a cheaper option.', ar: 'هذا خيار أرخص.' },
            { en: 'No problem. Take your time.', ar: 'ولا يهمك. خذ راحتك.' },
          ],
          note: 'خطة الرد: (1) I understand. (2) سبب السعر بـ because أو خيار أرخص. (3) بدون ضغط: No problem, take your time.',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: عميل يرى السعر مرتفعًا.',
          lines: [
            { speaker: 'customer', en: "Hmm, it's too expensive for me.", ar: 'همم، غالي علي.' },
            { speaker: 'staff', en: "I understand. It's more expensive because it has noise cancelling.", ar: 'أفهمك. أغلى لأن فيها عزل ضوضاء.' },
            { speaker: 'staff', en: 'Do you need noise cancelling? If not, here is a cheaper option.', ar: 'تحتاج عزل الضوضاء؟ إذا لا، هذا خيار أرخص.' },
            { speaker: 'customer', en: "Thanks. I'll think about it.", ar: 'شكرًا. بفكّر في الموضوع.' },
            { speaker: 'staff', en: 'No problem. Take your time.', ar: 'ولا يهمك. خذ راحتك.' },
          ],
          questions: [
            {
              id: 'u4l3-l1', type: 'choice', skill: 'listening', itemIds: ['because'],
              prompt: 'لماذا السماعة أغلى حسب الموظف؟', options: ['لأنها أحدث', 'لأن فيها عزل ضوضاء', 'لأن لونها مميز'], answer: 1,
            },
            {
              id: 'u4l3-l2', type: 'choice', skill: 'listening', itemIds: ['think-about-it', 'no-problem'],
              prompt: 'كيف تعامل الموظف مع «بفكّر في الموضوع»؟', options: ['ضغط عليه ليشتري الآن', 'قال له ولا يهمك، خذ راحتك', 'تجاهله'], answer: 1,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: "I understand. Here is a cheaper option.", ar: 'أفهمك. هذا خيار أرخص.' },
            { en: "It's more expensive because the camera is better.", ar: 'أغلى لأن الكاميرا أفضل.' },
            { en: 'No problem. Take your time.', ar: 'ولا يهمك. خذ راحتك.' },
          ],
        },
        { kind: 'drill', title: 'تدريب العبارات', itemIds: ['too-expensive', 'i-understand', 'cheaper-option', 'because', 'think-about-it', 'no-problem'] },
        {
          kind: 'quiz', title: 'محادثة كاملة',
          exercises: [
            {
              id: 'u4l3-q1', type: 'fill', skill: 'grammar', itemIds: ['too-expensive'],
              prompt: 'too أم very؟', sentence: 'The sound is ___ good.', ar: 'الصوت ممتاز جدًا.', answers: ['very'], bank: ['too', 'very'],
              explain: 'هذا مدح، فنستخدم very. too تعني «أكثر من اللازم».',
            },
            {
              id: 'u4l3-d1', type: 'dialogue', skill: 'conversation', itemIds: ['i-understand', 'cheaper-option', 'compare-for-you', 'no-problem'],
              prompt: 'عميل يرى أن اللابتوب غالٍ.',
              turns: [
                { speaker: 'customer', en: "This laptop is too expensive.", ar: 'هذا اللابتوب غالي مرة.' },
                { speaker: 'staff', options: ['I understand. What is your budget?', 'No, it is cheap.', 'Then go to another store.'], answer: 0, ar: 'أفهمك. كم ميزانيتك؟' },
                { speaker: 'customer', en: 'Around two thousand.', ar: 'حوالي ألفين.' },
                { speaker: 'staff', options: ['We have a cheaper option. Let me compare them for you.', 'We have a more cheap option.', 'Sorry, goodbye.'], answer: 0, ar: 'عندنا خيار أرخص. خلني أقارن لك بينهم.' },
                { speaker: 'customer', en: "Thanks. I'll think about it.", ar: 'شكرًا. بفكّر في الموضوع.' },
                { speaker: 'staff', options: ['No problem. Take your time.', 'You must buy now.', 'Why?'], answer: 0, ar: 'ولا يهمك. خذ راحتك.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'u4l4', unitId: 'u4', title: 'الضمان والاسترجاع والأعطال', titleEn: 'Warranty, returns & problems', minutes: 10,
      goal: 'تفهم أسئلة الضمان والاسترجاع والأعطال، وتجيب بالتحقق وليس بالتخمين.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'كلمات الدرس', itemIds: ['warranty', 'return', 'exchange', 'policy', 'terms', 'not-sure', 'broken'] },
        {
          kind: 'grammar', id: 'g-can-i-question', title: 'Can I …? في أسئلة العميل', pattern: 'Can I + فعل …? · How long is …?',
          explanation: [
            'العميل يسأل عن الإمكانية بـ Can I …?: Can I return it? Can I exchange it?',
            'وعن المدة بـ How long is …?: How long is the warranty?',
            'ردك الآمن عندما لا تعرف: I\'m not sure. Let me check the policy. / Let me ask my manager.',
          ],
          examples: [
            { en: 'Can I exchange it for another color?', ar: 'أقدر أبدّله بلون ثاني؟' },
            { en: 'How long is the warranty?', ar: 'كم مدة الضمان؟' },
            { en: "I'm not sure. Let me check the policy for you.", ar: 'لست متأكدًا. خلني أتأكد من السياسة.' },
          ],
          note: 'الضمان والاسترجاع شروط رسمية. لا تخمّن أبدًا مدة أو شرطًا؛ تحقق أو اسأل المسؤول.',
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: عميلة جهازها لا يعمل.',
          lines: [
            { speaker: 'customer', en: "Hi. My headphones are broken. The left side doesn't work.", ar: 'أهلًا. سماعاتي خربانة. الجهة اليسرى ما تشتغل.' },
            { speaker: 'staff', en: "I'm sorry to hear that. Do you have the receipt?", ar: 'آسف لسماع ذلك. معك الفاتورة؟' },
            { speaker: 'customer', en: 'Yes. Can I exchange them?', ar: 'نعم. أقدر أبدّلها؟' },
            { speaker: 'staff', en: "I'm not sure. Let me check the warranty terms with my manager. One moment, please.", ar: 'لست متأكدًا. خلني أتأكد من شروط الضمان مع المدير. لحظة لو سمحتِ.' },
          ],
          questions: [
            {
              id: 'u4l4-l1', type: 'choice', skill: 'listening', itemIds: ['broken'],
              prompt: 'ما المشكلة؟', options: ['الشاحن لا يعمل', 'الجهة اليسرى من السماعة لا تعمل', 'اللون لا يعجبها'], answer: 1,
            },
            {
              id: 'u4l4-l2', type: 'choice', skill: 'listening', itemIds: ['terms', 'not-sure'],
              prompt: 'هل وافق الموظف على الاستبدال مباشرة؟', options: ['نعم', 'لا، قال إنه سيتأكد من شروط الضمان مع المدير', 'رفض'], answer: 1,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: "I'm sorry to hear that.", ar: 'آسف لسماع ذلك.' },
            { en: 'Do you have the receipt?', ar: 'معك الفاتورة؟' },
            { en: "I'm not sure. Let me check the policy.", ar: 'لست متأكدًا. خلني أتأكد من السياسة.' },
          ],
        },
        { kind: 'drill', title: 'تدريب الكلمات', itemIds: ['warranty', 'return', 'exchange', 'policy', 'not-sure', 'broken'] },
        {
          kind: 'quiz', title: 'اختبار قصير',
          exercises: [
            {
              id: 'u4l4-q1', type: 'choice', skill: 'conversation', itemIds: ['warranty', 'not-sure'], optionsDir: 'ltr',
              prompt: 'How long is the warranty? (لا تعرف المدة)', options: ['Two years, I think.', "I'm not sure. Let me check for you.", 'Forever.'], answer: 1,
              explain: 'لا تخمّن مدة الضمان. «أظن» قد تسبب مشكلة للعميل وللمتجر.',
            },
            {
              id: 'u4l4-q2', type: 'choice', skill: 'vocab', itemIds: ['exchange', 'return'],
              prompt: 'العميل يريد أن يعيد الجهاز ويأخذ لونًا آخر. أي كلمة؟', options: ['return', 'exchange', 'repair'], answer: 1, optionsDir: 'ltr',
              explain: 'exchange = استبدال بشيء آخر. return = إرجاع.',
            },
            {
              id: 'u4l4-q3', type: 'type', skill: 'writing', itemIds: ['receipt'],
              prompt: 'اسأل العميل: «معك الفاتورة؟»', answers: ['Do you have the receipt?', 'Do you have your receipt?'],
              requiredWords: [['receipt'], ['have']], model: 'Do you have the receipt?', starter: 'Do you', hints: ['Do you have …?'],
            },
          ],
        },
      ],
    },
    {
      id: 'u4l5', unitId: 'u4', title: 'إنهاء البيع والوداع', titleEn: 'Closing the sale', minutes: 9,
      goal: 'تسأل عن أي طلب آخر، وتعرض بأدب (Would you like …?)، وتوجّه للكاشير وتودّع العميل.',
      steps: [
        { kind: 'review' },
        { kind: 'vocab', title: 'عبارات الدرس', itemIds: ['anything-else', 'would-you-like', 'here-you-are', 'cashier', 'bag', 'enjoy', 'see-you'] },
        {
          kind: 'grammar', id: 'g-would-like', title: 'Would you like …? العرض المهذب', pattern: 'Would you like + اسم? · Would you like to + فعل?',
          explanation: [
            'Would you like … أكثر أدبًا من Do you want …',
            'بعدها اسم: Would you like a bag?',
            'أو to + فعل: Would you like to try it?',
            'الرد: Yes, please. / No, thank you.',
          ],
          examples: [
            { en: 'Would you like a bag?', ar: 'تبغى كيس؟' },
            { en: 'Would you like to try it?', ar: 'تحب تجربه؟' },
            { en: 'Is there anything else I can help you with?', ar: 'فيه شيء ثاني أقدر أساعدك فيه؟' },
          ],
          note: "خطأ شائع: Would you like try it? ✗ — الصحيح: Would you like to try it? ✓",
        },
        {
          kind: 'listen', title: 'استمع أولًا', situation: 'محادثة افتراضية: نهاية عملية بيع.',
          lines: [
            { speaker: 'staff', en: 'Is there anything else I can help you with?', ar: 'فيه شيء ثاني أقدر أساعدك فيه؟' },
            { speaker: 'customer', en: "No, that's all. Thank you.", ar: 'لا، بس كذا. شكرًا.' },
            { speaker: 'staff', en: 'You can pay at the cashier, over there. Would you like a bag?', ar: 'تقدر تدفع عند الكاشير، هناك. تبغى كيس؟' },
            { speaker: 'customer', en: 'Yes, please.', ar: 'نعم، لو سمحت.' },
            { speaker: 'staff', en: 'Here you are. Enjoy your new phone! See you again.', ar: 'تفضل. بالتوفيق مع جوالك الجديد! نشوفك مرة ثانية.' },
          ],
          questions: [
            {
              id: 'u4l5-l1', type: 'choice', skill: 'listening', itemIds: ['anything-else'],
              prompt: 'هل يريد العميل شيئًا آخر؟', options: ['نعم، شاحن', 'لا، هذا كل شيء', 'لم يجب'], answer: 1,
            },
            {
              id: 'u4l5-l2', type: 'choice', skill: 'listening', itemIds: ['would-you-like', 'bag'],
              prompt: 'ماذا عرض الموظف في النهاية؟', options: ['خصم', 'كيس', 'غطاء'], answer: 1,
            },
          ],
        },
        {
          kind: 'repeat', title: 'استمع وكرّر',
          phrases: [
            { en: 'Is there anything else I can help you with?', ar: 'فيه شيء ثاني أقدر أساعدك فيه؟' },
            { en: 'Would you like a bag?', ar: 'تبغى كيس؟' },
            { en: 'Here you are. Enjoy your new phone!', ar: 'تفضل. بالتوفيق مع جوالك الجديد!' },
          ],
        },
        { kind: 'drill', title: 'تدريب العبارات', itemIds: ['anything-else', 'would-you-like', 'here-you-are', 'cashier', 'bag', 'see-you'] },
        {
          kind: 'quiz', title: 'محادثة كاملة: عملية بيع من البداية للنهاية',
          exercises: [
            {
              id: 'u4l5-q1', type: 'fill', skill: 'grammar', itemIds: ['would-you-like'],
              prompt: 'أكمل', sentence: 'Would you like ___ try it?', answers: ['to'], bank: ['to', 'for', 'a'],
              explain: 'Would you like to + فعل.',
            },
            {
              id: 'u4l5-d1', type: 'dialogue', skill: 'conversation', itemIds: ['how-can-i-help', 'use-it-for', 'recommend', 'in-stock', 'anything-else', 'would-you-like'],
              prompt: 'محادثة شاملة تجمع ما تعلمته في الوحدات.',
              turns: [
                { speaker: 'customer', en: 'Hello. I need wireless earbuds.', ar: 'مرحبًا. أحتاج سماعات لاسلكية.' },
                { speaker: 'staff', options: ['Sure. What will you use them for?', 'Sure. What will you use them?', 'Sure. They are where?'], answer: 0, ar: 'أكيد. لأي شيء بتستخدمها؟' },
                { speaker: 'customer', en: 'For the gym and for calls.', ar: 'للنادي وللمكالمات.' },
                { speaker: 'staff', options: ['I recommend these. They are light and the microphone is clear.', 'I recommend you these. They light.', 'These are the most lightest.'], answer: 0, ar: 'أنصحك بهذه. خفيفة والمايك واضح.' },
                { speaker: 'customer', en: 'Do you have them in white?', ar: 'عندكم منها أبيض؟' },
                { speaker: 'staff', options: ['Let me check the system. … Yes, white is in stock.', 'Yes, we have every color. (بدون تحقق)', 'White is out of stock forever.'], answer: 0, ar: 'خلني أشيك على النظام. … نعم، الأبيض متوفر.' },
                { speaker: 'customer', en: "Great. I'll take them.", ar: 'ممتاز. بآخذها.' },
                { speaker: 'staff', options: ['Is there anything else I can help you with?', 'Anything other more?', 'Goodbye.'], answer: 0, ar: 'فيه شيء ثاني أقدر أساعدك فيه؟' },
                { speaker: 'customer', en: "No, that's all.", ar: 'لا، بس كذا.' },
                { speaker: 'staff', options: ['You can pay at the cashier. Enjoy your new earbuds!', 'Pay there. Bye.', 'You can paying at the cashier.'], answer: 0, ar: 'تقدر تدفع عند الكاشير. بالتوفيق مع سماعاتك الجديدة!' },
              ],
            },
          ],
        },
      ],
    },
  ],
  test: [
    {
      id: 'u4t-1', type: 'choice', skill: 'listening', audio: 'Sorry, the black one is out of stock, but we have it in silver.', hideAudioText: true, itemIds: ['out-of-stock'],
      prompt: 'استمع: ما اللون المتوفر؟', options: ['الأسود', 'الفضي', 'لا شيء'], answer: 1,
    },
    {
      id: 'u4t-2', type: 'fill', skill: 'grammar', itemIds: ['cost'],
      prompt: 'أكمل', sentence: 'It ___ 450 riyals.', answers: ['costs'], bank: ['cost', 'costs', 'costing'],
    },
    {
      id: 'u4t-3', type: 'choice', skill: 'listening', audio: 'The total is two thousand and fifty riyals.', hideAudioText: true, itemIds: ['total'],
      prompt: 'استمع: كم المجموع؟', options: ['2,015', '2,050', '2,500'], answer: 1, optionsDir: 'ltr',
    },
    {
      id: 'u4t-4', type: 'fill', skill: 'grammar', itemIds: ['too-expensive'],
      prompt: 'too أم very؟', sentence: "It's ___ expensive for me. I can't buy it.", answers: ['too'], bank: ['too', 'very'],
    },
    {
      id: 'u4t-5', type: 'choice', skill: 'conversation', itemIds: ['i-understand'], optionsDir: 'ltr',
      prompt: "العميل: It's too expensive. أفضل بداية للرد:", options: ['No, it is not.', 'I understand.', 'Buy it now.'], answer: 1,
    },
    {
      id: 'u4t-6', type: 'choice', skill: 'reading', itemIds: ['warranty', 'policy'],
      prompt: 'زميلك كتب لك: “Please check the warranty terms before you answer the customer.” ماذا يطلب؟', options: ['أن تبيع بسرعة', 'أن تتحقق من شروط الضمان قبل الرد', 'أن تعطي خصمًا'], answer: 1,
    },
    {
      id: 'u4t-7', type: 'type', skill: 'writing', itemIds: ['would-you-like', 'bag'],
      prompt: 'اعرض على العميل كيسًا بطريقة مهذبة.', answers: ['Would you like a bag?'], requiredWords: [['would you like', 'do you need', 'do you want'], ['bag']],
      model: 'Would you like a bag?',
    },
    {
      id: 'u4t-8', type: 'order', skill: 'grammar', itemIds: ['anything-else'],
      prompt: 'رتّب', ar: 'فيه شيء ثاني أقدر أساعدك فيه؟', words: ['Is', 'there', 'anything', 'else', 'I', 'can', 'help', 'you', 'with?'],
    },
  ],
};
