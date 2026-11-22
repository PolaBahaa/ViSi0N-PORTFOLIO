import React, { useEffect, useRef, useState } from 'react';
import { ButtonLink, Caption, CloseButton, Closing, CopyButton, FileCard, TextLink, useLocalState } from './kit';
import portraitCutout from './photos/pola-portrait.png';

type Lang = 'en' | 'ar';
type Category = 'platform' | 'app' | 'learning';

type Project = {
    id: number;
    name: string;
    year: string;
    category: Category;
    visibility: 'public' | 'private';
    status?: 'development';
    url?: string;
    extraLinks?: { label: string; href: string }[];
    stack: string[];
    tagline: Record<Lang, string>;
    detail: Record<Lang, string>;
};

const projects: Project[] = [
    {
        id: 1, name: 'AMAL-Academy', year: '2026', category: 'platform', visibility: 'private', status: 'development',
        stack: ['TypeScript', 'React', 'Vite', 'Supabase'],
        tagline: { en: 'A complete courses academy platform — my biggest build so far.', ar: 'منصة أكاديمية كورسات متكاملة — أكبر مشروع اشتغلت عليه لحد دلوقتي.' },
        detail: {
            en: 'Courses and chapters, video lessons, student enrollments, roles and permissions — guarded by an automated test suite that covers the core flows. Built with Antigravity and in active development.',
            ar: 'كورسات وفصول وفيديوهات وتسجيل طلاب وصلاحيات — محمية بمجموعة اختبارات آلية بتغطي الوظائف الأساسية. بتتبني بمساعدة Antigravity ولسه تحت التطوير.',
        },
    },
    {
        id: 2, name: 'HAMOURY', year: '2026', category: 'app', visibility: 'public', url: 'https://github.com/PolaBahaa/HAMOURY',
        stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Firebase'],
        tagline: { en: 'A fun activities and competitions app built for a church summer trip.', ar: 'تطبيق أنشطة ومسابقات ممتع، معمول لرحلة صيفية للكنيسة.' },
        detail: {
            en: 'Runs games and competitions on real event days. Built with Firebase and QR code scanning, with confetti celebrations baked in.',
            ar: 'بيشغّل ألعاب ومسابقات في أيام الرحلة فعلًا. مبني بـ Firebase ومسح رموز QR، ومعاه احتفالات كونفيتي جاهزة.',
        },
    },
    {
        id: 3, name: 'Revelation-Museum', year: '2026', category: 'app', visibility: 'public', url: 'https://github.com/PolaBahaa/Revelation-Museum',
        stack: ['React', 'TypeScript', 'Three.js', 'Tailwind CSS'],
        tagline: { en: 'An interactive 3D museum experience on the web.', ar: 'تجربة متحف تفاعلي ثلاثي الأبعاد على الويب.' },
        detail: {
            en: 'A museum experience rendered in real time with Three.js, with animated scenes and motion throughout.',
            ar: 'تجربة متحف بتترسم في الوقت الحقيقي بتقنية Three.js، مع مشاهد متحركة وحركة في كل حتة.',
        },
    },
    {
        id: 4, name: 'MMH-Podcast', year: '2026', category: 'app', visibility: 'public', url: 'https://github.com/PolaBahaa/MMH-Podcast',
        stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
        tagline: { en: 'A gamified Christian podcast experience made for SPP 2026.', ar: 'تجربة بودكاست مسيحي تفاعلية بأسلوب الألعاب، معمولة لـ SPP 2026.' },
        detail: {
            en: 'Podcast listening turned into a game, built as a modern single-page React app.',
            ar: 'سماع البودكاست اتحوّل للعبة، مبنية كتطبيق React حديث من صفحة واحدة.',
        },
    },
    {
        id: 5, name: 'Memory-Blocks-Game', year: '2026', category: 'app', visibility: 'private',
        stack: ['JavaScript', 'Capacitor', 'Android'],
        tagline: { en: 'A memory blocks game packaged as a real Android app.', ar: 'لعبة مكعبات ذاكرة متغلفة كتطبيق أندرويد حقيقي.' },
        detail: {
            en: 'The classic flip-and-match memory game, wrapped with Capacitor so it installs and runs on Android phones.',
            ar: 'لعبة الذاكرة الكلاسيكية بتاعة قلب الكروت والمطابقة، متغلفة بـ Capacitor عشان تتثبت وتشتغل على موبايلات أندرويد.',
        },
    },
    {
        id: 6, name: 'Faar-Counter', year: '2025', category: 'app', visibility: 'public', url: 'https://github.com/PolaBahaa/Faar-Counter',
        stack: ['HTML', 'CSS', 'JavaScript'],
        tagline: { en: 'A funny rat-hitting counter game with an Arabic interface.', ar: 'لعبة عداد ضرب الفأر المضحكة — بواجهة عربية.' },
        detail: {
            en: 'Plain HTML, CSS and JavaScript with no frameworks. A silly idea turned into a playable little game.',
            ar: 'HTML وCSS وJavaScript بس من غير أي frameworks. فكرة ظريفة اتحولت للعبة صغيرة تتلعب فعلًا.',
        },
    },
    {
        id: 7, name: 'ElZero HTML & CSS Templates', year: '2024', category: 'learning', visibility: 'public',
        stack: ['HTML', 'CSS'],
        extraLinks: [
            { label: 'Leon', href: 'https://github.com/PolaBahaa/HTML_CSS_Leon' },
            { label: 'Kasper', href: 'https://github.com/PolaBahaa/HTML_CSS_Kasper' },
            { label: 'ViSi0N', href: 'https://github.com/PolaBahaa/HTML_CSS_ViSi0N' },
            { label: 'Dashboard', href: 'https://github.com/PolaBahaa/HTML_CSS_Dashboard' },
        ],
        tagline: { en: 'Four complete website templates built while mastering HTML & CSS.', ar: 'أربع قوالب مواقع كاملة اتبنوا أثناء إتقان HTML وCSS.' },
        detail: {
            en: 'Leon, Kasper, ViSi0N and Dashboard — full multi-section page templates from ElZero Web School, plus a set of CSS assignments.',
            ar: 'Leon وKasper وViSi0N وDashboard — قوالب صفحات كاملة متعددة الأقسام من ElZero Web School، بالإضافة لمجموعة تكليفات CSS.',
        },
    },
];

