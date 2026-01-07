export interface ParsedCode {
  code: string;
  name: string;
}

export function parseCodeFromResponse(response: string): ParsedCode {
  console.log('Parsing response, length:', response.length);

  // Try multiple patterns to extract code

  // Pattern 1: Standard markdown code blocks with language
  const codeBlockPatterns = [
    /```tsx\n([\s\S]*?)```/g,
    /```typescript\n([\s\S]*?)```/g,
    /```jsx\n([\s\S]*?)```/g,
    /```javascript\n([\s\S]*?)```/g,
    /```ts\n([\s\S]*?)```/g,
    /```js\n([\s\S]*?)```/g,
    /```\n([\s\S]*?)```/g,
  ];

  for (const pattern of codeBlockPatterns) {
    const matches = [...response.matchAll(pattern)];
    if (matches.length > 0) {
      // Get the largest code block (likely the main component)
      const largestBlock = matches.reduce((prev, curr) =>
        curr[1].length > prev[1].length ? curr : prev
      );
      const code = largestBlock[1].trim();

      // Verify it looks like a React component
      if (code.includes('export default') || code.includes('function') || code.includes('const')) {
        const name = extractComponentName(code);
        console.log('Found code block, component name:', name);
        return { code, name };
      }
    }
  }

  // Pattern 2: Try to find code without markdown wrapper
  // Look for 'use client' or import statements as start indicators
  const codePatterns = [
    // Starts with 'use client'
    /('use client'[\s\S]*export\s+default\s+(?:function\s+)?[\s\S]*)/,
    // Starts with import
    /(import\s+[\s\S]*export\s+default\s+(?:function\s+)?[\s\S]*)/,
    // Just export default function
    /(export\s+default\s+function\s+\w+[\s\S]*)/,
  ];

  for (const pattern of codePatterns) {
    const match = response.match(pattern);
    if (match) {
      let code = match[1].trim();
      // Clean up any trailing markdown or text
      const endMarkers = ['```', '\n\nThis', '\n\nThe', '\n\nI ', '\n\nHere'];
      for (const marker of endMarkers) {
        const idx = code.indexOf(marker);
        if (idx > 0) {
          code = code.substring(0, idx).trim();
        }
      }

      if (code.includes('return') && code.includes('<')) {
        const name = extractComponentName(code);
        console.log('Found raw code, component name:', name);
        return { code, name };
      }
    }
  }

  // Log what we received for debugging
  console.error('Could not parse code from response. First 500 chars:', response.substring(0, 500));
  throw new Error('No valid code block found in response. The AI may not have returned proper React code.');
}

function extractComponentName(code: string): string {
  // Try to extract from "export default function ComponentName"
  const funcMatch = code.match(/export\s+default\s+function\s+(\w+)/);
  if (funcMatch) return funcMatch[1];

  // Try to extract from "function ComponentName" before export default
  const funcMatch2 = code.match(/function\s+(\w+)\s*\([^)]*\)\s*\{[\s\S]*export\s+default\s+\1/);
  if (funcMatch2) return funcMatch2[1];

  // Try to extract from "const ComponentName = " followed by export default
  const constMatch = code.match(/const\s+(\w+)\s*=/);
  if (constMatch && code.includes('export default')) return constMatch[1];

  // Try to extract from "export default ComponentName"
  const defaultMatch = code.match(/export\s+default\s+(\w+)\s*;?\s*$/m);
  if (defaultMatch && defaultMatch[1] !== 'function') return defaultMatch[1];

  return 'GeneratedScreen';
}

export function extractCodeFromStream(partialResponse: string): string | null {
  // Try to extract partial code during streaming
  const codeStartPatterns = [
    { marker: '```tsx\n', offset: 7 },
    { marker: '```typescript\n', offset: 14 },
    { marker: '```jsx\n', offset: 7 },
    { marker: '```ts\n', offset: 6 },
    { marker: '```js\n', offset: 6 },
    { marker: '```\n', offset: 4 },
  ];

  for (const { marker, offset } of codeStartPatterns) {
    const startIdx = partialResponse.indexOf(marker);
    if (startIdx !== -1) {
      const afterStart = partialResponse.substring(startIdx + offset);
      const codeEnd = afterStart.indexOf('```');

      if (codeEnd !== -1) {
        // Complete code block
        return afterStart.substring(0, codeEnd).trim();
      }

      // Partial code block - return what we have if it looks like code
      const partial = afterStart.trim();
      if (partial.length > 50) {
        return partial;
      }
    }
  }

  // Also try to detect raw code without markdown
  if (partialResponse.includes("'use client'") || partialResponse.includes('import ')) {
    const lines = partialResponse.split('\n');
    const codeLines: string[] = [];
    let inCode = false;

    for (const line of lines) {
      if (line.includes("'use client'") || line.includes('import ') || inCode) {
        inCode = true;
        if (!line.startsWith('```')) {
          codeLines.push(line);
        }
      }
    }

    if (codeLines.length > 3) {
      return codeLines.join('\n');
    }
  }

  return null;
}
