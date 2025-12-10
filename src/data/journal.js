export const journalInfo = {
  title: "Aurora Journal of Systems Engineering",
  shortTitle: "AJSE",
  issn: "2791-4021 (online)",
  doiPrefix: "10.56890/ajse",
  frequency: "Quarterly, published online-first",
  description:
    "Peer-reviewed, open-access journal for intelligent systems, resilient infrastructure, and trustworthy AI.",
  tagline: "Fast, rigorous, and transparent publication for applied research.",
  indexingBadges: [
    "Crossref DOI ready",
    "Open Access compliant",
    "Google Scholar friendly",
    "LOCKSS archiving ready",
  ],
  focusAreas: [
    "Autonomous and cyber-physical systems",
    "Data-centric AI and trustworthy ML",
    "Smart energy, mobility, and built environments",
    "Secure distributed systems and edge/cloud orchestration",
    "Human-in-the-loop decision support",
    "Sustainable computing and green software",
  ],
  publicationTimeline: [
    { title: "Desk check", detail: "48h formatting and scope screening" },
    { title: "Double-blind review", detail: "10-14 days average turn-around" },
    { title: "Author revision", detail: "1-2 weeks revision window" },
    { title: "Acceptance", detail: "Decision letter + invoice issued" },
    { title: "Online first", detail: "DOI minted within 72h after payment" },
  ],
  policies: {
    ethics: [
      "COPE-aligned editorial practices",
      "Conflicts of interest declared by authors, reviewers, and editors",
      "Data/code availability statements encouraged for reproducibility",
    ],
    plagiarism: [
      "< 15% total similarity; no single source above 5%",
      "Mandatory plagiarism and AI-writing detection at submission",
      "Retractions follow COPE guidelines",
    ],
    openAccess:
      "Gold OA. Authors retain copyright with CC BY 4.0 licensing and perpetual hosting.",
  },
};

export const editorialBoard = [
  {
    name: "Dr. Anika Rao",
    role: "Editor-in-Chief",
    affiliation: "Indian Institute of Technology Delhi, India",
    focus: "Autonomous and intelligent systems",
  },
  {
    name: "Prof. Luca Marin",
    role: "Deputy Editor",
    affiliation: "Politecnico di Milano, Italy",
    focus: "Cyber-physical infrastructure and control",
  },
  {
    name: "Dr. Maya Castillo",
    role: "Managing Editor",
    affiliation: "Universidad de los Andes, Colombia",
    focus: "Human-centered computing and resilience",
  },
  {
    name: "Prof. Elise Tan",
    role: "Associate Editor",
    affiliation: "National University of Singapore, Singapore",
    focus: "Trustworthy AI and verification",
  },
  {
    name: "Dr. David Mensah",
    role: "Associate Editor",
    affiliation: "University of Cape Town, South Africa",
    focus: "Smart energy and sustainability",
  },
  {
    name: "Prof. Satoshi Nakahara",
    role: "Associate Editor",
    affiliation: "Tohoku University, Japan",
    focus: "Edge computing and distributed systems",
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
    "8-12 pages, double-column IEEE style, 12pt main text, single-spaced",
    "Include title page with author affiliations, ORCID, and corresponding author email",
    "All figures at 300 DPI minimum; vector formats preferred for line art",
  ],
  files: [
    "Manuscript (DOCX or LaTeX PDF) with line numbers",
    "Cover letter stating novelty and conflict-of-interest declarations",
    "Signed publication ethics statement (auto-generated after submission)",
    "Optional: dataset/code link with license and checksum",
  ],
  referencing: [
    "IEEE numeric citation style with DOI where available",
    "APA 7th is accepted for humanities-focused sections",
    "Reference managers: provide .bib or .ris file for camera-ready",
  ],
  fee: {
    amount: 120,
    currency: "USD",
    includes: [
      "DOI registration via Crossref",
      "Professional copyediting and typesetting",
      "Long-term archiving and hosting",
    ],
    waiver:
      "Fee charged only after acceptance. Waivers/discounts available for students and researchers from low-income economies.",
  },
  plagiarism: null, // filled below to avoid circular reference lint complaints
  submissionFormat: ["DOCX", "PDF"],
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
  email: "editorial.office@ajse.org",
  support: "+91-98765-43210",
  whatsapp: "+91-98765-43210",
  address: "Research Park, 4th Floor, Sector 22, Bengaluru, India",
  officeHours: "09:00-18:00 IST, Monday-Friday",
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
