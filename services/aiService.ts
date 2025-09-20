// AI Service Integration (DeepSeek)
import Constants from 'expo-constants';

// Fallback key (requested): used only if env and app.json extra are not set
const HARDCODED_DEEPSEEK_API_KEY = 'sk-bed1da6178fd416bba6faa57b8b29b73';

export interface AIRequest {
  userRequest: string;
  answerFormat: string;
  shopsData?: ShopData[]; // optional; we may send Firestore catalog instead
}

export interface ShopData {
  name: string;
  url?: string;
  categories?: string[];
  sampleItems?: Array<{
    name: string;
    price: string;
    category: string;
  }>;
}

export interface AIResponse {
  products: Product[];
  totalCost: number;
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Product {
  id: string;
  name: string;
  price: string;
  store: string;
  category: 'product' | 'tool';
  description: string;
  availability: string;
  url?: string;
  imageUrl?: string;
  alternatives?: ProductAlternative[];
}

export interface ProductAlternative {
  name: string;
  price: string;
  store: string;
  description: string;
  availability: string;
  url?: string;
}

// DeepSeek API integration
export const callAIService = async (request: AIRequest): Promise<AIResponse> => {
  try {
    // Use the provided answer format and inject the user request
    const promptFromTemplate = (request.answerFormat || "").replace('{userRequest}', request.userRequest);

    // Build a short catalog appendix (first N items per store) if provided
    let catalogAppendix = '';
    if (request.shopsData && request.shopsData.length > 0) {
      const lines: string[] = [];
      const lowerReq = (request.userRequest || '').toLowerCase();
      const isApplePie = lowerReq.includes('apple pie') || lowerReq.includes('pie');
      lines.push('\nCATALOG (use these exact shop names, locations and items; prefer relevant items):');
      for (const shop of request.shopsData.slice(0, 8)) {
        // We may pass location info via name suffix if available from Firestore caller
        lines.push(`- ${shop.name}`);
        let items = shop.sampleItems ?? [];
        // If user asked for apple pie, prioritize relevant ingredients/tools from the catalog
        if (isApplePie) {
          const keywords = ['apple', 'flour', 'sugar', 'cinnamon', 'nutmeg', 'butter', 'egg', 'vanilla', 'pie', 'crust', 'rolling pin', 'pastry', 'lemon', 'cornstarch', 'foil', 'parchment', 'cooling rack'];
          const scored = items.map((it) => {
            const name = (it.name || '').toLowerCase();
            const score = keywords.reduce((s, kw) => (name.includes(kw) ? s + 1 : s), 0);
            return { it, score };
          }).sort((a, b) => b.score - a.score);
          items = scored.map((x) => x.it);
        }
        items = items.slice(0, 12);
        for (const it of items) {
          lines.push(`  • ${it.name} | ${it.price} | ${it.category}`);
        }
      }
      catalogAppendix = '\n' + lines.join('\n');
    }

    const extra = ((Constants as any)?.expoConfig?.extra ?? (Constants as any)?.manifest?.extra ?? {}) as Record<string, any>;
    const apiKey = (process.env as any)?.EXPO_PUBLIC_DEEPSEEK_API_KEY
      || extra?.EXPO_PUBLIC_DEEPSEEK_API_KEY
      || extra?.DEEPSEEK_API_KEY
      || HARDCODED_DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error('DeepSeek API key missing. Set EXPO_PUBLIC_DEEPSEEK_API_KEY env var or add it to expo.extra in app.json.');

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that outputs strictly valid JSON without code fences. Do not include any commentary.'
          },
          {
            role: 'user',
            content: promptFromTemplate + catalogAppendix
          }
        ],
        temperature: 0.5,
        max_tokens: 2200
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content ?? '';

    // Parse the JSON response from DeepSeek (strip code fences, attempt repairs)
    try {
      const jsonStr = extractJson(raw);
      const parsed = safeParseJsonWithRepair(jsonStr);
      return parsed;
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, raw);
      throw new Error('AI response was not valid JSON');
    }
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    // Do not fallback to mock data; propagate error to caller
    throw error instanceof Error ? error : new Error('AI request failed');
  }
};

// Attempt to extract a JSON substring from a response that may include code fences or text
function extractJson(text: string): string {
  const fenceMatch = text.match(/```(?:json)?\n([\s\S]*?)```/i);
  if (fenceMatch && fenceMatch[1]) {
    return fenceMatch[1].trim();
  }
  // If there are stray characters before or after the JSON, try to find the first { and last }
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    return text.slice(first, last + 1);
  }
  return text.trim();
}

// Attempts to repair common JSON issues from LLM output and parse it
function safeParseJsonWithRepair(text: string): any {
  // 1) Remove trailing commas before ] or }
  let repaired = text.replace(/,\s*(\]|\})/g, '$1');
  // 2) Ensure quotes are straight (replace fancy quotes)
  repaired = repaired
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"');
  // 3) Attempt to close any unclosed string at end of line (best effort)
  // Not fully robust, but helps when LLM truncates a URL or line
  // 4) Remove dangling backticks left by code blocks
  repaired = repaired.replace(/```/g, '');
  // 5) Try parsing; if it fails, throw the original error
  return JSON.parse(repaired);
}

// (No mock helpers; AI must use catalog provided in the prompt)

// Answer format template for AI requests
export const ANSWER_FORMAT = `
Please provide a detailed shopping list for the following project request: "{userRequest}"

IMPORTANT:
1) Use ONLY the shops and items provided in the appended CATALOG section. Do not invent new shops.
2) Prefer items that closely match the user's request. If an exact item is not listed, pick the closest comparable item from the same shop.
3) For each needed category, include 2-3 alternatives from DIFFERENT shops in the catalog when possible.

Format your response as JSON with the following structure:
{
  "products": [
    {
      "name": "Specific product name (use a name from the catalog when possible)",
      "price": "$XX.XX",
      "store": "Shop name EXACTLY as shown in the catalog",
      "category": "product" or "tool",
      "description": "Why this item fits and any specs",
      "availability": "In Stock" or "Out of Stock",
      "url": "Product URL if available",
      "alternatives": [
        {
          "name": "Alternative item",
          "price": "$XX.XX",
          "store": "Different shop from the catalog",
          "description": "Why comparable / trade-offs",
          "availability": "In Stock" or "Out of Stock",
          "url": "Product URL if available"
        },
        {
          "name": "Budget option",
          "price": "$XX.XX", 
          "store": "Another different shop from the catalog",
          "description": "Pros/cons",
          "availability": "In Stock" or "Out of Stock",
          "url": "Product URL if available"
        }
      ]
    }
  ],
  "totalCost": XX.XX,
  "estimatedTime": "X hours",
  "difficulty": "Easy" or "Medium" or "Hard"
}

STRICT RULES:
- Use ONLY these shops and items. If something is missing, pick the closest alternative from the same catalog.
- Return STRICT, valid JSON only. No code fences. No commentary.
`;
