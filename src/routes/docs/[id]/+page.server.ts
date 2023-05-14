export const prerender = true;
import db from '$lib/server/db.ts';

export const load = async ({ params }) => {
  return {
    'doc': db.docs.find(row => row['ID'] == params.id),
  }
}

export const entries = () => {
  const entries = db.docs.map(row => ({
      'id': row['ID'].toString(),
    })
  );
  for (let entry of entries) {
    if (!entry.id) {
      console.log(entry);
    }
  }

  return entries;
}
