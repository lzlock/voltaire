export const prerender = true;
import db from '$lib/server/db.ts';

export const load = async ({ params }) => {
  return {
    'doc': db.docs.find(row => row['ID'] == params.id),
  }
}
