import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import pb from '@/config/pocketbase';

const API_KEY = import.meta.env.VITE_GOOGLE_AI_KEY;

if (!API_KEY) {
  console.warn('[Gemini] VITE_GOOGLE_AI_KEY is not set in .env');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

const SYSTEM_PROMPT = `You are the Slow Forest Impact Assistant. 
About Slow Forest: Social enterprise working with smallholder farmers in Laos, Vietnam, and Indonesia.
Capabilities: Answer questions about EUDR, certifications, and analyze data. 
Respond in the language the user uses.`;

const tools = [
  {
    functionDeclarations: [
      {
        name: 'get_staff_list',
        description: 'Get a list of staff members for a specific country.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            country: { type: SchemaType.STRING, description: 'laos, indonesia, or vietnam' },
          },
          required: ['country'],
        },
      },
    ],
  },
];

const functions: Record<string, (args: any) => Promise<any>> = {
  get_staff_list: async ({ country }) => {
    try {
      const result = await pb.collection('users').getList(1, 10, {
        filter: `country ~ "${country}" && status = "active"`,
      });
      return { total: result.totalItems, staff: result.items };
    } catch (err) {
      return { error: 'Data fetch failed' };
    }
  },
};

/**
 * Robust chat sender that tries multiple configurations to overcome API version/model/field 404/400 errors.
 */
export async function sendChatMessage(
  message: string,
  history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>
) {
  console.log('[Gemini] Starting Resilient Chat Flow...');

  // Configuration sets to try in order
  const configs = [
    // 1. Full feature set on v1
    { model: 'gemini-1.5-flash', apiVersion: 'v1', useTools: true, useSystem: true },
    // 2. Full feature set on v1beta
    { model: 'gemini-1.5-flash', apiVersion: 'v1beta', useTools: true, useSystem: true },
    // 3. Simplified set on v1 (No tools/system to avoid 400 error)
    { model: 'gemini-1.5-flash', apiVersion: 'v1', useTools: false, useSystem: false },
    // 4. Stable v1.0 on v1
    { model: 'gemini-pro', apiVersion: 'v1', useTools: false, useSystem: false },
  ];

  let lastError = null;

  for (const config of configs) {
    try {
      console.log(`[Gemini] Trying config: ${config.model} (${config.apiVersion}, tools:${config.useTools})`);

      const modelParams: any = { model: config.model };
      if (config.useSystem) modelParams.systemInstruction = SYSTEM_PROMPT;
      if (config.useTools) modelParams.tools = tools;

      const model = genAI.getGenerativeModel(modelParams, { apiVersion: config.apiVersion as any });

      // If we are NOT using systemInstruction, we prepend it to the first message or history
      let currentHistory = [...history];
      let currentMessage = message;

      if (!config.useSystem && currentHistory.length === 0) {
        currentMessage = `Context: ${SYSTEM_PROMPT}\n\nUser: ${message}`;
      }

      const chat = model.startChat({ history: currentHistory });

      let result = await chat.sendMessage(currentMessage);
      let response = result.response;

      // Tool handling (only if tools are enabled and used)
      if (config.useTools) {
        for (let i = 0; i < 3; i++) {
          const call = response.candidates?.[0]?.content?.parts?.find(p => p.functionCall);
          if (!call?.functionCall) break;

          const { name, args } = call.functionCall;
          const fn = functions[name];
          if (fn) {
            const toolResult = await fn(args);
            result = await chat.sendMessage([{
              functionResponse: { name, response: toolResult },
            } as any]);
            response = result.response;
          } else break;
        }
      }

      const text = response.text();
      console.log(`[Gemini] Success using ${config.model} (${config.apiVersion})`);
      return text;

    } catch (err: any) {
      console.warn(`[Gemini] Config failed: ${err.message}`);
      lastError = err;
      // Continue to next config
    }
  }

  // If all configs failed
  console.error('[Gemini] All fallback configurations exhausted.');
  if (lastError?.message?.includes('429')) throw new Error('AI Quota exceeded. Try again in 1 min.');
  throw new Error(`AI Connectivity Error: ${lastError?.message || 'Unknown'}`);
}
