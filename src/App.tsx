import React, { useEffect, useRef, useState } from 'react';
import { ButtonLink, Caption, CloseButton, Closing, CopyButton, FileCard, TextLink, useLocalState } from './kit';
import { initialRepos, loadPublicRepos, repoToProject } from './github';
import brandLogo from './pola-logo.svg';
import portraitCutout from './photos/pola-portrait.png';

type Lang = 'en' | 'ar';
type Category = 'platform' | 'app' | 'learning';

export type Project = {
    id: number;
    name: string;
    year: string;
    category: Category;
    status?: 'development';
    url?: string;
    stack: string[];
    tagline: Record<Lang, string>;
    detail: Record<Lang, string>;
};

// Curated presentation for known public repositories. The live grid is driven
// entirely by the GitHub API; this only enriches matching public repos.
const curatedProjects: Project[] = [
    {
        id: 1, name: 'ViSi0N-PORTFOLIO', year: '2026', category: 'app', url: 'https://github.com/PolaBahaa/ViSi0N-PORTFOLIO',
        stack: ['TypeScript'],
        tagline: { en: 'This site: an interactive bilingual portfolio, live on GitHub Pages.', ar: 'الموقع ده نفسه: بورتفوليو تفاعلي بلغتين، لايف على GitHub Pages.' },
        detail: {
            en: 'The source behind this page: React, TypeScript and hand-written CSS, synced live with the public GitHub repositories.',
            ar: 'الكود ورا الصفحة دي: React وTypeScript وCSS مكتوب بالإيد، متزامن لايف مع مستودعات GitHub العامة.',
        },
    },
    {
        id: 2, name: 'HAMOURY', year: '2026', category: 'app', url: 'https://github.com/PolaBahaa/HAMOURY',
        stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Firebase'],
        tagline: { en: 'A fun activities and competitions app built for a church summer trip.', ar: 'تطبيق أنشطة ومسابقات ممتع، معمول لرحلة صيفية للكنيسة.' },
        detail: {
            en: 'Runs activities and competitions on real event days. Built with Firebase and QR code scanning, with confetti celebrations baked in.',
            ar: 'بيشغّل أنشطة ومسابقات في أيام الرحلة فعلًا. مبني بـ Firebase ومسح رموز QR، ومعاه احتفالات كونفيتي جاهزة.',
        },
    },
    {
        id: 3, name: 'Revelation-Museum', year: '2026', category: 'app', url: 'https://github.com/PolaBahaa/Revelation-Museum',
        stack: ['React', 'TypeScript', 'Three.js', 'Tailwind CSS'],
        tagline: { en: 'An interactive 3D museum experience on the web.', ar: 'تجربة متحف تفاعلي ثلاثي الأبعاد على الويب.' },
        detail: {
            en: 'A museum experience rendered in real time with Three.js, with animated scenes and motion throughout.',
            ar: 'تجربة متحف بتترسم في الوقت الحقيقي بتقنية Three.js، مع مشاهد متحركة وحركة في كل حتة.',
        },
    },
    {
        id: 4, name: 'MMH-Podcast', year: '2026', category: 'app', url: 'https://github.com/PolaBahaa/MMH-Podcast',
        stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
        tagline: { en: 'An interactive Christian podcast experience made for SPP 2026.', ar: 'تجربة بودكاست مسيحي تفاعلية، معمولة لـ SPP 2026.' },
        detail: {
            en: 'Podcast listening turned into an interactive experience, built as a modern single-page React app.',
            ar: 'سماع البودكاست بقى تجربة تفاعلية، مبنية كتطبيق React حديث من صفحة واحدة.',
        },
    },
];

const skills = ['JavaScript', 'TypeScript', 'C#', '.NET', 'React', 'Node.js', 'Express', 'HTML', 'CSS', 'Tailwind CSS', 'Vite', 'Firebase', 'Supabase', 'Three.js', 'Capacitor', 'Git & GitHub'];

type Sticker = { pos: string; kind: 'pill' | 'circle'; tone: 'teal' | 'yellow' | 'orange' | 'pink' | 'green'; tilt: string; delay: string; lines: Record<Lang, string[]>; sub?: Record<Lang, string> };

