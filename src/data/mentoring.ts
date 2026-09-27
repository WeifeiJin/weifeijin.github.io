export interface MentoringPerson {
  name: string;
  homepage?: string;
}

export interface MentoringCollaboration {
  people: MentoringPerson[];
  paperTitle: string;
  publicationUrl: string;
  outcome: string;
}

export const mentoringCollaborations: MentoringCollaboration[] = [
  {
    people: [{ name: 'Houde Dong' }],
    paperTitle: 'CrossSteer: Cross-Modal Safety Steering for Audio-Language Models',
    publicationUrl: '/publication/2026-neurips-crosssteer/',
    outcome: 'First-author work accepted to NeurIPS 2026',
  },
  {
    people: [{ name: 'Suyang Sun' }],
    paperTitle: 'DUAP: Dual-task Universal Adversarial Perturbations Against Voice Control Systems',
    publicationUrl: '/publication/2026-icme-duap/',
    outcome: 'First-author work accepted to ICME 2026',
  },
  {
    people: [{ name: 'Hejia Wang' }, { name: 'Yulin Ye' }],
    paperTitle: 'Boosting the Transferability of Audio Adversarial Examples with Acoustic Representation Optimization',
    publicationUrl: '/publication/2025-icme-transferability/',
    outcome: 'Collaborative research published at ICME 2025',
  },
];
