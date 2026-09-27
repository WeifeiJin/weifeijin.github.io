export interface NewsItem {
  date: string;
  dateTime: string;
  text: string;
  highlight?: string;
  kind?: 'paper' | 'career';
}

export const news: NewsItem[] = [
  { date: 'Sep 2026', dateTime: '2026-09', text: 'CrossSteer was accepted to NeurIPS 2026.', highlight: 'NeurIPS 2026' },
  { date: 'Mar 2026', dateTime: '2026-03', text: 'Our paper on dual-task universal adversarial perturbations against voice control systems was accepted to ICME 2026.', highlight: 'ICME 2026' },
  { date: 'Feb 2026', dateTime: '2026-02', text: 'Joined the ByteDance SecurityFlow Team as an AI Security Research Intern.', kind: 'career' },
  { date: 'Sep 2025', dateTime: '2025-09', text: 'Our first-author paper ALMGuard was accepted to NeurIPS 2025.', highlight: 'NeurIPS 2025' },
  { date: 'Jun 2025', dateTime: '2025-06', text: 'Our MALSIGHT paper was accepted to IEEE TIFS.', highlight: 'IEEE TIFS' },
  { date: 'Mar 2025', dateTime: '2025-03', text: 'Our first-author paper on audio adversarial example transferability was accepted to ICME 2025.', highlight: 'ICME 2025' },
  { date: 'Jan 2025', dateTime: '2025-01', text: 'Our first-author speech privacy paper was accepted to USENIX Security 2025.', highlight: 'USENIX Security 2025' },
  { date: 'Apr 2024', dateTime: '2024-04', text: 'Our first-author audio style transfer paper was accepted to SecTL 2024.', highlight: 'SecTL 2024' },
];
