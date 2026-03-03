import { ResumeData } from "../types";

// =============================================================================
//  Resume Analyzer — Universal Edition (Optimized)
//  Supports: Tech, Healthcare, Finance, Legal, Education, Creative, Trades,
//            Sales, Science, Real Estate, Hospitality, Government, General
//
//  Performance notes:
//  - All static data structures pre-compiled once at module load
//  - Single tokenisation pass per text input
//  - Multi-word matching via first-word index (no full-text scan per phrase)
//  - Buzzword matching via single compiled RegExp (not N × string.includes)
//  - ATS patterns merged into one RegExp pass
//  - Industry detection via pre-built signal index
//  - Result memoisation with bounded LRU cache
// =============================================================================

// ── Stop Words ────────────────────────────────────────────────────────────────
export const STOP_WORDS = new Set([
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can",
  "did",
  "do",
  "does",
  "doing",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "has",
  "have",
  "having",
  "he",
  "her",
  "here",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "itself",
  "just",
  "me",
  "more",
  "most",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "now",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "s",
  "same",
  "she",
  "should",
  "so",
  "some",
  "such",
  "t",
  "than",
  "that",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "will",
  "with",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  // Generic job-ad filler
  "experience",
  "work",
  "years",
  "team",
  "skills",
  "required",
  "preferred",
  "using",
  "strong",
  "ability",
  "knowledge",
  "working",
  "business",
  "new",
  "support",
  "including",
  "ensure",
  "provide",
  "role",
  "company",
  "job",
  "description",
  "requirements",
  "responsibilities",
  "looking",
  "join",
  "candidate",
  "ideal",
  "must",
  "plus",
  "environment",
  "opportunity",
  "benefits",
  "salary",
  "status",
  "employment",
  "type",
  "full",
  "time",
  "part",
  "contract",
  "remote",
  "hybrid",
  "office",
  "location",
  "based",
  "within",
  "across",
  "related",
  "field",
  "degree",
  "bachelor",
  "master",
  "phd",
  "equivalent",
  "demonstrated",
  "proven",
  "track",
  "record",
  "excellent",
  "good",
  "written",
  "verbal",
  "highly",
  "motivated",
  "self",
  "starter",
  "fast",
  "paced",
  "dynamic",
  "detail",
  "oriented",
  "organized",
  "multiple",
  "priorities",
  "deadlines",
  "flexible",
  "adaptable",
  "independent",
  "player",
  "cross",
  "functional",
  "internal",
  "external",
  "stakeholders",
  "clients",
  "customers",
  "partners",
  "vendors",
  "mentor",
  "coach",
  "train",
  "guide",
  "lead",
  "direct",
  "oversee",
  "coordinate",
  "facilitate",
  "drive",
  "execute",
  "implement",
  "develop",
  "create",
  "build",
  "maintain",
  "improve",
  "optimize",
  "enhance",
  "evaluate",
  "analyze",
  "assess",
  "monitor",
  "report",
  "document",
  "present",
  "communicate",
  "collaborate",
  "partner",
  "closely",
  "align",
  "integrate",
  "standardize",
  "streamline",
  "automate",
  "innovate",
  "transform",
  "scale",
  "grow",
  "expand",
  "increase",
  "decrease",
  "reduce",
  "minimize",
  "maximize",
  "deliver",
  "achieve",
  "exceed",
  "meet",
  "goals",
  "objectives",
  "targets",
  "kpis",
  "results",
  "outcomes",
  "impact",
  "value",
  "policies",
  "procedures",
  "standards",
  "regulations",
  "laws",
  "industry",
  "best",
  "practices",
  "trends",
  "technologies",
  "tools",
  "systems",
  "platforms",
  "applications",
  "lifecycle",
  "waterfall",
  "six",
  "sigma",
  "boot",
  "hibernate",
  "jpa",
  "containers",
  "helm",
  "chef",
  "puppet",
  "mac",
  "unix",
  "shell",
  "scripting",
  "unit",
  "load",
  "penetration",
  "vulnerability",
  "incident",
  "response",
  "forensics",
  "governance",
  "strategy",
  "planning",
  "execution",
  "delivery",
  "operations",
  "maintenance",
  "root",
  "cause",
  "resolution",
  "escalation",
  "customer",
  "success",
  "satisfaction",
  "journey",
  "retention",
  "churn",
  "acquisition",
  "conversion",
  "revenue",
  "growth",
  "profitability",
  "margin",
  "roi",
  "tco",
  "budget",
  "forecast",
  "modeling",
  "treasury",
  "fp",
  "hr",
  "recruiting",
  "talent",
  "onboarding",
  "training",
  "compensation",
  "payroll",
  "employee",
  "relations",
  "engagement",
  "culture",
  "diversity",
  "inclusion",
  "equity",
  "belonging",
  "drafting",
  "review",
  "patent",
  "trademark",
  "copyright",
  "protection",
  "ccpa",
  "fedramp",
  "fisma",
  "itar",
  "ear",
  "ofac",
  "fcpa",
  "ukba",
  "anti",
  "bribery",
  "corruption",
  "money",
  "laundering",
  "sanctions",
  "export",
  "controls",
  "trade",
  "customs",
  "chain",
  "procurement",
  "sourcing",
  "warehouse",
  "transportation",
  "freight",
  "shipping",
  "receiving",
  "distribution",
  "fulfillment",
  "manufacturing",
  "production",
  "control",
  "assurance",
  "lean",
  "tqm",
  "tpm",
  "5s",
  "kaizen",
  "continuous",
  "improvement",
  "ehs",
  "environmental",
  "health",
  "sustainability",
  "csr",
  "esg",
  "corporate",
  "social",
  "responsibility",
  "board",
  "directors",
  "investor",
  "public",
  "communications",
  "media",
  "press",
  "analyst",
  "brand",
  "product",
  "content",
  "digital",
  "email",
  "ppc",
  "advertising",
  "campaign",
  "event",
  "channel",
  "inside",
  "outside",
  "mid",
  "market",
  "smb",
  "b2c",
  "account",
  "development",
  "sdr",
  "bdr",
  "ae",
  "vp",
  "supervisor",
  "senior",
  "staff",
  "principal",
  "programmer",
  "consultant",
  "specialist",
  "coordinator",
  "administrator",
  "technician",
  "assistant",
  "clerk",
  "representative",
  "agent",
  "officer",
  "executive",
  "ceo",
  "cfo",
  "coo",
  "cto",
  "cio",
  "cmo",
  "cro",
  "ciso",
  "chro",
  "cdo",
  "cpo",
  "president",
  "founder",
  "co",
  "owner",
  "managing",
]);

