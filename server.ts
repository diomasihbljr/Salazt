import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Conversational scenarios data for intelligent offline / fallback responses
const fallbackResponses: Record<string, Array<{
  triggers: string[];
  reply: string;
  correction: string;
  explanationId: string;
  suggestions: string[];
}>> = {
  ordering_food: [
    {
      triggers: ['menu', 'order', 'table', 'food', 'coffee', 'water', 'hi', 'hello'],
      reply: "Welcome to The Green Garden Cafe! I'm your server today. Would you like to see our breakfast menu or start with a hot beverage?",
      correction: "Tip: In English restaurants, you can say 'A table for two, please' or 'Could I see the beverage list?'",
      explanationId: "Pelayan menanyakan apakah Anda ingin melihat menu sarapan atau memesan minuman hangat terlebih dahulu.",
      suggestions: ["I'd like an iced latte with oat milk, please.", "Could I see the breakfast menu?", "What do you recommend?"]
    },
    {
      triggers: ['latte', 'coffee', 'recommend', 'breakfast', 'pancake', 'sandwich'],
      reply: "Great choice! Our avocado sourdough toast and signature vanilla latte are very popular today. Would you like anything else to accompany that?",
      correction: "Polite phrase: 'I would like...' or 'Can I get...' is very natural and polite in cafes.",
      explanationId: "Gunakan frasa sopan 'Could I have...' atau 'I would like...' daripada 'Give me...'",
      suggestions: ["That's all for now, thank you.", "Could I have the bill, please?", "How long will it take?"]
    }
  ],
  asking_directions: [
    {
      triggers: ['where', 'how', 'station', 'museum', 'lost', 'help', 'excuse me'],
      reply: "Excuse me! Yes, I know this area well. Where are you heading to? The Central Train Station or the Art Gallery?",
      correction: "Start with 'Excuse me' to be polite before asking someone on the street.",
      explanationId: "Selalu awali dengan 'Excuse me' (Permisi) saat bertanya arah jalan kepada orang asing.",
      suggestions: ["How do I get to the Central Station?", "Is the art gallery within walking distance?", "Can you show me on the map?"]
    }
  ],
  job_interview: [
    {
      triggers: ['experience', 'tell me', 'myself', 'role', 'apply', 'skills', 'strengths'],
      reply: "Thank you for joining this interview. Could you please tell me briefly about your background and what motivated you to apply for this position?",
      correction: "Highlight your key achievements using action verbs like 'managed', 'developed', or 'collaborated'.",
      explanationId: "Saat wawancara kerja, gunakan action verbs masa lampau (Past Tense) untuk mendeskripsikan pengalaman kerja Anda.",
      suggestions: ["I have three years of experience in project management.", "My greatest strength is solving complex problems.", "I am very passionate about this industry."]
    }
  ]
};

// AI English Tutor endpoint
app.post('/api/tutor', async (req, res) => {
  const { message, scenario = 'daily_conversation', level = 'A2 - Elementary', includeIndonesian = true, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // If Gemini API is available, generate response
  if (ai && process.env.GEMINI_API_KEY) {
    try {
      const systemInstruction = `You are SALAZT AI Tutor, an empathetic, encouraging, and natural English language teacher.
The learner's estimated CEFR level is: ${level}.
The practice scenario is: "${scenario.replace(/_/g, ' ')}".
${includeIndonesian ? 'Include clear, helpful Indonesian explanations (Bahasa Indonesia) alongside your feedback.' : 'Keep explanations in simple English.'}

Your task:
1. Provide a warm, conversational English reply (2-3 sentences max) keeping the dialogue going.
2. Provide gentle grammar or vocabulary feedback ("correction"): If there are mistakes, kindly show how to say it more naturally. If the student made no errors, praise their phrasing or suggest an idiomatic alternative.
3. Provide an Indonesian note ("explanationId"): Translate tricky terms or explain the grammar rule in Bahasa Indonesia.
4. Provide 3 short suggested replies the user can select to continue the conversation.

Respond in strict JSON with keys:
- "reply": string
- "correction": string
- "explanationId": string
- "suggestions": string[] (array of 3 strings)`;

      const prompt = `Student history: ${JSON.stringify(history.slice(-4))}
Latest student message: "${message}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: { type: Type.STRING },
              correction: { type: Type.STRING },
              explanationId: { type: Type.STRING },
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['reply', 'correction', 'explanationId', 'suggestions'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        reply: parsed.reply || "That sounds great! Keep practicing.",
        correction: parsed.correction || "Good job! Your sentence is clear.",
        explanationId: parsed.explanationId || "Terus berlatih untuk memperkaya kosakata Anda.",
        suggestions: parsed.suggestions || ["Can you tell me more?", "How do you pronounce that?", "Let's change topic."]
      });
    } catch (err: any) {
      console.error('Gemini API call error:', err?.message || err);
      // Fallback gracefully
    }
  }

  // Graceful intelligent fallback
  const normalizedMsg = message.toLowerCase();
  const scenarioPool = fallbackResponses[scenario] || [
    {
      triggers: [],
      reply: `That's very interesting! Talking about "${message.slice(0, 30)}..." is great practice. What else would you like to share about this?`,
      correction: "Great attempt! Notice your sentence rhythm and word choice.",
      explanationId: "Cobalah menyusun kalimat lengkap dengan pola Subject + Verb + Object untuk kejelasan.",
      suggestions: ["Could you explain that in another way?", "What is a better word for this?", "Let's practice another situation."]
    }
  ];

  let selected = scenarioPool.find(item => item.triggers.some(t => normalizedMsg.includes(t))) || scenarioPool[0];

  return res.json({
    reply: selected.reply,
    correction: selected.correction,
    explanationId: selected.explanationId,
    suggestions: selected.suggestions
  });
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'SALAZT', timestamp: new Date().toISOString(), aiReady: Boolean(process.env.GEMINI_API_KEY) });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve production static assets
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Mount Vite dev server middleware
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SALAZT app server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
