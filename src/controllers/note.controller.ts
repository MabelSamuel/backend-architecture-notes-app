import { Request, Response } from 'express';
import { noteService } from '../services/note.service';

function listNotes(req: Request, res: Response): void {
  const notes = noteService.getAllNotes();
  res.json({ data: notes });
}

function getNote(req: Request, res: Response): void {
  const note = noteService.getNoteById(req.params.id);
  res.json({ data: note });
}

function createNote(req: Request, res: Response): void {
  const note = noteService.createNote(req.body);
  res.status(201).json({ data: note });
}

function updateNote(req: Request, res: Response): void {
  const note = noteService.updateNote(req.params.id, req.body);
  res.json({ data: note });
}

function deleteNote(req: Request, res: Response): void {
  noteService.deleteNote(req.params.id);
  res.status(204).send();
}

export const noteController = { listNotes, getNote, createNote, updateNote, deleteNote };
