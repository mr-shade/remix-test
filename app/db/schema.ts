import { z } from 'zod';

// Define the Note schema for validation
export const NoteSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  created_at: z.number().optional(),
  updated_at: z.number().optional(),
});

export type Note = z.infer<typeof NoteSchema>;

// Schema for creating a new note
export const CreateNoteSchema = NoteSchema.omit({ id: true, created_at: true, updated_at: true });
export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;

// Schema for updating an existing note
export const UpdateNoteSchema = NoteSchema.omit({ created_at: true, updated_at: true });
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
