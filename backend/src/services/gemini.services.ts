import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export interface GeminiAnalysis {
  category: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  priority_score: number;
  summary: string;
  tags: string[];
}

export async function analyseFeedback(
  title: string,
  description: string
): Promise<GeminiAnalysis> {
  const prompt = `
Analyse this product feedback and return ONLY valid JSON — no markdown, no code blocks, no extra text.

The JSON must have exactly these fields:
{
  "category": "Bug" | "Feature Request" | "Improvement" | "Other",
  "sentiment": "Positive" | "Neutral" | "Negative",
  "priority_score": number between 1 (low) and 10 (critical),
  "summary": "one sentence summary under 20 words",
  "tags": ["tag1", "tag2", "tag3"]
}

Feedback title: "${title}"
Feedback description: "${description}"
`;

  const result = await model.generateContent(prompt);
  const text = result.response
    .text()
    .replace(/```json|```/g, '')
    .trim();

  const parsed: GeminiAnalysis = JSON.parse(text);

  // Sanitise fields defensively
  return {
    category: parsed.category || 'Other',
    sentiment: ['Positive', 'Neutral', 'Negative'].includes(parsed.sentiment)
      ? parsed.sentiment
      : 'Neutral',
    priority_score: Math.min(10, Math.max(1, Number(parsed.priority_score) || 5)),
    summary: parsed.summary || '',
    tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
  };
}