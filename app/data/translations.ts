/**
 * UI translations. Default: English (en).
 * Translation banner text is always shown in Japanese.
 */
export type Locale = "en" | "fr" | "ja" | "hi" | "ru" | "ur" | "es";

export const LOCALES: Locale[] = ["en", "ja", "fr", "es", "hi", "ru", "ur"];

/** Label for the language (for badge and dropdown) */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
  fr: "Français",
  es: "Español",
  hi: "हिन्दी",
  ru: "Русский",
  ur: "اردو",
};

/** Banner text is always Japanese (like the original design). */
export const BANNER_TEXT_JA = "このポートフォリオは 6 言語で利用可能です";

export type TranslationKeys = {
  // Nav
  "nav.home": string;
  "nav.blogs": string;
  "nav.philosophy": string;
  "nav.openMenu": string;
  "nav.closeMenu": string;
  // Hero
  "hero.greeting": string;
  "hero.intro": string;
  "hero.cta": string;
  // Banner (sentence: "This portfolio is available in 6 languages")
  "banner.text": string;
  // Cards
  "cards.inAHurry": string;
  "cards.downloadResume": string;
  "cards.experience": string;
  "cards.experienceGraduating": string;
  "cards.experienceWorkedAt": string;
  "cards.experienceDomain": string;
  "cards.projects": string;
  "cards.projectsRepos": string;
  "cards.projectsContributions": string;
  "cards.projectsOpenSource": string;
  "cards.contact": string;
  "cards.contactTldr": string;
  "cards.gmail": string;
  "cards.github": string;
  "cards.twitter": string;
  "cards.linkedin": string;
  // Beyond Code
  "beyondCode.title": string;
  // Listening / Drinking
  "listening.title": string;
  "listening.track": string;
  "listening.notListening": string;
  "listening.whileDrinking": string;
  "listening.drink": string;
  // Proof of Work
  "pow.title": string;
  "pow.lastDays": string;
  "pow.openCalendar": string;
  "pow.calendarUrl": string;
  "pow.empty": string;
  // Philosophy
  "philosophy.title": string;
  "philosophy.body": string;
  // Music Production
  "music.title": string;
  "music.body": string;
  "music.spotify": string;
  // Blogs
  "blogs.title": string;
  // Footer
  "footer.philosophy": string;
  "footer.blogs": string;
  "footer.contact": string;
  // Back
  "back.label": string;
  // Project detail
  "project.github": string;
  "project.live": string;
  "project.demo": string;
};

