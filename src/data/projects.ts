export interface ProjectSection {
  title: string
  body: string
}

export interface Project {
  id: string
  title: string
  period: string
  tags: string[]
  summary: string
  sections: ProjectSection[]
  image?: string
}

export const projects: Project[] = [
  {
    id: 'ai-civil-complaint',
    title: 'AI Civil Complaint Classification',
    period: '2024',
    tags: ['NLP', 'ML', 'Production'],
    summary:
      'Built and deployed an NLP/ML system to classify civil complaints for the university cloud portal and mobile app.',
    sections: [
      {
        title: 'Overview',
        body: 'Developed an AI system to automatically classify civil complaints submitted through Kangwon National University’s cloud portal and mobile app.',
      },
      {
        title: 'Scale & deployment',
        body: 'The system processed 50,000+ cumulative requests and was deployed in a production environment. Operator feedback was gathered to evaluate workflow efficiency improvements.',
      },
      {
        title: 'Recognition',
        body: 'Received the Excellence Award from the Regional Intelligence Center Creative & Autonomous Project Program.',
      },
    ],
  },
  {
    id: 'hai-lab-website',
    title: 'HAI Lab Website',
    period: '2024',
    tags: ['Web', 'HCI'],
    summary:
      'Developed and maintained the official website for the Human–AI Interaction Lab at Kangwon National University.',
    sections: [
      {
        title: 'Role',
        body: 'Developed and maintained the official website for the Human–AI Interaction Lab (HAI Lab) at Kangwon National University, led by Prof. Auk Kim.',
      },
      {
        title: 'Scope',
        body: 'Responsible for building and updating the lab’s web presence, including research publications, team member profiles, and project showcases.',
      },
    ],
  },
  {
    id: 'campus-notice-aggregator',
    title: 'Campus Notice Aggregator & Curator',
    period: '2025',
    tags: ['Web', 'Aggregation'],
    summary:
      'Capstone project — aggregates and curates official notices across campus portals into a single feed.',
    sections: [
      {
        title: 'Problem',
        body: 'Capstone project that solves the problem of scattered official notices across multiple Kangwon National University portals.',
      },
      {
        title: 'Solution',
        body: 'Built a unified aggregator that collects, deduplicates, and curates notices from various campus systems into a single, searchable feed accessible to students.',
      },
    ],
  },
  {
    id: 'ai-phishing-training',
    title: 'AI Phishing Training Automation',
    period: '2026',
    tags: ['AI', 'Automation', 'Security'],
    summary:
      'Automated creation and delivery of phishing-awareness training content using AI-driven pipelines at NSHC Safe Square, Singapore.',
    sections: [
      {
        title: 'Context',
        body: 'Internship project at NSHC Safe Square (Singapore).',
      },
      {
        title: 'Delivery',
        body: 'Designed and built AI-driven pipelines that automatically generate and deliver phishing-awareness training content. The system reduces manual effort in creating security training materials and scales to larger audiences.',
      },
    ],
  },
  {
    id: 'clinical-ml',
    title: 'Clinical ML & Visualization',
    period: '2024',
    tags: ['ML', 'Data Visualization', 'Healthcare'],
    summary:
      'ML models and data visualization pipelines for clinical research at Kangwon National University Hospital.',
    sections: [
      {
        title: 'Overview',
        body: 'Developed machine learning models and data visualization pipelines for clinical research in collaboration with Kangwon National University Hospital.',
      },
      {
        title: 'Work',
        body: 'The work involved processing and analyzing medical datasets, building predictive models, and creating visualizations to support researchers in interpreting results.',
      },
    ],
  },
]
