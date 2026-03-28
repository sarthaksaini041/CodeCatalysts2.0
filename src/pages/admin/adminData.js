// ── Initial data shared across admin sections ──────────────────────

export const INITIAL_STORY = `Born on October 28, 2025, Code Catalysts is a collective of visionary developers at GLA University. We bypass the buzzwords and focus on shipping high-performance builds, leveraging the power of modern stacks and AI.`;

export const INITIAL_STORY_IMAGES = [
  { id: 1, url: '' },
  { id: 2, url: '' },
  { id: 3, url: '' },
];

export const INITIAL_JOURNEY = [
  { id: 1, date: 'OCTOBER 28, 2025', title: 'The Genesis', description: 'Code Catalysts was founded at GLA University with a mission to bridge the gap between academic learning and high-end engineering.' },
  { id: 2, date: 'NOVEMBER 15, 2025', title: 'First Deployment', description: 'Successfully launched our internal collaboration ecosystem, proving our architectural foundations.' },
  { id: 3, date: 'JANUARY 20, 2026', title: 'Hackathon Victory', description: 'Dominated the regional technical summit, securing 1st place with our AI-driven fleet management prototype.' },
  { id: 4, date: 'MARCH 20, 2026', title: 'Premium Rebrand', description: 'Implemented the Dark Neon UI overhaul across our entire digital footprint, setting a new standard for developer aesthetics.' },
];

export const ICON_OPTIONS = [
  'Lightbulb', 'Code2', 'Users', 'Palette', 'Rocket', 'Zap', 'Globe', 'Briefcase',
  'Shield', 'Star', 'Target', 'Layers', 'GitBranch', 'Terminal', 'Cpu', 'Database',
];

export const INITIAL_BUILD_CARDS = [
  { id: 1, title: 'Idea to MVP', tag: 'Product Direction', description: 'Fast-track from concept to prototype.', icon: 'Lightbulb' },
  { id: 2, title: 'Full-Stack', tag: 'Engineering', description: 'End-to-end development with precision.', icon: 'Code2' },
  { id: 3, title: 'Team Squad', tag: 'Workflow', description: 'Agile collaboration in small squads.', icon: 'Users' },
  { id: 4, title: 'Design First', tag: 'Aesthetics', description: 'Premium UI/UX from day one.', icon: 'Palette' },
];

export const INITIAL_PROJECTS = [
  {
    id: 1, title: 'Code Catalysts Website', category: 'Web Platform', status: 'Released', featured: true,
    shortDescription: 'The official landing page and ecosystem for Code Catalysts, featuring a premium dark neon aesthetic and real-time team synchronization.',
    techStack: ['React', 'Three.js', 'Framer Motion', 'Supabase'],
    githubUrl: 'https://github.com/code-catalysts', liveUrl: 'https://codecatalysts.dev',
  },
  {
    id: 2, title: 'Fleet Management AI', category: 'Artificial Intelligence', status: 'MVP', featured: false,
    shortDescription: 'An AI-driven prototype for real-time fleet tracking and optimization, which secured 1st place at the regional technical summit.',
    techStack: ['Python', 'TensorFlow', 'React Native', 'Node.js'],
    githubUrl: 'https://github.com/code-catalysts/fleet-ai', liveUrl: '',
  },
  {
    id: 3, title: 'Internal Dev Ecosystem', category: 'Developer Tools', status: 'In Development', featured: false,
    shortDescription: 'A collaborative toolset for internal teams to manage sprints, documentation, and deployments within the Code Catalysts framework.',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Docker'],
    githubUrl: '', liveUrl: '',
  },
];