const stickers: Sticker[] = [
    { pos: 'pb-pos-1', kind: 'circle', tone: 'teal', tilt: '-7deg', delay: '0.05s', lines: { en: ['FULL', 'STACK'], ar: ['تطوير', 'ويب'] }, sub: { en: 'JS · C# · WEB', ar: 'JS · C# · WEB' } },
    { pos: 'pb-pos-2', kind: 'pill', tone: 'yellow', tilt: '-6deg', delay: '0.15s', lines: { en: ['REACT ↗', 'TYPESCRIPT'], ar: ['React ↗', 'TypeScript'] } },
    { pos: 'pb-pos-3', kind: 'pill', tone: 'orange', tilt: '5deg', delay: '0.25s', lines: { en: ['M ⟶TION &', 'INTERACTION'], ar: ['حركة ⟶', 'وتفاعل'] } },
    { pos: 'pb-pos-4', kind: 'pill', tone: 'pink', tilt: '6deg', delay: '0.35s', lines: { en: ['RESPONSIVE', 'DESIGN ©'], ar: ['تصميم', 'متجاوب ©'] } },
    { pos: 'pb-pos-5', kind: 'pill', tone: 'teal', tilt: '-5deg', delay: '0.45s', lines: { en: ['.NET · NODE', "✳ '26"], ar: ['.NET · Node', "✳ '26"] } },
];

