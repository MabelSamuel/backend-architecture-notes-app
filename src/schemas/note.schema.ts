import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().min(1, 'title is required'),
  content: z.string().min(1, 'content is required'),
});

export const updateNoteSchema = createNoteSchema.partial();
