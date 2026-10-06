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

// Keep the full original counter URL when an article or site is renamed.
export const blogViewUrls: Record<string, string> = {
  'from-research-to-researcher': 'https://weifeijin.github.io/blog/from-doing-research-to-becoming-a-researcher/',
};

export const blogLikes = {
  // Public Cloudflare Worker origin; never put credentials in this URL.
  apiUrl: 'https://likes.weifeijin.com',
};
