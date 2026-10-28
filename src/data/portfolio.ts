// ════════════════════════════════════════════════════════════════════════
//  PORTFOLIO DATA — edit this file to update all site content.
//  No component changes are needed for routine content updates.
//
//  HONESTY RULE: only fill verified information. Leave arrays empty to
//  hide sections instead of inventing details.
// ════════════════════════════════════════════════════════════════════════

export const profile = {
  name: 'Muhammad Hashir Khan',
  shortName: 'M. Hashir Khan',
  initials: 'MHK',
  title: 'AI Automation Developer',
  email: 'muhammadhashirkhan.official@gmail.com',
  whatsapp: {
    display: '+92 312 2347665',
    number: '923122347665',
  },
  location: 'Pakistan · Remote-friendly',

  // Photograph slot: drop your portrait at public/images/profile.jpg.
  // While the file is missing the UI shows a typographic fallback.
  portrait: 'images/profile.jpg',

  // Editable availability status — shown as a hero chip.
  availability: {
    status: 'Open to opportunities',
    detail: 'Discussing remote roles, full-time positions and freelance projects.',
  },

  // ── About ────────────────────────────────────────────────────────────
  bio: [
    'I’m Muhammad Hashir Khan, an AI Automation Developer. My work sits at the point where business processes meet AI: taking repetitive, rule-heavy operations and folding them into intelligent workflows that run with fewer manual touches.',
    'In practice that means designing automation logic around real operational needs — validating data before it enters a system, structuring AI output so downstream tools can trust it, wiring APIs and webhooks together, and making sure failures degrade safely instead of silently. Around that core I also build and improve websites, applications, WordPress sites, search visibility, campaigns and written content.',
    'I care about honest engineering: solutions that do what they claim, integrations that behave predictably, and work that a non-technical stakeholder can understand and trust.',
  ],
  capabilities: [
    'AI-powered workflows',
    'API & webhook integration',
    'Automation architecture',
    'Structured AI output',
    'Chat experiences',
    'Web & app builds',
  ],

  // Fill these in as information becomes verified — leave [] to hide.
  education: [] as string[],
  experience: [] as string[],
  certifications: [] as string[],
  achievements: [] as string[],
};

// ── Resume slot ────────────────────────────────────────────────────────
export const resume = {
  label: 'Download Resume',
  file: '/files/resume.pdf', // drop your PDF at public/files/resume.pdf
  note: 'Formatted PDF version of my profile — upload it at public/files/resume.pdf and it becomes downloadable automatically.',
};

// ── Marquee strip (home) ───────────────────────────────────────────────
export const marquee = [
  'AI Automation',
  'LLM Workflows',
  'API Integration',
  'Webhooks',
  'React',
  'TypeScript',
  'Node.js',
  'Gemini API',
  'WordPress',
  'SEO',
];

// ── Contact helpers ────────────────────────────────────────────────────
export const socialLinks = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammad-hashir-khan-991b45436' },
  { id: 'github', label: 'GitHub', href: 'https://github.com/Muhammad-Hashir-Khan' },
  { id: 'upwork', label: 'Upwork', href: 'https://www.upwork.com/freelancers/~016c3591be4e9f68d4' },
  { id: 'fiverr', label: 'Fiverr', href: 'https://www.fiverr.com/mhashirkhan__' },
] as const;

export type SocialId = (typeof socialLinks)[number]['id'];

// ── Services (also drives the pricing page) ────────────────────────────
export interface Service {
  id: string;
  index: string;
  name: string;
  description: string;
  price: number;
  capabilities: string[];
  waMessage: string;
  note?: string;
  featured?: boolean;
}

