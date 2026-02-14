import { MASTER_PROMPT_SYSTEM } from "./config";

const FORBIDDEN_TERMS = [
    "chatgpt", "openai", "bard", // AI references
    "delve", "tapestry", // Common AI phrases
    "click here", "buy now", // Aggressive sales
    // Competitors (example placeholders)
    "accenture", "infosys", "tcs"
];

export function injectContext(prompt: string, context: { niches: string[]; brandVoice: string }): string {
    return `
${MASTER_PROMPT_SYSTEM}

CURRENT CONTEXT:
Target Niches: ${context.niches.join(", ")}
Brand Voice: ${context.brandVoice}

USER REQUEST:
${prompt}
`;
}

export function validateInput(prompt: string): { valid: boolean; error?: string } {
    const lower = prompt.toLowerCase();

    if (FORBIDDEN_TERMS.some(term => lower.includes(term))) {
        return { valid: false, error: "Input contains forbidden terms." };
    }

    if (prompt.length < 10) {
        return { valid: false, error: "Prompt too short." };
    }

    return { valid: true };
}

export function validateOutput(text: string): { valid: boolean; error?: string } {
    const lower = text.toLowerCase();

    // Term check
    const violations = FORBIDDEN_TERMS.filter(term => lower.includes(term));
    if (violations.length > 0) {
        return { valid: false, error: `Content contains forbidden terms: ${violations.join(", ")}` };
    }

    // Structure check (Markdown headers)
    if (!text.includes("#")) {
        return { valid: false, error: "Content missing markdown structure." };
    }

    return { valid: true };
}
