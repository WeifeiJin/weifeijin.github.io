export interface MentoringPerson {
  name: string;
  homepage?: string;
}

export interface MentoringCollaboration {
  people: MentoringPerson[];
  outcome: string;
}

export const mentoringCollaborations: MentoringCollaboration[] = [
  {
    people: [{ name: 'Houde Dong' }],
    outcome: 'First-author work accepted to NeurIPS 2026.',
  },
  {
    people: [{ name: 'Suyang Sun' }],
    outcome: 'First-author work accepted to ICME 2026.',
  },
  {
    people: [{ name: 'Hejia Wang' }, { name: 'Yulin Ye' }],
    outcome: 'Contributed to research published at ICME 2025.',
  },
];