const STR = {
    en: {
        nav: { projects: 'Projects', journey: 'Journey', skills: 'Skills', contact: 'Contact' },
        brandRole: 'Full-stack developer',
        eyebrow: '"If you want to test a man\'s character, give him power" - Lincoln',
        roles: ['Full-stack web developer', 'JavaScript & C# engineer', 'React · .NET · Node.js', 'Coding since childhood'],
        introA: 'Programming has been my world since childhood. Years spent across different technologies and operating systems turned curiosity into craft.',
        introB: 'Today I design and build full-stack web products with JavaScript and C#: React interfaces, .NET and Node.js services, end to end.',
        getInTouch: 'Start a project',
        stats: { repos: 'Public repositories', domains: 'Project domains', tech: 'Technologies in use' },
        projectsLabel: 'Selected work',
        projectsHeading: 'Projects',
        projectsChip: (n: number) => `${n} projects ↗`,
        projectsIntro: 'Shipped work, live on GitHub. Every card opens the full story and the source behind it.',
        filters: { all: 'All', platform: 'Platforms', app: 'Apps', learning: 'Learning' } as Record<'all' | Category, string>,
        details: 'Details',
        inDevelopment: 'In development',
        builtWith: 'Built with',
        repositories: 'Repositories',
        skillHighlight: (s: string) => `Highlighting projects that use ${s}. Tap the skill again to clear.`,
        journeyLabel: 'The road so far',
        journeyHeading: 'Journey',
        journeyChip: (from: string, to: string) => `${from} → ${to}`,
        journey: [
            { year: 'Early days', text: 'Started programming as a kid and never stopped. Years across different technologies and operating systems built a deep technical base.' },
            { year: '2019', text: 'The start of intensive, structured programming study.' },
            { year: 'Along the way', text: 'More than 6 Python certificates and more than 11 intensive frontend and JavaScript courses from different providers, a Full-Stack .NET certificate from ITI (Information Technology Institute) through its annual student training, and a Full-Stack JavaScript certificate from EgyptFWD with Udacity.' },
            { year: '2024', text: 'Foundations: four complete HTML & CSS website templates from ElZero Web School (Leon, Kasper, ViSi0N, Dashboard), plus a full set of CSS assignments.' },
            { year: '2026', text: 'Full apps in React and TypeScript: an interactive podcast, a real-time 3D museum and a competitions app that runs live events.' },
            { year: 'Today', text: 'Going deeper into full-stack: modern JavaScript frameworks up front, with C#/.NET and Node.js behind them.' },
        ],
        skillsLabel: 'The toolbox',
        skillsHeading: 'Skills',
        skillsChip: (n: number) => `${n} tools ✳`,
        contactLabel: 'Say hello',
        contactHeading: 'Contact',
        contactText: 'Have a project or an idea worth building? Send it over and we can talk.',
        contactLabels: { email: 'Email', call: 'Call', whatsapp: 'WhatsApp', linkedin: 'LinkedIn', facebook: 'Facebook' },
        whatsappCta: 'Send a message',
        copyGithub: 'Copy GitHub link',
        contactGithub: 'GitHub profile',
        rights: { name: 'Pola Bahaa', reserved: 'All rights reserved.' },
    },
    ar: {
        nav: { projects: 'المشاريع', journey: 'الرحلة', skills: 'المهارات', contact: 'تواصل' },
        brandRole: 'مطوّر Full-Stack',
        eyebrow: '"لو عايز تختبر معدن الراجل، اديله سلطة" - لينكولن',
        roles: ['مطوّر ويب Full-Stack', 'بشتغل بـ JavaScript وC#', 'React · .NET · Node.js', 'ببرمج من وأنا طفل'],
        introA: 'البرمجة عالمي من وأنا طفل. سنين بشتغل فيها مع تكنولوجيا وأنظمة تشغيل مختلفة، لحد ما الفضول بقى حرفة.',
        introB: 'دلوقتي بصمّم وببني منتجات ويب Full-Stack بـ JavaScript وC#: واجهات React، وخدمات .NET وNode.js، من أول سطر لحد التسليم.',
        getInTouch: 'يلا نبدأ مشروعك',
        stats: { repos: 'مستودع عام على GitHub', domains: 'مجال للمشاريع', tech: 'تقنية شغال بيها' },
        projectsLabel: 'أعمال مختارة',
        projectsHeading: 'المشاريع',
        projectsChip: (n: number) => `${n} مشروع ↗`,
        projectsIntro: 'شغل حقيقي متسلّم وموجود على GitHub. كل كارت بيتفتح بالقصة الكاملة والكود اللي وراها.',
        filters: { all: 'الكل', platform: 'منصات', app: 'تطبيقات', learning: 'رحلة التعلم' } as Record<'all' | Category, string>,
        details: 'التفاصيل',
        inDevelopment: 'تحت التطوير',
        builtWith: 'التقنيات المستخدمة',
        repositories: 'المستودعات',
        skillHighlight: (s: string) => `بظهر المشاريع اللي استخدمت ${s}. دوس على المهارة تاني عشان تمسح التحديد.`,
        journeyLabel: 'الطريق لحد هنا',
        journeyHeading: 'الرحلة',
        journeyChip: (from: string, to: string) => `${from} ← ${to}`,
        journey: [
            { year: 'البداية', text: 'بدأت أبرمج وأنا طفل ومكمّل من ساعتها. سنين مع تكنولوجيا وأنظمة تشغيل مختلفة بنتلي قاعدة تقنية قوية.' },
            { year: '2019', text: 'بداية الدراسة والتدريب المكثّف المنظّم في البرمجة.' },
            { year: 'على مدار الرحلة', text: 'أكتر من 6 شهادات في Python، وأكتر من 11 كورس مكثّف في الفرونت إند وJavaScript من جهات مختلفة، وشهادة Full-Stack .NET من ITI (معهد تكنولوجيا المعلومات) من خلال تدريبه السنوي للطلاب، وشهادة Full-Stack بـ JavaScript من EgyptFWD وUdacity.' },
            { year: '2024', text: 'الأساس: أربع قوالب مواقع كاملة بـ HTML وCSS من ElZero Web School (Leon وKasper وViSi0N وDashboard)، مع مجموعة تكليفات CSS كاملة.' },
            { year: '2026', text: 'تطبيقات كاملة بـ React وTypeScript: بودكاست تفاعلي، ومتحف 3D بيترسم لحظيًا، وتطبيق مسابقات بيشتغل في الفعاليات الحقيقية.' },
            { year: 'دلوقتي', text: 'بتعمّق أكتر في الـ Full-Stack: frameworks حديثة للواجهة، وC#/.NET وNode.js في الباك إند.' },
        ],
        skillsLabel: 'صندوق الأدوات',
        skillsHeading: 'المهارات',
        skillsChip: (n: number) => `${n} أداة ✳`,
        contactLabel: 'قول أهلًا',
        contactHeading: 'التواصل',
        contactText: 'عندك مشروع أو فكرة تستاهل تتبني؟ ابعتهالي ونكلم بعض.',
        contactLabels: { email: 'الإيميل', call: 'اتصال', whatsapp: 'واتساب', linkedin: 'لينكدإن', facebook: 'فيسبوك' },
        whatsappCta: 'ابعتلي رسالة',
        copyGithub: 'انسخ لينك GitHub',
        contactGithub: 'حساب GitHub',
        rights: { name: 'بولا بهاء', reserved: 'جميع الحقوق محفوظة.' },
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

// Playful sticker: pops in on load, shakes on hover, drops and bounces back on tap/click.
function StickerBubble({ s, lang }: { s: Sticker; lang: Lang }) {
    const [phase, setPhase] = useState<'pop' | 'idle' | 'drop'>('pop');
    const cls = phase === 'drop' ? 'pb-sticker-drop' : phase === 'idle' ? 'pb-sticker-settled' : '';
    return <div
        className={`pb-sticker pb-st-${s.kind} pb-st-${s.tone} ${s.pos}${cls ? ' ' + cls : ''}`}
        dir="auto"
        style={{ '--tilt': s.tilt, animationDelay: phase === 'pop' ? s.delay : undefined } as React.CSSProperties}
        onPointerDown={() => { if (phase !== 'drop') setPhase('drop'); }}
        onAnimationEnd={e => { if (e.animationName === 'pb-pop' || e.animationName === 'pb-drop') setPhase('idle'); }}
        role="button" tabIndex={0} aria-label={s.lines[lang].join(' ')}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (phase !== 'drop') setPhase('drop'); } }}
    >
        {s.lines[lang].map((line, i) => <span key={i} className="pb-sticker-line">{line}</span>)}
        {s.sub ? <span className="pb-sticker-sub">{s.sub[lang]}</span> : null}
    </div>;
}

