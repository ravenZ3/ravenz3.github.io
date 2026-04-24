import { defineCollection, z } from 'astro:content';

const noteSchema = z.object({
  title: z.string(),
  stage: z.enum(['seedling', 'budding', 'evergreen']),
  tags: z.array(z.string()).optional().default([]),
  description: z.string().optional(),
  // The date the note was first written / started
  date: z.coerce.date().optional(),
  // The date the note was last significantly updated
  modified: z.coerce.date().optional(),
  // 'prose' enables drop cap
  kind: z.enum(['prose', 'essay', 'note']).optional().default('note'),
  // Epistemic metadata (Gwern-style)
  certainty: z.enum([
    'impossible', 'unlikely', 'possible', 'likely', 'highly likely', 'certain'
  ]).optional().default('possible'),
  importance: z.number().min(0).max(10).optional().default(5),
});

export const collections = {
  literary:     defineCollection({ type: 'content', schema: noteSchema }),
  perspectives: defineCollection({ type: 'content', schema: noteSchema }),
  reflections:  defineCollection({ type: 'content', schema: noteSchema }),
};