export const INITIAL_APPLICATIONS = [
  {
    id: 1, fullName: 'Arjun Mehta', email: 'arjun.mehta@gla.ac.in', university: 'GLA University', year: '2',
    skills: ['React', 'Node.js', 'MongoDB'], github: 'https://github.com/arjunmehta', portfolio: '',
    whyJoin: 'I have always admired Code Catalysts for pushing the boundaries of student innovation. I want to contribute to real-world projects while learning from the best engineers in the community.',
    contribute: 'I bring full-stack development experience especially in the MERN stack, and a strong hold on system design patterns.',
    submittedAt: '2026-03-24T10:30:00Z',
  },
  {
    id: 2, fullName: 'Priya Sharma', email: 'priya.ts@srmu.edu.in', university: 'SRM Ghaziabad', year: '3',
    skills: ['Python', 'TensorFlow', 'Keras', 'Data Science'], github: 'https://github.com/priyasharmads', portfolio: 'https://priyaml.vercel.app',
    whyJoin: 'Code Catalysts represents the intersection of cutting-edge AI research and practical engineering — exactly what I am passionate about.',
    contribute: 'Deep expertise in ML pipelines and computer vision. I have published two research papers on NLP fine-tuning.',
    submittedAt: '2026-03-25T08:15:00Z',
  },
  {
    id: 3, fullName: 'Rohan Kapoor', email: 'rohan.k@ietagra.ac.in', university: 'IET Agra', year: '1',
    skills: ['C++', 'Embedded Systems', 'Arduino'], github: 'https://github.com/rkapoor-iot', portfolio: '',
    whyJoin: 'I am a first-year student with a passion for IoT and embedded systems. I believe Code Catalysts can help me grow beyond the curriculum.',
    contribute: 'Hardware experience with Arduino and ESP32, strong in C++ and real-time operating systems.',
    submittedAt: '2026-03-25T21:45:00Z',
  },
];

export const INITIAL_LEADER = {
  name: 'Rudraksh Pandey', role: 'Full-Stack Engineer', tagline: 'Lead architect & visionary',
  bio: 'Visionary leader and lead architect of Code Catalysts. Specializing in highly interactive technical ecosystems and distributed systems architecture.',
  techStack: ['React', 'Node.js', 'Three.js', 'AI/ML', 'Distributed Systems'],
  linkedin: '#', github: '#',
};

