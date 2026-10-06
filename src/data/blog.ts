import type { CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;
export type BlogLanguage = BlogEntry['data']['language'];

export function blogUrl(post: BlogEntry): string {
  return `/blog/${post.data.slug}/${post.data.language === 'en' ? 'en/' : ''}`;
}

export function groupBlogPosts(posts: BlogEntry[]): BlogEntry[][] {
  const groups = new Map<string, BlogEntry[]>();
  const variants = new Set<string>();
  for (const post of posts) {
    const key = `${post.data.slug}:${post.data.language}`;
    if (variants.has(key)) {
      throw new Error(`Duplicate Blog translation ${key} in ${post.filePath ?? post.id}.`);
    }
    variants.add(key);
    const translations = groups.get(post.data.slug) ?? [];
    translations.push(post);
    groups.set(post.data.slug, translations);
  }
  return [...groups.values()]
    .map((translations) => translations.sort((a, b) => a.data.language === b.data.language ? 0 : a.data.language === 'zh' ? -1 : 1))
    .sort((a, b) => b[0].data.publishedAt.localeCompare(a[0].data.publishedAt));
}

export function readingStats(post: BlogEntry) {
  const text = `${post.data.introduction ?? ''}\n${post.body ?? ''}`
    .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, '')
    .replace(/<!--[^]*?-->/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s*\[[^\]]+\]:.*$/gm, '')
    .replace(/<[^>]+>/g, '')
    .replace(/https?:\/\/\S+/g, '');
  const characters = (text.match(/\p{Script=Han}/gu) ?? []).length;
  const words = (text.replace(/\p{Script=Han}/gu, ' ').match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) ?? []).length;
  const minutes = Math.max(1, Math.ceil(characters / 300 + words / 220));
  const count = (characters + words).toLocaleString(post.data.language === 'zh' ? 'zh-CN' : 'en-US');
  return {
    count,
    minutes,
    label: post.data.language === 'zh'
      ? `共计 ${count} 字 · 预计阅读 ${minutes} 分钟`
      : `${count} words · ${minutes} min read`,
  };
}

export function blogDate(date: string, language: BlogLanguage): string {
  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}
