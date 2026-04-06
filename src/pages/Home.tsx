const experience = [
  {
    org: 'Human–AI Interaction Lab, Kangwon National University',
    role: 'Research Intern',
    period: 'Dec 2023 – Present',
    location: 'Chuncheon, South Korea',
    items: [
      'AI Civil Complaint Classification — Built and deployed an NLP/ML system to classify civil complaints for the university cloud portal and mobile app (50,000+ requests). Excellence Award, Regional Intelligence Center.',
      'Developed and maintained the lab website.',
    ],
  },
  {
    org: 'NSHC Safe Square',
    role: 'Intern',
    period: 'Jan 2026 – Feb 2026',
    location: 'Singapore',
    items: [
      'AI Phishing Training Automation — Automated creation and delivery of phishing-awareness training content using AI-driven pipelines.',
    ],
  },
  {
    org: 'Kangwon National University Hospital',
    role: 'Intern',
    period: 'Aug 2024 – Dec 2024',
    location: 'Chuncheon, South Korea',
    items: [
      'Developed ML models and data visualization pipelines for clinical research.',
    ],
  },
]

const awards = [
  { title: 'Encouragement Award, Capstone Project Competition', year: '2025' },
  { title: 'Excellence Award, Regional Intelligence Center Creative & Autonomous Project', year: '2024' },
  { title: 'Outstanding Essay Award, Kangwon National University', year: '2023' },
]

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section>
        <h1 className="text-3xl font-bold mb-1">Dongju Son</h1>
        <p className="text-gray-600 mb-3">
          CS + Data Science @ Kangwon National University · Research Intern · Founder of CapybaraLab
        </p>
        <div className="flex gap-4 text-sm">
          <a href="https://github.com/djson98" target="_blank" rel="noreferrer" className="hover:underline">
            GitHub
          </a>
          <a href="mailto:your.email@example.com" className="hover:underline">
            Email
          </a>
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="text-xl font-semibold border-b pb-1 mb-4">Education</h2>
        <div>
          <p className="font-medium">Kangwon National University</p>
          <p className="text-sm text-gray-500">Chuncheon, South Korea</p>
          <ul className="mt-1 text-sm space-y-0.5 list-disc list-inside text-gray-700">
            <li>B.S. in Computer Science — GPA 3.78 / 4.5 · Expected Aug 2026</li>
            <li>M.S. in Data Science (Advisor: Prof. Auk Kim) · Expected Sep 2026</li>
          </ul>
        </div>
      </section>

      {/* Experience */}
      <section>
        <h2 className="text-xl font-semibold border-b pb-1 mb-4">Experience</h2>
        <div className="space-y-6">
          {experience.map((exp) => (
            <div key={exp.org}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{exp.org}</p>
                  <p className="text-sm text-gray-500">{exp.role} · {exp.location}</p>
                </div>
                <p className="text-sm text-gray-400 whitespace-nowrap ml-4">{exp.period}</p>
              </div>
              <ul className="mt-2 text-sm space-y-1 list-disc list-inside text-gray-700">
                {exp.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section>
        <h2 className="text-xl font-semibold border-b pb-1 mb-4">Honors & Awards</h2>
        <ul className="space-y-1 text-sm text-gray-700">
          {awards.map((a) => (
            <li key={a.title} className="flex justify-between">
              <span>{a.title}</span>
              <span className="text-gray-400 ml-4">{a.year}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