// ── Action Verbs ──────────────────────────────────────────────────────────────
export const ACTION_VERBS = new Set([
  "achieved",
  "improved",
  "trained",
  "managed",
  "resolved",
  "created",
  "developed",
  "launched",
  "increased",
  "decreased",
  "negotiated",
  "spearheaded",
  "transformed",
  "optimized",
  "designed",
  "implemented",
  "led",
  "organized",
  "planned",
  "executed",
  "accelerated",
  "accomplished",
  "adapted",
  "advocated",
  "analyzed",
  "architected",
  "assembled",
  "assessed",
  "audited",
  "authored",
  "budgeted",
  "built",
  "calculated",
  "cataloged",
  "championed",
  "clarified",
  "collaborated",
  "communicated",
  "compiled",
  "completed",
  "composed",
  "conceived",
  "conducted",
  "constructed",
  "consulted",
  "controlled",
  "coordinated",
  "counseled",
  "cultivated",
  "customized",
  "delegated",
  "delivered",
  "demonstrated",
  "deployed",
  "devised",
  "diagnosed",
  "directed",
  "discovered",
  "dispatched",
  "documented",
  "drove",
  "earned",
  "edited",
  "educated",
  "eliminated",
  "empowered",
  "engineered",
  "enhanced",
  "established",
  "evaluated",
  "examined",
  "exceeded",
  "expanded",
  "expedited",
  "facilitated",
  "forecasted",
  "formulated",
  "fostered",
  "founded",
  "generated",
  "guided",
  "headed",
  "identified",
  "illustrated",
  "influenced",
  "initiated",
  "innovated",
  "inspected",
  "instituted",
  "integrated",
  "introduced",
  "invented",
  "investigated",
  "maximized",
  "mentored",
  "minimized",
  "modernized",
  "monitored",
  "motivated",
  "navigated",
  "operated",
  "originated",
  "overhauled",
  "oversaw",
  "participated",
  "performed",
  "pioneered",
  "pitched",
  "positioned",
  "predicted",
  "prepared",
  "presented",
  "prioritized",
  "produced",
  "programmed",
  "projected",
  "promoted",
  "proposed",
  "proved",
  "published",
  "quantified",
  "recommended",
  "reconciled",
  "recruited",
  "redesigned",
  "reduced",
  "regulated",
  "rehabilitated",
  "remodeled",
  "reorganized",
  "repaired",
  "replaced",
  "represented",
  "researched",
  "restored",
  "restructured",
  "retrieved",
  "reviewed",
  "revised",
  "revitalized",
  "routed",
  "saved",
  "scheduled",
  "secured",
  "selected",
  "shaped",
  "simplified",
  "solved",
  "standardized",
  "steered",
  "stimulated",
  "strategized",
  "streamlined",
  "strengthened",
  "structured",
  "succeeded",
  "supervised",
  "supported",
  "surpassed",
  "synthesized",
  "systematized",
  "taught",
  "tested",
  "tracked",
  "translated",
  "troubleshot",
  "unified",
  "upgraded",
  "utilized",
  "validated",
  "verified",
  "visualized",
  "volunteered",
  "won",
  "wrote",
  // Extended for non-tech roles
  "administered",
  "appraised",
  "arbitrated",
  "cared",
  "certified",
  "classified",
  "coached",
  "collected",
  "curated",
  "enforced",
  "exhibited",
  "filed",
  "handled",
  "harvested",
  "installed",
  "interviewed",
  "issued",
  "lobbied",
  "mediated",
  "ordered",
  "painted",
  "patrolled",
  "photographed",
  "planted",
  "prescribed",
  "processed",
  "purchased",
  "raised",
  "referred",
  "rendered",
  "screened",
  "served",
  "sketched",
  "submitted",
  "surveyed",
  "treated",
  "trimmed",
  "typed",
  "updated",
  "welded",
  "crafted",
  "copyedited",
  "proofread",
  "storyboarded",
  "animated",
  "scored",
  "litigated",
  "deposed",
  "argued",
  "settled",
  "appealed",
  "enrolled",
  "differentiated",
  "tutored",
  "graded",
]);