const translations: Record<Locale, TranslationKeys> = {
  en: {
    "nav.home": "Home",
    "nav.blogs": "Blogs",
    "nav.philosophy": "Philosophy",
    "nav.openMenu": "Open menu",
    "nav.closeMenu": "Close menu",
    "hero.greeting": "hey there!",
    "hero.intro": "fellow developer here, this is my portfolio to look into my work.",
    "hero.cta": "so lets give you an experience shall we?",
    "banner.text": BANNER_TEXT_JA,
    "cards.inAHurry": "in a hurry?",
    "cards.downloadResume": "download resume",
    "cards.experience": "Experience",
    "cards.experienceGraduating": "Graduating: 2026",
    "cards.experienceWorkedAt": "Worked at: 3 startups",
    "cards.experienceDomain": "Main Domain: Fullstack Developer",
    "cards.projects": "Projects",
    "cards.projectsRepos": "github repos: 61",
    "cards.projectsContributions": "contributions: 2 orgs",
    "cards.projectsOpenSource": "open source: 3 orgs",
    "cards.contact": "Contact",
    "cards.contactTldr": "gmail · github · twitter · linkedin",
    "cards.gmail": "gmail",
    "cards.github": "github",
    "cards.twitter": "twitter",
    "cards.linkedin": "linkedin",
    "beyondCode.title": "BEYOND CODE",
    "listening.title": "Currently Listening:",
    "listening.track": "of monsters and men : empire",
    "listening.notListening": "Not listening right now",
    "listening.whileDrinking": "While Drinking to:",
    "listening.drink": "Caramel Macchiato",
    "pow.title": "Proof of Work",
    "pow.lastDays": "Last {days} days · {count} events · older lives in Calendar",
    "pow.openCalendar": "open calendar",
    "pow.calendarUrl": "/api/pow/calendar",
    "pow.empty":
      "No events yet. Once GitHub webhooks are connected, you’ll see commits/PRs/CI here in near real time.",
    "philosophy.title": "philosophy",
    "philosophy.body":
      "this part is raw here, a space where i put my thoughts in. my journey has been tough, even though i still need to learn a lot but something that i am a firm believer of, genuine struggle always surpasses luck. I've seen so many of my people getting places for which they didnt prepare or worked hard for, purely based on luck. and i want to prove them wrong.",
    "music.title": "Music Production",
    "music.body":
      "Given that i am a human, therefore i have hobbies, this one was a really expensive one. But the creativity and innovation it brought to my overall being is immense. and although i didnt make big here, i have learnt something that i am extremely proud of. checkout my pages.",
    "music.spotify": "spotify",
    "blogs.title": "Blogs",
    "footer.philosophy": "Philosophy",
    "footer.blogs": "Blogs",
    "footer.contact": "Contact",
    "back.label": "Back to home",
    "project.github": "GITHUB",
    "project.live": "LIVE",
    "project.demo": "DEMO",
  },
  ja: {
    "nav.home": "ホーム",
    "nav.blogs": "ブログ",
    "nav.philosophy": "哲学",
    "nav.openMenu": "メニューを開く",
    "nav.closeMenu": "メニューを閉じる",
    "hero.greeting": "やあ！",
    "hero.intro": "開発者のポートフォリオです。",
    "hero.cta": "それでは、体験してみましょう。",
    "banner.text": "このポートフォリオは 6 言語で利用可能です",
    "cards.inAHurry": "急いでいますか？",
    "cards.downloadResume": "履歴書をダウンロード",
    "cards.experience": "経験",
    "cards.experienceGraduating": "卒業予定: 2026年",
    "cards.experienceWorkedAt": "勤務先: 3社のスタートアップ",
    "cards.experienceDomain": "専門: フルスタック開発",
    "cards.projects": "プロジェクト",
    "cards.projectsRepos": "GitHubリポジトリ: 61",
    "cards.projectsContributions": "コントリビューション: 2組織",
    "cards.projectsOpenSource": "オープンソース: 3組織",
    "cards.contact": "連絡先",
    "cards.contactTldr": "gmail · github · twitter · linkedin",
    "cards.gmail": "gmail",
    "cards.github": "github",
    "cards.twitter": "twitter",
    "cards.linkedin": "linkedin",
    "beyondCode.title": "BEYOND CODE",
    "listening.title": "現在聴いている曲:",
    "listening.track": "of monsters and men : empire",
    "listening.notListening": "今は再生していません",
    "listening.whileDrinking": "飲みながら:",
    "listening.drink": "キャラメルマキアート",
    "pow.title": "作業ログ",
    "pow.lastDays": "直近 {days} 日 · {count} 件 · 過去分はカレンダーへ",
    "pow.openCalendar": "カレンダーを開く",
    "pow.calendarUrl": "/api/pow/calendar",
    "pow.empty":
      "まだイベントがありません。GitHub Webhook を接続すると、コミット/PR/CI がここに表示されます。",
    "philosophy.title": "哲学",
    "philosophy.body":
      "ここでは飾らず、自分の考えを書きます。道のりは厳しかったし、まだ学ぶことは多い。それでも信じているのは、本気の努力は運を超えるということ。準備も努力もせず、運だけで場所を得た人をたくさん見てきた。彼らに間違いを証明したい。",
    "music.title": "音楽制作",
    "music.body":
      "人間だから趣味がある。これはかなりお金がかかった趣味だ。でも、創造性とイノベーションが自分にもたらしたものは大きい。ここで大成したわけではないが、とても誇れることを学んだ。ページをチェックしてほしい。",
    "music.spotify": "spotify",
    "blogs.title": "ブログ",
    "footer.philosophy": "哲学",
    "footer.blogs": "ブログ",
    "footer.contact": "連絡先",
    "back.label": "ホームに戻る",
    "project.github": "GITHUB",
    "project.live": "LIVE",
    "project.demo": "DEMO",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.blogs": "Blogs",
    "nav.philosophy": "Philosophie",
    "nav.openMenu": "Ouvrir le menu",
    "nav.closeMenu": "Fermer le menu",
    "hero.greeting": "Salut !",
    "hero.intro": "Développeur, voici mon portfolio.",
    "hero.cta": "Alors, on vous fait visiter ?",
    "banner.text": "Ce portfolio est disponible en 6 langues",
    "cards.inAHurry": "Pressé ?",
    "cards.downloadResume": "Télécharger le CV",
    "cards.experience": "Expérience",
    "cards.experienceGraduating": "Diplôme prévu : 2026",
    "cards.experienceWorkedAt": "Passage : 3 startups",
    "cards.experienceDomain": "Domaine : Développement fullstack",
    "cards.projects": "Projets",
    "cards.projectsRepos": "Dépôts GitHub : 61",
    "cards.projectsContributions": "Contributions : 2 orgs",
    "cards.projectsOpenSource": "Open source : 3 orgs",
    "cards.contact": "Contact",
    "cards.contactTldr": "gmail · github · twitter · linkedin",
    "cards.gmail": "gmail",
    "cards.github": "github",
    "cards.twitter": "twitter",
    "cards.linkedin": "linkedin",
    "beyondCode.title": "BEYOND CODE",
    "listening.title": "En ce moment :",
    "listening.track": "of monsters and men : empire",
    "listening.notListening": "Rien en ce moment",
    "listening.whileDrinking": "En buvant :",
    "listening.drink": "Caramel Macchiato",
    "pow.title": "Preuve de travail",
    "pow.lastDays": "{count} événements · {days} derniers jours · le reste est dans le calendrier",
    "pow.openCalendar": "ouvrir le calendrier",
    "pow.calendarUrl": "/api/pow/calendar",
    "pow.empty":
      "Aucun événement pour l’instant. Connecte les webhooks GitHub pour voir commits/PR/CI ici.",
    "philosophy.title": "Philosophie",
    "philosophy.body":
      "Cette partie est brute, un espace où je pose mes pensées. Mon parcours a été dur ; j’ai encore beaucoup à apprendre, mais je crois fermement que le vrai effort dépasse la chance. J’ai vu tant de proches atteindre des endroits pour lesquels ils ne s’étaient pas préparés, par pur hasard. Je veux leur prouver le contraire.",
    "music.title": "Production musicale",
    "music.body":
      "Étant humain, j’ai des loisirs ; celui-ci coûte cher. Mais la créativité et l’innovation que ça m’a apportées sont immenses. Je n’ai pas percé ici, mais j’ai appris quelque chose dont je suis très fier. Allez voir mes pages.",
    "music.spotify": "spotify",
    "blogs.title": "Blogs",
    "footer.philosophy": "Philosophie",
    "footer.blogs": "Blogs",
    "footer.contact": "Contact",
    "back.label": "Retour à l’accueil",
    "project.github": "GITHUB",
    "project.live": "LIVE",
    "project.demo": "DEMO",
  },
  es: {
    "nav.home": "Inicio",
    "nav.blogs": "Blogs",
    "nav.philosophy": "Filosofía",
    "nav.openMenu": "Abrir menú",
    "nav.closeMenu": "Cerrar menú",
    "hero.greeting": "¡Hola!",
    "hero.intro": "Desarrollador; este es mi portfolio.",
    "hero.cta": "¿Te doy una vuelta?",
    "banner.text": "Este portfolio está disponible en 6 idiomas",
    "cards.inAHurry": "¿Tienes prisa?",
    "cards.downloadResume": "Descargar currículum",
    "cards.experience": "Experiencia",
    "cards.experienceGraduating": "Graduación: 2026",
    "cards.experienceWorkedAt": "He trabajado en: 3 startups",
    "cards.experienceDomain": "Área: Desarrollador fullstack",
    "cards.projects": "Proyectos",
    "cards.projectsRepos": "Repos en GitHub: 61",
    "cards.projectsContributions": "Contribuciones: 2 orgs",
    "cards.projectsOpenSource": "Open source: 3 orgs",
    "cards.contact": "Contacto",
    "cards.contactTldr": "gmail · github · twitter · linkedin",
    "cards.gmail": "gmail",
    "cards.github": "github",
    "cards.twitter": "twitter",
    "cards.linkedin": "linkedin",
    "beyondCode.title": "BEYOND CODE",
    "listening.title": "Escuchando ahora:",
    "listening.track": "of monsters and men : empire",
    "listening.notListening": "No estoy escuchando ahora",
    "listening.whileDrinking": "Mientras tomo:",
    "listening.drink": "Caramel Macchiato",
    "pow.title": "Prueba de trabajo",
    "pow.lastDays": "Últimos {days} días · {count} eventos · lo anterior está en el calendario",
    "pow.openCalendar": "abrir calendario",
    "pow.calendarUrl": "/api/pow/calendar",
    "pow.empty":
      "Aún no hay eventos. Conecta los webhooks de GitHub para ver commits/PR/CI aquí.",
    "philosophy.title": "Filosofía",
    "philosophy.body":
      "Esta parte es cruda; un espacio donde dejo mis pensamientos. Mi camino ha sido duro y aún me queda mucho por aprender, pero creo firmemente en que el esfuerzo genuino supera a la suerte. He visto a mucha gente llegar a sitios para los que no se prepararon, solo por suerte. Quiero demostrarles que se equivocan.",
    "music.title": "Producción musical",
    "music.body":
      "Como humano, tengo hobbies; este fue muy caro. Pero la creatividad e innovación que me dio son enormes. Aunque no he triunfado aquí, he aprendido algo de lo que estoy muy orgulloso. Echa un vistazo a mis páginas.",
    "music.spotify": "spotify",
    "blogs.title": "Blogs",
    "footer.philosophy": "Filosofía",
    "footer.blogs": "Blogs",
    "footer.contact": "Contacto",
    "back.label": "Volver al inicio",
    "project.github": "GITHUB",
    "project.live": "LIVE",
    "project.demo": "DEMO",
  },
  hi: {
    "nav.home": "होम",
    "nav.blogs": "ब्लॉग",
    "nav.philosophy": "दर्शन",
    "nav.openMenu": "मेन्यू खोलें",
    "nav.closeMenu": "मेन्यू बंद करें",
    "hero.greeting": "नमस्ते!",
    "hero.intro": "डेवलपर, यह मेरा पोर्टफोलियो है।",
    "hero.cta": "तो चलिए आपको एक अनुभव दिखाते हैं।",
    "banner.text": "यह पोर्टफोलियो 6 भाषाओं में उपलब्ध है",
    "cards.inAHurry": "जल्दी में हैं?",
    "cards.downloadResume": "रिज़्यूमे डाउनलोड करें",
    "cards.experience": "अनुभव",
    "cards.experienceGraduating": "ग्रेजुएशन: 2026",
    "cards.experienceWorkedAt": "काम किया: 3 स्टार्टअप",
    "cards.experienceDomain": "डोमेन: फुलस्टैक डेवलपर",
    "cards.projects": "प्रोजेक्ट",
    "cards.projectsRepos": "GitHub रिपो: 61",
    "cards.projectsContributions": "योगदान: 2 संगठन",
    "cards.projectsOpenSource": "ओपन सोर्स: 3 संगठन",
    "cards.contact": "संपर्क",
    "cards.contactTldr": "gmail · github · twitter · linkedin",
    "cards.gmail": "gmail",
    "cards.github": "github",
    "cards.twitter": "twitter",
    "cards.linkedin": "linkedin",
    "beyondCode.title": "BEYOND CODE",
    "listening.title": "अभी सुन रहा हूँ:",
    "listening.track": "of monsters and men : empire",
    "listening.notListening": "अभी कुछ नहीं सुन रहा",
    "listening.whileDrinking": "पीते हुए:",
    "listening.drink": "कैरामेल मकियातो",
    "pow.title": "काम का प्रमाण",
    "pow.lastDays": "पिछले {days} दिन · {count} इवेंट्स · पुराने कैलेंडर में",
    "pow.openCalendar": "कैलेंडर खोलें",
    "pow.calendarUrl": "/api/pow/calendar",
    "pow.empty":
      "अभी कोई इवेंट नहीं। GitHub webhooks जोड़ने पर commits/PR/CI यहाँ दिखेंगे।",
    "philosophy.title": "दर्शन",
    "philosophy.body":
      "यह हिस्सा कच्चा है—यहाँ मैं अपने विचार रखता हूँ। मेरा सफर कठिन रहा; अभी बहुत सीखना बाकी है, लेकिन मैं मानता हूँ कि ईमानदार संघर्ष किस्मत से आगे होता है। मैंने कई लोगों को बिना तैयारी के सिर्फ किस्मत से आगे बढ़ते देखा। मैं उन्हें गलत साबित करना चाहता हूँ।",
    "music.title": "म्यूज़िक प्रोडक्शन",
    "music.body":
      "इंसान होने के नाते शौक हैं; यह वाला काफी महँगा था। लेकिन इसने जो रचनात्मकता और नवाचार दिया, वह बहुत है। यहाँ बड़ा नहीं बना, पर मैंने कुछ सीखा जिस पर मुझे गर्व है। मेरे पेज देखें।",
    "music.spotify": "spotify",
    "blogs.title": "ब्लॉग",
    "footer.philosophy": "दर्शन",
    "footer.blogs": "ब्लॉग",
    "footer.contact": "संपर्क",
    "back.label": "वापस होम",
    "project.github": "GITHUB",
    "project.live": "LIVE",
    "project.demo": "DEMO",
  },
  ru: {
    "nav.home": "Главная",
    "nav.blogs": "Блоги",
    "nav.philosophy": "Философия",
    "nav.openMenu": "Открыть меню",
    "nav.closeMenu": "Закрыть меню",
    "hero.greeting": "Привет!",
    "hero.intro": "Разработчик, вот мой портфолио.",
    "hero.cta": "Давайте покажу вам опыт.",
    "banner.text": "Это портфолио доступно на 6 языках",
    "cards.inAHurry": "Спешите?",
    "cards.downloadResume": "Скачать резюме",
    "cards.experience": "Опыт",
    "cards.experienceGraduating": "Выпуск: 2026",
    "cards.experienceWorkedAt": "Работал в: 3 стартапах",
    "cards.experienceDomain": "Область: Fullstack-разработчик",
    "cards.projects": "Проекты",
    "cards.projectsRepos": "Репозитории GitHub: 61",
    "cards.projectsContributions": "Контрибуции: 2 орг.",
    "cards.projectsOpenSource": "Open source: 3 орг.",
    "cards.contact": "Контакты",
    "cards.contactTldr": "gmail · github · twitter · linkedin",
    "cards.gmail": "gmail",
    "cards.github": "github",
    "cards.twitter": "twitter",
    "cards.linkedin": "linkedin",
    "beyondCode.title": "BEYOND CODE",
    "listening.title": "Сейчас слушаю:",
    "listening.track": "of monsters and men : empire",
    "listening.notListening": "Сейчас ничего не слушаю",
    "listening.whileDrinking": "Под:",
    "listening.drink": "Карамельный макиато",
    "pow.title": "Доказательство работы",
    "pow.lastDays": "Последние {days} дней · {count} событий · старое в календаре",
    "pow.openCalendar": "открыть календарь",
    "pow.calendarUrl": "/api/pow/calendar",
    "pow.empty":
      "Пока нет событий. Подключи GitHub webhooks — и здесь появятся коммиты/PR/CI.",
    "philosophy.title": "Философия",
    "philosophy.body":
      "Здесь без прикрас — место для моих мыслей. Путь был тяжёлым, мне ещё много учиться, но я твёрдо верю: настоящая борьба побеждает удачу. Видел многих, кто оказался не там, где готовился, лишь по везению. Хочу доказать обратное.",
    "music.title": "Музыкальное производство",
    "music.body":
      "Как у человека, у меня есть хобби; это вышло дорого. Но творчество и инновации, которые оно дало, огромны. Здесь я не прославился, но научился тому, чем горжусь. Заходите на мои страницы.",
    "music.spotify": "spotify",
    "blogs.title": "Блоги",
    "footer.philosophy": "Философия",
    "footer.blogs": "Блоги",
    "footer.contact": "Контакты",
    "back.label": "Назад на главную",
    "project.github": "GITHUB",
    "project.live": "LIVE",
    "project.demo": "DEMO",
  },
  ur: {
    "nav.home": "ہوم",
    "nav.blogs": "بلاگز",
    "nav.philosophy": "فلسفہ",
    "nav.openMenu": "مینو کھولیں",
    "nav.closeMenu": "مینو بند کریں",
    "hero.greeting": "سلام!",
    "hero.intro": "ڈویلپر، یہ میرا پورٹ فولیو ہے۔",
    "hero.cta": "تو چلیں آپ کو ایک تجربہ دکھاتے ہیں۔",
    "banner.text": "یہ پورٹ فولیو 6 زبانوں میں دستیاب ہے",
    "cards.inAHurry": "جلدی میں ہیں؟",
    "cards.downloadResume": "ریزیومے ڈاؤن لوڈ کریں",
    "cards.experience": "تجربہ",
    "cards.experienceGraduating": "گریجویشن: 2026",
    "cards.experienceWorkedAt": "کام کیا: 3 اسٹارٹ اپس",
    "cards.experienceDomain": "ڈومین: فل اسٹیک ڈویلپر",
    "cards.projects": "پروجیکٹس",
    "cards.projectsRepos": "GitHub ریپوز: 61",
    "cards.projectsContributions": "شراکتیں: 2 تنظیمیں",
    "cards.projectsOpenSource": "اوپن سورس: 3 تنظیمیں",
    "cards.contact": "رابطہ",
    "cards.contactTldr": "gmail · github · twitter · linkedin",
    "cards.gmail": "gmail",
    "cards.github": "github",
    "cards.twitter": "twitter",
    "cards.linkedin": "linkedin",
    "beyondCode.title": "BEYOND CODE",
    "listening.title": "اب سن رہا ہوں:",
    "listening.track": "of monsters and men : empire",
    "listening.notListening": "اب کچھ نہیں سن رہا",
    "listening.whileDrinking": "پیتے ہوئے:",
    "listening.drink": "کیریمل مکچیاتو",
    "pow.title": "کام کا ثبوت",
    "pow.lastDays": "پچھلے {days} دن · {count} ایونٹس · پرانا کیلنڈر میں",
    "pow.openCalendar": "کیلنڈر کھولیں",
    "pow.calendarUrl": "/api/pow/calendar",
    "pow.empty":
      "ابھی کوئی ایونٹ نہیں۔ GitHub webhooks جوڑیں تو commits/PR/CI یہاں نظر آئیں گے۔",
    "philosophy.title": "فلسفہ",
    "philosophy.body":
      "یہ حصہ خام ہے—یہاں میں اپنے خیالات لکھتا ہوں۔ میرا سفر سخت رہا، ابھی بہت کچھ سیکھنا ہے، لیکن میں یقین رکھتا ہوں کہ حقیقی جدوجہد قسمت سے آگے ہوتی ہے۔ میں نے بہت سے لوگوں کو بغیر تیاری کے محض قسمت سے آگے جاتے دیکھا۔ میں انہیں غلط ثابت کرنا چاہتا ہوں۔",
    "music.title": "موسیقی کی پروڈکشن",
    "music.body":
      "انسان ہونے کے ناطے شوق ہیں؛ یہ والا مہنگا تھا۔ لیکن اس نے جو تخلیق اور جدت دی، وہ بہت ہے۔ یہاں بڑا نہیں بنا، لیکن میں نے کچھ سیکھا جس پر فخر ہے۔ میری صفحات دیکھیں۔",
    "music.spotify": "spotify",
    "blogs.title": "بلاگز",
    "footer.philosophy": "فلسفہ",
    "footer.blogs": "بلاگز",
    "footer.contact": "رابطہ",
    "back.label": "واپس ہوم",
    "project.github": "GITHUB",
    "project.live": "LIVE",
    "project.demo": "DEMO",
  },
};

export function getTranslation(locale: Locale, key: keyof TranslationKeys): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}
