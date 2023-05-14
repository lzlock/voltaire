import { json } from '@sveltejs/kit';
import db from '$lib/server/db.ts';

export async function GET() {
  return json(db, {
    headers: {
      'Cache-Control': 'max-age=86400, immutable',
    }
  });
}