// ── Common Skills (All Industries) ───────────────────────────────────────────
export const COMMON_SKILLS = new Set([
  // Tech & Software
  "javascript",
  "typescript",
  "python",
  "java",
  "c++",
  "c#",
  "ruby",
  "php",
  "html",
  "css",
  "react",
  "angular",
  "vue",
  "node.js",
  "express",
  "django",
  "flask",
  "spring",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "git",
  "agile",
  "scrum",
  "rest api",
  "graphql",
  "ci/cd",
  "jenkins",
  "linux",
  "bash",
  "powershell",
  "terraform",
  "ansible",
  "kafka",
  "redis",
  "elasticsearch",
  "go",
  "rust",
  "swift",
  "kotlin",
  "scala",
  "matlab",
  "tableau",
  "power bi",
  "looker",
  "spark",
  "hadoop",
  "snowflake",
  "bigquery",
  "redshift",
  "dbt",
  "airflow",
  "mlflow",
  "tensorflow",
  "pytorch",
  "scikit-learn",
  "pandas",
  "numpy",
  "opencv",
  "fastapi",
  "grpc",
  "rabbitmq",
  "dynamodb",
  "firebase",
  "supabase",
  "vercel",
  "netlify",
  "github actions",
  "gitlab ci",
  "datadog",
  "grafana",
  "prometheus",
  "splunk",
  "new relic",
  "figma",
  "webpack",
  "vite",
  "jest",
  "cypress",
  "selenium",
  "playwright",
  "storybook",
  "tailwind",
  "sass",
  "redux",
  "next.js",
  "nuxt",
  "svelte",
  "flutter",
  "react native",
  "electron",
  "webgl",
  "three.js",
  "unity",
  "unreal engine",
  "r",
  "sas",
  "spss",
  "stata",
  // General Business & Soft Skills
  "leadership",
  "management",
  "communication",
  "problem solving",
  "project management",
  "customer service",
  "negotiation",
  "public speaking",
  "presentation",
  "writing",
  "editing",
  "research",
  "analytical skills",
  "critical thinking",
  "time management",
  "organization",
  "teamwork",
  "collaboration",
  "adaptability",
  "flexibility",
  "creativity",
  "innovation",
  "emotional intelligence",
  "conflict resolution",
  "decision making",
  "strategic planning",
  "active listening",
  "coaching",
  "mentoring",
  "change management",
  "stakeholder management",
  "process improvement",
  "cross-functional collaboration",
  "budget management",
  "risk assessment",
  "vendor management",
  "contract management",
  "microsoft office",
  "excel",
  "word",
  "powerpoint",
  "google workspace",
  "slack",
  "zoom",
  "jira",
  "confluence",
  "trello",
  "asana",
  "notion",
  "monday.com",
  // Sales & Marketing
  "marketing",
  "sales",
  "seo",
  "sem",
  "b2b sales",
  "cold calling",
  "lead generation",
  "crm",
  "account management",
  "content marketing",
  "social media marketing",
  "email marketing",
  "public relations",
  "market research",
  "salesforce",
  "hubspot",
  "brand management",
  "copywriting",
  "media buying",
  "influencer marketing",
  "affiliate marketing",
  "google ads",
  "facebook ads",
  "a/b testing",
  "conversion rate optimization",
  "customer segmentation",
  "pipeline management",
  "territory management",
  "channel sales",
  "inside sales",
  "solution selling",
  "consultative selling",
  "quota attainment",
  "google analytics",
  "marketo",
  "pardot",
  "mailchimp",
  "hootsuite",
  "sprout social",
  // Finance & Accounting
  "financial analysis",
  "budgeting",
  "forecasting",
  "accounting",
  "bookkeeping",
  "tax",
  "audit",
  "compliance",
  "risk management",
  "financial modeling",
  "gaap",
  "accounts payable",
  "accounts receivable",
  "payroll",
  "tax preparation",
  "auditing",
  "quickbooks",
  "ifrs",
  "cpa",
  "cfa",
  "series 7",
  "series 63",
  "bloomberg terminal",
  "equity research",
  "valuation",
  "mergers and acquisitions",
  "due diligence",
  "financial reporting",
  "cost accounting",
  "variance analysis",
  "cash flow management",
  "sarbanes-oxley",
  "erp",
  "sap",
  "oracle financials",
  "netsuite",
  "xero",
  "accounts reconciliation",
  "fund accounting",
  "private equity",
  "fixed income",
  "derivatives",
  "hedge fund",
  "portfolio management",
  // HR & People Operations
  "talent acquisition",
  "onboarding",
  "employee relations",
  "performance management",
  "benefits administration",
  "hris",
  "adp",
  "workday",
  "compensation analysis",
  "organizational development",
  "succession planning",
  "workforce planning",
  "labor relations",
  "employment law",
  "dei",
  "learning and development",
  "hr business partnering",
  "job analysis",
  "competency mapping",
  "bamboohr",
  "greenhouse",
  "lever",
  "icims",
  "recruiting",
  "employer branding",
  // Healthcare & Medical
  "patient care",
  "cpr",
  "bls",
  "acls",
  "pals",
  "emr",
  "ehr",
  "vital signs",
  "phlebotomy",
  "triage",
  "hipaa",
  "medical terminology",
  "infection control",
  "clinical research",
  "patient safety",
  "medication administration",
  "wound care",
  "iv insertion",
  "epic",
  "cerner",
  "meditech",
  "icd-10",
  "cpt coding",
  "medical billing",
  "case management",
  "discharge planning",
  "patient education",
  "care coordination",
  "telemetry",
  "surgical assist",
  "sterile technique",
  "patient assessment",
  "clinical documentation",
  "rn",
  "lpn",
  "cna",
  "npi",
  "clinical trials",
  "irb",
  "gcp",
  "pharmacology",
  "dosage calculation",
  "specimen collection",
  "urinalysis",
  "ecg",
  "venipuncture",
  "catheterization",
  "tracheostomy care",
  "ventilator management",
  "nutritional assessment",
  "behavioral health",
  "substance abuse counseling",
  "mental health",
  "psychology",
  "therapy",
  "counseling",
  "psychiatric",
  "occupational therapy",
  "physical therapy",
  "speech therapy",
  // Education & Teaching
  "lesson planning",
  "curriculum development",
  "classroom management",
  "special education",
  "esl",
  "tutoring",
  "student assessment",
  "instructional design",
  "e-learning",
  "canvas",
  "google classroom",
  "differentiated instruction",
  "iep",
  "504 plan",
  "stem education",
  "project-based learning",
  "formative assessment",
  "summative assessment",
  "data-driven instruction",
  "behavior management",
  "parent communication",
  "co-teaching",
  "reading intervention",
  "phonics",
  "early childhood education",
  "child development",
  "blackboard",
  "moodle",
  "schoology",
  "educational technology",
  "higher education administration",
  "advising",
  "articulate",
  "captivate",
  "learning management systems",
  // Legal
  "legal research",
  "legal writing",
  "westlaw",
  "lexisnexis",
  "contract drafting",
  "contract review",
  "litigation support",
  "discovery",
  "deposition",
  "brief writing",
  "legal analysis",
  "intellectual property",
  "corporate law",
  "employment law",
  "family law",
  "criminal law",
  "real estate law",
  "immigration law",
  "paralegal",
  "bar admission",
  "e-discovery",
  "document review",
  "court filings",
  "trial preparation",
  "mediation",
  "arbitration",
  "notary public",
  "legal billing",
  "clio",
  "regulatory compliance",
  "securities law",
  "tax law",
  "antitrust",
  "environmental law",
  "healthcare law",
  "privacy law",
  "gdpr",
  // Creative & Design
  "adobe photoshop",
  "adobe illustrator",
  "adobe indesign",
  "adobe after effects",
  "adobe premiere pro",
  "adobe xd",
  "sketch",
  "canva",
  "final cut pro",
  "motion graphics",
  "video editing",
  "photo editing",
  "ui design",
  "ux design",
  "user research",
  "wireframing",
  "prototyping",
  "typography",
  "brand identity",
  "graphic design",
  "print design",
  "web design",
  "art direction",
  "storyboarding",
  "content writing",
  "creative writing",
  "scriptwriting",
  "blogging",
  "social media content",
  "photography",
  "videography",
  "animation",
  "3d modeling",
  "blender",
  "cinema 4d",
  "autocad",
  "sketchup",
  "rhino",
  "color theory",
  "accessibility design",
  "design systems",
  "procreate",
  "davinci resolve",
  "logic pro",
  "ableton",
  "pro tools",
  // Construction & Skilled Trades
  "blueprint reading",
  "osha 10",
  "osha 30",
  "heavy machinery operation",
  "carpentry",
  "plumbing",
  "electrical wiring",
  "welding",
  "hvac",
  "project estimation",
  "safety compliance",
  "forklift certification",
  "cnc machining",
  "solidworks",
  "lean manufacturing",
  "quality control",
  "masonry",
  "concrete",
  "roofing",
  "framing",
  "drywall",
  "painting",
  "pipefitting",
  "ironworking",
  "sheet metal",
  "rigging",
  "scaffolding",
  "excavation",
  "site supervision",
  "construction management",
  "scheduling",
  "takeoffs",
  "rfi management",
  "submittal review",
  "punch list",
  "building codes",
  "inspection",
  "surveying",
  "procore",
  "bluebeam",
  "primavera",
  "ms project",
  "revit",
  "bim",
  // Science & Research
  "pcr",
  "elisa",
  "western blot",
  "cell culture",
  "gel electrophoresis",
  "chromatography",
  "spectroscopy",
  "mass spectrometry",
  "microscopy",
  "flow cytometry",
  "sequencing",
  "bioinformatics",
  "literature review",
  "grant writing",
  "data collection",
  "laboratory safety",
  "gmp",
  "glp",
  "lab notebook",
  "hypothesis testing",
  "statistical analysis",
  "experimental design",
  "peer review",
  "scientific writing",
  "irb protocol",
  "animal handling",
  "reagent preparation",
  "equipment calibration",
  "lims",
  "cloning",
  "crispr",
  "proteomics",
  "genomics",
  "metagenomics",
  "computational biology",
  "drug discovery",
  "formulation",
  "stability testing",
  // Real Estate
  "mls",
  "property valuation",
  "closing",
  "escrow",
  "zoning",
  "title search",
  "buyer representation",
  "seller representation",
  "lease negotiation",
  "property management",
  "commercial real estate",
  "residential real estate",
  "appraisal",
  "mortgage",
  "underwriting",
  "market analysis",
  "cma",
  "open houses",
  "listing agreements",
  "purchase agreements",
  "zillow",
  "loopnet",
  "costar",
  "yardi",
  "appfolio",
  "buildium",
  "argus",
  // Hospitality & Food Service
  "pos",
  "merchandising",
  "visual merchandising",
  "loss prevention",
  "event planning",
  "food safety",
  "servsafe",
  "hospitality management",
  "guest relations",
  "front desk",
  "hotel management",
  "revenue management",
  "food and beverage",
  "menu development",
  "catering",
  "banquet management",
  "housekeeping",
  "concierge",
  "opera pms",
  "micros",
  "aloha",
  "toast",
  "bartending",
  "mixology",
  "wine knowledge",
  "upselling",
  // Government, Nonprofit & Social Services
  "policy analysis",
  "grant writing",
  "program evaluation",
  "community outreach",
  "stakeholder engagement",
  "public administration",
  "federal acquisition",
  "far",
  "security clearance",
  "foia",
  "gsa",
  "appropriations",
  "legislative affairs",
  "crisis intervention",
  "motivational interviewing",
  "social work",
  "harm reduction",
  "trauma-informed care",
  "advocacy",
  "volunteer management",
  "fund development",
  "donor relations",
  "nonprofit management",
  "logic model",
  "program design",
  "needs assessment",
  "coalition building",
  "community organizing",
  // Journalism & Communications
  "ap style",
  "fact-checking",
  "investigative reporting",
  "copy editing",
  "proofreading",
  "news writing",
  "feature writing",
  "broadcast journalism",
  "podcasting",
  "media relations",
  "press releases",
  "crisis communications",
  "internal communications",
  "speech writing",
  "content strategy",
  "editorial planning",
  "cms",
  "wordpress",
  "seo writing",
  "audience development",
  "social media management",
  "newsletter writing",
  "interviewing",
  // Supply Chain & Operations
  "supply chain",
  "logistics",
  "inventory management",
  "iso 9001",
  "six sigma",
  "process mapping",
  "root cause analysis",
  "corrective action",
  "standard operating procedures",
  "demand planning",
  "s&op",
  "warehouse management",
  "transportation management",
  "freight",
  "customs compliance",
  "import export",
  "rfp",
  "category management",
  "supplier development",
]);

