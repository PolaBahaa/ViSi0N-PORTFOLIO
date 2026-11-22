import type { Project } from './App';
import snapshot from './repos-snapshot.json';

export type PublicRepo = {
    id: number; name: string; html_url: string; description: string | null;
    language: string | null; created_at: string; private: boolean;
    topics?: string[];
};

export const initialRepos = snapshot as PublicRepo[];

// Only the unauthenticated public endpoint is used. No tokens or private data.
export async function loadPublicRepos(signal: AbortSignal): Promise<PublicRepo[]> {
    const result: PublicRepo[] = [];
    const timeout = AbortSignal.timeout(15000);
    const requestSignal = AbortSignal.any([signal, timeout]);
    for (let page = 1; ; page++) {
        const response = await fetch(`https://api.github.com/users/PolaBahaa/repos?type=owner&sort=updated&per_page=100&page=${page}`, {
            signal: requestSignal, cache: 'no-store', headers: { Accept: 'application/vnd.github+json' },
        });
        if (!response.ok) throw new Error(`GitHub: ${response.status}`);
        const data: PublicRepo[] = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid GitHub response');
        result.push(...data.filter(repo => repo.private === false));
        if (data.length < 100) return result;
    }
}

export function repoToProject(repo: PublicRepo, curated: Project[]): Project {
    const existing = curated.find(project => project.url === repo.html_url);
    const description = repo.description?.trim();
    return {
        ...existing,
        id: repo.id,
        name: repo.name,
        year: repo.created_at.slice(0, 4),
        category: existing?.category ?? (/^(HTML_CSS_|CSS_)/.test(repo.name) ? 'learning' : 'app'),
        url: repo.html_url,
        stack: existing?.stack ?? (repo.language ? [repo.language] : ['GitHub']),
        tagline: existing?.tagline ?? {
            en: description || 'Explore the source code on GitHub.',
            ar: description || 'شوف الكود والتفاصيل على GitHub.',
        },
        detail: existing?.detail ?? {
            en: description || 'The latest project details and source code are available in this public GitHub repository.',
            ar: description || 'أحدث تفاصيل المشروع والكود متاحين في المستودع العام ده على GitHub.',
        },
    };
}
