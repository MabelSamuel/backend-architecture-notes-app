import { noteRepository, Note } from '../repositories/note.repository';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';

function getAllNotes(): Note[] {
  return noteRepository.findAll();
}

function getNoteById(id: string): Note {
  const note = noteRepository.findById(id);
  if (!note) {
    throw new AppError(`Note ${id} not found`, 404);
  }
  return note;
}

function createNote(data: { title: string; content: string }): Note {
  const note = noteRepository.create(data);
  logger.info({ event: 'note:created', noteId: note.id });
  return note;
}

function updateNote(id: string, data: Partial<{ title: string; content: string }>): Note {
  const note = noteRepository.update(id, data);
  if (!note) {
    throw new AppError(`Note ${id} not found`, 404);
  }
  logger.info({ event: 'note:updated', noteId: note.id });
  return note;
}

function deleteNote(id: string): void {
  const deleted = noteRepository.remove(id);
  if (!deleted) {
    throw new AppError(`Note ${id} not found`, 404);
  }
  logger.info({ event: 'note:deleted', noteId: id });
}

export const noteService = { getAllNotes, getNoteById, createNote, updateNote, deleteNote };
