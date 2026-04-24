import { getAllNotes } from "../../lib/garden";

export async function GET() {
  const allNotes = await getAllNotes();
  
  const searchIndex = allNotes.map(note => ({
    title: note.data.title,
    slug: note.slug,
    collection: note.collection,
    description: note.data.description || "",
    // Include the first few hundred chars of body for text search
    excerpt: note.body.slice(0, 300).replace(/[#*`]/g, "")
  }));

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
