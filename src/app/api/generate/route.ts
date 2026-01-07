import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { SYSTEM_PROMPT, EDIT_PROMPT_PREFIX } from '@/lib/ai/prompts/system';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const {
      prompt,
      provider,
      model,
      apiKey,
      existingScreens,
      currentScreenCode,
      currentScreenName,
      isEditMode
    } = await req.json();

    if (!apiKey) {
      return new Response('API key is required', { status: 400 });
    }

    // Create provider instance
    let llmProvider;
    if (provider === 'openai') {
      const openai = createOpenAI({ apiKey });
      llmProvider = openai(model);
    } else {
      const anthropic = createAnthropic({ apiKey });
      llmProvider = anthropic(model);
    }

    // Build context from existing screens
    const screensContext =
      existingScreens && existingScreens.length > 0
        ? `\n\nExisting screens in the prototype:\n${existingScreens
            .map((s: { name: string; description: string }) => `- ${s.name}: ${s.description}`)
            .join('\n')}\n\nYou can reference these screens for navigation if relevant.`
        : '';

    // Build the user message based on whether we're editing or creating
    let userMessage: string;

    if (isEditMode && currentScreenCode) {
      // Edit mode: include the current code and ask for modifications
      userMessage = `${EDIT_PROMPT_PREFIX}

Component Name: ${currentScreenName}

\`\`\`tsx
${currentScreenCode}
\`\`\`

User's requested changes:
${prompt}

IMPORTANT:
- Modify the existing component above based on the user's request
- Keep the same component name: ${currentScreenName}
- Preserve all existing functionality unless explicitly asked to remove it
- Only change what the user requested
- Return the COMPLETE updated component code${screensContext}`;
    } else {
      // New screen mode
      userMessage = `${prompt}${screensContext}`;
    }

    const result = streamText({
      model: llmProvider,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    // Return as text stream instead of data stream
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate UI' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
