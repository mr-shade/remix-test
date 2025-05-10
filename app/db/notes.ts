import { db, getDb } from './client';
import { Note, CreateNoteInput, UpdateNoteInput } from './schema';
import type { Client } from '@libsql/client';

// Generate a random ID for new notes
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Get all notes
export async function getAllNotes(client?: Client): Promise<Note[]> {
  const dbClient = client || db;
  const result = await dbClient.execute('SELECT * FROM notes ORDER BY created_at DESC');
  return result.rows.map(row => ({
    id: row.id as string,
    title: row.title as string,
    content: row.content as string,
    created_at: row.created_at as number,
    updated_at: row.updated_at as number,
  }));
}

// Get a note by ID
export async function getNoteById(id: string, client?: Client): Promise<Note | null> {
  const dbClient = client || db;
  const result = await dbClient.execute({
    sql: 'SELECT * FROM notes WHERE id = ?',
    args: [id],
  });

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id as string,
    title: row.title as string,
    content: row.content as string,
    created_at: row.created_at as number,
    updated_at: row.updated_at as number,
  };
}

// Create a new note
export async function createNote(data: CreateNoteInput, client?: Client): Promise<Note> {
  const dbClient = client || db;
  const now = Date.now();
  const id = generateId();

  await dbClient.execute({
    sql: 'INSERT INTO notes (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
    args: [id, data.title, data.content, now, now],
  });

  return {
    id,
    title: data.title,
    content: data.content,
    created_at: now,
    updated_at: now,
  };
}

// Update an existing note
export async function updateNote(id: string, data: UpdateNoteInput, client?: Client): Promise<Note | null> {
  const dbClient = client || db;
  const note = await getNoteById(id, dbClient);
  if (!note) {
    return null;
  }

  const now = Date.now();

  await dbClient.execute({
    sql: 'UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ?',
    args: [data.title, data.content, now, id],
  });

  return {
    ...note,
    title: data.title,
    content: data.content,
    updated_at: now,
  };
}

// Delete a note
export async function deleteNote(id: string, client?: Client): Promise<boolean> {
  const dbClient = client || db;
  const note = await getNoteById(id, dbClient);
  if (!note) {
    return false;
  }

  await dbClient.execute({
    sql: 'DELETE FROM notes WHERE id = ?',
    args: [id],
  });

  return true;
}