// Small contact icons, colored from the site's palette.
function ContactIcon({ kind }: { kind: 'email' | 'call' | 'whatsapp' | 'linkedin' | 'facebook' }) {
    const common = { width: 20, height: 20, viewBox: '0 0 24 24', 'aria-hidden': true as const, focusable: false as const };
    switch (kind) {
        case 'email':
            return <svg {...common}><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" /></svg>;
        case 'call':
            return <svg {...common}><path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>;
        case 'whatsapp':
            return <svg {...common}>
                <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="M12 3.2a8.8 8.8 0 0 0-7.6 13.3L3.2 20.8l4.4-1.2A8.8 8.8 0 1 0 12 3.2z" />
                <path fill="currentColor" d="M9.2 8.1c.3-.3.7-.3.9.1l.7 1.2c.1.3.1.6-.1.8l-.5.5c.5 1 1.3 1.8 2.3 2.3l.5-.5c.2-.2.5-.2.8-.1l1.2.7c.4.2.4.6.1.9-.5.5-1.1.8-1.8.7-2.8-.4-5-2.6-5.4-5.4-.1-.7.2-1.4.7-1.9l.6-.3z" />
            </svg>;
        case 'linkedin':
            return <svg {...common}>
                <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <text x="12" y="16.2" textAnchor="middle" fontSize="9.5" fontWeight="800" fontFamily="inherit" fill="currentColor">in</text>
            </svg>;
        case 'facebook':
            return <svg {...common}>
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <text x="12" y="16.8" textAnchor="middle" fontSize="11" fontWeight="800" fontFamily="inherit" fill="currentColor">f</text>
            </svg>;
    }
}