export const services: Service[] = [
  {
    id: 'ai-automation',
    index: '01',
    name: 'AI Automation Development',
    description:
      'Intelligent workflows, AI-powered business processes, API integrations and automation solutions designed around real operational needs.',
    price: 30,
    featured: true,
    capabilities: [
      'AI-powered workflows',
      'Business process automation',
      'API integrations',
      'AI assistants',
      'Chatbot integrations',
      'Automated notifications',
      'Data processing workflows',
      'App-to-app integrations',
      'Workflow validation',
      'Error handling & reliability',
    ],
    waMessage: "Hello Hashir — I'd like to discuss AI Automation Development for my business.",
  },
  {
    id: 'web-dev',
    index: '02',
    name: 'Web Development',
    description: 'Professional responsive websites, landing pages and web applications built to modern standards.',
    price: 30,
    capabilities: ['Responsive websites', 'Landing pages', 'Web applications', 'Frontend engineering'],
    waMessage: "Hello Hashir — I'm interested in Web Development services.",
  },
  {
    id: 'app-dev',
    index: '03',
    name: 'App Development',
    description: 'Application development based on clearly defined requirements and an appropriate technology stack.',
    price: 30,
    capabilities: ['Scoped app builds', 'Defined requirements', 'Stack planning'],
    waMessage: "Hello Hashir — I'm interested in App Development services.",
  },
  {
    id: 'wordpress',
    index: '04',
    name: 'WordPress Development',
    description: 'Business websites, WordPress customization, theme development where supported, and website improvements.',
    price: 25,
    capabilities: ['Business sites', 'Customization', 'Theme work', 'Site improvements'],
    waMessage: "Hello Hashir — I'm interested in WordPress Development services.",
  },
  {
    id: 'seo',
    index: '05',
    name: 'SEO Services',
    description: 'Technical SEO, on-page optimization, website structure and search visibility improvements.',
    price: 25,
    capabilities: ['Technical SEO', 'On-page optimization', 'Site structure', 'Search visibility'],
    note: 'No first-page ranking guarantees — improvements are built on verifiable best practice.',
    waMessage: "Hello Hashir — I'm interested in SEO services.",
  },
  {
    id: 'meta-ads',
    index: '06',
    name: 'Meta Ads',
    description: 'Advertising campaign setup, campaign management, audience strategy and performance analysis according to the agreed scope.',
    price: 30,
    capabilities: ['Campaign setup', 'Management', 'Audience strategy', 'Performance analysis'],
    note: 'No advertising-result guarantees — outcomes always depend on offers and budgets.',
    waMessage: "Hello Hashir — I'm interested in Meta Ads services.",
  },
  {
    id: 'content-writing',
    index: '07',
    name: 'Content Writing',
    description: 'Website copy, landing-page content, service descriptions and business-focused written content.',
    price: 25,
    capabilities: ['Website copy', 'Landing-page content', 'Service descriptions', 'Business writing'],
    waMessage: "Hello Hashir — I'm interested in Content Writing services.",
  },
  {
    id: 'solutions',
    index: '08',
    name: 'Additional Digital Solutions',
    description: 'A flexible structure for future services — automation audits, custom integrations, tooling and digital process improvements.',
    price: 30,
    capabilities: ['Automation audits', 'Custom integrations', 'Tooling', 'Process improvements'],
    waMessage: "Hello Hashir — I have a project in mind I'd like to discuss.",
  },
];

// ── Projects (demonstrations — honestly labeled) ───────────────────────
export type ProjectVisual = 'pipeline' | 'assistant' | 'triage' | 'invoice';

export interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  badge: string;
  summary: string;
  visual: ProjectVisual;
  tech: string[];
  details: {
    problem: string;
    workflow: string;
    logic: string;
    systems: string;
    validation: string;
    outcome: string;
  };
}