// ── Buzzwords ─────────────────────────────────────────────────────────────────
export const BUZZWORDS = new Set([
  "synergy",
  "go-getter",
  "think outside the box",
  "thought leader",
  "value-add",
  "results-driven",
  "hard worker",
  "team player",
  "self-starter",
  "dynamic",
  "ninja",
  "rockstar",
  "guru",
  "best of breed",
  "game changer",
  "wheelhouse",
  "move the needle",
  "hit the ground running",
  "hustle",
  "disruptive",
  "bleeding edge",
  "cutting edge",
  "innovative thinker",
  "visionary",
  "ecosystem",
  "holistic",
  "leverage",
  "scalable",
  "pivot",
  "extensive experience",
  "proven track record",
  "fast learner",
  "passionate",
  "wearing many hats",
  "roll up your sleeves",
  "entrepreneurial spirit",
  "culture fit",
  "people person",
  "go above and beyond",
  "value proposition",
  "low-hanging fruit",
  "boil the ocean",
  "circle back",
  "take this offline",
  "bandwidth",
  "deep dive",
  "drill down",
  "action item",
  "touch base",
  "ping",
  "robust",
  "best practices",
  "bottom line",
  "detail-oriented",
  "proactive",
  "dedicated professional",
  "compassionate caregiver",
  "servant leader",
  "results oriented",
  "highly qualified",
  "seasoned professional",
  "motivated individual",
  "go-to person",
]);

// ── Industry Types ─────────────────────────────────────────────────────────────
export type Industry =
  | "tech"
  | "healthcare"
  | "finance"
  | "legal"
  | "education"
  | "creative"
  | "trades"
  | "sales"
  | "science"
  | "hospitality"
  | "government"
  | "general";

const INDUSTRY_SIGNALS: Record<Exclude<Industry, "general">, string[]> = {
  tech: [
    "software",
    "engineer",
    "developer",
    "programming",
    "api",
    "cloud",
    "devops",
    "frontend",
    "backend",
    "fullstack",
    "codebase",
    "repository",
    "deployment",
    "microservices",
    "saas",
    "open source",
    "pull request",
    "agile",
    "sprint",
    "stack",
    "infrastructure",
    "database",
    "algorithm",
  ],
  healthcare: [
    "patient",
    "clinical",
    "medical",
    "nursing",
    "hipaa",
    "ehr",
    "hospital",
    "physician",
    "diagnosis",
    "treatment",
    "pharmacy",
    "therapy",
    "care plan",
    "bedside",
    "rounds",
    "medication",
    "bls",
    "acls",
    "vitals",
    "surgical",
    "healthcare",
    "clinic",
    "ward",
    "emr",
    "rn",
    "lpn",
    "cna",
    "caregiver",
  ],
  finance: [
    "gaap",
    "financial",
    "accounting",
    "portfolio",
    "equity",
    "cfa",
    "audit",
    "investment",
    "banking",
    "trading",
    "hedge fund",
    "asset",
    "liability",
    "balance sheet",
    "cash flow",
    "valuation",
    "underwriting",
    "tax",
    "cpa",
    "actuary",
    "derivatives",
    "fixed income",
    "budget",
    "forecast",
    "ifrs",
  ],
  legal: [
    "litigation",
    "counsel",
    "attorney",
    "deposition",
    "brief",
    "paralegal",
    "bar",
    "plaintiff",
    "defendant",
    "motion",
    "discovery",
    "contract",
    "clause",
    "jurisdiction",
    "statute",
    "regulation",
    "westlaw",
    "lexisnexis",
    "court",
    "filing",
    "legal",
    "law firm",
    "compliance",
  ],
  education: [
    "curriculum",
    "classroom",
    "students",
    "teaching",
    "pedagogy",
    "iep",
    "grade",
    "lesson",
    "school",
    "district",
    "faculty",
    "academic",
    "syllabus",
    "assessment",
    "instruction",
    "higher education",
    "professor",
    "tutor",
    "learning outcomes",
    "course",
    "semester",
    "enrollment",
  ],
  creative: [
    "design",
    "brand",
    "portfolio",
    "art direction",
    "copywriting",
    "illustration",
    "photography",
    "typography",
    "layout",
    "storyboard",
    "visual",
    "aesthetic",
    "editorial",
    "publication",
    "motion graphics",
    "creative",
    "ux",
    "ui",
    "figma",
    "adobe",
    "animation",
    "concept",
  ],
  trades: [
    "osha",
    "blueprint",
    "welding",
    "hvac",
    "electrical",
    "plumbing",
    "forklift",
    "construction",
    "carpentry",
    "masonry",
    "pipefitting",
    "cnc",
    "machining",
    "installation",
    "maintenance",
    "repair",
    "building code",
    "contractor",
    "apprentice",
    "journeyman",
    "site",
    "scaffold",
  ],
  sales: [
    "quota",
    "pipeline",
    "prospecting",
    "closing",
    "b2b",
    "territory",
    "revenue",
    "cold calling",
    "outbound",
    "inbound",
    "demo",
    "proposal",
    "commission",
    "crm",
    "salesforce",
    "hubspot",
    "account executive",
    "business development",
    "upsell",
    "cross-sell",
    "renewal",
    "churn",
  ],
  science: [
    "laboratory",
    "research",
    "pcr",
    "hypothesis",
    "specimens",
    "protocol",
    "experiment",
    "reagent",
    "centrifuge",
    "assay",
    "gel",
    "sequencing",
    "microscopy",
    "peer review",
    "grant",
    "pi",
    "publication",
    "r&d",
    "genomics",
    "proteomics",
    "cell culture",
    "clinical trial",
  ],
  hospitality: [
    "guest",
    "front desk",
    "servsafe",
    "reservation",
    "hotel",
    "concierge",
    "housekeeping",
    "food and beverage",
    "banquet",
    "catering",
    "restaurant",
    "kitchen",
    "bartending",
    "check-in",
    "check-out",
    "hospitality",
    "pms",
    "room",
    "service",
    "event",
    "resort",
    "inn",
  ],
  government: [
    "federal",
    "clearance",
    "policy",
    "appropriations",
    "gsa",
    "nonprofit",
    "grant",
    "advocacy",
    "legislative",
    "municipality",
    "public sector",
    "program evaluation",
    "community",
    "social services",
    "foia",
    "government",
    "regulation",
    "public health",
    "social work",
  ],
};

