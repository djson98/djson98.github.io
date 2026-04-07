export interface Project {
  id: string
  title: string
  period: string
  tags: string[]
  summary: string
  description: string
  image?: string          // 이미지 경로 (없으면 gradient fallback)
  gradient: string        // tailwind gradient classes
}

export const projects: Project[] = [
  {
    id: 'ai-civil-complaint',
    title: 'AI Civil Complaint Classification',
    period: '2024',
    tags: ['NLP', 'ML', 'Production'],
    summary: 'Built and deployed an NLP/ML system to classify civil complaints for the university cloud portal and mobile app.',
    gradient: 'from-blue-500 to-indigo-600',
    description: `Developed an AI system to automatically classify civil complaints submitted through Kangwon National University's cloud portal and mobile app.

The system processed 50,000+ cumulative requests and was deployed in a production environment. Operator feedback was gathered to evaluate workflow efficiency improvements.

Received the Excellence Award from the Regional Intelligence Center Creative & Autonomous Project Program.`,
  },
  {
    id: 'hai-lab-website',
    title: 'HAI Lab Website',
    period: '2024',
    tags: ['Web', 'HCI'],
    summary: 'Developed and maintained the official website for the Human–AI Interaction Lab at Kangwon National University.',
    gradient: 'from-sky-500 to-cyan-500',
    description: `Developed and maintained the official website for the Human–AI Interaction Lab (HAI Lab) at Kangwon National University, led by Prof. Auk Kim.

Responsible for building and updating the lab's web presence, including research publications, team member profiles, and project showcases.`,
  },
  {
    id: 'campus-notice-aggregator',
    title: 'Campus Notice Aggregator & Curator',
    period: '2025',
    tags: ['Web', 'Aggregation'],
    summary: 'Capstone project — aggregates and curates official notices across campus portals into a single feed.',
    gradient: 'from-violet-500 to-purple-600',
    description: `Capstone project that solves the problem of scattered official notices across multiple Kangwon National University portals.

Built a unified aggregator that collects, deduplicates, and curates notices from various campus systems into a single, searchable feed accessible to students.`,
  },
  {
    id: 'ai-phishing-training',
    title: 'AI Phishing Training Automation',
    period: '2026',
    tags: ['AI', 'Automation', 'Security'],
    summary: 'Automated creation and delivery of phishing-awareness training content using AI-driven pipelines at NSHC Safe Square, Singapore.',
    gradient: 'from-rose-500 to-orange-500',
    description: `Internship project at NSHC Safe Square (Singapore).

Designed and built AI-driven pipelines that automatically generate and deliver phishing-awareness training content. The system reduces manual effort in creating security training materials and scales to larger audiences.`,
  },
  {
    id: 'clinical-ml',
    title: 'Clinical ML & Visualization',
    period: '2024',
    tags: ['ML', 'Data Visualization', 'Healthcare'],
    summary: 'ML models and data visualization pipelines for clinical research at Kangwon National University Hospital.',
    gradient: 'from-emerald-500 to-teal-600',
    description: `Developed machine learning models and data visualization pipelines for clinical research in collaboration with Kangwon National University Hospital.

The work involved processing and analyzing medical datasets, building predictive models, and creating visualizations to support researchers in interpreting results.`,
  },
]
