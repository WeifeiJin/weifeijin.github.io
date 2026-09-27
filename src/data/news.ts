export interface NewsItem {
  date: string;
  dateTime: string;
  text: string;
  highlight?: string;
  kind?: 'paper' | 'career';
}

export const news: NewsItem[] = [
  { date: 'Sep 2026', dateTime: '2026-09', text: 'Our paper on cross-modal safety steering for audio-language models has been accepted to NeurIPS 2026.', highlight: 'NeurIPS 2026' },
  { date: 'Mar 2026', dateTime: '2026-03', text: 'Our paper on dual-task universal adversarial perturbations against voice control systems has been accepted to ICME 2026.', highlight: 'ICME 2026' },
  { date: 'Feb 2026', dateTime: '2026-02', text: 'I joined ByteDance SecurityFlow as an AI security research intern.', kind: 'career' },
  { date: 'Sep 2025', dateTime: '2025-09', text: 'Our paper on safety guardrails for audio-language models has been accepted to NeurIPS 2025.', highlight: 'NeurIPS 2025' },
  { date: 'Jun 2025', dateTime: '2025-06', text: 'Our paper on binary malware summarization has been accepted to IEEE TIFS.', highlight: 'IEEE TIFS' },
  { date: 'Mar 2025', dateTime: '2025-03', text: 'Our paper on the transferability of audio adversarial examples has been accepted to ICME 2025.', highlight: 'ICME 2025' },
  { date: 'Jan 2025', dateTime: '2025-01', text: 'Our paper on speech privacy against automatic speech recognition systems has been accepted to USENIX Security 2025.', highlight: 'USENIX Security 2025' },
  { date: 'Apr 2024', dateTime: '2024-04', text: 'Our paper on ASR robustness through audio style transfer has been accepted to SecTL 2024.', highlight: 'SecTL 2024' },
];
