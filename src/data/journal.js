export const journalInfo = {
  title: "International Journal of AI-Driven Discovery",
  shortTitle: "IJAIDD",
  issn: "2791-4021 (online)",
  doiPrefix: "10.56890/ajse",
  frequency: "Bimonthly (Six issues in a year)",
  description:
    "An international, peer-reviewed scholarly publication dedicated to advancing research in Artificial Intelligence (AI) and its transformative role across Science, Engineering, Technology, and Society.",
  tagline: "Bridging Theory and Application in the Age of AI.",
  aboutFull: [
    "The journal is an international, peer-reviewed scholarly publication dedicated to advancing research in Artificial Intelligence (AI) and its transformative role across Science, Engineering, Technology, and Society. As AI rapidly becomes a foundational driver of innovation, discovery, and decision-making, the journal provides a high-quality academic platform for publishing original research that contributes to both theoretical advancement and practical implementation of intelligent systems. The journal aims to support and promote interdisciplinary and cross-sector research, recognizing that many of today’s global challenges require AI-driven solutions that transcend traditional disciplinary boundaries.",
    "A defining characteristic of the journal is its strong commitment to ethical, responsible, and transparent AI research. In addition to technical excellence, the journal promotes studies addressing explainability, fairness, accountability, robustness, and governance of AI systems. Research that examines the societal, legal, and ethical implications of AI deployment is considered essential to ensuring that technological progress aligns with human values and public interest.",
  ],
  aims: [
    "Promote cutting-edge AI research across interdisciplinary domains",
    "Bridge theoretical AI research with real-world applications",
    "Encourage ethical, responsible, and explainable AI systems",
    "Support global collaboration between academia and industry",
  ],
  objectives: [
    "Publish original and impactful AI research",
    "Ensure rapid yet rigorous peer review",
    "Provide open and accessible knowledge dissemination",
    "Support early-career researchers and students",
  ],
  detailedScope: [
    {
      category: "Core Artificial Intelligence",
      topics: [
        "Machine Learning & Deep Learning",
        "Generative AI & Large Language Models",
        "Computer Vision & NLP",
        "Reinforcement Learning",
        "Explainable & Trustworthy AI",
      ],
    },
    {
      category: "AI for Science & Engineering",
      topics: [
        "AI for Physics, Chemistry & Materials",
        "AI-Driven Engineering Design",
        "Robotics & Intelligent Automation",
        "Smart Manufacturing & Industry 4.0",
      ],
    },
    {
      category: "AI in Technology & Society",
      topics: [
        "AI for Healthcare & Life Sciences",
        "AI for Climate, Environment & Sustainability",
        "AI Ethics, Law & Governance",
        "AI for Smart Cities & IoT",
      ],
    },
  ],
  scopeNote: "Interdisciplinary research and AI-driven discovery papers are strongly encouraged.",
  indexingBadges: [
    "Google Scholar (Planned)",
    "DOAJ (Planned)",
    "Scopus (Planned)",
    "Web of Science (Planned)",
  ],
  publicationTimeline: [
    { title: "Editorial Desk Check", detail: "Same day of submission" },
    { title: "Double-blind Review", detail: "Completed within 15 days" },
    { title: "Author Revision", detail: "1-2 weeks window" },
    { title: "DOI & Publication", detail: "Online within 72h of acceptance" },
  ],
  policies: {
    peerReview: {
      type: "Double-blind peer review",
      description: "Each manuscript is reviewed by at least two independent expert reviewers selected based on subject expertise.",
      timeline: [
        { stage: "Initial editorial decision", period: "Same day of submission" },
        { stage: "Peer-review decision", period: "Within 15 days" }
      ]
    },
    ethics: [
      "Author Responsibilities: Original work, proper citation, disclosure of conflicts, ethical research.",
      "Editorial Responsibilities: Fair decision-making, confidentiality, ethical oversight.",
      "Reviewer Responsibilities: Objective evaluation, confidentiality, timely review."
    ],
    aiUsage: "Authors must disclose the use of AI tools. AI-generated content must be critically reviewed and validated by authors.",
    plagiarism: [
      "Similarity index must be below 15%",
      "Mandatory plagiarism screening for all manuscripts",
      "Self-plagiarism and duplicate submissions are prohibited"
    ],
    copyright: "Authors retain copyright. Articles published under Creative Commons licenses with proper attribution required.",
    openAccess: "Gold Open Access (USD 100) or Subscription-based (No publication fee).",
    launchOffer: "Full waiver for all papers submitted until 01.06.2026. Accepted papers will be published free of cost."
  },
};