export const projects: Project[] = [
  {
    id: 'lead-intake',
    index: '01',
    title: 'Intelligent Lead-Intake Workflow',
    category: 'AI Automation — Data Capture & Routing',
    badge: 'Technical demonstration',
    summary:
      'A documented workflow pattern that turns scattered inbound inquiries into validated, structured, routed records — with retries and a dead-letter path.',
    visual: 'pipeline',
    tech: ['Node.js', 'Webhooks', 'LLM structured output', 'Rules engine', 'Notifications'],
    details: {
      problem:
        'Businesses receive inquiries across multiple channels — forms, messaging, social inboxes. Copying details into a system by hand is slow, error-prone and inconsistent, and leads often sink without an accurate record.',
      workflow:
        '1) An inquiry arrives through a webhook endpoint. 2) A validation layer checks required fields and formats before anything else runs. 3) An AI step converts free-form text into structured JSON — name, contact, request, urgency, budget band. 4) Business rules decide priority and destination. 5) A notification is dispatched; transient failures are retried automatically.',
      logic:
        'Deterministic validation guards the AI step: the model’s output is schema-checked before it is trusted. Rule-based routing stays explainable — every decision can be traced to a field the workflow evaluated.',
      systems:
        'Webhook endpoint · LLM API (structured output) · Rules engine · Notification service (email / messaging) · Structured logging',
      validation:
        'Required-field checks, type and format guards, schema-validated AI output, duplicate suppression, and an explicit retry budget with a dead-letter path for anything that still fails.',
      outcome:
        'Demonstration pattern — not a publicly documented client engagement. The architecture is ready to be connected to a real intake channel on request.',
    },
  },
  {
    id: 'portfolio-assistant',
    index: '02',
    title: 'On-Site AI Portfolio Assistant',
    category: 'AI Application — Secure LLM Integration',
    badge: 'Technical demonstration',
    summary:
      'This very website’s assistant: a guard-railed chat experience answering strictly from verified profile facts through a server-side Gemini endpoint.',
    visual: 'assistant',
    tech: ['React', 'TypeScript', 'Node serverless', 'Gemini API', 'Rate limiting'],
    details: {
      problem:
        'Publishing an AI API key in browser code leaks it instantly, and unguarded assistants happily invent qualifications a person doesn’t have.',
      workflow:
        'Chat UI → serverless /api/chat endpoint → schema-validated request → Gemini API call with a strict, fact-locked system prompt → validated reply rendered back in the panel.',
      logic:
        'The API key never leaves the server. Input length caps, per-IP rate limiting and a session-trimmed history keep usage sane; the system prompt may only state facts from the verified fact file.',
      systems: 'React chat UI · Serverless function · Gemini API · Rate limiter · Vercel',
      validation:
        'Body size and type checks, history trimming, honest "not provided" answers for anything unknown, and a graceful offline fallback that points visitors to direct contact channels.',
      outcome: 'Shipping live on this portfolio — the assistant launcher is in the corner of every page.',
    },
  },
  {
    id: 'support-triage',
    index: '03',
    title: 'Support-Request Triage Pattern',
    category: 'AI Automation — Classification & Filtering',
    badge: 'Technical demonstration',
    summary:
      'An illustrative pattern for classifying, prioritizing and routing inbound support requests without manual triage — with a human-queue fallback.',
    visual: 'triage',
    tech: ['TypeScript', 'Prompt design', 'Automation logic', 'Simulation'],
    details: {
      problem:
        'Manual triage slows response time, and the same edge cases get routed wrongly over and over because decisions live in people’s heads.',
      workflow:
        'New ticket → category and priority classification → sanity checks (blacklists, duplicates) → routing to a queue or an auto-summary reply → escalation path for high-priority items.',
      logic:
        'AI suggests the classification; deterministic thresholds decide routing. Unknown categories fall back to a human queue instead of a confident guess.',
      systems: 'Ticket intake · LLM classification · Queue routing · Auto-reply composer',
      validation:
        'A confidence floor before auto-routing, duplicate detection, retry and back-off on provider errors, plus a full action log for audit.',
      outcome:
        'Illustrative — the pattern is documented here as a case study and can be demonstrated live on request.',
    },
  },
  {
    id: 'invoice-fields',
    index: '04',
    title: 'Invoice Field Assistant',
    category: 'AI Automation — Document Data Extraction',
    badge: 'Technical demonstration',
    summary:
      'Extracting structured fields from business documents and pushing them to a destination system — with schema validation and a low-confidence review queue.',
    visual: 'invoice',
    tech: ['LLM structured output', 'JSON schema', 'Node.js', 'Validation'],
    details: {
      problem:
        'Retyping fields from invoices and business documents wastes hours and introduces small, expensive errors into accounting records.',
      workflow:
        'Document upload → extraction prompt returns JSON (invoice number, date, total, currency) → schema validation → human review for low-confidence fields → export to the destination system.',
      logic:
        'Schema enforcement on everything the model returns; deterministic checks on dates and amounts; the review queue stops silent AI mistakes from reaching real records.',
      systems: 'Document intake · LLM extraction · JSON schema validation · Export API',
      validation:
        'Field-level confidence, an arithmetic cross-check (line items vs recorded total), a hard block when validation fails, and retries on transient failures.',
      outcome:
        'Demonstration pattern — intended to be wired to a real inbox or drive pipeline when a client needs it.',
    },
  },
];

