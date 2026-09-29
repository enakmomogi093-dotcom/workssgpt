import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { SYSTEM_INSTRUCTION, DEFAULT_MODEL } from './src/lib/gemini-config.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Support JSON body up to 20MB for images/attachments
app.use(express.json({ limit: '20mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'WorksGPT',
    timestamp: Date.now(),
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// POST /api/chat - Streaming Gemini response
app.post('/api/chat', async (req, res) => {
  const { message, history = [], model = DEFAULT_MODEL, temperature = 0.7, images = [] } = req.body;

  if (!message && (!images || images.length === 0)) {
    return res.status(400).json({ error: 'Message or attachment is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[WorksGPT Error] GEMINI_API_KEY environment variable is missing.');
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please check your environment variables.',
    });
  }

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Build contents history
    // Gemini contents accepts array of { role: 'user' | 'model', parts: [...] }
    const contents: any[] = [];

    // Add prior conversation messages
    if (Array.isArray(history)) {
      for (const item of history) {
        if (!item.content) continue;
        const role = item.role === 'assistant' ? 'model' : 'user';
        contents.push({
          role,
          parts: [{ text: item.content }],
        });
      }
    }

    // Build current user message parts
    const currentParts: any[] = [];

    // Include multimodal images if provided
    if (Array.isArray(images)) {
      for (const img of images) {
        if (img?.inlineData?.data && img?.inlineData?.mimeType) {
          currentParts.push({
            inlineData: {
              mimeType: img.inlineData.mimeType,
              data: img.inlineData.data,
            },
          });
        }
      }
    }

    // Text part
    if (message) {
      currentParts.push({ text: message });
    }

    contents.push({
      role: 'user',
      parts: currentParts,
    });

    // Stream generation
    const responseStream = await ai.models.generateContentStream({
      model: model || DEFAULT_MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: typeof temperature === 'number' ? temperature : 0.7,
      },
    });

    for await (const chunk of responseStream) {
      const textChunk = chunk.text;
      if (textChunk) {
        res.write(`data: ${JSON.stringify({ chunk: textChunk })}\n\n`);
      }
    }

    // Send completion event
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error: any) {
    console.error('[WorksGPT Chat Error]', error?.message || 'Unknown error');
    // Send user-friendly error without leaking sensitive secrets
    res.write(
      `data: ${JSON.stringify({
        error: 'Something went wrong. Please try again.',
      })}\n\n`
    );
    res.end();
  }
});

async function startServer() {
  if (!isProduction) {
    // Development mode: Vite dev server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[WorksGPT] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