const skills = ['TypeScript', 'JavaScript', 'React', 'HTML', 'CSS', 'Tailwind CSS', 'Vite', 'Firebase', 'Supabase', 'Three.js', 'Capacitor', 'Express', 'Git & GitHub'];

const skillUse: Record<string, number[]> = {
    'TypeScript': [1, 2, 3, 4], 'JavaScript': [5, 6], 'React': [1, 2, 3, 4], 'HTML': [6, 7], 'CSS': [6, 7],
    'Tailwind CSS': [2, 3, 4], 'Vite': [1, 2, 3, 4], 'Firebase': [2], 'Supabase': [1], 'Three.js': [3],
    'Capacitor': [5], 'Express': [2], 'Git & GitHub': [1, 2, 3, 4, 5, 6, 7],
};

type Sticker = { pos: string; kind: 'pill' | 'circle'; tone: 'teal' | 'yellow' | 'orange' | 'pink' | 'green'; tilt: string; delay: string; lines: Record<Lang, string[]>; sub?: Record<Lang, string> };

const stickers: Sticker[] = [
    { pos: 'pb-pos-1', kind: 'circle', tone: 'teal', tilt: '-7deg', delay: '0.05s', lines: { en: ['FRONT-END'], ar: ['واجهات', 'أمامية'] }, sub: { en: 'UI · CODE · DETAIL', ar: 'كود · تفاصيل · ذوق' } },
    { pos: 'pb-pos-2', kind: 'pill', tone: 'yellow', tilt: '-6deg', delay: '0.15s', lines: { en: ['REACT ↗', 'TYPESCRIPT'], ar: ['React ↗', 'TypeScript'] } },
    { pos: 'pb-pos-3', kind: 'pill', tone: 'orange', tilt: '5deg', delay: '0.25s', lines: { en: ['M ⟶TION &', 'INTERACTION'], ar: ['حركة ⟶', 'وتفاعل'] } },
    { pos: 'pb-pos-4', kind: 'pill', tone: 'pink', tilt: '6deg', delay: '0.35s', lines: { en: ['RESPONSIVE', 'DESIGN ©'], ar: ['تصميم', 'متجاوب ©'] } },
    { pos: 'pb-pos-5', kind: 'pill', tone: 'teal', tilt: '-5deg', delay: '0.45s', lines: { en: ['WEB & ANDROID', "✳ '26"], ar: ['ويب وأندرويد', "✳ '26"] } },
    { pos: 'pb-pos-6', kind: 'circle', tone: 'green', tilt: '8deg', delay: '0.55s', lines: { en: ['GAME', 'DEV'], ar: ['تطوير', 'ألعاب'] }, sub: { en: '· WEB · 3D ·', ar: '· ويب · 3D ·' } },
];