export const INITIAL_REPS = [
  {
    id: 'iet', name: 'Aditya Tiwari', university: 'IET AGRA', role: 'Technical Lead', tagline: 'Embedded systems pioneer',
    techStack: ['Embedded', 'IoT', 'C++', 'Python', 'RTOS'],
    bio: 'Expert in embedded systems and technical architectures, ensuring IET Agra stays at the forefront of innovation.',
    linkedin: '#', github: '#',
    members: [
      { id: 'm1', name: 'Anushka Gupta',  role: 'System Architect',  tagline: 'Distributed systems specialist', techStack: ['Kafka', 'Java', 'Microservices', 'Docker'], bio: 'Specialist in distributed systems and high-throughput architectures.', linkedin: '#', github: '#' },
      { id: 'm2', name: 'Sharvil Mishra', role: 'Robotics Engineer',  tagline: 'Hardware-software bridge',       techStack: ['ROS', 'Firmware', 'C++', 'SolidWorks'],   bio: 'Focuses on hardware-software integration and robotics motion planning.', linkedin: '#', github: '#' },
      { id: 'm3', name: 'Aditya Shukla',  role: 'Software Engineer',  tagline: 'Algorithms & optimization',     techStack: ['C++', 'Algorithms', 'Data Structures'],   bio: 'Proficient in C++ and computational optimization.', linkedin: '#', github: '#' },
      { id: 'm4', name: 'Apeksha Joshi',  role: 'Security Analyst',   tagline: 'Network & pen-test expert',     techStack: ['PenTesting', 'Wireshark', 'Networking'],  bio: 'Expert in network security and vulnerability assessments.', linkedin: '#', github: '#' },
    ],
  },
  {
    id: 'gla', name: 'Sarthak Saini', university: 'GLA UNIVERSITY', role: 'Innovation Lead', tagline: 'AI/ML culture driver',
    techStack: ['AI/ML', 'PyTorch', 'FastAPI', 'UI/UX', 'LLMs'],
    bio: 'Driving AI/ML initiatives and fostering a culture of rapid development at GLA University.',
    linkedin: '#', github: '#',
    members: [
      { id: 'm5', name: 'Sparsh Raj',         role: 'Mechanical Dev',   tagline: 'Engineering meets software',  techStack: ['CAD', 'MATLAB', 'FEA', 'Python'],              bio: 'Integrating mechanical principles with software engineering.', linkedin: '#', github: '#' },
      { id: 'm6', name: 'Tanishka Agarwal',   role: 'AI Developer',     tagline: 'Neural network architect',    techStack: ['CV', 'NLP', 'TensorFlow', 'Keras'],            bio: 'Architecting neural networks for computer vision and NLP tasks.', linkedin: '#', github: '#' },
      { id: 'm7', name: 'Prakhar Saxena',     role: 'Product Analyst',  tagline: 'Engineering meets UX',        techStack: ['Market Research', 'Agile', 'Figma'],           bio: 'Bridging engineering and UX for product-driven development.', linkedin: '#', github: '#' },
      { id: 'm8', name: 'Radhika Maheshwari', role: 'Data Scientist',   tagline: 'Pattern hunter in big data', techStack: ['Stats', 'Spark', 'SQL', 'Pandas'],             bio: 'Uncovering actionable patterns in large-scale datasets.', linkedin: '#', github: '#' },
      { id: 'm9', name: 'Ananya Khatri',      role: 'AI Researcher',    tagline: 'Ethical AI advocate',         techStack: ['RL', 'Ethics', 'NLP', 'Python'],               bio: 'Researcher in NLP and responsible AI systems.', linkedin: '#', github: '#' },
      { id: 'm10', name: 'Ansh Aditya',       role: 'Backend Dev',      tagline: 'Microservices craftsman',     techStack: ['GoLang', 'Docker', 'K8s', 'gRPC'],             bio: 'Building scalable microservices and resilient backend systems.', linkedin: '#', github: '#' },
    ],
  },
  {
    id: 'srm', name: 'Siddhartha Panwar', university: 'SRM GHAZIABAD', role: 'Network Lead', tagline: 'Performance & web architecture',
    techStack: ['Networking', 'AWS', 'Rust', 'Wasm', 'BGP'],
    bio: 'Commanding the SRM Ghaziabad hub with a focus on web networking and performance architecture.',
    linkedin: '#', github: '#',
    members: [
      { id: 'm11', name: 'Yash Sharma',     role: 'DevOps Lead',       tagline: 'CI/CD pipeline architect',   techStack: ['Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions'], bio: 'Streamlining CI/CD pipelines and infrastructure automation.', linkedin: '#', github: '#' },
      { id: 'm12', name: 'Shivansh Gautam', role: 'Network Engineer',  tagline: 'High-availability champion', techStack: ['BGP', 'Cisco', 'Linux', 'Wireshark'],              bio: 'Specialist in high-availability network topologies.', linkedin: '#', github: '#' },
      { id: 'm13', name: 'Lakshay Gupta',   role: 'Cloud Architect',   tagline: 'Serverless & scalable infra', techStack: ['GCP', 'Serverless', 'Firebase', 'CDN'],           bio: 'Designing scalable cloud-native architectures.', linkedin: '#', github: '#' },
      { id: 'm14', name: 'Vedant',          role: 'Security Engineer', tagline: 'Zero-trust implementer',     techStack: ['Crypto', 'IAM', 'Zero Trust', 'OWASP'],            bio: 'Focuses on application security and identity management.', linkedin: '#', github: '#' },
    ],
  },
];

export const INITIAL_SETTINGS = {
  contactEmail: 'team@codecatalysts.dev',
  linkedinUrl: 'https://linkedin.com/company/code-catalysts000/',
  githubUrl: 'https://github.com/code-catalysts',
  instagramUrl: '#',
  footerTagline: 'Building, learning, and shipping together since 2025.',
  footerCopyright: '© 2025 Code Catalysts. Engineered for Excellence.',
  footerLinks: [
    { id: 1, label: 'About', href: '/' },
    { id: 2, label: 'Team', href: '/team' },
    { id: 3, label: 'Projects', href: '#' },
    { id: 4, label: 'Journey', href: '#' },
  ],
};
