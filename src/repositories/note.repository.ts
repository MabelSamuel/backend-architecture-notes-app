export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory store. Swapped for Prisma once the database lesson lands —
// only this file will need to change.
const notes: Note[] = [];
let nextId = 1;

function findAll(): Note[] {
  return notes;
}

function findById(id: string): Note | undefined {
  return notes.find((note) => note.id === id);
}

function create(data: { title: string; content: string }): Note {
  const now = new Date().toISOString();
  const note: Note = {
    id: String(nextId++),
    title: data.title,
    content: data.content,
    createdAt: now,
    updatedAt: now,
  };
  notes.push(note);
  return note;
}

function update(id: string, data: Partial<{ title: string; content: string }>): Note | undefined {
  const note = findById(id);
  if (!note) return undefined;

  if (data.title !== undefined) note.title = data.title;
  if (data.content !== undefined) note.content = data.content;
  note.updatedAt = new Date().toISOString();

  return note;
}

function remove(id: string): boolean {
  const index = notes.findIndex((note) => note.id === id);
  if (index === -1) return false;

  notes.splice(index, 1);
  return true;
}

export const noteRepository = { findAll, findById, create, update, remove };
