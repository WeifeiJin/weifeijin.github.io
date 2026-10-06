export interface ResearchArea {
  number: string;
  name: string;
  subtitle: string;
  description: string;
  paperSlugs: string[];
  preprints?: { title: string; url: string; year: number }[];
  currentTopics?: string[];
}

export const researchAreas: ResearchArea[] = [
  {
    number: '01',
    name: 'Perception',
    subtitle: 'Multimodal Robustness',
    description: 'Securing speech and other multimodal inputs against adversarial manipulation and privacy threats.',
    paperSlugs: ['2026-icme-duap', '2025-usenix-whispering', '2025-icme-transferability', '2024-sectl-styletransfer'],
  },
  {
    number: '02',
    name: 'Cognition',
    subtitle: 'LLMs & Agents',
    description: 'Safety and security of audio-language models and autonomous agents.',
    paperSlugs: ['2026-neurips-crosssteer', '2025-neurips-almguard'],
  },
  {
    number: '03',
    name: 'Memory',
    subtitle: 'Secure AI Memory',
    description: 'Protecting RAG systems and external knowledge bases from context injection and poisoning.',
    paperSlugs: [],
    preprints: [
      {
        title: 'Divide and Doubt: Diverse Distributed Poisoning for Retrieval-Augmented Generation',
        url: 'https://arxiv.org/abs/2609.27090',
        year: 2026,
      },
      {
        title: 'CleanBase: Detecting Malicious Documents in RAG Knowledge Databases',
        url: 'https://arxiv.org/abs/2605.00460',
        year: 2026,
      },
    ],
  },
];
