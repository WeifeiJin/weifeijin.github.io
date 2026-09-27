export interface Publication {
  slug: string;
  year: number;
  title: string;
  authors: string[];
  venue: string;
  paper?: string;
  selectedAt?: string;
}

export const publications: Publication[] = [
  {
    slug: '2026-neurips-crosssteer', year: 2026,
    title: 'CrossSteer: Cross-Modal Safety Steering for Audio-Language Models',
    authors: ['Houde Dong', 'Weifei Jin', 'Yuxin Cao', 'Wei Song', 'Derui Wang', 'Jie Hao'],
    venue: 'NeurIPS 2026',
    selectedAt: '2026-09',
  },
  {
    slug: '2026-icme-duap', year: 2026,
    title: 'DUAP: Dual-task Universal Adversarial Perturbations Against Voice Control Systems',
    authors: ['Suyang Sun', 'Weifei Jin', 'Yuxin Cao', 'Wei Song', 'Jie Hao'],
    venue: 'ICME 2026', paper: 'https://arxiv.org/abs/2601.12786',
    selectedAt: '2026-03',
  },
  {
    slug: '2025-neurips-almguard', year: 2025,
    title: 'ALMGuard: Safety Shortcuts and Where to Find Them as Guardrails for Audio–Language Models',
    authors: ['Weifei Jin', 'Yuxin Cao', 'Junjie Su', 'Minhui Xue', 'Jie Hao', 'Ke Xu', 'Jin Song Dong', 'Derui Wang'],
    venue: 'NeurIPS 2025', paper: 'https://arxiv.org/abs/2510.26096',
    selectedAt: '2025-09',
  },
  {
    slug: '2025-tifs-malsight', year: 2025,
    title: 'MALSIGHT: Exploring Malicious Source Code and Benign Pseudocode for Iterative Binary Malware Summarization',
    authors: ['Haolang Lu', 'Hongrui Peng', 'Guoshun Nan', 'Jiaoyang Cui', 'Cheng Wang', 'Weifei Jin', 'Songtao Wang', 'Shengli Pan', 'Xiaofeng Tao'],
    venue: 'IEEE TIFS 2025', paper: 'https://arxiv.org/abs/2406.18379',
    selectedAt: '2025-06',
  },
  {
    slug: '2025-icme-transferability', year: 2025,
    title: 'Boosting the Transferability of Audio Adversarial Examples with Acoustic Representation Optimization',
    authors: ['Weifei Jin', 'Junjie Su', 'Hejia Wang', 'Yulin Ye', 'Jie Hao'],
    venue: 'ICME 2025', paper: 'https://arxiv.org/abs/2503.19591',
    selectedAt: '2025-03',
  },
  {
    slug: '2025-usenix-whispering', year: 2025,
    title: 'Whispering Under the Eaves: Protecting User Privacy Against Commercial and LLM-powered Automatic Speech Recognition Systems',
    authors: ['Weifei Jin', 'Yuxin Cao', 'Junjie Su', 'Derui Wang', 'Yedi Zhang', 'Minhui Xue', 'Jie Hao', 'Jin Song Dong', 'Yixian Yang'],
    venue: 'USENIX Security 2025', paper: 'https://www.usenix.org/system/files/conference/usenixsecurity25/sec25cycle1-prepub-743-jin-weifei.pdf',
    selectedAt: '2025-01',
  },
  {
    slug: '2024-sectl-styletransfer', year: 2024,
    title: 'Towards Evaluating the Robustness of Automatic Speech Recognition Systems via Audio Style Transfer',
    authors: ['Weifei Jin', 'Yuxin Cao', 'Junjie Su', 'Qi Shen', 'Kai Ye', 'Derui Wang', 'Jie Hao', 'Ziyao Liu'],
    venue: 'SecTL 2024 (AsiaCCS Workshop)', paper: 'https://arxiv.org/abs/2405.09470',
  },
];

export const selectedPublications = publications
  .filter((publication) => publication.selectedAt !== undefined)
  .sort((a, b) => (b.selectedAt ?? '').localeCompare(a.selectedAt ?? ''));