export function App() {
    const [langRaw, setLang, saved] = useLocalState<Lang>('pola-portfolio.lang.v1', 'en');
    const lang: Lang = langRaw === 'ar' ? 'ar' : 'en';
    const t = STR[lang];
    const chooseLang = (v: Lang) => { if (saved.ready) setLang(v); };

    const [repos, setRepos] = useState(initialRepos);
    const [syncState, setSyncState] = useState<'loading' | 'live' | 'error'>('loading');
    const [syncVersion, setSyncVersion] = useState(0);
    useEffect(() => {
        const controller = new AbortController();
        setSyncState('loading');
        loadPublicRepos(controller.signal).then(data => {
            setRepos(data);
            setSyncState('live');
        }).catch(() => { if (!controller.signal.aborted) setSyncState('error'); });
        return () => controller.abort();
    }, [syncVersion]);
    useEffect(() => {
        const id = window.setInterval(() => setSyncVersion(v => v + 1), 60 * 60 * 1000);
        return () => window.clearInterval(id);
    }, []);
    // Public repositories only. Private work never appears here.
    const projects: Project[] = repos.map(repo => repoToProject(repo, curatedProjects));

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
    }, [lang, filter, activeSkill, repos]);

    const pickSkill = (s: string) => {
        setActiveSkill(cur => cur === s ? null : s);
        if (activeSkill !== s) scrollToId('pb-projects');
    };

    const visible = projects.filter(p => filter === 'all' || p.category === filter);
    const openProject = openId == null ? undefined : projects.find(p => p.id === openId);
    const githubUrl = 'https://github.com/PolaBahaa';
    useEffect(() => {
        if (openId != null && !projects.some(project => project.id === openId)) {
            dialogRef.current?.close();
            setOpenId(null);
        }
    }, [repos, openId]);

    // Only offer filters that actually have projects.
    const presentCategories = (['platform', 'app', 'learning'] as Category[]).filter(c => projects.some(p => p.category === c));
    const domainCount = new Set(projects.map(p => p.category)).size;

    const contactRows: { kind: 'email' | 'call' | 'whatsapp' | 'linkedin' | 'facebook'; href: string; strong: string; strongDir?: 'ltr' }[] = [
        { kind: 'email', href: 'mailto:pola.bahaa753@gmail.com', strong: 'pola.bahaa753@gmail.com', strongDir: 'ltr' },
        { kind: 'call', href: 'tel:+201284978352', strong: '+20 128 497 8352', strongDir: 'ltr' },
        { kind: 'whatsapp', href: 'https://wa.me/201284978352?text=Hi+Pola%21', strong: t.whatsappCta },
        { kind: 'linkedin', href: 'https://www.linkedin.com/in/pola-bahaa/', strong: 'Pola Bahaa' },
        { kind: 'facebook', href: 'https://www.facebook.com/pola.vision/', strong: 'Pola ViSi0N' },
    ];

    return <div id="pb-top" className="pb-root">
        <FileCard lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="pb-hero">
                <nav className="pb-nav" aria-label="Portfolio sections">
                    <button type="button" className="pb-brand" onClick={() => scrollToId('pb-top')} aria-label="Pola Bahaa, back to top">
                        <img className="pb-brand-logo" src={brandLogo} alt="" aria-hidden="true" />
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
                    {stickers.map(s => <StickerBubble key={s.pos} s={s} lang={lang} />)}
                </div>

                <div className="pb-ticker" dir="ltr" aria-hidden="true">
                    <div className="pb-ticker-track">{[...skills, ...skills].map((s, i) => <span key={i} className="pb-ticker-item">{s}</span>)}</div>
                </div>
            </div>

            <section className="pb-stats pb-reveal" aria-label="Numbers">
                <div className="pb-stat"><Counter to={repos.length} /><span className="pb-stat-label">{t.stats.repos}</span></div>
                <div className="pb-stat"><Counter to={domainCount} /><span className="pb-stat-label">{t.stats.domains}</span></div>
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
                <div className="pb-sync" role="status">
                    <span className={`pb-sync-dot pb-sync-${syncState}`} aria-hidden="true" />
                    <span>{lang === 'ar'
                        ? (syncState === 'live' ? 'متزامن مع مستودعات GitHub العامة' : syncState === 'loading' ? 'جاري تحديث المشاريع من GitHub…' : 'تعذر التحديث. المعروض آخر نسخة متاحة، وقد لا يشمل تغييرات حديثة.')
                        : (syncState === 'live' ? 'Synced with public GitHub repositories' : syncState === 'loading' ? 'Updating projects from GitHub…' : 'Update unavailable. Showing the last available snapshot, which may be out of date.')}</span>
                    <button type="button" disabled={syncState === 'loading'} onClick={() => setSyncVersion(v => v + 1)}>{lang === 'ar' ? 'تحديث' : 'Refresh'}</button>
                </div>
                <div className="pb-chips pb-reveal" role="group" aria-label="Filter projects">
                    <button type="button" className={`pb-chip${filter === 'all' ? ' is-active' : ''}`} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>{t.filters.all}</button>
                    {presentCategories.map(c =>
                        <button key={c} type="button" className={`pb-chip${filter === c ? ' is-active' : ''}`} aria-pressed={filter === c} onClick={() => setFilter(c)}>{t.filters[c]}</button>
                    )}
                </div>
                {activeSkill ? <Caption>{t.skillHighlight(activeSkill)}</Caption> : null}
                <div className="pb-grid">
                    {visible.map((p, i) => {
                        const used = activeSkill != null && (activeSkill === 'Git & GitHub' || p.stack.includes(activeSkill));
                        const dim = activeSkill != null && !used;
                        return <article key={p.id} className={`pb-card pb-reveal${used ? ' pb-glow' : ''}${dim ? ' pb-dim' : ''}`} data-delay={`${Math.min(i, 5) * 70}ms`}>
                            <div className="pb-card-head">
                                <h3 className="pb-card-name">{p.name}</h3>
                                <span className="pb-card-year">{p.year}</span>
                            </div>
                            <div className="pb-card-badges">
                                {p.status === 'development' ? <span className="pb-badge pb-badge-dev">{t.inDevelopment}</span> : null}
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
                <div className="pb-skills pb-reveal">
                    {skills.map(s => <button key={s} type="button" className={`pb-skill${activeSkill === s ? ' is-active' : ''}`} aria-pressed={activeSkill === s} onClick={() => pickSkill(s)}>{s}</button>)}
                </div>
            </section>

            <section className="pb-section pb-contact-block" id="pb-contact">
                <div className="pb-contact-inner pb-reveal">
                    <p className="pb-label pb-label-onDark">{t.contactLabel}</p>
                    <h2 className="pb-contact-heading">{t.contactHeading}</h2>
                    <p className="pb-contact-text">{t.contactText}</p>
                    <div className="pb-contact-grid">
                        {contactRows.map(row =>
                            <a key={row.kind} className={`pb-contact-link pb-contact-${row.kind}`} href={row.href} {...(row.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                                <span className="pb-contact-icon" aria-hidden="true"><ContactIcon kind={row.kind} /></span>
                                <span className="pb-contact-kind">{t.contactLabels[row.kind]}</span>
                                <strong dir={row.strongDir}>{row.strong}</strong>
                                <span className="pb-contact-arrow" aria-hidden="true">↗</span>
                            </a>
                        )}
                    </div>
                    <div className="pb-contact-actions">
                        <ButtonLink href={githubUrl} variant="primary" pill>{t.contactGithub}</ButtonLink>
                        <CopyButton text={githubUrl} label={t.copyGithub} variant="secondary" />
                    </div>
                </div>
            </section>

            <Closing><img className="pb-footer-logo" src={brandLogo} alt="Pola Bahaa logo" /><span className="pb-rights"><span dir="ltr">© 2026</span> {t.rights.name}. {t.rights.reserved}</span></Closing>
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
                </div>
                <p className="pb-dialog-tagline">{openProject.tagline[lang]}</p>
                <p className="pb-dialog-detail">{openProject.detail[lang]}</p>
                <p className="pb-dialog-sublabel">{t.builtWith}</p>
                <div className="pb-card-stack">{openProject.stack.map(s => <span key={s} className="pb-tag">{s}</span>)}</div>
                {openProject.url ? <>
                    <p className="pb-dialog-sublabel">{t.repositories}</p>
                    <div className="pb-dialog-links">
                        <TextLink href={openProject.url}>GitHub · {openProject.name}</TextLink>
                    </div>
                </> : null}
            </div> : null}
        </dialog>
    </div>;
}