export const editorialBoard = [
  {
    name: "Dr. Ragul Sambath",
    role: "Editor-in-Chief",
    email: "editor@ajse.org",
    affiliation: "Department of Electrical and Electronics Engineering, Chettinad College of Engineering and Technology",
    bio: "Dr. Ragul Sambath is a dedicated researcher and faculty member specializing in Electrical and Electronics Engineering with a strong focus on intelligent and data-driven technologies. His academic interests include AI-enabled engineering systems, smart technologies, and applied research innovation. As Editor-in-Chief, he oversees the peer-review process, editorial decisions, and quality assurance, ensuring timely and transparent publication of high-impact research.",
    focus: "AI-enabled engineering, smart technologies",
  },
  {
    name: "Dr. V. Nagaraj",
    role: "Editor-in-Chief",
    email: "nagaraj@ajse.org",
    affiliation: "Department of Electrical and Electronics Engineering, Chettinad College of Engineering and Technology",
    focus: "Power systems, AI in renewable energy",
  },
  {
    name: "Prof. Luca Marin",
    role: "Associate Editor",
    affiliation: "Politecnico di Milano, Italy",
    focus: "Cyber-physical infrastructure and control",
  },
  {
    name: "Dr. Maya Castillo",
    role: "Associate Editor",
    affiliation: "Universidad de los Andes, Colombia",
    focus: "Human-centered computing and resilience",
  },
];

export const reviewerPool = [
  "Dr. Irene Kovacs - Safety assurance",
  "Dr. Minsoo Park - Reinforcement learning",
  "Dr. Salim Farouk - Cybersecurity",
  "Dr. Aline Dubois - Transportation systems",
  "Dr. Peter Wood - Data governance",
];

export const currentIssue = {
  volume: 12,
  issue: 4,
  month: "November",
  year: 2025,
  theme: "Trustworthy Autonomy and Resilient Infrastructure",
  published: "Published online November 12, 2025",
  papers: [
    {
      title:
        "Risk-aware Decision Layers for Mission-Critical Autonomous Vehicles",
      authors: "A. Ilyas, C. Mehta, J. Fern",
      doi: "10.56890/ajse.12.4.001",
      pages: "1-14",
      pdfUrl: "#",
      abstract:
        "A layered decision architecture combining verifiable safety shields with learning-based controllers to reduce disengagements by 28% across 1.2M km simulations.",
      keywords: ["autonomy", "verification", "safety cases"],
    },
    {
      title: "Adaptive Microgrid Orchestration with Physics-Informed RL",
      authors: "L. Marin, E. Tan, P. Wood",
      doi: "10.56890/ajse.12.4.002",
      pages: "15-32",
      pdfUrl: "#",
      abstract:
        "Demonstrates a physics-informed reinforcement learning controller that stabilizes hybrid microgrids under 15% renewable volatility without curtailment.",
      keywords: ["microgrids", "reinforcement learning", "energy systems"],
    },
    {
      title: "Privacy-Preserving Multimodal Federated Models for Hospitals",
      authors: "D. Mensah, S. Nakahara",
      doi: "10.56890/ajse.12.4.003",
      pages: "33-52",
      pdfUrl: "#",
      abstract:
        "Introduces a multimodal federated learning pipeline with differential privacy that achieves 92.1% F1 on ICU risk detection across four hospitals.",
      keywords: ["federated learning", "privacy", "healthcare AI"],
    },
    {
      title: "Cascading Failure Simulation for Smart Rail Networks",
      authors: "K. Meier, I. Kovacs",
      doi: "10.56890/ajse.12.4.004",
      pages: "53-70",
      pdfUrl: "#",
      abstract:
        "A Monte Carlo stress-testing framework that uncovers hidden coupling in rail signaling, reducing incident propagation by 34% in a digital twin.",
      keywords: ["digital twins", "transportation", "simulation"],
    },
  ],
};

