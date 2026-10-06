export const blogComments = {
  repo: 'WeifeiJin/weifeijin.github.io',
  repoId: 'R_kgDOOC3vBg',
  category: 'Announcements',
  categoryId: 'DIC_kwDOOC3vBs4DHI70',
  // Both translations use the same thread. New posts can let giscus create one.
  discussionNumbers: {
    'from-research-to-researcher': 1,
  } as Record<string, number>,
};

// Keep the existing counter when an article's public URL changes.
export const blogViewPaths: Record<string, string> = {
  'from-research-to-researcher': '/blog/from-doing-research-to-becoming-a-researcher/',
};

export const blogLikes = {
  // Public Cloudflare Worker origin; never put credentials in this URL.
  apiUrl: 'https://weifeijin-blog-likes.ninedreamwf.workers.dev',
};
