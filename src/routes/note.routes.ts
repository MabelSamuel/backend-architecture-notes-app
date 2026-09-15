import { Router } from 'express';
import { noteController } from '../controllers/note.controller';
import { validate } from '../middleware/validate';
import { createNoteSchema, updateNoteSchema } from '../schemas/note.schema';

const router = Router();

router.get('/', noteController.listNotes);
router.get('/:id', noteController.getNote);
router.post('/', validate(createNoteSchema), noteController.createNote);
router.patch('/:id', validate(updateNoteSchema), noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

export { router as noteRoutes };
