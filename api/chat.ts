import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION, DEFAULT_MODEL } from '../src/lib/gemini-config';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history = [], model = DEFAULT_MODEL, temperature = 0.7, images = [] } = req.body || {};

  if (!message && (!images || images.length === 0)) {
    return res.status(400).json({ error: 'Message or attachment is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const contents: any[] = [];

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

    const currentParts: any[] = [];
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

    if (message) {
      currentParts.push({ text: message });
    }

    contents.push({
      role: 'user',
      parts: currentParts,
    });

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

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error: any) {
    console.error('[WorksGPT Vercel API Error]', error?.message || 'Unknown error');
    res.write(`data: ${JSON.stringify({ error: 'Something went wrong. Please try again.' })}\n\n`);
    res.end();
  }
}
