import { nanoid } from 'nanoid';

// In-memory storage for development (use Vercel KV in production)
const exports = new Map<string, { screens: unknown; metadata: unknown; createdAt: string }>();

export async function POST(req: Request) {
  try {
    const { screens, metadata } = await req.json();

    if (!screens || screens.length === 0) {
      return new Response('No screens to export', { status: 400 });
    }

    // Generate unique ID
    const exportId = nanoid(10);

    // Store the export (in production, use Vercel KV)
    exports.set(exportId, {
      screens,
      metadata,
      createdAt: new Date().toISOString(),
    });

    // Calculate expiration (30 days)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Get base URL
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return new Response(
      JSON.stringify({
        id: exportId,
        url: `${baseUrl}/preview/${exportId}`,
        expiresAt: expiresAt.toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to export prototype' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response('Export ID is required', { status: 400 });
    }

    const exportData = exports.get(id);

    if (!exportData) {
      return new Response('Export not found', { status: 404 });
    }

    return new Response(JSON.stringify(exportData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get export error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to get export' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