// ── Skills (editable, honest) ──────────────────────────────────────────
export interface SkillCategory {
  id: string;
  title: string;
  items: string[];
  featured?: boolean;
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'specialization',
    title: 'Primary specialization',
    featured: true,
    items: ['AI Automation Development', 'Intelligent workflow design', 'Automation architecture'],
  },
  {
    id: 'automation',
    title: 'Automation & integration',
    items: [
      'API integrations',
      'Webhooks & event flows',
      'Validation & error handling',
      'Automated notifications',
      'Workflow orchestration patterns',
    ],
  },
  {
    id: 'web',
    title: 'Web development',
    items: ['React & TypeScript', 'Responsive interfaces', 'REST & serverless backends', 'Modern CSS engineering', 'Vite tooling'],
  },
  {
    id: 'ai',
    title: 'AI & APIs',
    items: ['Gemini API integration', 'LLM prompt engineering', 'Structured output handling', 'Chat experience design'],
  },
  {
    id: 'additional',
    title: 'Additional skills',
    items: ['App development', 'WordPress development', 'SEO', 'Meta Ads', 'Content writing'],
  },
];

export const skillsNote =
  'These lists are intentionally honest — they reflect what I can actually demonstrate today, and they grow alongside new work.';

// ── Process ────────────────────────────────────────────────────────────
export interface ProcessStage {
  index: string;
  title: string;
  text: string;
}

export const processStages: ProcessStage[] = [
  { index: '01', title: 'Discover', text: 'Understand the business, the real bottleneck, and what “done” must look like — in plain language.' },
  { index: '02', title: 'Plan', text: 'Define the workflow, integrations, data shape and success criteria before any code exists.' },
  { index: '03', title: 'Build', text: 'Develop the automation or application in small, verifiable increments.' },
  { index: '04', title: 'Test', text: 'Validate functionality, edge cases and failure behaviour — automations must fail safely.' },
  { index: '05', title: 'Deliver', text: 'Ship with documentation, a walkthrough, and everything agreed in scope.' },
  { index: '06', title: 'Improve', text: 'Monitor, tune and extend where the engagement includes ongoing improvements.' },
];

// ── Professional opportunities ─────────────────────────────────────────
export interface Opportunity {
  id: string;
  title: string;
  text: string;
  waMessage: string;
}

export const opportunities: Opportunity[] = [
  {
    id: 'remote-roles',
    title: 'Remote roles',
    text: 'Distributed teams that need an engineer who thinks in systems, not just screens.',
    waMessage: "Hello Hashir — I'd like to discuss a remote AI Automation Developer role.",
  },
  {
    id: 'permanent',
    title: 'Permanent positions',
    text: 'Long-term positions in companies building automation into their operations.',
    waMessage: "Hello Hashir — I'm hiring for a permanent position and want to discuss it.",
  },
  {
    id: 'freelance',
    title: 'Freelance projects',
    text: 'Scoped automation, web or integration projects with clear deliverables.',
    waMessage: "Hello Hashir — I have a freelance project I'd like to scope with you.",
  },
  {
    id: 'collaboration',
    title: 'Technical collaboration',
    text: 'Founders, agencies and developers exploring AI-powered builds together.',
    waMessage: "Hello Hashir — I'd like to explore a technical collaboration with you.",
  },
];

// ── Pricing copy ───────────────────────────────────────────────────────
export const pricing = {
  disclaimer:
    'Starting prices are indicative. Final pricing depends on project scope, complexity, integrations, features, delivery requirements and ongoing support. A complete application or enterprise automation system costs more than a starting price.',
  currency: 'USD',
};

// ── Chatbot (interface copy + suggestions) ─────────────────────────────
export const chatbot = {
  name: 'Portfolio Assistant',
  subtitle: 'Gemini-powered · answers from verified profile facts',
  welcome:
    "Hello — I'm the portfolio assistant for Muhammad Hashir Khan. Ask me about his specialization, services, starting prices or how to reach him. I only share what's listed on this site.",
  suggestions: [
    'What does Muhammad specialize in?',
    'What AI automation services does he offer?',
    'What are his starting prices?',
    'How can I discuss a project?',
    'Can I contact him about a remote position?',
    'Which technologies does he actually use?',
  ],
  maxChars: 1000,
};