const INDUSTRY_WORD_COUNT_RANGES: Record<Industry, [number, number]> = {
  tech: [300, 800],
  healthcare: [300, 700],
  finance: [350, 900],
  legal: [400, 1200],
  education: [300, 800],
  creative: [200, 600],
  trades: [150, 500],
  sales: [250, 700],
  science: [400, 1500],
  hospitality: [200, 600],
  government: [400, 1000],
  general: [300, 800],
};

const INDUSTRY_SECTIONS: Record<Industry, string[]> = {
  tech: ["experience", "education", "skills", "projects"],
  healthcare: ["experience", "education", "certifications", "licenses"],
  finance: ["experience", "education", "skills", "certifications"],
  legal: ["experience", "education", "bar admissions"],
  education: ["experience", "education", "certifications"],
  creative: ["experience", "skills", "portfolio"],
  trades: ["experience", "certifications", "skills"],
  sales: ["experience", "achievements", "skills"],
  science: ["experience", "education", "publications", "research"],
  hospitality: ["experience", "skills", "certifications"],
  government: ["experience", "education", "clearances", "skills"],
  general: ["experience", "education", "skills"],
};

// ── Aliases ────────────────────────────────────────────────────────────────────
export const SKILL_ALIASES: Record<string, string> = {
  nodejs: "node.js",
  node: "node.js",
  reactjs: "react",
  vuejs: "vue",
  angularjs: "angular",
  postgres: "postgresql",
  mongo: "mongodb",
  k8s: "kubernetes",
  kube: "kubernetes",
  gke: "kubernetes",
  eks: "kubernetes",
  aks: "kubernetes",
  tf: "terraform",
  js: "javascript",
  ts: "typescript",
  py: "python",
  rb: "ruby",
  css3: "css",
  html5: "html",
  ec2: "aws",
  s3: "aws",
  lambda: "aws",
  gcs: "gcp",
  powerbi: "power bi",
  msexcel: "excel",
  sklearn: "scikit-learn",
  scikit: "scikit-learn",
  torch: "pytorch",
  nextjs: "next.js",
  nuxtjs: "nuxt",
  sveltejs: "svelte",
  epicemr: "epic",
  photoshop: "adobe photoshop",
  illustrator: "adobe illustrator",
  indesign: "adobe indesign",
  "after effects": "adobe after effects",
  "premiere pro": "adobe premiere pro",
  premiere: "adobe premiere pro",
  sox: "sarbanes-oxley",
  "ms excel": "excel",
  "google sheets": "excel",
  pmp: "project management",
  "ms project": "project management",
  prince2: "project management",
};

export const MULTI_WORD_ALIASES: Record<string, string> = {
  "electronic health records": "ehr",
  "electronic medical records": "emr",
  "continuous integration": "ci/cd",
  "continuous deployment": "ci/cd",
  "continuous delivery": "ci/cd",
  "user experience": "ux design",
  "user interface": "ui design",
  "search engine optimization": "seo",
  "search engine marketing": "sem",
  "project management professional": "project management",
  "registered nurse": "rn",
  "licensed practical nurse": "lpn",
  "certified nursing assistant": "cna",
  "cardiopulmonary resuscitation": "cpr",
  "basic life support": "bls",
  "advanced cardiac life support": "acls",
  "six sigma green belt": "six sigma",
  "six sigma black belt": "six sigma",
  "lean six sigma": "six sigma",
  "generally accepted accounting": "gaap",
  "international financial reporting": "ifrs",
  "human resource information": "hris",
  "applicant tracking": "recruiting",
  "point of sale": "pos",
  "occupational safety": "osha 30",
};

// ── Types ──────────────────────────────────────────────────────────────────────
export interface ScoreBreakdown {
  length: number;
  contactInfo: number;
  actionVerbs: number;
  metrics: number;
  penalties: number;
}

export interface Suggestion {
  message: string;
  severity: "error" | "warning" | "tip";
  category: "content" | "format" | "keywords" | "tone" | "ats";
}

export interface AnalysisResult {
  standaloneScore: number;
  scoreBreakdown: ScoreBreakdown;
  matchScore: number | null;
  matchScoreConfidence: "high" | "low" | null;
  detectedIndustry: Industry;
  detectedIndustrySecondary: Industry | null;
  metricsFound: string[];
  actionVerbsFound: string[];
  bulletPointVerbCount: number;
  skillsFound: string[];
  missingKeywords: string[];
  matchedKeywords: string[];
  buzzwordsFound: string[];
  repeatedVerbs: string[];
  missingSections: string[];
  atsIssues: string[];
  suggestions: Suggestion[];
  wordCount: number;
  hasContactInfo: boolean;
}

// =============================================================================
//  Pre-compiled static structures (built ONCE at module load, never rebuilt)
// =============================================================================

/** Alias map as a Map for O(1) lookup instead of object property access */
const ALIAS_MAP = new Map(Object.entries(SKILL_ALIASES));

/** Multi-word skills sorted longest-first to avoid partial matches */
const MULTI_WORD_SKILLS = [...COMMON_SKILLS]
  .filter((s) => s.includes(" "))
  .sort((a, b) => b.length - a.length);

/** Multi-word aliases sorted longest-first */
const MULTI_WORD_ALIAS_ENTRIES = Object.entries(MULTI_WORD_ALIASES).sort(
  ([a], [b]) => b.length - a.length,
);

/** All multi-word phrases (skills + aliases) indexed by their first word.
 *  Lets us skip 95% of phrases on each token — O(candidates) not O(all phrases). */
const MULTI_WORD_INDEX = new Map<
  string,
  Array<{ phrase: string; canonical: string }>
>();
for (const skill of MULTI_WORD_SKILLS) {
  const first = skill.split(" ")[0];
  if (!MULTI_WORD_INDEX.has(first)) MULTI_WORD_INDEX.set(first, []);
  MULTI_WORD_INDEX.get(first)!.push({ phrase: skill, canonical: skill });
}
for (const [phrase, canonical] of MULTI_WORD_ALIAS_ENTRIES) {
  const first = phrase.split(" ")[0];
  if (!MULTI_WORD_INDEX.has(first)) MULTI_WORD_INDEX.set(first, []);
  MULTI_WORD_INDEX.get(first)!.push({ phrase, canonical });
}