const STR = {
    en: {
        nav: { projects: 'Projects', journey: 'Journey', skills: 'Skills', contact: 'Contact' },
        brandRole: 'Front-end developer',
        eyebrow: 'Interactive portfolio · 2026',
        roles: ['Front-end developer', 'React & TypeScript builder', 'Game developer', 'Design-driven coder'],
        introA: 'I\'m currently building AMAL-Academy, a complete courses academy platform, with React, TypeScript and Supabase.',
        introB: 'I build interactive web experiences — from playful games and a real-time 3D museum to full platforms.',
        getInTouch: 'Get in touch',
        heroNote: 'Every control on this page works: try the filters, open a project, tap a skill, or switch the language.',
        stats: { repos: 'Repositories on GitHub', publicRepos: 'Public projects', showcased: 'Showcased here', tech: 'Technologies in use' },
        projectsLabel: 'Selected work',
        projectsHeading: 'Projects',
        projectsChip: (n: number) => `${n} builds ↗`,
        projectsIntro: 'Real repositories from my GitHub — every card opens for the full story.',
        filters: { all: 'All', platform: 'Platforms', app: 'Apps & games', learning: 'Learning' },
        details: 'Details',
        inDevelopment: 'In development',
        privateRepo: 'Private repo',
        builtWith: 'Built with',
        repositories: 'Repositories',
        skillHighlight: (s: string) => `Highlighting projects that use ${s}. Tap the skill again to clear.`,
        journeyLabel: 'The road so far',
        journeyHeading: 'Journey',
        journeyChip: (from: string, to: string) => `${from} → ${to}`,
        journey: [
            { year: '2024', text: 'Foundations — HTML & CSS templates from ElZero Web School: Leon, Kasper, ViSi0N and Dashboard, plus a full set of CSS assignments.' },
            { year: '2025', text: 'First game — Faar-Counter, a funny rat-hitting counter game with an Arabic interface.' },
            { year: '2026', text: 'Full apps in React and TypeScript — a memory game for Android, a gamified podcast, a 3D museum and a competitions app.' },
            { year: 'Today', text: 'AMAL-Academy — a complete courses academy platform, in active development.' },
        ],
        skillsLabel: 'The toolbox',
        skillsHeading: 'Skills',
        skillsChip: (n: number) => `${n} tools ✳`,
        skillsHint: 'Tap a skill to highlight the projects that use it.',
        nowLabel: 'Right now',
        nowHeading: 'Currently building',
        nowTitle: 'AMAL-Academy',
        nowText: 'A courses academy platform with courses and chapters, video lessons, student enrollments, roles and permissions — plus automated tests guarding the core flows.',
        nowChips: ['Courses & chapters', 'Video lessons', 'Enrollments', 'Roles & permissions', 'Automated tests'],
        contactLabel: 'Say hello',
        contactHeading: 'Contact',
        contactText: 'The verified place to find me and my work is GitHub — every project on this page links back to its source there.',
        copyGithub: 'Copy GitHub link',
        contactGithub: 'GitHub profile',
        closing: 'Project facts verified from Pola\'s GitHub on 22 Nov 2026.',
    },
    ar: {
        nav: { projects: 'المشاريع', journey: 'الرحلة', skills: 'المهارات', contact: 'تواصل' },
        brandRole: 'مطوّر واجهات أمامية',
        eyebrow: 'بورتفوليو تفاعلي · 2026',
        roles: ['مطوّر واجهات أمامية', 'بيبني بـ React وTypeScript', 'مطوّر ألعاب', 'مهووس بالتصميم'],
        introA: 'حاليًا ببني منصة AMAL-Academy — أكاديمية كورسات متكاملة — بـ React وTypeScript وSupabase.',
        introB: 'ببني تجارب ويب تفاعلية — من ألعاب خفيفة ومتحف ثلاثي الأبعاد بيترسم لحظيًا لحد منصات كاملة.',
        getInTouch: 'تواصل معايا',
        heroNote: 'كل زرار في الصفحة دي شغال: جرّب الفلاتر، افتح أي مشروع، دوس على مهارة، أو بدّل اللغة.',
        stats: { repos: 'مستودع على GitHub', publicRepos: 'مشروع عام', showcased: 'معروض هنا', tech: 'تقنية شغال بيها' },
        projectsLabel: 'أعمال مختارة',
        projectsHeading: 'المشاريع',
        projectsChip: (n: number) => `${n} مشاريع ↗`,
        projectsIntro: 'مستودعات حقيقية من GitHub بتاعي — كل كارت بيتفتح بالقصة الكاملة.',
        filters: { all: 'الكل', platform: 'منصات', app: 'تطبيقات وألعاب', learning: 'رحلة التعلم' },
        details: 'التفاصيل',
        inDevelopment: 'تحت التطوير',
        privateRepo: 'مستودع خاص',
        builtWith: 'التقنيات المستخدمة',
        repositories: 'المستودعات',
        skillHighlight: (s: string) => `بظهر المشاريع اللي استخدمت ${s}. دوس على المهارة تاني عشان تمسح التحديد.`,
        journeyLabel: 'الطريق لحد هنا',
        journeyHeading: 'الرحلة',
        journeyChip: (from: string, to: string) => `${from} ← ${to}`,
        journey: [
            { year: '2024', text: 'الأساس — قوالب HTML وCSS من ElZero Web School: Leon وKasper وViSi0N وDashboard، بالإضافة لمجموعة تكليفات CSS كاملة.' },
            { year: '2025', text: 'أول لعبة — Faar-Counter، لعبة عداد ضرب الفأر المضحكة بواجهة عربية.' },
            { year: '2026', text: 'تطبيقات كاملة بـ React وTypeScript — لعبة ذاكرة للأندرويد، وبودكاست تفاعلي، ومتحف ثلاثي الأبعاد، وتطبيق مسابقات.' },
            { year: 'دلوقتي', text: 'منصة AMAL-Academy — أكاديمية كورسات متكاملة، تحت التطوير حاليًا.' },
        ],
        skillsLabel: 'صندوق الأدوات',
        skillsHeading: 'المهارات',
        skillsChip: (n: number) => `${n} أداة ✳`,
        skillsHint: 'دوس على أي مهارة عشان تظهر المشاريع اللي استخدمتها.',
        nowLabel: 'دلوقتي',
        nowHeading: 'بشتغل على',
        nowTitle: 'AMAL-Academy',
        nowText: 'منصة أكاديمية كورسات فيها كورسات وفصول وفيديوهات وتسجيل طلاب وصلاحيات — بالإضافة لاختبارات آلية بتحمي الوظائف الأساسية.',
        nowChips: ['كورسات وفصول', 'فيديوهات تعليمية', 'تسجيل الطلاب', 'الأدوار والصلاحيات', 'اختبارات آلية'],
        contactLabel: 'قول أهلًا',
        contactHeading: 'التواصل',
        contactText: 'المكان المؤكد للوصول لي ولشغلي هو GitHub — كل مشروع في الصفحة دي موصول بمصدره هناك.',
        copyGithub: 'انسخ لينك GitHub',
        contactGithub: 'حساب GitHub',
        closing: 'معلومات المشاريع مأخوذة من GitHub بتاع بولا بتاريخ 22 نوفمبر 2026.',
    },
};

