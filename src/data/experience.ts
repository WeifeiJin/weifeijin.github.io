export interface ResearchExperience {
  institution: string;
  unit?: string;
  remote?: boolean;
  role: string;
  period: string;
  details: string;
  logo: string;
}

export const researchExperience: ResearchExperience[] = [
  {
    institution: 'ByteDance',
    unit: 'SecurityFlow Team',
    role: 'AI Security Research Intern',
    period: 'Feb 2026 – May 2026',
    details: 'Mentors: Dr. Yang Bai and Dr. Dongxian Wu',
    logo: '/images/experience/bytedance.svg',
  },
  {
    institution: 'Duke University',
    remote: true,
    role: 'Research Collaborator',
    period: 'May 2025 – Nov 2025',
    details: 'Advisor: Prof. Neil Gong',
    logo: '/images/experience/duke.png',
  },
  {
    institution: 'Tsinghua University',
    unit: 'THUCSNET',
    role: 'Undergraduate Researcher',
    period: 'Nov 2024 – Mar 2025',
    details: 'Advisor: Prof. Ke Xu',
    logo: '/images/experience/tsinghua.png',
  },
  {
    institution: 'National University of Singapore',
    remote: true,
    role: 'Research Collaborator',
    period: 'Aug 2024 – Mar 2025',
    details: 'Collaborator: Dr. Yuxin Cao (Prof. Jin Song Dong’s group)',
    logo: '/images/experience/nus.png',
  },
  {
    institution: 'CSIRO’s Data61',
    remote: true,
    role: 'Research Collaborator',
    period: 'May 2024 – May 2025',
    details: 'Mentor: Dr. Derui Wang; collaborator: Dr. Minhui Xue',
    logo: '/images/experience/csiro.png',
  },
];
