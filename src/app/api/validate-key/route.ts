import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

export async function POST(req: Request) {
  try {
    const { provider, apiKey } = await req.json();

    if (!apiKey) {
      return new Response('API key is required', { status: 400 });
    }

    // Create provider instance and make a minimal API call
    let llmProvider;
    if (provider === 'openai') {
      const openai = createOpenAI({ apiKey });
      llmProvider = openai('gpt-4o-mini');
    } else {
      const anthropic = createAnthropic({ apiKey });
      llmProvider = anthropic('claude-3-5-haiku-latest');
    }

    // Make a minimal request to validate the key
    await generateText({
      model: llmProvider,
      prompt: 'Hi',
      maxTokens: 5,
    });

    return new Response(JSON.stringify({ valid: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Key validation error:', error);
    return new Response(
      JSON.stringify({ valid: false, error: 'Invalid API key' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