function Counter({ to }: { to: number }) {
    const [n, setN] = useState(0);
    useEffect(() => {
        let raf = 0;
        const start = performance.now();
        const tick = (t: number) => {
            const p = Math.min(1, (t - start) / 1200);
            setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [to]);
    return <span className="pb-stat-num">{n}</span>;
}

function Rotator({ words }: { words: string[] }) {
    const [i, setI] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setI(v => (v + 1) % words.length), 2400);
        return () => clearInterval(id);
    }, [words.length]);
    return <span key={`${words[0]}-${i}`} className="pb-rotator">{words[i]}</span>;
}

function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function SectionChip({ tone, tilt, children }: { tone: 'teal' | 'yellow' | 'orange' | 'pink' | 'green'; tilt: string; children: React.ReactNode }) {
    return <span className={`pb-section-chip pb-st-${tone}`} style={{ '--tilt': tilt } as React.CSSProperties}>{children}</span>;
}

export function App() {
    const [langRaw, setLang, saved] = useLocalState('pola-portfolio.lang.v1', 'en');
    const lang: Lang = langRaw === 'ar' ? 'ar' : 'en';
    const t = STR[lang];
    const chooseLang = (v: Lang) => { if (saved.ready) setLang(v); };

    const [filter, setFilter] = useState<'all' | Category>('all');
    const [activeSkill, setActiveSkill] = useState<string | null>(null);
    const [openId, setOpenId] = useState<number | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const d = dialogRef.current;
        if (d && openId != null && !d.open) d.showModal();
    }, [openId]);

    // Scroll-reveal: sections, cards and timeline items rise in as they enter view.
    useEffect(() => {
        const els = Array.from(document.querySelectorAll('.pb-reveal:not(.pb-in)'));
        if (!('IntersectionObserver' in window)) {
            els.forEach(e => e.classList.add('pb-in'));
            return;
        }
        const io = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (en.isIntersecting) {
                    const el = en.target as HTMLElement;
                    const d = el.getAttribute('data-delay');
                    if (d) {
                        el.style.transitionDelay = d;
                        setTimeout(() => { el.style.transitionDelay = ''; el.classList.add('pb-done'); }, 1100);
                    }
                    el.classList.add('pb-in');
                    io.unobserve(el);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
        els.forEach(e => io.observe(e));
        return () => io.disconnect();
    }, [lang, filter, activeSkill]);

    const pickSkill = (s: string) => {
        setActiveSkill(cur => cur === s ? null : s);
        if (activeSkill !== s) scrollToId('pb-projects');
    };

    const visible = projects.filter(p => filter === 'all' || p.category === filter);
    const openProject = openId == null ? undefined : projects.find(p => p.id === openId);
    const githubUrl = 'https://github.com/PolaBahaa';

    return <div id="pb-top" className="pb-root">
        <FileCard lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="pb-hero">
                <nav className="pb-nav" aria-label="Portfolio sections">
                    <button type="button" className="pb-brand" onClick={() => scrollToId('pb-top')} aria-label="Pola Bahaa — back to top">
                        <span className="pb-brand-mark" aria-hidden="true">PB</span>
                        <span className="pb-brand-text">Pola Bahaa<span className="pb-brand-role">{t.brandRole}</span></span>
                    </button>
                    <div className="pb-nav-links">
                        <button type="button" className="pb-nav-link" onClick={() => scrollToId('pb-projects')}>{t.nav.projects}</button>
                        <button type="button" className="pb-nav-link" onClick={() => scrollToId('pb-journey')}>{t.nav.journey}</button>
                        <button type="button" className="pb-nav-link" onClick={() => scrollToId('pb-skills')}>{t.nav.skills}</button>
                        <button type="button" className="pb-nav-link" onClick={() => scrollToId('pb-contact')}>{t.nav.contact}</button>
                    </div>
                    <div className="pb-lang" role="group" aria-label="Language">
                        <button type="button" aria-pressed={lang === 'en'} onClick={() => chooseLang('en')}>EN</button>
                        <button type="button" aria-pressed={lang === 'ar'} onClick={() => chooseLang('ar')}>عربي</button>
                    </div>
                </nav>
                {saved.message ? <Caption>{saved.message}</Caption> : null}

                <p className="pb-eyebrow">{t.eyebrow}</p>
                <h1 className="pb-hero-title">POLA BAHAA</h1>
                <div className="pb-hero-role"><Rotator words={t.roles} /></div>

                <div className="pb-hero-sub">
                    <p className="pb-hero-para">{t.introA}</p>
                    <p className="pb-hero-para">{t.introB}</p>
                    <button type="button" className="pb-touch" onClick={() => scrollToId('pb-contact')}><span className="file-hover-underline">{t.getInTouch}</span> <span className="pb-touch-arrow" aria-hidden="true">→</span></button>
                </div>

                <div className="pb-gridfield">
                    <div className="pb-portrait"><img src={portraitCutout} alt={lang === 'ar' ? 'صورة بولا' : 'Portrait of Pola'} /></div>
                    {stickers.map(s => <div key={s.pos} className={`pb-sticker pb-st-${s.kind} pb-st-${s.tone} ${s.pos}`} style={{ '--tilt': s.tilt, animationDelay: s.delay } as React.CSSProperties}>
                        {s.lines[lang].map((line, i) => <span key={i} className="pb-sticker-line">{line}</span>)}
                        {s.sub ? <span className="pb-sticker-sub">{s.sub[lang]}</span> : null}
                    </div>)}
                </div>

                <div className="pb-ticker" dir="ltr" aria-hidden="true">
                    <div className="pb-ticker-track">{[...skills, ...skills].map((s, i) => <span key={i} className="pb-ticker-item">{s}</span>)}</div>
                </div>
                <p className="pb-hero-note">{t.heroNote}</p>
            </div>

            <section className="pb-stats pb-reveal" aria-label="Numbers">
                <div className="pb-stat"><Counter to={12} /><span className="pb-stat-label">{t.stats.repos}</span></div>
                <div className="pb-stat"><Counter to={10} /><span className="pb-stat-label">{t.stats.publicRepos}</span></div>
                <div className="pb-stat"><Counter to={projects.length} /><span className="pb-stat-label">{t.stats.showcased}</span></div>
                <div className="pb-stat"><Counter to={skills.length} /><span className="pb-stat-label">{t.stats.tech}</span></div>
            </section>

            <section className="pb-section" id="pb-projects">
                <div className="pb-section-head pb-reveal">
                    <div className="pb-section-head-text">
                        <p className="pb-label">{t.projectsLabel}</p>
                        <h2 className="pb-heading">{t.projectsHeading}</h2>
                    </div>
                    <SectionChip tone="yellow" tilt="5deg">{t.projectsChip(projects.length)}</SectionChip>
                </div>
                <p className="pb-intro pb-reveal">{t.projectsIntro}</p>
                <div className="pb-chips pb-reveal" role="group" aria-label="Filter projects">
                    {(['all', 'platform', 'app', 'learning'] as const).map(c =>
                        <button key={c} type="button" className={`pb-chip${filter === c ? ' is-active' : ''}`} aria-pressed={filter === c} onClick={() => setFilter(c)}>{t.filters[c]}</button>
                    )}
                </div>
                {activeSkill ? <Caption>{t.skillHighlight(activeSkill)}</Caption> : null}
                <div className="pb-grid">
                    {visible.map((p, i) => {
                        const used = activeSkill != null && (skillUse[activeSkill] ?? []).includes(p.id);
                        const dim = activeSkill != null && !used;
                        return <article key={p.id} className={`pb-card pb-reveal${used ? ' pb-glow' : ''}${dim ? ' pb-dim' : ''}`} data-delay={`${Math.min(i, 5) * 70}ms`}>
                            <div className="pb-card-head">
                                <h3 className="pb-card-name">{p.name}</h3>
                                <span className="pb-card-year">{p.year}</span>
                            </div>
                            <div className="pb-card-badges">
                                {p.status === 'development' ? <span className="pb-badge pb-badge-dev">{t.inDevelopment}</span> : null}
                                {p.visibility === 'private' ? <span className="pb-badge">{t.privateRepo}</span> : null}
                            </div>
                            <p className="pb-card-tagline">{p.tagline[lang]}</p>
                            <div className="pb-card-stack">{p.stack.map(s => <span key={s} className="pb-tag">{s}</span>)}</div>
                            <div className="pb-card-actions">
                                <button type="button" className="pb-textbtn" onClick={() => setOpenId(p.id)}><span className="file-hover-underline">{t.details}</span></button>
                                {p.url ? <ButtonLink href={p.url} variant="ghost" compact>GitHub</ButtonLink> : null}
                            </div>
                        </article>;
                    })}
                </div>
            </section>

            <section className="pb-section" id="pb-journey">
                <div className="pb-section-head pb-reveal">
                    <div className="pb-section-head-text">
                        <p className="pb-label">{t.journeyLabel}</p>
                        <h2 className="pb-heading">{t.journeyHeading}</h2>
                    </div>
                    <SectionChip tone="teal" tilt="-5deg">{t.journeyChip(t.journey[0].year, t.journey[t.journey.length - 1].year)}</SectionChip>
                </div>
                <ol className="pb-timeline">
                    {t.journey.map((j, i) => <li key={j.year} className="pb-timeline-item pb-reveal" data-delay={`${Math.min(i, 5) * 80}ms`}>
                        <span className="pb-timeline-year">{j.year}</span>
                        <p className="pb-timeline-text">{j.text}</p>
                    </li>)}
                </ol>
            </section>

            <section className="pb-section" id="pb-skills">
                <div className="pb-section-head pb-reveal">
                    <div className="pb-section-head-text">
                        <p className="pb-label">{t.skillsLabel}</p>
                        <h2 className="pb-heading">{t.skillsHeading}</h2>
                    </div>
                    <SectionChip tone="orange" tilt="6deg">{t.skillsChip(skills.length)}</SectionChip>
                </div>
                <Caption>{t.skillsHint}</Caption>
                <div className="pb-skills pb-reveal">
                    {skills.map(s => <button key={s} type="button" className={`pb-skill${activeSkill === s ? ' is-active' : ''}`} aria-pressed={activeSkill === s} onClick={() => pickSkill(s)}>{s}</button>)}
                </div>
            </section>

            <section className="pb-section">
                <div className="pb-now pb-reveal">
                    <p className="pb-now-label">{t.nowLabel}</p>
                    <h2 className="pb-now-heading">{t.nowHeading}</h2>
                    <p className="pb-now-title">{t.nowTitle}</p>
                    <p className="pb-now-text">{t.nowText}</p>
                    <div className="pb-now-chips">{t.nowChips.map(c => <span key={c} className="pb-now-chip">{c}</span>)}</div>
                </div>
            </section>

            <section className="pb-section pb-contact-block" id="pb-contact">
                <div className="pb-contact-inner pb-reveal">
                    <p className="pb-label pb-label-onDark">{t.contactLabel}</p>
                    <h2 className="pb-contact-heading">{t.contactHeading}</h2>
                    <p className="pb-contact-text">{t.contactText}</p>
                    <div className="pb-contact-actions">
                        <ButtonLink href={githubUrl} variant="primary" pill>{t.contactGithub}</ButtonLink>
                        <CopyButton text={githubUrl} label={t.copyGithub} variant="secondary" />
                    </div>
                </div>
            </section>

            <Closing>{t.closing}</Closing>
        </FileCard>

        <dialog ref={dialogRef} className="pb-dialog" onClose={() => setOpenId(null)} onClick={e => { if (e.target === dialogRef.current) dialogRef.current?.close(); }}>
            {openProject ? <div className="pb-dialog-body">
                <div className="pb-dialog-close"><CloseButton onClick={() => dialogRef.current?.close()} /></div>
                <div className="pb-card-head">
                    <h3 className="pb-dialog-name">{openProject.name}</h3>
                    <span className="pb-card-year">{openProject.year}</span>
                </div>
                <div className="pb-card-badges">
                    {openProject.status === 'development' ? <span className="pb-badge pb-badge-dev">{t.inDevelopment}</span> : null}
                    {openProject.visibility === 'private' ? <span className="pb-badge">{t.privateRepo}</span> : null}
                </div>
                <p className="pb-dialog-tagline">{openProject.tagline[lang]}</p>
                <p className="pb-dialog-detail">{openProject.detail[lang]}</p>
                <p className="pb-dialog-sublabel">{t.builtWith}</p>
                <div className="pb-card-stack">{openProject.stack.map(s => <span key={s} className="pb-tag">{s}</span>)}</div>
                {openProject.url || openProject.extraLinks ? <>
                    <p className="pb-dialog-sublabel">{t.repositories}</p>
                    <div className="pb-dialog-links">
                        {openProject.url ? <TextLink href={openProject.url}>GitHub — {openProject.name}</TextLink> : null}
                        {openProject.extraLinks?.map(l => <TextLink key={l.href} href={l.href}>GitHub — {l.label}</TextLink>)}
                    </div>
                </> : null}
            </div> : null}
        </dialog>
    </div>;
}
