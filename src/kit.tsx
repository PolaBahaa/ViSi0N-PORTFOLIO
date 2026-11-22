import React, { useCallback, useState } from 'react';

// Standalone replacements for the hosted-page UI kit this project was
// originally composed with. Same class names, so style.css applies unchanged.

export function FileRouter({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

export function FileCard({ lang, dir, children }: { lang?: string; dir?: 'ltr' | 'rtl'; children: React.ReactNode }) {
    return <div className="file-card" lang={lang} dir={dir}>{children}</div>;
}

export function Caption({ children }: { children: React.ReactNode }) {
    return <p className="file-caption">{children}</p>;
}

export function CloseButton({ onClick }: { onClick?: () => void }) {
    return <button type="button" className="file-close" aria-label="Close" onClick={onClick}>×</button>;
}

export function Closing({ children }: { children: React.ReactNode }) {
    return <footer className="file-closing">{children}</footer>;
}

type Variant = 'primary' | 'secondary' | 'ghost';

function buttonClass(variant?: Variant, compact?: boolean, pill?: boolean) {
    return ['file-button', variant ? `file-button-${variant}` : '', compact ? 'file-compact' : '', pill ? 'file-pill' : '']
        .filter(Boolean).join(' ');
}

export function ButtonLink({ href, variant, compact, pill, children }: {
    href: string; variant?: Variant; compact?: boolean; pill?: boolean; children: React.ReactNode;
}) {
    return <a className={buttonClass(variant, compact, pill)} href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a className="file-text-link" href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

export function CopyButton({ text, label, variant }: { text: string; label: string; variant?: Variant }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch { /* no-op */ }
            document.body.removeChild(ta);
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };
    return <button type="button" className={buttonClass(variant ?? 'secondary')} onClick={() => { void copy(); }}>
        {copied ? '✓ ' : ''}{label}
    </button>;
}

// Device-local persistence backed by localStorage.
export function useLocalState<T extends string>(key: string, initial: T): [T, (v: T) => void, { ready: boolean; message: string | null }] {
    const [value, setValue] = useState<T>(() => {
        try {
            const v = window.localStorage.getItem(key);
            return (v != null ? (v as T) : initial);
        } catch {
            return initial;
        }
    });
    const set = useCallback((v: T) => {
        setValue(v);
        try { window.localStorage.setItem(key, v); } catch { /* no-op */ }
    }, [key]);
    return [value, set, { ready: true, message: null }];
}