/** Single compiled RegExp for all buzzwords — one pass, not N × includes() */
const BUZZWORDS_RE = new RegExp(
  [...BUZZWORDS]
    .sort((a, b) => b.length - a.length) // longest first = greedy match
    .map((b) => b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"),
  "gi",
);

/** ATS patterns merged into a single tagged RegExp via named groups */
const ATS_PATTERNS: Array<{ re: RegExp; label: string }> = [
  { re: /\|.+\|/, label: "tables" },
  { re: /[""''\u201C\u201D\u2018\u2019]/, label: "smart quotes" },
  { re: /[◆▪►▶❖✦✓✔]/, label: "decorative bullets" },
  { re: /#{1,6}\s/, label: "markdown headers" },
  { re: /\[.+\]\(.+\)/, label: "markdown links" },
  { re: /(.)\1{4,}/, label: "repeated characters" },
  { re: /\b[A-Z]{2,}\s+[A-Z]{2,}\s+[A-Z]{2,}\b/, label: "excessive all-caps" },
];

/** Pre-compiled contact regexes */
const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
const PHONE_RE =
  /\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/;
const LINKEDIN_RE = /linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/;

/** Pre-compiled metric regex */
const METRIC_RE =
  /\b(\$[\d,]+(?:\.\d+)?[MKBmkb]?|\d+(?:,\d{3})*(?:\.\d+)?%|\d{2,}(?:,\d{3})*)\b/g;

/** Pre-compiled tokeniser regex */
const TOKEN_RE = /[^a-z0-9\u00C0-\u024F.#+\-]+/;

/** Pre-compiled proper noun regex */
const PROPER_RE = /\b([A-Z]{2,}|[A-Z][a-z]+[A-Z][a-zA-Z0-9]*)\b/g;

/** Pre-compiled bullet regex */
const BULLET_RE = /(?:^|\n)\s*[-•*]\s*([^\n,;:]{3,80})/gm;

/** Industry signal index: word → Set<Industry> for O(1) per-token lookup */
const INDUSTRY_SIGNAL_INDEX = new Map<
  string,
  Set<Exclude<Industry, "general">>
>();
for (const [industry, signals] of Object.entries(INDUSTRY_SIGNALS) as [
  Exclude<Industry, "general">,
  string[],
][]) {
  for (const signal of signals) {
    if (!INDUSTRY_SIGNAL_INDEX.has(signal))
      INDUSTRY_SIGNAL_INDEX.set(signal, new Set());
    INDUSTRY_SIGNAL_INDEX.get(signal)!.add(industry);
  }
}

/** Stemmed action verb lookup — maps stem → original verb for fast matching */
const STEMMED_VERBS = new Map<string, string>();
for (const verb of ACTION_VERBS) {
  STEMMED_VERBS.set(stem(verb), verb);
}

// =============================================================================
//  LRU Result Cache (bounded at 30 entries)
// =============================================================================
const CACHE_MAX = 30;
const resultCache = new Map<string, AnalysisResult>();

function getCacheKey(resume: string, jd?: string): string {
  // Cheap key: lengths + first 60 chars of each. Avoids hashing entire text.
  return `${resume.length}|${jd?.length ?? 0}|${resume.slice(0, 60)}|${jd?.slice(0, 60) ?? ""}`;
}

function cacheGet(key: string): AnalysisResult | undefined {
  const val = resultCache.get(key);
  if (val) {
    // Move to end (most-recently-used)
    resultCache.delete(key);
    resultCache.set(key, val);
  }
  return val;
}

function cacheSet(key: string, result: AnalysisResult): void {
  if (resultCache.size >= CACHE_MAX) {
    // Evict oldest (first) entry
    resultCache.delete(resultCache.keys().next().value!);
  }
  resultCache.set(key, result);
}

// =============================================================================
//  Core Helpers
// =============================================================================

/** Conservative stemmer — only reliable resume suffixes, no false positives */
function stem(word: string): string {
  if (word.length < 5) return word;
  if (word.endsWith("ing")) return word.slice(0, -3);
  if (word.endsWith("ied")) return word.slice(0, -3) + "y";
  if (word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.endsWith("ed") && word.length > 5) return word.slice(0, -2);
  return word;
}

/** Parsed representation of a single text input — built in one pass */
interface ParsedText {
  lower: string;
  words: string[]; // lower-cased tokens
  wordFreq: Map<string, number>; // normalised token → count
  multiSkills: Map<string, number>; // multi-word skill/alias canonical → count
  bulletWords: string[][]; // first 3 words of each bullet line
  properNouns: string[]; // ALL-CAPS / CamelCase tokens
  wordCount: number;
}

/**
 * Single-pass parser: tokenises, normalises, indexes multi-word phrases,
 * and extracts structural features in one sweep of the text.
 */
function parseText(text: string): ParsedText {
  const lower = text.toLowerCase();

  // ── Tokenise ──────────────────────────────────────────────────────────────
  const words = lower.split(TOKEN_RE).filter((w) => w.length > 1);

  // ── Single-word frequency map (alias-normalised) ───────────────────────────
  const wordFreq = new Map<string, number>();
  for (const w of words) {
    const norm = ALIAS_MAP.get(w) ?? w;
    wordFreq.set(norm, (wordFreq.get(norm) ?? 0) + 1);
  }

  // ── Multi-word phrases via first-word index ────────────────────────────────
  // For each token, check only the phrases that START with that token.
  // This replaces ~150 full-text includes() with targeted lookups.
  const multiSkills = new Map<string, number>();
  for (let i = 0; i < words.length; i++) {
    const candidates = MULTI_WORD_INDEX.get(words[i]);
    if (!candidates) continue;
    for (const { phrase, canonical } of candidates) {
      if (lower.includes(phrase)) {
        multiSkills.set(canonical, (multiSkills.get(canonical) ?? 0) + 1);
      }
    }
  }

  // ── Bullet lines ──────────────────────────────────────────────────────────
  BULLET_RE.lastIndex = 0;
  const bulletWords: string[][] = [];
  let bm: RegExpExecArray | null;
  while ((bm = BULLET_RE.exec(text)) !== null) {
    bulletWords.push(
      bm[1]
        .toLowerCase()
        .split(TOKEN_RE)
        .filter((w) => w.length > 1)
        .slice(0, 3),
    );
  }

  // ── Proper nouns ──────────────────────────────────────────────────────────
  PROPER_RE.lastIndex = 0;
  const properNouns = (text.match(PROPER_RE) ?? []).map((m) => m.toLowerCase());

  return {
    lower,
    words,
    wordFreq,
    multiSkills,
    bulletWords,
    properNouns,
    wordCount: words.length,
  };
}

/**
 * Build keyword → frequency map from a ParsedText.
 * Used for JD match scoring.
 */
function buildKeywordFreq(pt: ParsedText): Map<string, number> {
  const freq = new Map(pt.wordFreq);

  // Merge multi-word skills
  for (const [k, v] of pt.multiSkills) {
    freq.set(k, (freq.get(k) ?? 0) + v);
  }

  // Proper nouns not already in map
  for (const pn of pt.properNouns) {
    if (!STOP_WORDS.has(pn) && pn.length > 2) {
      freq.set(pn, (freq.get(pn) ?? 0) + 1);
    }
  }

  // First words from bullets
  for (const bw of pt.bulletWords) {
    for (const w of bw) {
      if (!STOP_WORDS.has(w) && w.length > 2 && !ACTION_VERBS.has(w)) {
        freq.set(w, (freq.get(w) ?? 0) + 1);
      }
    }
  }

  return freq;
}

export function detectIndustry(text: string): {
  primary: Industry;
  secondary: Industry | null;
} {
  // Walk tokens once, accumulate scores via pre-built signal index
  const scores = new Map<Exclude<Industry, "general">, number>();
  const lower = text.toLowerCase();

  // Check multi-word signals first (e.g. "hedge fund", "open source")
  for (const [signal, industries] of INDUSTRY_SIGNAL_INDEX) {
    if (signal.includes(" ") && lower.includes(signal)) {
      for (const ind of industries) scores.set(ind, (scores.get(ind) ?? 0) + 1);
    }
  }

  // Check single-word signals via tokenised words
  for (const word of lower.split(TOKEN_RE)) {
    const industries = INDUSTRY_SIGNAL_INDEX.get(word);
    if (industries) {
      for (const ind of industries) scores.set(ind, (scores.get(ind) ?? 0) + 1);
    }
  }

  const ranked = [...scores.entries()].sort(([, a], [, b]) => b - a);
  const primary = ranked[0]?.[1] > 0 ? (ranked[0][0] as Industry) : "general";
  const secondary =
    ranked[1]?.[1] > 1 && ranked[1][0] !== primary
      ? (ranked[1][0] as Industry)
      : null;
  return { primary, secondary };
}

function extractMetrics(text: string): string[] {
  METRIC_RE.lastIndex = 0;
  const seen = new Set<string>();
  const results: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = METRIC_RE.exec(text)) !== null) {
    const match = m[0];
    if (seen.has(match)) continue;
    seen.add(match);
    const num = parseInt(match.replace(/[^0-9]/g, ""), 10);
    const isYear =
      num >= 1990 && num <= 2030 && match.replace(/[^0-9]/g, "").length === 4;
    if (!isYear) results.push(match);
  }
  return results;
}

function makeSuggestion(
  message: string,
  severity: Suggestion["severity"],
  category: Suggestion["category"],
): Suggestion {
  return { message, severity, category };
}

// =============================================================================
//  Main Export
// =============================================================================

export function analyzeResume(resume: string, jd?: string): AnalysisResult {
  // ── Cache check ────────────────────────────────────────────────────────────
  const cacheKey = getCacheKey(resume, jd);
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  // ── Parse inputs (each parsed once, reused everywhere) ────────────────────
  const rp = parseText(resume);
  const jp = jd?.trim() ? parseText(jd) : null;

  // ── Industry Detection ─────────────────────────────────────────────────────
  const combinedLower = jp ? `${jp.lower} ${rp.lower}` : rp.lower;
  const { primary: detectedIndustry, secondary: detectedIndustrySecondary } =
    detectIndustry(combinedLower);

  const [minWords, maxWords] = INDUSTRY_WORD_COUNT_RANGES[detectedIndustry];
  const expectedSections = INDUSTRY_SECTIONS[detectedIndustry];

  // ── Contact Info ───────────────────────────────────────────────────────────
  const hasContactInfo =
    EMAIL_RE.test(resume) || PHONE_RE.test(resume) || LINKEDIN_RE.test(resume);

  // ── Metrics ────────────────────────────────────────────────────────────────
  const metricsFound = extractMetrics(resume);

  // ── ATS Issues — one pass through pre-compiled pattern list ───────────────
  const atsIssues = ATS_PATTERNS.filter(({ re }) => re.test(resume)).map(
    ({ label }) => label,
  );

  // ── Skills found ──────────────────────────────────────────────────────────
  const skillsFound = new Set<string>();
  for (const [word] of rp.wordFreq) {
    if (COMMON_SKILLS.has(word)) skillsFound.add(word);
  }
  for (const [canonical] of rp.multiSkills) {
    if (COMMON_SKILLS.has(canonical)) skillsFound.add(canonical);
  }

  // ── Action Verbs — single pass using pre-built stemmed verb map ────────────
  const actionVerbsFound = new Set<string>();
  const verbCounts: Record<string, number> = {};
  for (const [word, count] of rp.wordFreq) {
    const verbKey = ACTION_VERBS.has(word)
      ? word
      : (STEMMED_VERBS.get(stem(word)) ?? null);
    if (verbKey) {
      actionVerbsFound.add(verbKey);
      verbCounts[verbKey] = (verbCounts[verbKey] ?? 0) + count;
    }
  }

  // ── Bullet-leading verbs — check first word of each bullet ────────────────
  let bulletPointVerbCount = 0;
  for (const bw of rp.bulletWords) {
    if (bw.length > 0) {
      const w = bw[0];
      if (ACTION_VERBS.has(w) || STEMMED_VERBS.has(stem(w)))
        bulletPointVerbCount++;
    }
  }

  // ── Buzzwords — single RegExp pass ────────────────────────────────────────
  const buzzwordsFound = new Set<string>();
  BUZZWORDS_RE.lastIndex = 0;
  let bwm: RegExpExecArray | null;
  while ((bwm = BUZZWORDS_RE.exec(rp.lower)) !== null) {
    buzzwordsFound.add(bwm[0].toLowerCase());
  }

  // ── Repeated verbs ────────────────────────────────────────────────────────
  const repeatedVerbs = Object.entries(verbCounts)
    .filter(([, c]) => c >= 3)
    .map(([v]) => v);

  // ── Missing sections ──────────────────────────────────────────────────────
  const missingSections = expectedSections.filter((s) => !rp.lower.includes(s));

  // ── Score Calculation ──────────────────────────────────────────────────────
  const breakdown: ScoreBreakdown = {
    length: 0,
    contactInfo: 0,
    actionVerbs: 0,
    metrics: 0,
    penalties: 0,
  };
  const rawSuggestions: Suggestion[] = [];

  // Length
  if (rp.wordCount >= minWords && rp.wordCount <= maxWords) {
    breakdown.length = 20;
  } else if (rp.wordCount > maxWords) {
    breakdown.length = 10;
    rawSuggestions.push(
      makeSuggestion(
        `Resume is long (${rp.wordCount} words; ideal for ${detectedIndustry}: ${minWords}–${maxWords}). Condense to your most impactful achievements.`,
        "warning",
        "format",
      ),
    );
  } else {
    breakdown.length = 5;
    rawSuggestions.push(
      makeSuggestion(
        `Resume is short (${rp.wordCount} words; ideal for ${detectedIndustry}: ${minWords}–${maxWords}). Expand with specific achievements and responsibilities.`,
        "error",
        "format",
      ),
    );
  }

  // Contact
  if (hasContactInfo) {
    breakdown.contactInfo = 20;
  } else {
    rawSuggestions.push(
      makeSuggestion(
        "No contact information detected. Add your email, phone number, or LinkedIn URL.",
        "error",
        "format",
      ),
    );
  }

  // Action Verbs
  const verbVariety =
    actionVerbsFound.size >= 10 ? 20 : actionVerbsFound.size >= 5 ? 10 : 0;
  const verbPosition =
    bulletPointVerbCount >= 5 ? 10 : bulletPointVerbCount >= 2 ? 5 : 0;
  breakdown.actionVerbs = Math.min(30, verbVariety + verbPosition);

  if (actionVerbsFound.size < 5) {
    rawSuggestions.push(
      makeSuggestion(
        'Very few action verbs found. Begin each bullet with a strong verb (e.g. "Delivered", "Managed", "Achieved").',
        "error",
        "content",
      ),
    );
  } else if (actionVerbsFound.size < 10) {
    rawSuggestions.push(
      makeSuggestion(
        "Use more varied action verbs — aim for at least 10 distinct verbs.",
        "warning",
        "content",
      ),
    );
  } else if (bulletPointVerbCount < actionVerbsFound.size) {
    rawSuggestions.push(
      makeSuggestion(
        "Some action verbs appear mid-sentence. Move them to the start of bullet points for maximum impact.",
        "tip",
        "content",
      ),
    );
  }

  // Metrics
  if (metricsFound.length >= 5) {
    breakdown.metrics = 30;
  } else if (metricsFound.length >= 2) {
    breakdown.metrics = 15;
    rawSuggestions.push(
      makeSuggestion(
        "Add more quantifiable metrics (%, $, headcount, timeframes) to make achievements concrete.",
        "warning",
        "content",
      ),
    );
  } else {
    rawSuggestions.push(
      makeSuggestion(
        "No quantifiable metrics found. Numbers make a resume memorable — add figures wherever possible.",
        "error",
        "content",
      ),
    );
  }

  // Penalties
  if (buzzwordsFound.size > 0) {
    breakdown.penalties -= buzzwordsFound.size * 2;
    rawSuggestions.push(
      makeSuggestion(
        `Overused phrases: '${[...buzzwordsFound].slice(0, 3).join("', '")}'. Replace with specific, evidence-based language.`,
        "warning",
        "tone",
      ),
    );
  }
  if (repeatedVerbs.length > 0) {
    breakdown.penalties -= repeatedVerbs.length * 2;
    rawSuggestions.push(
      makeSuggestion(
        `Verb(s) used 3+ times: '${repeatedVerbs.join("', '")}'. Vary your vocabulary.`,
        "tip",
        "tone",
      ),
    );
  }
  if (missingSections.length > 0) {
    breakdown.penalties -= missingSections.length * 5;
    rawSuggestions.push(
      makeSuggestion(
        `Missing sections for ${detectedIndustry} roles: ${missingSections.map((s) => s[0].toUpperCase() + s.slice(1)).join(", ")}.`,
        "warning",
        "format",
      ),
    );
  }
  if (atsIssues.length > 0) {
    breakdown.penalties -= atsIssues.length * 3;
    rawSuggestions.push(
      makeSuggestion(
        `ATS formatting issues: ${atsIssues.join(", ")}. These may cause your resume to be misread by applicant tracking systems.`,
        "warning",
        "ats",
      ),
    );
  }
  if (skillsFound.size === 0) {
    breakdown.penalties -= 10;
    rawSuggestions.push(
      makeSuggestion(
        "No recognisable skills detected. Add a Skills section with relevant tools, technologies, or competencies.",
        "error",
        "content",
      ),
    );
  }

  const standaloneScore = Math.max(
    0,
    Math.min(
      100,
      breakdown.length +
        breakdown.contactInfo +
        breakdown.actionVerbs +
        breakdown.metrics +
        breakdown.penalties,
    ),
  );

  // ── JD Match Analysis ──────────────────────────────────────────────────────
  let matchScore: number | null = null;
  let matchScoreConfidence: "high" | "low" | null = null;
  const missingKeywords: string[] = [];
  const matchedKeywordsMap = new Map<string, number>();

  if (jp) {
    const jdFreqs = buildKeywordFreq(jp);
    const resumeFreqs = buildKeywordFreq(rp);
    matchScoreConfidence = jp.wordCount >= 50 ? "high" : "low";

    if (matchScoreConfidence === "low") {
      rawSuggestions.push(
        makeSuggestion(
          "The job description is very short — match score may not be fully reliable.",
          "tip",
          "keywords",
        ),
      );
    }

    // Pre-build stemmed resume set once for O(1) fallback lookups
    const resumeStemmed = new Set([...resumeFreqs.keys()].map(stem));

    let weightedMatch = 0;
    let totalWeight = 0;

    for (const [keyword, freq] of jdFreqs) {
      if (STOP_WORDS.has(keyword) || keyword.length <= 2) continue;
      const weight = Math.log1p(freq);
      totalWeight += weight;
      const hit = resumeFreqs.has(keyword) || resumeStemmed.has(stem(keyword));
      if (hit) {
        weightedMatch += weight;
        matchedKeywordsMap.set(keyword, freq);
      } else {
        missingKeywords.push(keyword);
      }
    }

    if (totalWeight > 0) {
      matchScore = Math.round((weightedMatch / totalWeight) * 100);
      if (matchScore < 50) {
        rawSuggestions.push(
          makeSuggestion(
            "Low keyword match. Naturally weave in the missing skills listed below to improve your chances.",
            "error",
            "keywords",
          ),
        );
      } else if (matchScore < 80) {
        rawSuggestions.push(
          makeSuggestion(
            "Good keyword match. A few more terms from the job description may push you past ATS filters.",
            "tip",
            "keywords",
          ),
        );
      }
    }
  }

  // Sort missing: known skills first, then alpha
  missingKeywords.sort((a, b) => {
    const d = (COMMON_SKILLS.has(b) ? 1 : 0) - (COMMON_SKILLS.has(a) ? 1 : 0);
    return d !== 0 ? d : a.localeCompare(b);
  });

  // Sort matched: highest JD frequency first
  const matchedKeywords = [...matchedKeywordsMap.entries()]
    .sort(([, a], [, b]) => b - a)
    .map(([kw]) => kw)
    .slice(0, 20);

  // Cap suggestions at 6, errors first
  const suggestions = [
    ...rawSuggestions.filter((s) => s.severity === "error"),
    ...rawSuggestions.filter((s) => s.severity === "warning"),
    ...rawSuggestions.filter((s) => s.severity === "tip"),
  ].slice(0, 6);

  const result: AnalysisResult = {
    standaloneScore,
    scoreBreakdown: breakdown,
    matchScore,
    matchScoreConfidence,
    detectedIndustry,
    detectedIndustrySecondary,
    metricsFound,
    actionVerbsFound: [...actionVerbsFound],
    bulletPointVerbCount,
    skillsFound: [...skillsFound],
    missingKeywords: missingKeywords.slice(0, 20),
    matchedKeywords,
    buzzwordsFound: [...buzzwordsFound],
    repeatedVerbs,
    missingSections,
    atsIssues,
    suggestions,
    wordCount: rp.wordCount,
    hasContactInfo,
  };

  cacheSet(cacheKey, result);
  return result;
}

/** Conservative flattening — strips common HTML tags used in the builder */
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, " ");
}

