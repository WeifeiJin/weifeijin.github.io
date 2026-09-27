export interface ResearchArea {
  number: string;
  name: string;
  subtitle: string;
  description: string;
  paperSlugs: string[];
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
    description: 'Guardrails for audio-language models, AI-assisted security analysis, and safer autonomous agents.',
    paperSlugs: ['2025-neurips-almguard', '2025-tifs-malsight'],
  },
  {
    number: '03',
    name: 'Memory',
    subtitle: 'Secure AI Memory',
    description: 'Protecting RAG systems and external knowledge bases from context injection and poisoning.',
    paperSlugs: [],
    currentTopics: ['RAG security', 'Knowledge poisoning', 'Persistent agent memory'],
  },
];
