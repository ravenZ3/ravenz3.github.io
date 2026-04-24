import { getCollection } from 'astro:content';

export const COLLECTIONS = ['literary', 'perspectives', 'reflections'] as const;
export type GardenCollection = typeof COLLECTIONS[number];

export interface NoteRef {
  slug: string;
  collection: GardenCollection;
  title: string;
}

// All notes across all collections, each tagged with which collection it's from.
export async function getAllNotes() {
  const [literary, perspectives, reflections] = await Promise.all([
    getCollection('literary'),
    getCollection('perspectives'),
    getCollection('reflections'),
  ]);
  return [
    ...literary.map(e     => ({ ...e, collection: 'literary'     as const })),
    ...perspectives.map(e => ({ ...e, collection: 'perspectives' as const })),
    ...reflections.map(e  => ({ ...e, collection: 'reflections'  as const })),
  ];
}

export type GardenNote = Awaited<ReturnType<typeof getAllNotes>>[number];

// Scan a note's raw markdown body for internal links of the form:
//   [text](/literary/slug)  [text](/perspectives/slug)  [text](/reflections/slug)
// Returns the slugs of all linked notes.
function extractInternalLinks(body: string): string[] {
  const pattern = /\[([^\]]+)\]\(\/(literary|perspectives|reflections)\/([^)#?\s/]+)\)/g;
  const slugs: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(body)) !== null) {
    slugs.push(m[3]);
  }
  return slugs;
}

// Build the reverse link index at build time.
// Returns Map<targetSlug, [notes that link to it]>
export async function buildBacklinkIndex(): Promise<Map<string, NoteRef[]>> {
  const notes = await getAllNotes();
  const index = new Map<string, NoteRef[]>();

  for (const note of notes) {
    for (const targetSlug of extractInternalLinks(note.body)) {
      if (!index.has(targetSlug)) index.set(targetSlug, []);
      index.get(targetSlug)!.push({
        slug: note.slug,
        collection: note.collection,
        title: note.data.title,
      });
    }
  }

  return index;
}

export function noteUrl(collection: GardenCollection, slug: string): string {
  return `/${collection}/${slug}`;
}

export const STAGE_SYMBOL: Record<string, string> = {
  seedling: '○',
  budding:  '◑',
  evergreen: '●',
};

export const STAGE_LABEL: Record<string, string> = {
  seedling: 'seedling',
  budding:  'budding',
  evergreen: 'evergreen',
};
