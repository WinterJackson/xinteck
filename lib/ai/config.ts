
export const CORE_NICHES = [
    "Scalable Web Architecture",
    "Enterprise Mobile Engineering",
    "Custom Software Strategy",
    "UX Systems & Product Design",
    "Cloud Infrastructure & DevOps"
];

export const SECONDARY_NICHES = [
    "AI Integration for Enterprise",
    "Software Security & Resilience",
    "SaaS Architecture Patterns",
    "Digital Product Lifecycle Strategy"
];

export const SCORING_WEIGHTS = {
    relevance: 0.35,
    seo: 0.20,
    authority: 0.20,
    novelty: 0.15,
    clarity: 0.10
};

export const MASTER_PROMPT_SYSTEM = `
SYSTEM ROLE:
You are an elite technical editorial strategist embedded inside a premium software engineering company.
Your mission is to generate content that:
1. Directly supports the company’s service offerings.
2. Demonstrates engineering authority.
3. Attracts high-value business clients (CTOs, VPs of Engineering).
4. Improves SEO relevance in enterprise software niches.

BOUNDARIES:
- NEVER generate generic beginner tutorials (e.g., "How to install React").
- NEVER generate consumer tech hype reviews.
- NEVER mention specific competitors by name.
- Tone must be: Professional, Authoritative, Elite, Results-Oriented.
`;

export const SCOUT_PROMPT_TEMPLATE = `
TASK: TREND SCOUT
CONTEXT:
- Target Niches: {niches}
- Excluded Topics: {exclusions}

INSTRUCTION:
Identify 5 emerging or high-impact technical themes relevant to Enterprise decision-makers within these niches.
Focus on: Architecture, Scalability, ROI, Security, Modernization.

OUTPUT JSON FORMAT:
[
  {
    "title": "Specific, catchy but professional title",
    "angle": "The specific hook or argument (e.g., Why X is better than Y for enterprise)",
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "businessValueScore": 1-100 (Heuristic based on enterprise value),
    "reasoning": "Brief explanation of why this matters to a CTO"
  }
]
`;

export const DRAFT_PROMPT_TEMPLATE = `
TASK: DRAFT ARTICLE
TOPIC: {title}
ANGLE: {angle}
TONE: {brandVoice}

INSTRUCTION:
Write a 500-800 word professional article in Markdown.
Structure:
1. The Challenge (Define the business/engineering problem)
2. The Solution (Technical deep dive, architectural patterns)
3. The Impact (Business KPIs, Scalability, ROI)

CONSTRAINTS:
- Use H2 and H3 headers for structure.
- Paragraphs should be concise.
- No fluff, no marketing jargon.
- Emphasize "Custom Engineering" and "Strategic Thinking".
- Naturally weave in these keywords: {keywords}

OUTPUT:
Pure Markdown content.
`;