export const archiveIssues = [
  {
    volume: 12,
    issue: 3,
    month: "August",
    year: 2025,
    theme: "Edge Intelligence and Adaptive Networks",
    published: "Published August 28, 2025",
    papers: [
      {
        title: "Latency-aware Scheduling for Federated Edge Clusters",
        authors: "M. Castillo, I. Park",
        doi: "10.56890/ajse.12.3.001",
        pages: "1-18",
        pdfUrl: "#",
        abstract:
          "A hybrid scheduler balancing accuracy and latency across heterogeneous edge hardware.",
        keywords: ["edge computing", "federated learning"],
      },
      {
        title: "Robust Graph Models for Critical Infrastructure",
        authors: "E. Tan, S. Farouk",
        doi: "10.56890/ajse.12.3.002",
        pages: "19-35",
        pdfUrl: "#",
        abstract:
          "Presents robustness-aware GNNs for cascading failure prediction under uncertainty.",
        keywords: ["graph neural networks", "resilience"],
      },
    ],
  },
  {
    volume: 12,
    issue: 2,
    month: "May",
    year: 2025,
    theme: "Sustainable Computing and Green Software",
    published: "Published May 14, 2025",
    papers: [
      {
        title: "Carbon Budgets for AI Inference in Production",
        authors: "S. Dubois, P. Wood",
        doi: "10.56890/ajse.12.2.001",
        pages: "1-21",
        pdfUrl: "#",
        abstract:
          "Defines service-level carbon budgets and telemetry for large-scale inference systems.",
        keywords: ["sustainability", "observability"],
      },
    ],
  },
];

export const submissionGuidelines = {
  formatting: [
    "Initial Submission: FREE FORMAT (No IEEE formatting required)",
    "File Format: Microsoft Word (.DOC or .DOCX) ONLY. No PDF or Latex accepted at initial stage",
    "Language: English only",
    "Max Length: 12 pages",
    "Post-Acceptance: Must strictly follow IEEE double-column format",
  ],
  files: [
    "Manuscript (DOCX only) with clear structure",
    "Cover letter with novelty statement",
    "Disclosure of AI usage in research/preparation",
  ],
  referencing: [
    "Standard academic referencing allowed for initial stage",
    "IEEE numeric style required for final camera-ready version",
  ],
  fee: {
    amount: 100,
    currency: "USD",
    includes: [
      "Open Access publication",
      "Permanent DOI assignment",
      "Global discoverability and indexing",
    ],
    waiver: "Full or partial waivers available for students and authors from low-income backgrounds. Requests accepted after acceptance.",
  },
  launchOffer: journalInfo.policies.launchOffer,
  plagiarism: journalInfo.policies.plagiarism,
  submissionFormat: ["DOCX"],
};

submissionGuidelines.plagiarism = journalInfo.policies.plagiarism;

export const doiInfo = {
  prefix: journalInfo.doiPrefix,
  registrar: "Crossref (enrollment-ready)",
  policy:
    "DOIs minted at acceptance; metadata pushed to Crossref within 48 hours of publication.",
};

export const paymentInfo = {
  gateways: ["Razorpay", "Stripe"],
  currency: submissionGuidelines.fee.currency,
  amount: submissionGuidelines.fee.amount,
  note: "Process payment only after formal acceptance. Pro-forma invoices and receipts are issued automatically.",
  verification: [
    "Auto-capture payment intent ID and receipt URL",
    "Manual verification queue for wire transfers",
    "Match payment to submission ID before publication",
  ],
};

export const contactInfo = {
  email: "editor@ajse.org",
  support: "Dr. V. Nagaraj: +91 99521 24414",
  whatsapp: "+91 99521 24414",
  whatsappNote: "WhatsApp only",
  address: "Chettinad College of Engineering and Technology, Karur, Tamil Nadu, India",
  officeHours: "09:00-18:00 IST, Monday-Saturday",
};

export const mockSubmissions = [
  {
    id: "AJSE-2025-0412",
    title: "Risk-aware Decision Layers for Mission-Critical Autonomous Vehicles",
    authors: "A. Ilyas, C. Mehta",
    status: "Under review",
    received: "12 Nov 2025",
    reviewer: "Dr. Irene Kovacs",
  },
  {
    id: "AJSE-2025-0331",
    title: "Adaptive Microgrid Orchestration with Physics-Informed RL",
    authors: "L. Marin, E. Tan",
    status: "Revisions requested",
    received: "02 Nov 2025",
    reviewer: "Dr. Salim Farouk",
  },
  {
    id: "AJSE-2025-0284",
    title: "Privacy-Preserving Multimodal Federated Models for Hospitals",
    authors: "D. Mensah, S. Nakahara",
    status: "Accepted",
    received: "24 Oct 2025",
    reviewer: "Dr. Minsoo Park",
  },
];

export const acceptanceEmailTemplate = {
  subject: "AJSE Acceptance and Next Steps",
  body: [
    "Thank you for submitting to the Aurora Journal of Systems Engineering.",
    "Your manuscript has been accepted subject to final copyediting.",
    `We will mint a DOI under prefix ${journalInfo.doiPrefix} and schedule online-first publication.`,
    "Kindly complete payment via Razorpay/Stripe or request an institutional invoice.",
  ],
};