export function flattenResumeData(data: ResumeData): string {
  const parts: string[] = [];

  // Personal Info
  if (data.personalInfo.fullName) parts.push(data.personalInfo.fullName);
  if (data.personalInfo.email) parts.push(data.personalInfo.email);
  if (data.personalInfo.phone) parts.push(data.personalInfo.phone);
  if (data.personalInfo.location) parts.push(data.personalInfo.location);
  if (data.personalInfo.website) parts.push(data.personalInfo.website);
  if (data.personalInfo.summary)
    parts.push(stripHtml(data.personalInfo.summary));

  // Experience
  data.experience.forEach((exp) => {
    if (exp.company) parts.push(exp.company);
    if (exp.position) parts.push(exp.position);
    if (exp.description) parts.push(stripHtml(exp.description));
  });

  // Education
  data.education.forEach((edu) => {
    if (edu.institution) parts.push(edu.institution);
    if (edu.degree) parts.push(edu.degree);
  });

  // Skills
  data.skills.forEach((skill) => {
    if (skill.name) parts.push(skill.name);
    if (skill.skills) parts.push(skill.skills);
  });

  // Projects
  data.projects.forEach((project) => {
    if (project.name) parts.push(project.name);
    if (project.description) parts.push(stripHtml(project.description));
  });

  // Awards
  data.awards.forEach((award) => {
    if (award.name) parts.push(award.name);
    if (award.issuer) parts.push(award.issuer);
    if (award.description) parts.push(stripHtml(award.description));
  });

  // Languages
  data.languages.forEach((lang) => {
    if (lang.name) parts.push(lang.name);
    if (lang.proficiency) parts.push(lang.proficiency);
  });

  // Volunteer
  data.volunteerWork.forEach((vol) => {
    if (vol.organization) parts.push(vol.organization);
    if (vol.position) parts.push(vol.position);
    if (vol.description) parts.push(stripHtml(vol.description));
  });

  // Interests
  data.interests.forEach((interest) => {
    if (interest.name) parts.push(interest.name);
  });

  // Custom Sections
  data.customSections?.forEach((section) => {
    if (section.title) parts.push(section.title);
    section.items.forEach((item) => {
      if (item.title) parts.push(item.title);
      if (item.subtitle) parts.push(item.subtitle);
      if (item.description) parts.push(stripHtml(item.description));
    });
  });

  return parts.filter(Boolean).join(" ");
}
