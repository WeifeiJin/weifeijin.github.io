export interface ResearchExperience {
  institution: string;
  unit?: string;
  remote?: boolean;
  role: string;
  period: string;
  details: Array<string | { name: string; url: string }>;
  logo: string;
}

export const researchExperience: ResearchExperience[] = [
  {
    institution: 'ByteDance',
    unit: 'SecurityFlow Team',
    role: 'Research Intern',
    period: 'Feb 2026 – May 2026',
    details: [
      'Mentors: ',
      { name: 'Dr. Yang Bai', url: 'https://bymavis.github.io/' },
      ' and ',
      { name: 'Dr. Dongxian Wu', url: 'https://csdongxian.github.io/' },
    ],
    logo: '/images/experience/bytedance.svg',
  },
  {
    institution: 'Duke University',
    remote: true,
    role: 'Undergraduate Researcher',
    period: 'May 2025 – Nov 2025',
    details: ['Advisor: ', { name: 'Prof. Neil Gong', url: 'https://people.duke.edu/~zg70/' }],
    logo: '/images/experience/duke.png',
  },
  {
    institution: 'Tsinghua University',
    unit: 'THUCSNET',
    role: 'Undergraduate Researcher',
    period: 'Nov 2024 – Mar 2025',
    details: ['Advisor: ', { name: 'Prof. Ke Xu', url: 'https://www.insc.tsinghua.edu.cn/inscen/info/1255/1060.htm' }],
    logo: '/images/experience/tsinghua.png',
  },
  {
    institution: 'National University of Singapore',
    remote: true,
    role: 'Research Collaborator',
    period: 'Aug 2024 – Mar 2025',
    details: [
      'Collaborator: ',
      { name: 'Yuxin Cao', url: 'https://yuxincao22.github.io/' },
      ' (',
      { name: 'Prof. Jin Song Dong', url: 'https://www.comp.nus.edu.sg/cs/people/dongjs/' },
      '’s group)',
    ],
    logo: '/images/experience/nus.png',
  },
  {
    institution: 'CSIRO’s Data61',
    remote: true,
    role: 'Research Collaborator',
    period: 'Oct 2023 – May 2025',
    details: [
      'Mentor: ',
      { name: 'Dr. Derui Wang', url: 'https://neuralsec.github.io/cv/' },
      '; collaborator: ',
      { name: 'Dr. Minhui Xue', url: 'https://minhui-xue.github.io/' },
    ],
    logo: '/images/experience/csiro.png',
  },
];
